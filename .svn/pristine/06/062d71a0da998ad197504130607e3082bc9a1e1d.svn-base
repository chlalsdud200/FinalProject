package kr.or.tacs.officer.basicscreen.service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.List;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.or.tacs.common.file.service.GoogleDriveService;
import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.dto.officer.AIRiskDTO;
import kr.or.tacs.dto.officer.BasicScreenDetailDTO;
import kr.or.tacs.officer.basicscreen.mapper.AIRiskMapper;
import kr.or.tacs.officer.basicscreen.mapper.IScreenDetailMapper;

@Service
public class AiRiskServiceImpl implements IAiRiskService {

    @Autowired
    private AIRiskMapper aiMapper;

    @Autowired
    private IScreenDetailMapper detailMapper;

    @Autowired
    private IFileService fileService;

    @Autowired
    private GoogleDriveService googleDriveService;

    @Autowired
    private ChatClient chatClient;

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    // -------------------------------------------------------------------------
    // IAiRiskService 구현
    // -------------------------------------------------------------------------

    @Override
    public AIRiskDTO getAiRiskResult(String bizTypeCd, String refNo) {
        if (!hasValue(bizTypeCd) || !hasValue(refNo)) {
            return null;
        }
        AIRiskDTO dto = new AIRiskDTO();
        dto.setArrBizTypeCd(bizTypeCd.trim());
        dto.setArrRefNo(refNo.trim());
        return aiMapper.selectAiRiskResult(dto);
    }

    @Override
    public int saveAiRiskResult(AIRiskDTO dto) {
        if (dto == null || !hasValue(dto.getArrBizTypeCd()) || !hasValue(dto.getArrRefNo())) {
            return 0;
        }
        try {
            return aiMapper.insertAiRiskResult(dto);
        } catch (DuplicateKeyException e) {
            System.out.println("[AI 위험도] 이미 저장된 결과가 있어 저장을 건너뜁니다. refNo=" + dto.getArrRefNo());
            return 0;
        }
    }

    @Override
    public void aiResultSave(String bizTypeCd, String refNo) {

        if (!hasValue(bizTypeCd) || !hasValue(refNo)) {
            System.out.println("[AI 위험도] 업무구분 또는 신고번호가 없어 분석을 건너뜁니다.");
            return;
        }

        bizTypeCd = bizTypeCd.trim();
        refNo     = refNo.trim();

        if (!"IMPORT".equals(bizTypeCd) && !"EXPORT".equals(bizTypeCd)) {
            System.out.println("[AI 위험도] 알 수 없는 업무구분이라 분석을 건너뜁니다. bizTypeCd=" + bizTypeCd);
            return;
        }

        // ── 1. 중복 체크 ─────────────────────────────────────────────────────
        AIRiskDTO search = new AIRiskDTO();
        search.setArrBizTypeCd(bizTypeCd);
        search.setArrRefNo(refNo);

        if (aiMapper.selectAiRiskResult(search) != null) {
            System.out.println("[AI 위험도] 기존 분석 결과가 있어 재분석하지 않습니다. refNo=" + refNo);
            return;
        }

        // ── 2. 신고 상세 조회 ────────────────────────────────────────────────
        BasicScreenDetailDTO detail = "IMPORT".equals(bizTypeCd)
                ? detailMapper.selectImportDetail(refNo)
                : detailMapper.selectExportDetail(refNo);

        // ── 3. 신고 품목 전체 조회 ─────────────────────────────────────────
        List<BasicScreenDetailDTO> itemList = "IMPORT".equals(bizTypeCd)
                ? detailMapper.selectImportItems(refNo)
                : detailMapper.selectExportItems(refNo);

        // ── 4. 첨부파일 텍스트 추출 ──────────────────────────────────────────
        String fileText = extractFileText(refNo, detail);
        saveAiDebugText(refNo, fileText);

        System.out.println("===== AI PDF/TXT 추출 내용 저장 완료 =====");
        System.out.println("신고번호 = " + refNo);
        System.out.println("저장위치 = C:/upload/ai-debug/" + makeSafeFileName(refNo) + ".txt");

        // ── 5. Spring AI ChatClient로 위험도 판단 ────────────────────────────
        AIRiskJudgement judgement = judgeWithAi(bizTypeCd, refNo, detail, itemList, fileText);

        System.out.println("AI 최종 점수 = " + judgement.score());
        System.out.println("AI 등급     = " + judgement.gradeCd());
        System.out.println("AI 상세사유  = " + judgement.detailCn());

        // ── 6. DB 저장 ───────────────────────────────────────────────────────
        AIRiskDTO dto = new AIRiskDTO();
        dto.setArrNo(aiMapper.selectArrNo());
        dto.setArrBizTypeCd(bizTypeCd);
        dto.setArrRefNo(refNo);
        dto.setArrScore(judgement.score());
        dto.setArrGradeCd(judgement.gradeCd());
        dto.setArrResultCn(judgement.resultCn());
        dto.setArrDetailCn(judgement.detailCn());
        dto.setArrStatusCd("DONE");
        dto.setArrOfficerId(null);

        try {
            // insert 직전 재확인 (동시 접근 방어)
            if (aiMapper.selectAiRiskResult(search) != null) {
                System.out.println("[AI 위험도] insert 직전 기존 결과 확인됨. 저장을 건너뜁니다. refNo=" + refNo);
                return;
            }
            aiMapper.insertAiRiskResult(dto);

        } catch (DuplicateKeyException e) {
            System.out.println("[AI 위험도] 이미 저장된 결과가 있어 insert를 건너뜁니다. refNo=" + refNo);
        } catch (Exception e) {
            System.out.println("[AI 위험도] 결과 저장 중 오류가 발생했습니다. refNo=" + refNo);
            e.printStackTrace();
        }
    }

    // =========================================================================
    // Spring AI 판단 로직 (기존 규칙 기반 점수 계산을 대체)
    // =========================================================================

    private AIRiskJudgement judgeWithAi(String bizTypeCd,
                                        String refNo,
                                        BasicScreenDetailDTO detail,
                                        List<BasicScreenDetailDTO> itemList,
                                        String fileText) {
        try {
            String prompt = buildPrompt(bizTypeCd, refNo, detail, itemList, fileText);

            String rawResponse = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            return parseJudgement(rawResponse);

        } catch (Exception e) {
            System.out.println("[AI 위험도] ChatClient 호출 실패, 기본 MIDDLE 등급으로 처리합니다. cause=" + e.getMessage());
            return new AIRiskJudgement(
                    50,
                    "MIDDLE",
                    "AI 분석 중 오류가 발생하여 담당자 확인이 필요합니다.",
                    "ChatClient 오류: " + e.getMessage()
            );
        }
    }

    private String buildPrompt(String bizTypeCd,
                                String refNo,
                                BasicScreenDetailDTO detail,
                                List<BasicScreenDetailDTO> itemList,
                                String fileText) {

        String amount = detail != null ? nvl(detail.getAmount()) : "-";
        String currencyCode = detail != null ? nvl(detail.getCurrencyCode()) : "-";
        String origin = detail != null ? nvl(detail.getOrigin()) : "-";
        String itemSummary = buildItemSummary(itemList, detail);

        String attachedText = (fileText == null || fileText.isBlank())
                ? "[송장/포장명세서/B/L 첨부파일 텍스트 없음]"
                : fileText.length() > 6000
                        ? fileText.substring(0, 6000) + "\n...(이하 생략)"
                        : fileText;

        // String.formatted/String.format을 쓰면 프롬프트 안의 % 기호(예: 1% 이내) 때문에
        // UnknownFormatConversionException 이 발생할 수 있다. 그래서 문자열 연결 방식으로 만든다.
        return """
                당신은 세관 신고서 위험도를 분석하는 전문가입니다.
                아래의 [신고 기본 정보], [신고 품목 전체], [제출서류 내용]을 비교하여 위험도를 판단해 주세요.

                [신고 기본 정보]
                - 업무구분: """ + bizTypeCd + """
                - 신고번호: """ + refNo + """
                - 신고총금액: """ + amount + " " + currencyCode + """
                - 대표 원산지: """ + origin + """

                [신고 품목 전체]
                """ + itemSummary + """

                [제출서류 내용]
                """ + attachedText + """

                [중요 판단 원칙]
                1. 반드시 [신고 품목 전체]와 제출서류의 품목 전체를 비교하세요.
                2. 대표 품목 1개만 보고 제출서류의 추가 품목을 불일치로 판단하지 마세요.
                3. 제출서류에 여러 품목이 있고, 그 품목들이 [신고 품목 전체]에 포함되어 있으면 품목 불일치가 아닙니다.
                4. 검역합격증명서, QUARANTINE CERTIFICATE, FQC 문서는 AI 위험도 비교 대상에서 제외하세요. 이 문서가 없거나 대표 품목만 적혀 있어도 위험도를 올리지 마세요.
                5. 송장(COMMERCIAL INVOICE), 포장명세서(PACKING LIST), B/L(BILL OF LADING)을 주요 비교 대상 문서로 사용하세요. 문서명이 다르더라도 본문에 해당 문서 제목이 있으면 그 문서로 판단하세요.
                6. TH, THAILAND, 태국은 같은 원산지로 보세요.
                7. 금액 비교는 반드시 통화를 구분하세요.
                   - [신고 기본 정보]의 신고총금액은 신고통화 기준 금액입니다.
                   - Invoice/Packing List의 US$ 금액과 신고총금액이 같은 통화일 때만 직접 비교하세요.
                   - [신고 품목 전체]의 과세가격(KRW)은 세금 산출용 원화 금액이므로 Invoice의 US$ 금액과 직접 비교하지 마세요.
                   - 서로 다른 통화의 금액을 단순 비교하여 금액 불일치로 판단하지 마세요.
                   - 같은 통화의 신고금액과 Invoice/Packing List 금액이 같거나 소수점/반올림 표시만 다르면 일치로 보세요.
                   - 1% 이내의 반올림/환산 차이는 위험도를 크게 올리지 마세요.
                8. 수량과 중량은 단위를 구분하세요. BAGS와 KG를 단순 비교하지 마세요.
                9. 확인불가와 불일치를 분리하세요. 실제로 다른 값이 확인될 때만 불일치로 판단하세요.
                10. 제출서류가 대체로 일치하면 LOW로 판단하세요.

                [점수 기준]
                - 0~25 LOW: 품명, HS코드, 수량/중량, 금액, 원산지, B/L이 대체로 일치
                - 26~39 LOW: 사소한 반올림 차이 또는 일부 항목 확인 필요
                - 40~69 MIDDLE: 실제 불일치가 일부 있거나 필수 문서가 일부 부족
                - 70~100 HIGH: HS코드/품명/금액/원산지 중 핵심 항목이 명확히 불일치하거나 주요 서류가 없음

                [응답 형식]
                반드시 아래 JSON만 반환하세요. 다른 설명 없이 JSON만 출력하세요.
                {
                  "score": <0~100 정수>,
                  "gradeCd": "<HIGH|MIDDLE|LOW>",
                  "resultCn": "<한 문장 결과 요약>",
                  "detailCn": "<실제 불일치 또는 확인 필요 항목만 작성. 일치한 항목을 불일치로 쓰지 말 것>"
                }
                """;
    }

    private String buildItemSummary(List<BasicScreenDetailDTO> itemList, BasicScreenDetailDTO detail) {
        StringBuilder sb = new StringBuilder();

        if (itemList != null && !itemList.isEmpty()) {
            int idx = 1;
            for (BasicScreenDetailDTO item : itemList) {
                sb.append(idx++).append(". ")
                  .append("품명: ").append(nvl(item.getItemName())).append("\n")
                  .append("   HS코드: ").append(nvl(item.getHsCode())).append("\n")
                  .append("   수량: ").append(nvl(item.getQty())).append("\n")
                  .append("   중량: ").append(nvl(item.getWeight())).append("\n")
                  .append("   원산지: ").append(nvl(item.getOrigin())).append("\n")
                  .append("   과세가격(KRW, 세금산출용): ").append(nvl(item.getAmount())).append("\n");
            }
            return sb.toString();
        }

        if (detail == null) {
            return "- 신고 품목 정보 없음";
        }

        return "1. 품명: " + nvl(detail.getItemName()) + "\n"
             + "   HS코드: " + nvl(detail.getHsCode()) + "\n"
             + "   수량: " + nvl(detail.getQty()) + "\n"
             + "   원산지: " + nvl(detail.getOrigin()) + "\n"
             + "   신고총금액: " + nvl(detail.getAmount()) + "\n";
    }

    private AIRiskJudgement parseJudgement(String raw) {
        try {
            String json = raw.replaceAll("(?s)```json\\s*", "")
                             .replaceAll("(?s)```\\s*", "")
                             .trim();

            JsonNode node = OBJECT_MAPPER.readTree(json);

            int    score    = node.path("score").asInt(50);
            String gradeCd  = node.path("gradeCd").asText("MIDDLE");
            String resultCn = node.path("resultCn").asText("AI 분석 결과를 확인하세요.");
            String detailCn = node.path("detailCn").asText("");

            if (score < 0)   score = 0;
            if (score > 100) score = 100;

            if      (score >= 70) gradeCd = "HIGH";
            else if (score >= 40) gradeCd = "MIDDLE";
            else                  gradeCd = "LOW";

            return new AIRiskJudgement(score, gradeCd, resultCn, detailCn);

        } catch (Exception e) {
            System.out.println("[AI 위험도] JSON 파싱 실패. raw=" + raw);
            return new AIRiskJudgement(
                    50,
                    "MIDDLE",
                    "AI 응답 파싱 실패로 담당자 확인이 필요합니다.",
                    "파싱 오류: " + e.getMessage()
            );
        }
    }

    // =========================================================================
    // 첨부파일 텍스트 추출 (기존 로직 유지)
    // =========================================================================

    private String extractFileText(String refNo, BasicScreenDetailDTO detail) {
        StringBuilder fileText = new StringBuilder();
        try {
            if (detail == null || detail.getTfgNo() == null) {
                return "";
            }

            List<FileInfoDTO> files = fileService.getFileList(detail.getTfgNo());
            if (files == null || files.isEmpty()) {
                return "";
            }

            for (FileInfoDTO file : files) {
                if (file.getDfiDriveFileId() == null || file.getDfiDriveFileId().isBlank()) {
                    continue;
                }
                if (!"DONE".equals(file.getDfiUploadSttsCd())) {
                    continue;
                }

                String mime    = file.getDfiMimeTy();
                String orgName = file.getDfiOrgNm();

                if (isQuarantineFile(orgName)) {
                    System.out.println("[AI 위험도] 검역증명서는 비교 대상에서 제외합니다. file=" + orgName);
                    continue;
                }

                byte[] bytes = googleDriveService.downloadFile(file.getDfiDriveFileId());

                fileText.append("\n\n===== 첨부파일: ").append(orgName == null ? "파일명없음" : orgName).append(" =====\n");

                if ((mime != null && mime.contains("text"))
                        || (orgName != null && orgName.toLowerCase().endsWith(".txt"))) {
                    fileText.append(new String(bytes, StandardCharsets.UTF_8));

                } else if ((mime != null && mime.contains("pdf"))
                        || (orgName != null && orgName.toLowerCase().endsWith(".pdf"))) {
                    try (PDDocument document = Loader.loadPDF(bytes)) {
                        PDFTextStripper stripper = new PDFTextStripper();
                        fileText.append(cleanExtractedText(stripper.getText(document)));
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("[AI 위험도] 첨부파일 내용 읽기 실패: " + e.getMessage());
        }
        return fileText.toString();
    }


    private boolean isQuarantineFile(String orgName) {
        if (orgName == null) return false;
        String name = orgName.toLowerCase();
        return name.contains("검역")
                || name.contains("quarantine")
                || name.contains("inspection certificate")
                || name.contains("fqc-");
    }

    private String cleanExtractedText(String text) {
        if (text == null) return "";
        return text
                .replaceAll("(?i)TACS\\s+QUARANTINE\\s+CERTIFICATE", "")
                .replaceAll("(?m)^[ \t]*$\\n", "")
                .trim();
    }

    // =========================================================================
    // 공통 유틸리티 (기존 유지)
    // =========================================================================

    private void saveAiDebugText(String refNo, String fileText) {
        try {
            Path dir  = Path.of("C:/upload/ai-debug");
            Files.createDirectories(dir);
            Path file = dir.resolve(makeSafeFileName(refNo) + ".txt");

            String content =
                    "===== AI PDF/TXT 추출 내용 =====\n"
                  + "신고번호: " + refNo + "\n"
                  + "생성시각: " + LocalDateTime.now() + "\n"
                  + "================================\n\n"
                  + (fileText == null || fileText.isBlank() ? "[추출된 텍스트 없음]" : fileText);

            Files.writeString(file, content, StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        } catch (Exception e) {
            System.out.println("[AI 위험도] 추출 텍스트 파일 저장 실패: " + e.getMessage());
        }
    }

    private String makeSafeFileName(String value) {
        if (value == null || value.isBlank()) return "unknown";
        return value.replaceAll("[^a-zA-Z0-9가-힣._-]", "_");
    }

    private boolean hasValue(String value) {
        return value != null && !value.trim().isEmpty() && !"-".equals(value.trim());
    }

    private String nvl(String value) {
        return hasValue(value) ? value : "-";
    }

    // =========================================================================
    // 내부 결과 전달용 레코드
    // =========================================================================

    private record AIRiskJudgement(int score, String gradeCd, String resultCn, String detailCn) {}
}