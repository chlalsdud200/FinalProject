package kr.or.tacs.owner.transport.service;

import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.common.notification.service.INotificationService;
import kr.or.tacs.common.ocr.service.GoogleVisionOcrService;
import kr.or.tacs.dto.owner.OwnerFreightCertCompareResultDTO;
import kr.or.tacs.dto.owner.OwnerFreightDTO;
import kr.or.tacs.owner.transport.mapper.IFreightMapper;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class FreightServiceImpl implements IFreightService {

    @Autowired
    private IFreightMapper freightMapper;

    @Autowired
    private IFileService fileService;

    @Autowired
    private GoogleVisionOcrService googleVisionOcrService;

    @Autowired
    private INotificationService notificationService;

    @Override
    public List<OwnerFreightDTO> retrieveFreightList(String owrId) {
        return freightMapper.selectFreightList(owrId);
    }

    @Override
    public OwnerFreightDTO retrieveFreight(String tcsNo, String owrId) {
        return freightMapper.selectFreight(tcsNo, owrId);
    }

    /**
     * 신고필증 AI 대조
     * - DB 저장 안 함
     * - PDFBox/OCR로 파일 내용만 판독
     * - 상세 B/L 번호와 일치하는지 결과만 반환
     */
    @Override
    public OwnerFreightCertCompareResultDTO compareFreightCertificate(
            String tcsNo,
            String trcNo,
            MultipartFile certFile,
            String owrId
    ) {
        OwnerFreightDTO freight = validateFreightCertTarget(tcsNo, trcNo, owrId, certFile);

        CertCompareResult compareResult = compareCertificateBlNo(
                certFile,
                freight.getTcsMblNo(),
                freight.getTcsHblNo()
        );

        OwnerFreightCertCompareResultDTO resultDTO = new OwnerFreightCertCompareResultDTO();

        if (compareResult.isMatched()) {
            resultDTO.setMatchYn("Y");
            resultDTO.setMatchMethodCd(compareResult.getMatchMethodCd());
            resultDTO.setMatchedBlNo(compareResult.getMatchedBlNo());
            resultDTO.setMessage("신고필증의 B/L 번호가 정산 상세의 B/L 번호와 일치합니다.");
        } else {
            resultDTO.setMatchYn("N");
            resultDTO.setMatchMethodCd("FAIL");
            resultDTO.setMatchedBlNo("");
            resultDTO.setMessage("신고필증에서 정산 상세의 B/L 번호를 확인하지 못했습니다.");
        }

        return resultDTO;
    }

    /**
     * 신고필증 최종 업로드/전달
     * - 최종 저장 전에 서버에서 다시 대조
     * - 대조 성공 시 공통 파일 업로드
     * - TRAN_RCP에 필증 전달 완료 상태 업데이트
     */
    @Override
    @Transactional
    public void uploadFreightCertificate(
            String tcsNo,
            String trcNo,
            MultipartFile certFile,
            String owrId
    ) {
        OwnerFreightDTO freight = validateFreightCertTarget(tcsNo, trcNo, owrId, certFile);

        CertCompareResult compareResult = compareCertificateBlNo(
                certFile,
                freight.getTcsMblNo(),
                freight.getTcsHblNo()
        );

        if (!compareResult.isMatched()) {
            throw new IllegalArgumentException("B/L 번호 대조가 일치하지 않아 신고필증을 전달할 수 없습니다.");
        }

        try {
            Map<String, MultipartFile> filesByDocTyCd = new LinkedHashMap<>();
            filesByDocTyCd.put("CUSTOMS_CERT", certFile);

            Long certTfgNo = fileService.uploadFiles(
                    "BIZ",
                    filesByDocTyCd,
                    owrId,
                    "OWNER"
            );

            freightMapper.updateFreightCertificate(
                    trcNo,
                    owrId,
                    certTfgNo
            );

            // 운임 정산완료(TRC_STL_PAID) 상태에서만 도달하는 지점이므로
            // '정산완료 + 신고필증 전달' 두 조건이 동시에 충족된다.
            // → 운송담당자에게 D/O 발급 진행 알림. refKey=trcNo('TRC-' 접두)로 담당자 1인에게만 전달.
            Map<String, String> bindings = new HashMap<>();
            bindings.put("trcNo", trcNo);
            // 운송의뢰 상세의 D/O 작업탭으로 직접 이동 (그 건+단계)
            bindings.put("linkUrl", "/transport/import.do?page=TACS-FW-030&work=do&trcNo=" + trcNo);
            notificationService.registNotification("DO_READY", trcNo, owrId, bindings);

        } catch (Exception e) {
            throw new RuntimeException("신고필증 파일 저장 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 운임 정산/운송의뢰/화주/납부상태 기본 검증
     */
    private OwnerFreightDTO validateFreightCertTarget(
            String tcsNo,
            String trcNo,
            String owrId,
            MultipartFile certFile
    ) {
        if (certFile == null || certFile.isEmpty()) {
            throw new IllegalArgumentException("신고필증 파일을 선택하세요.");
        }

        OwnerFreightDTO freight = freightMapper.selectFreight(tcsNo, owrId);

        if (freight == null) {
            throw new IllegalArgumentException("운임 정산 정보를 찾을 수 없습니다.");
        }

        if (!trcNo.equals(freight.getTcsTrcNo())) {
            throw new IllegalArgumentException("운송의뢰번호가 정산 정보와 일치하지 않습니다.");
        }

        if (!"TRC_STL_PAID".equals(freight.getTcsStlStatusCd())) {
            throw new IllegalArgumentException("납부완료 상태에서만 신고필증을 전달할 수 있습니다.");
        }

        return freight;
    }

    /**
     * PDFBox 우선 대조, 실패 시 OCR 대조
     */
    private CertCompareResult compareCertificateBlNo(
            MultipartFile file,
            String mblNo,
            String hblNo
    ) {
        String pdfText = extractTextByPdfBox(file);
        String matchedBlNo = findMatchedBlNo(pdfText, mblNo, hblNo);

        if (matchedBlNo != null) {
            return CertCompareResult.matched(matchedBlNo, "PDF_TEXT");
        }

        String visionText = googleVisionOcrService.extractText(file);

        System.out.println("===== GOOGLE VISION OCR TEXT START =====");
        System.out.println(visionText);
        System.out.println("===== GOOGLE VISION OCR TEXT END =====");

        matchedBlNo = findMatchedBlNo(visionText, mblNo, hblNo);

        if (matchedBlNo != null) {
            return CertCompareResult.matched(matchedBlNo, "GOOGLE_VISION");
        }

        return CertCompareResult.notMatched();
    }

    /**
     * 텍스트 PDF용 PDFBox 추출
     */
    private String extractTextByPdfBox(MultipartFile file) {
        String fileName = file.getOriginalFilename();

        if (fileName == null || !fileName.toLowerCase().endsWith(".pdf")) {
            return "";
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (Exception e) {
            return "";
        }
    }


    /**
     * 추출 텍스트 안에 상세 MBL/HBL 번호가 들어있는지 확인
     */
    private String findMatchedBlNo(String text, String mblNo, String hblNo) {
        if (text == null || text.isBlank()) {
            return null;
        }

        String normalizedText = normalizeBlNo(text);

        if (hasText(mblNo) && normalizedText.contains(normalizeBlNo(mblNo))) {
            return mblNo;
        }

        if (hasText(hblNo) && normalizedText.contains(normalizeBlNo(hblNo))) {
            return hblNo;
        }

        return null;
    }

    private String normalizeBlNo(String value) {
        if (value == null) {
            return "";
        }

        return value
                .replaceAll("[\\s\\-_/]", "")
                .toUpperCase();
    }

    private boolean hasText(String value) {
        return value != null
                && !value.isBlank()
                && !"-".equals(value.trim());
    }

    /**
     * 내부 대조 결과 객체
     */
    private static class CertCompareResult {
        private final boolean matched;
        private final String matchedBlNo;
        private final String matchMethodCd;

        private CertCompareResult(boolean matched, String matchedBlNo, String matchMethodCd) {
            this.matched = matched;
            this.matchedBlNo = matchedBlNo;
            this.matchMethodCd = matchMethodCd;
        }

        static CertCompareResult matched(String matchedBlNo, String matchMethodCd) {
            return new CertCompareResult(true, matchedBlNo, matchMethodCd);
        }

        static CertCompareResult notMatched() {
            return new CertCompareResult(false, null, "FAIL");
        }

        boolean isMatched() {
            return matched;
        }

        String getMatchedBlNo() {
            return matchedBlNo;
        }

        String getMatchMethodCd() {
            return matchMethodCd;
        }
    }
}