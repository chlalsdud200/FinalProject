package kr.or.tacs.broker.declare.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;

import kr.or.tacs.broker.declare.mapper.IBrokerDeclareMapper;
import kr.or.tacs.common.file.service.GoogleDriveService;
import kr.or.tacs.vo.broker.declare.ImportDeclarationParsedDto;
import kr.or.tacs.vo.broker.TfgFileDto;

/**
 * 첨부 PDF 들 (Invoice / Packing List / B/L / Phytosanitary 등) 을
 * Gemini 2.5 Flash 에게 통째로 보내서 구조화된 ImportDeclarationParsedDto 로 변환.
 *
 *  · 1번의 LLM 호출로 여러 문서를 종합 — cross-validation
 *  · 우선순위 규칙은 프롬프트에 명시 → AI 가 충돌 해결
 *  · 결과는 form 자동 채움에만 사용. DB 저장은 사용자 검토 후 기존 임시저장 흐름.
 */
@Service
public class AiDocumentParserService {

    @Autowired
    private ObjectProvider<ChatClient.Builder> chatClientBuilderProvider;

    @Autowired
    private IBrokerDeclareMapper brokerDeclareMapper;

    @Autowired
    private GoogleDriveService googleDriveService;
    
    private ChatClient chatClient;

    /**
     * TFG_NO 의 모든 PDF 첨부파일을 종합 파싱
     * @return null 이면 파일 없음 (UI 에서 "첨부 없음" 안내)
     */
    public ImportDeclarationParsedDto parseFromTfg(Long tfgNo) {
        if (tfgNo == null) return null;

        // 1) 파일 목록 조회
        List<TfgFileDto> files = brokerDeclareMapper.selectPdfFilesByTfgNo(tfgNo);
        if (files == null || files.isEmpty()) return null;

     // 2) 각 PDF 텍스트 추출
        List<DocText> docs = new ArrayList<>();

        for (TfgFileDto f : files) {
            String text = extractPdfTextFromDriveOrLocal(f);

            if (text != null && !text.isBlank()) {
                docs.add(new DocText(f.getDocTyCd(), f.getOrgNm(), text));
            }
        }

        if (docs.isEmpty()) {
            System.out.println("[AI PDF 자동채움] PDF 텍스트를 추출한 문서가 없습니다.");
            return null;
        }

        // 3) Gemini 호출 (structured output)
        return callGemini(docs);
    }

    /**
     * Google Drive 파일이면 Drive API로 byte[]를 받아 PDFBox로 읽고,
     * Drive fileId가 없으면 기존 로컬 경로 방식으로 fallback한다.
     */
    private String extractPdfTextFromDriveOrLocal(TfgFileDto f) {
        if (f == null) {
            return null;
        }

        String driveFileId = f.getDriveFileId();

        if (driveFileId != null && !driveFileId.trim().isEmpty()) {
            try {
                System.out.println("[AI PDF 자동채움] Google Drive PDF 다운로드 시작"
                    + " / fileNo=" + f.getDfiFileNo()
                    + " / driveFileId=" + driveFileId
                    + " / fileName=" + f.getOrgNm());

                byte[] pdfBytes = googleDriveService.downloadFile(driveFileId);
                String text = extractPdfTextFromBytes(pdfBytes);

                if (text == null || text.trim().isEmpty()) {
                    System.out.println("[AI PDF 자동채움] PDFBox 텍스트 추출 결과가 비어 있습니다."
                        + " 스캔 PDF/OCR 필요 가능성 있음"
                        + " / fileNo=" + f.getDfiFileNo()
                        + " / fileName=" + f.getOrgNm());
                    return null;
                }

                System.out.println("[AI PDF 자동채움] PDF 텍스트 추출 성공"
                    + " / fileNo=" + f.getDfiFileNo()
                    + " / length=" + text.length());

                return text;

            } catch (Exception e) {
                System.out.println("[AI PDF 자동채움] Google Drive PDF 다운로드 또는 PDFBox 추출 실패"
                    + " / fileNo=" + f.getDfiFileNo()
                    + " / fileName=" + f.getOrgNm());

                e.printStackTrace();

                /*
                 * 혹시 로컬 경로도 살아있는 개발환경이면 fallback.
                 * 완전 Drive 전용이면 이 fallback은 없어도 된다.
                 */
                return extractPdfText(f.getFullPath());
            }
        }

        System.out.println("[AI PDF 자동채움] driveFileId가 없어 로컬 경로로 PDFBox 시도"
            + " / fileNo=" + f.getDfiFileNo()
            + " / fullPath=" + f.getFullPath());

        return extractPdfText(f.getFullPath());
    }

   
    /** PDF byte[] → 평문 추출 */
    private String extractPdfTextFromBytes(byte[] pdfBytes) {
        if (pdfBytes == null || pdfBytes.length == 0) {
            System.out.println("[AI PDF 자동채움] PDF byte[]가 비어 있습니다.");
            return null;
        }

        try (PDDocument doc = Loader.loadPDF(pdfBytes)) {
            String text = new PDFTextStripper().getText(doc);

            if (text == null || text.trim().isEmpty()) {
                System.out.println("[AI PDF 자동채움] PDFBox 텍스트 추출 결과가 비어 있습니다.");
                return null;
            }

            return text;

        } catch (IOException e) {
            System.out.println("[AI PDF 자동채움] PDF byte[] 파싱 실패");
            e.printStackTrace();
            return null;
        }
    }

    /** PDF 파일 → 평문 추출 (로컬 fallback용) */
    private String extractPdfText(String fullPath) {
        if (fullPath == null || fullPath.trim().isEmpty()) {
            System.out.println("[AI PDF 자동채움] 로컬 fullPath가 비어 있습니다.");
            return null;
        }

        File f = new File(fullPath);

        System.out.println("[AI PDF 자동채움] 로컬 PDF 경로 확인: " + f.getAbsolutePath());
        System.out.println("[AI PDF 자동채움] exists=" + f.exists() + ", isFile=" + f.isFile());

        if (!f.exists() || !f.isFile()) {
            return null;
        }

        try (PDDocument doc = Loader.loadPDF(f)) {
            String text = new PDFTextStripper().getText(doc);

            if (text == null || text.trim().isEmpty()) {
                System.out.println("[AI PDF 자동채움] 로컬 PDFBox 텍스트 추출 결과가 비어 있습니다: " + f.getAbsolutePath());
                return null;
            }

            return text;

        } catch (IOException e) {
            System.out.println("[AI PDF 자동채움] 로컬 PDF 파싱 실패: " + f.getAbsolutePath());
            e.printStackTrace();
            return null;
        }
    }
    

    /** Gemini 에 모든 문서 + 우선순위 규칙을 보내 ImportDeclarationParsedDto 로 받기 */
    private ImportDeclarationParsedDto callGemini(List<DocText> docs) {
    	   if (chatClient == null) {
               ChatClient.Builder builder = chatClientBuilderProvider.getIfAvailable();

               if (builder == null) {
                   System.out.println("[AI PDF 자동채움] ChatClient.Builder Bean이 없어 AI 파싱을 비활성화합니다.");
                   return null;
               }

               chatClient = builder.build();
           }

        StringBuilder docsBlock = new StringBuilder();
        int i = 1;
        for (DocText d : docs) {
            docsBlock.append("\n=== Document ").append(i++).append(" — ")
                     .append(d.docTyCd != null ? d.docTyCd : "UNKNOWN")
                     .append(" (filename: ").append(d.fileName).append(") ===\n")
                     .append(d.text).append("\n");
        }

        String prompt = """
            You are a Korean customs broker assistant.
            I'm giving you multiple PDF documents related to ONE import shipment into Korea.
            Extract data into ONE consolidated import declaration DTO.

            DOCUMENT TYPES (may be present or missing):
              - COMMERCIAL_INVOICE  : buyer/seller, items, prices, totals, Incoterms
              - PACKING_LIST        : packages, quantities, weights
              - BL                  : shipper, consignee, B/L#, vessel, ports
              - PHYTOSANITARY (PHYTO): plant inspection, botanical names
              - others (ETC)

            PRIORITY RULES (when fields appear in multiple documents):
              - Importer/Consignee, B/L#, vessel, ports, transport, container : trust BL
              - Item descriptions, HS code, prices, totals, Incoterms, currency : trust INVOICE
              - Package count/units, quantities, weights : trust PACKING_LIST
              - Origin country, botanical names : trust PHYTOSANITARY

            CONFLICT RESOLUTION:
              - Different spellings of same company → prefer BL spelling
              - Korean company names: keep Hangul if present in any doc
              - Dates → normalize to YYYY-MM-DD
              - Country codes → ISO 3166-1 alpha-2 (KR, CN, US, ...)
              - Currency → ISO 4217 (USD, KRW, EUR, ...)
              - Transport mode → "Sea" / "Air" / "Land"
              - HS code: if any document mentions it, use it. Otherwise estimate from product name.

            OUTPUT:
              - Return ONE consolidated JSON matching the provided schema.
              - Use null for unavailable fields. NEVER hallucinate company names or numbers.
              - For items: one entry per distinct product (combine same product across docs).

            DOCUMENTS:
            """ + docsBlock;

        try {
            return chatClient.prompt()
                .user(prompt)
                .call()
                .entity(ImportDeclarationParsedDto.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /** 내부 자료구조 — 문서 1개의 type + text */
    private static class DocText {
        final String docTyCd;
        final String fileName;
        final String text;
        DocText(String docTyCd, String fileName, String text) {
            this.docTyCd = docTyCd;
            this.fileName = fileName;
            this.text = text;
        }
    }
}
