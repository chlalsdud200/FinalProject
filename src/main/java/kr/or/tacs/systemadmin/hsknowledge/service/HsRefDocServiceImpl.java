package kr.or.tacs.systemadmin.hsknowledge.service;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.ai.document.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import kr.or.tacs.common.file.service.GoogleDriveService;
import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.systemadmin.hsknowledge.mapper.IHsRefDocMapper;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefChunkVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefDocSearchQueryVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefDocSearchResultVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefDocSearchVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefDocVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class HsRefDocServiceImpl implements IHsRefDocService {

    private static final String BIZ_SE_CD = "HSREF";
    private static final String DOC_TY_CD = "HSREF";
    private static final String DEFAULT_STATUS_NEW = "NEW";
    private static final Set<String> ALLOWED_STATUS = Set.of("NEW", "EMBEDDING", "DONE", "FAILED");

    private final IHsRefDocMapper hsRefDocMapper;
    private final IFileService fileService;
    private final GoogleDriveService googleDriveService;
    private final HsRefDocEmbeddingAsyncService embeddingAsyncService;
    private final HsRefDocVectorStoreService vectorStoreService;

    @Value("${spring.ai.vectorstore.milvus.collection-name:hs_reference_chunks}")
    private String defaultCollection;

    @Value("${spring.ai.google.genai.embedding.text.options.model:text-embedding-004}")
    private String defaultModel;

    @Override
    public PaginationInfoVO<HsRefDocVO> retriveHsRefDocList(HsRefDocSearchVO search) {
        HsRefDocSearchVO normalized = search == null ? new HsRefDocSearchVO() : search;
        normalized.setKeyword(trim(normalized.getKeyword()));
        normalized.setEmbedStatusCd(normalizeFilterStatus(normalized.getEmbedStatusCd()));
        normalized.setUseYn(normalizeFilterUseYn(normalized.getUseYn()));
        normalizePage(normalized);

        int totalRecord = hsRefDocMapper.selectHsRefDocTotalRecord(normalized);
        normalized.setTotalRecord(totalRecord);
        normalized.setDataList(hsRefDocMapper.selectHsRefDocList(normalized));
        return normalized;
    }

    @Override
    public HsRefDocVO retriveHsRefDoc(Long hsRefDocNo) {
        return getDoc(requireId(hsRefDocNo));
    }

    @Override
    @Transactional
    public Long registHsRefDoc(String hsParentDocumentId,
                               String hsMilvusCollection,
                               String hsEmbeddingModel,
                               MultipartFile file,
                               CustomUser loginUser) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "첨부파일을 선택해 주세요.");
        }
        if (loginUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        Long tfgNo = fileService.uploadFiles(
                BIZ_SE_CD,
                Map.of(DOC_TY_CD, file),
                loginUser.getLoginId(),
                "SYSTEM_ADMIN"
        );

        HsRefDocVO doc = new HsRefDocVO();
        doc.setTfgNo(tfgNo);
        doc.setHsParentDocumentId(defaultValue(trim(hsParentDocumentId), file.getOriginalFilename()));
        doc.setHsMilvusCollection(defaultValue(trim(hsMilvusCollection), defaultCollection));
        doc.setHsEmbeddingModel(defaultValue(trim(hsEmbeddingModel), defaultModel));
        doc.setHsEmbedStatusCd(DEFAULT_STATUS_NEW);
        doc.setHsUseYn("Y");

        hsRefDocMapper.insertHsRefDoc(doc);
        return doc.getHsRefDocNo();
    }

    @Override
    @Transactional
    public void modifyHsRefDoc(Long hsRefDocNo,
                               String hsParentDocumentId,
                               String hsMilvusCollection,
                               String hsEmbeddingModel,
                               String hsEmbedStatusCd,
                               String hsUseYn) {
        Long id = requireId(hsRefDocNo);
        HsRefDocVO current = getDoc(id);

        HsRefDocVO update = new HsRefDocVO();
        update.setHsRefDocNo(id);
        update.setHsParentDocumentId(defaultValue(trim(hsParentDocumentId), current.getHsParentDocumentId()));
        update.setHsMilvusCollection(defaultValue(trim(hsMilvusCollection), current.getHsMilvusCollection()));
        update.setHsEmbeddingModel(defaultValue(trim(hsEmbeddingModel), current.getHsEmbeddingModel()));
        update.setHsEmbedStatusCd(normalizeStatus(defaultValue(trim(hsEmbedStatusCd), current.getHsEmbedStatusCd())));
        update.setHsUseYn(normalizeYn(defaultValue(trim(hsUseYn), current.getHsUseYn()), "사용여부는 Y 또는 N만 가능합니다."));

        int updated = hsRefDocMapper.updateHsRefDoc(update);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "지식 문서가 존재하지 않습니다.");
        }
    }

    @Override
    @Transactional
    public void modifyHsRefDocUseYn(Long hsRefDocNo, String useYn) {
        Long id = requireId(hsRefDocNo);
        String normalizedUseYn = normalizeYn(useYn, "사용여부는 Y 또는 N만 가능합니다.");
        getDoc(id);
        int updated = hsRefDocMapper.updateHsRefDocUseYn(id, normalizedUseYn);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "지식 문서가 존재하지 않습니다.");
        }
    }

    /*
     * 지식 문서 완전 삭제(영구).
     * Milvus 벡터 → 청크 행 → 문서 행 순으로 지우고, 첨부파일은 best-effort로 삭제한다.
     * (벡터 삭제는 청크 행의 hsDocId가 필요하므로 반드시 청크 행 삭제보다 먼저 한다.)
     */
    @Override
    @Transactional
    public void removeHsRefDoc(Long hsRefDocNo) {
        Long id = requireId(hsRefDocNo);
        HsRefDocVO doc = getDoc(id);
        if ("EMBEDDING".equals(doc.getHsEmbedStatusCd())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "임베딩 처리 중인 문서는 삭제할 수 없습니다.");
        }

        deleteVectorChunks(id);
        hsRefDocMapper.deleteHsRefChunks(id);

        int deleted = hsRefDocMapper.deleteHsRefDoc(id);
        if (deleted == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "지식 문서가 존재하지 않습니다.");
        }

        // 첨부파일 삭제 실패가 문서 삭제 자체를 막지 않도록 best-effort 처리한다.
        if (doc.getFileNo() != null) {
            try {
                fileService.deleteFile(doc.getFileNo());
            } catch (Exception e) {
                log.warn("HS 지식 문서 첨부파일 삭제 실패. hsRefDocNo={}, fileNo={}", id, doc.getFileNo(), e);
            }
        }
    }

    @Override
    public List<HsRefChunkVO> retriveHsRefChunkList(Long hsRefDocNo) {
        Long id = requireId(hsRefDocNo);
        getDoc(id);
        return hsRefDocMapper.selectHsRefChunkList(id);
    }

    @Override
    public ResponseEntity<byte[]> retriveHsRefDocDownload(Long hsRefDocNo) {
        HsRefDocVO doc = getDoc(requireId(hsRefDocNo));
        if (!"Y".equals(doc.getHsUseYn())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "사용 중인 문서만 다운로드할 수 있습니다.");
        }
        if (doc.getFileNo() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "첨부파일 정보가 없습니다.");
        }

        FileInfoDTO fileInfo = fileService.getFileInfo(doc.getFileNo());
        if (fileInfo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "파일 정보가 존재하지 않습니다.");
        }
        if (!StringUtils.hasText(fileInfo.getDfiDriveFileId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Google Drive 파일 ID가 없습니다.");
        }
        if (!"DONE".equals(fileInfo.getDfiUploadSttsCd())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 업로드가 아직 완료되지 않았습니다.");
        }

        byte[] fileBytes = googleDriveService.downloadFile(fileInfo.getDfiDriveFileId());
        String fileName = StringUtils.hasText(fileInfo.getDfiOrgNm()) ? fileInfo.getDfiOrgNm() : "download";
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (StringUtils.hasText(fileInfo.getDfiMimeTy())) {
            try {
                mediaType = MediaType.parseMediaType(fileInfo.getDfiMimeTy());
            } catch (Exception ignored) {
                mediaType = MediaType.APPLICATION_OCTET_STREAM;
            }
        }

        ContentDisposition contentDisposition = ContentDisposition.attachment()
                .filename(fileName, StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(fileBytes.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(fileBytes);
    }

    @Override
    @Transactional
    public void registHsRefDocEmbedding(Long hsRefDocNo) {
        Long id = requireId(hsRefDocNo);
        HsRefDocVO doc = getDoc(id);
        if ("EMBEDDING".equals(doc.getHsEmbedStatusCd())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 임베딩 처리 중입니다.");
        }
        if (!Set.of("NEW", "FAILED").contains(doc.getHsEmbedStatusCd())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "신규 또는 실패 상태의 문서만 임베딩 실행할 수 있습니다.");
        }
        validateFileReadyForEmbedding(doc);
        hsRefDocMapper.updateHsRefDocEmbedStatus(id, "EMBEDDING");
        startEmbeddingAfterCommit(id);
    }

    @Override
    @Transactional
    public void registHsRefDocReembedding(Long hsRefDocNo) {
        Long id = requireId(hsRefDocNo);
        HsRefDocVO doc = getDoc(id);
        if ("EMBEDDING".equals(doc.getHsEmbedStatusCd())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 임베딩 처리 중입니다.");
        }
        validateFileReadyForEmbedding(doc);
        deleteVectorChunks(id);
        hsRefDocMapper.deleteHsRefChunks(id);
        hsRefDocMapper.updateHsRefDocEmbedResult(id, "EMBEDDING", 0);
        startEmbeddingAfterCommit(id);
    }

    @Override
    public List<HsRefDocSearchResultVO> retriveHsRefDocSearch(HsRefDocSearchQueryVO request) {
        if (request == null || !StringUtils.hasText(trim(request.getQuery()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "검색어를 입력해 주세요.");
        }
        if (!vectorStoreService.isMilvusEnabled()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Milvus가 비활성화되어 검색을 사용할 수 없습니다.");
        }

        String query = trim(request.getQuery());
        int topK = normalizeTopK(request.getTopK());
        List<Document> documents = vectorStoreService.search(query, topK);
        if (documents == null || documents.isEmpty()) {
            return List.of();
        }

        List<Long> docNos = documents.stream()
                .map(document -> toLong(document.getMetadata().get("hs_ref_doc_no")))
                .filter(value -> value != null && value > 0)
                .distinct()
                .toList();
        Map<Long, HsRefDocVO> docMap = docNos.isEmpty()
                ? Map.of()
                : hsRefDocMapper.selectHsRefDocsByNos(docNos).stream()
                        .collect(Collectors.toMap(HsRefDocVO::getHsRefDocNo, Function.identity(), (left, right) -> left));

        return documents.stream()
                .filter(document -> {
                    Long no = toLong(document.getMetadata().get("hs_ref_doc_no"));
                    return no != null && docMap.containsKey(no);
                })
                .map(document -> toSearchResult(document, docMap))
                .toList();
    }

    private HsRefDocVO getDoc(Long hsRefDocNo) {
        HsRefDocVO doc = hsRefDocMapper.selectHsRefDoc(hsRefDocNo);
        if (doc == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "지식 문서가 존재하지 않습니다.");
        }
        return doc;
    }

    private String normalizeStatus(String value) {
        String upper = trim(value);
        if (upper == null) {
            return DEFAULT_STATUS_NEW;
        }
        upper = upper.toUpperCase(Locale.ROOT);
        if (!ALLOWED_STATUS.contains(upper)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "임베딩 상태는 " + List.copyOf(ALLOWED_STATUS) + " 중 하나여야 합니다.");
        }
        return upper;
    }

    private String normalizeFilterStatus(String value) {
        String trimmed = trim(value);
        if (!StringUtils.hasText(trimmed) || "all".equalsIgnoreCase(trimmed)) {
            return "all";
        }
        return normalizeStatus(trimmed);
    }

    private String normalizeFilterUseYn(String value) {
        String trimmed = trim(value);
        if (!StringUtils.hasText(trimmed) || "all".equalsIgnoreCase(trimmed)) {
            return "all";
        }
        return normalizeYn(trimmed, "사용여부 필터는 all, Y, N만 가능합니다.");
    }

    private String normalizeYn(String value, String message) {
        String normalized = trim(value);
        if (!StringUtils.hasText(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        normalized = normalized.toUpperCase(Locale.ROOT);
        if (!"Y".equals(normalized) && !"N".equals(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return normalized;
    }

    private Long requireId(Long value) {
        if (value == null || value <= 0L) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지식 문서 번호가 올바르지 않습니다.");
        }
        return value;
    }

    private String defaultValue(String value, String fallback) {
        return StringUtils.hasText(value) ? value : fallback;
    }

    private String trim(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private void normalizePage(HsRefDocSearchVO search) {
        int currentPage = Math.max(search.getCurrentPage(), 1);
        int screenSize = search.getScreenSize();
        if (screenSize != 10 && screenSize != 20 && screenSize != 50) {
            screenSize = 10;
        }
        search.setScreenSize(screenSize);
        search.setCurrentPage(currentPage);
    }

    private void validateFileReadyForEmbedding(HsRefDocVO doc) {
        if (doc.getFileNo() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "첨부파일 정보가 없습니다.");
        }

        FileInfoDTO fileInfo = fileService.getFileInfo(doc.getFileNo());
        if (fileInfo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "파일 정보가 존재하지 않습니다.");
        }
        if (!StringUtils.hasText(fileInfo.getDfiDriveFileId()) || !"DONE".equals(fileInfo.getDfiUploadSttsCd())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 업로드가 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.");
        }
    }

    private void deleteVectorChunks(Long hsRefDocNo) {
        List<String> documentIds = hsRefDocMapper.selectHsRefChunkList(hsRefDocNo).stream()
                .map(HsRefChunkVO::getHsDocId)
                .filter(StringUtils::hasText)
                .toList();
        vectorStoreService.deleteChunks(documentIds);
    }

    private HsRefDocSearchResultVO toSearchResult(Document document, Map<Long, HsRefDocVO> docMap) {
        Map<String, Object> metadata = document.getMetadata();
        Long hsRefDocNo = toLong(metadata.get("hs_ref_doc_no"));
        HsRefDocVO doc = hsRefDocNo == null ? null : docMap.get(hsRefDocNo);

        HsRefDocSearchResultVO result = new HsRefDocSearchResultVO();
        result.setHsRefDocNo(hsRefDocNo);
        result.setHsRefChunkNo(toLong(metadata.get("hs_ref_chunk_no")));
        result.setChunkIndex(toInteger(metadata.get("chunk_index")));
        result.setParentDocumentId(toString(metadata.get("parent_document_id")));
        result.setContent(document.getText());
        result.setScore(document.getScore());
        result.setFileOrgNm(doc == null ? null : doc.getFileOrgNm());
        return result;
    }

    private int normalizeTopK(Integer topK) {
        if (topK == null) {
            return 10;
        }
        return Math.min(Math.max(topK, 1), 50);
    }

    private Long toLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String text && StringUtils.hasText(text)) {
            try {
                return Long.parseLong(text);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private Integer toInteger(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value instanceof String text && StringUtils.hasText(text)) {
            try {
                return Integer.parseInt(text);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private String toString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private void startEmbeddingAfterCommit(Long hsRefDocNo) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            embeddingAsyncService.registHsRefDocEmbedding(hsRefDocNo);
            return;
        }
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                embeddingAsyncService.registHsRefDocEmbedding(hsRefDocNo);
            }
        });
    }
}
