package kr.or.tacs.systemadmin.hsknowledge.service;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import kr.or.tacs.common.file.service.GoogleDriveService;
import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.systemadmin.hsknowledge.mapper.IHsRefDocMapper;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefChunkVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefDocVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class HsRefDocEmbeddingAsyncService {

    private static final int CHUNK_SIZE = 1000;
    private static final int CHUNK_OVERLAP = 200;

    private final IHsRefDocMapper hsRefDocMapper;
    private final IFileService fileService;
    private final GoogleDriveService googleDriveService;
    private final HsRefDocVectorStoreService vectorStoreService;

    @Async("embeddingExecutor")
    @Transactional
    public void registHsRefDocEmbedding(Long hsRefDocNo) {
        try {
            processEmbedding(hsRefDocNo);
        } catch (UploadNotReadyException e) {
            log.info("HS 지식 문서 파일 업로드 미완료. hsRefDocNo={}", hsRefDocNo);
            hsRefDocMapper.updateHsRefDocEmbedResult(hsRefDocNo, "NEW", 0);
        } catch (Exception e) {
            log.error("HS 지식 문서 임베딩 전처리 실패. hsRefDocNo={}", hsRefDocNo, e);
            hsRefDocMapper.deleteHsRefChunks(hsRefDocNo);
            hsRefDocMapper.updateHsRefDocEmbedResult(hsRefDocNo, "FAILED", 0);
        }
    }

    private void processEmbedding(Long hsRefDocNo) throws Exception {
        HsRefDocVO doc = hsRefDocMapper.selectHsRefDoc(hsRefDocNo);
        if (doc == null || doc.getFileNo() == null) {
            throw new IllegalStateException("HS 지식 문서 또는 파일 정보가 없습니다.");
        }

        FileInfoDTO fileInfo = fileService.getFileInfo(doc.getFileNo());
        if (fileInfo == null || !StringUtils.hasText(fileInfo.getDfiDriveFileId())) {
            throw new UploadNotReadyException();
        }
        if (!"DONE".equals(fileInfo.getDfiUploadSttsCd())) {
            throw new UploadNotReadyException();
        }

        byte[] fileBytes = googleDriveService.downloadFile(fileInfo.getDfiDriveFileId());
        String text = extractText(fileBytes, fileInfo);
        if (text == null) {
            hsRefDocMapper.deleteHsRefChunks(hsRefDocNo);
            hsRefDocMapper.updateHsRefDocEmbedResult(hsRefDocNo, "FAILED", 0);
            return;
        }

        hsRefDocMapper.deleteHsRefChunks(hsRefDocNo);
        List<HsRefDocVectorStoreService.ChunkDocument> chunks = insertChunks(doc, text.strip());
        vectorStoreService.addChunks(doc.getHsMilvusCollection(), chunks);
        hsRefDocMapper.updateHsRefDocEmbedResult(hsRefDocNo, "DONE", chunks.size());
    }

    private String extractText(byte[] fileBytes, FileInfoDTO fileInfo) throws Exception {
        if (isPdf(fileInfo)) {
            try (PDDocument document = Loader.loadPDF(fileBytes)) {
                return new PDFTextStripper().getText(document);
            }
        }
        if (isTxt(fileInfo)) {
            return new String(fileBytes, StandardCharsets.UTF_8);
        }
        if (isExcel(fileInfo)) {
            return extractExcelText(fileBytes);
        }
        return null;
    }

    /*
     * 엑셀 텍스트 추출
     *
     * 모든 시트를 순회하며 행 단위로 셀 값을 탭으로 구분해 한 줄로 만든다.
     * 빈 행은 건너뛰고, 시트명은 머리말로 남겨 청크 검색 시 맥락을 돕는다.
     * .xlsx / .xls 모두 WorkbookFactory가 자동 판별한다.
     */
    private String extractExcelText(byte[] fileBytes) throws Exception {
        StringBuilder sb = new StringBuilder();
        DataFormatter formatter = new DataFormatter();

        try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(fileBytes))) {
            int sheetCount = workbook.getNumberOfSheets();
            for (int s = 0; s < sheetCount; s++) {
                Sheet sheet = workbook.getSheetAt(s);
                if (sheet == null) {
                    continue;
                }

                sb.append("# ").append(sheet.getSheetName()).append('\n');

                for (Row row : sheet) {
                    StringBuilder line = new StringBuilder();
                    short lastCellNum = row.getLastCellNum();
                    for (int c = 0; c < lastCellNum; c++) {
                        Cell cell = row.getCell(c);
                        String value = cell == null ? "" : formatter.formatCellValue(cell).strip();
                        if (c > 0) {
                            line.append('\t');
                        }
                        line.append(value);
                    }

                    String lineText = line.toString().strip();
                    if (!lineText.isEmpty()) {
                        sb.append(lineText).append('\n');
                    }
                }
                sb.append('\n');
            }
        }

        return sb.toString();
    }

    private List<HsRefDocVectorStoreService.ChunkDocument> insertChunks(HsRefDocVO doc, String text) {
        if (!StringUtils.hasText(text)) {
            return List.of();
        }

        List<HsRefDocVectorStoreService.ChunkDocument> chunks = new ArrayList<>();
        int start = 0;
        int index = 1;
        while (start < text.length()) {
            int end = Math.min(start + CHUNK_SIZE, text.length());
            String content = text.substring(start, end);

            HsRefChunkVO chunk = new HsRefChunkVO();
            chunk.setHsRefDocNo(doc.getHsRefDocNo());
            chunk.setHsDocId(doc.getHsRefDocNo() + "-" + index);
            chunk.setHsParentDocumentId(doc.getHsParentDocumentId());
            chunk.setHsChunkIndex(index);
            chunk.setHsCode(null);
            hsRefDocMapper.insertHsRefChunk(chunk);
            chunks.add(new HsRefDocVectorStoreService.ChunkDocument(chunk, content));

            if (end >= text.length()) {
                break;
            }
            start = Math.max(end - CHUNK_OVERLAP, start + 1);
            index++;
        }
        return chunks;
    }

    private boolean isPdf(FileInfoDTO fileInfo) {
        String mime = lower(fileInfo.getDfiMimeTy());
        String ext = lower(fileInfo.getDfiExt());
        String name = lower(fileInfo.getDfiOrgNm());
        return "application/pdf".equals(mime) || "pdf".equals(ext) || name.endsWith(".pdf");
    }

    private boolean isTxt(FileInfoDTO fileInfo) {
        String mime = lower(fileInfo.getDfiMimeTy());
        String ext = lower(fileInfo.getDfiExt());
        String name = lower(fileInfo.getDfiOrgNm());
        return mime.startsWith("text/") || "txt".equals(ext) || name.endsWith(".txt");
    }

    private boolean isExcel(FileInfoDTO fileInfo) {
        String mime = lower(fileInfo.getDfiMimeTy());
        String ext = lower(fileInfo.getDfiExt());
        String name = lower(fileInfo.getDfiOrgNm());
        // MIME은 DB 저장 시 길이 제한으로 잘릴 수 있어 확장자/파일명 기준을 우선으로 본다.
        return "xlsx".equals(ext) || "xls".equals(ext)
                || name.endsWith(".xlsx") || name.endsWith(".xls")
                || mime.contains("spreadsheetml") || mime.contains("ms-excel");
    }

    private String lower(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }

    private static class UploadNotReadyException extends RuntimeException {
    }
}
