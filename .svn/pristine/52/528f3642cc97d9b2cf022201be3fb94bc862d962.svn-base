package kr.or.tacs.transport.export.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.common.notification.service.INotificationService;
import kr.or.tacs.transport.export.mapper.ExportTransportMapper;
import kr.or.tacs.vo.transport.TransportInboundRequestVO;
import kr.or.tacs.vo.transport.TransportRequestVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExportTransportServiceImpl implements ExportTransportService {

    private final ExportTransportMapper exportTransportMapper;
    private final IFileService fileService;
    private final INotificationService notificationService;

    private static final String EXP_MANIFEST_BIZ_SE_CD = "EXP_MANIFEST";
    private static final String TRANSPORT_ACTOR_TYPE = "TRANSPORT_MANAGER";

    @Override
    public List<TransportRequestVO> retriveExpTransportReqList() {
        return exportTransportMapper.retriveExpTransportReqList(currentTmId());
    }

    @Override
    public List<TransportInboundRequestVO> retriveExpInboundReqList() {
        return exportTransportMapper.retriveExpInboundReqList(currentTmId());
    }

    @Override
    public List<TransportRequestVO> retriveExpManifestList() {
        return exportTransportMapper.retriveExpManifestList(currentTmId());
    }

    @Override
    @Transactional
    public int registExpCargoManifest(TransportRequestVO vo,
                                      String actorId,
                                      MultipartFile invoicePdfFile,
                                      MultipartFile packingListPdfFile,
                                      MultipartFile manifestPdfFile) {
        Long tfgNo = uploadManifestFiles(vo, actorId, invoicePdfFile, packingListPdfFile, manifestPdfFile);
        vo.setManifestTfgNo(tfgNo);
        return exportTransportMapper.insertExpCargoManifest(vo);
    }

    @Override
    @Transactional
    public int modifyExpCargoManifestSupplement(TransportRequestVO vo,
                                                String actorId,
                                                MultipartFile invoicePdfFile,
                                                MultipartFile packingListPdfFile,
                                                MultipartFile manifestPdfFile) {
        Long tfgNo = uploadManifestFiles(vo, actorId, invoicePdfFile, packingListPdfFile, manifestPdfFile);
        vo.setManifestTfgNo(tfgNo);
        int manifestCnt = exportTransportMapper.updateExpCargoManifestSupplement(vo);
        if (manifestCnt <= 0) {
            return 0;
        }
        exportTransportMapper.updateExpManifestSupplementItemSubmitted(vo);
        exportTransportMapper.updateExpManifestSupplementSubmitted(vo);
        return manifestCnt;
    }

    @Override
    public boolean modifyExpTransportReqStatus(String trcNo, String statusCd, String rejectType, String rejectMemo) {
        String rejectReason = buildRejectReason(rejectType, rejectMemo);
        return exportTransportMapper.updateExpTransportReqStatus(trcNo, statusCd, rejectType, rejectMemo, rejectReason) > 0;
    }


    @Override
    @Transactional
    public boolean registExpInboundReq(String trcNo,
                                       String wirNo,
                                       String wmId,
                                       String wzNo,
                                       String inPlanDt,
                                       String cargoMgmtNo,
                                       String invoiceNo,
                                       String incoTermsCd,
                                       String remark) {
        exportTransportMapper.insertExpInboundReq(
                blankToNull(trcNo),
                blankToNull(wirNo),
                blankToNull(wmId),
                blankToNull(wzNo),
                blankToNull(inPlanDt),
                blankToNull(cargoMgmtNo),
                blankToNull(invoiceNo),
                blankToNull(incoTermsCd),
                blankToNull(remark)
        );

        int updated = exportTransportMapper.updateExpInboundReq(
                blankToNull(trcNo),
                blankToNull(wmId),
                blankToNull(wzNo),
                blankToNull(inPlanDt),
                blankToNull(cargoMgmtNo),
                blankToNull(invoiceNo),
                blankToNull(incoTermsCd),
                blankToNull(remark)
        );

        if (updated != 0 || exportTransportMapper.countExpInboundReqByTrcNo(blankToNull(trcNo)) > 0) {
            String savedWirNo = blankToNull(wirNo);
            if (savedWirNo == null) {
                savedWirNo = blankToNull(trcNo);
            }
            if (savedWirNo != null) {
                notificationService.registNotification(
                        "WH_INBOUND_REQUESTED",
                        "WIR-" + savedWirNo,
                        null,
                        Map.of("wirNo", savedWirNo)
                );
            }
            return true;
        }

        return false;
    }

    private Long uploadManifestFiles(TransportRequestVO vo,
                                     String actorId,
                                     MultipartFile invoicePdfFile,
                                     MultipartFile packingListPdfFile,
                                     MultipartFile manifestPdfFile) {
        Map<String, MultipartFile> filesByDocTyCd = new LinkedHashMap<>();
        putPdfFile(filesByDocTyCd, "INVOICE", invoicePdfFile);
        putPdfFile(filesByDocTyCd, "PACKING_LIST", packingListPdfFile);
        putPdfFile(filesByDocTyCd, "MANIFEST_PDF", manifestPdfFile);

        if (filesByDocTyCd.isEmpty()) {
            return null;
        }

        String uploadActorId = actorId;
        if (uploadActorId == null || uploadActorId.isBlank()) {
            uploadActorId = vo.getOwnerId();
        }

        try {
            return fileService.uploadFiles(EXP_MANIFEST_BIZ_SE_CD, filesByDocTyCd, uploadActorId, TRANSPORT_ACTOR_TYPE);
        } catch (Exception e) {
            throw new IllegalStateException("수출 적하목록 첨부파일 저장에 실패했습니다.", e);
        }
    }

    private void putPdfFile(Map<String, MultipartFile> filesByDocTyCd, String docTyCd, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return;
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("첨부파일은 PDF만 업로드할 수 있습니다.");
        }

        filesByDocTyCd.put(docTyCd, file);
    }

    private String buildRejectReason(String rejectType, String rejectMemo) {
        if (rejectType != null && !rejectType.isBlank()
                && rejectMemo != null && !rejectMemo.isBlank()) {
            return rejectType + " / " + rejectMemo;
        }
        if (rejectType != null && !rejectType.isBlank()) {
            return rejectType;
        }
        if (rejectMemo != null && !rejectMemo.isBlank()) {
            return rejectMemo;
        }
        return null;
    }


    private String blankToNull(String value) {
        if (value == null || value.isBlank() || "-".equals(value.trim())) {
            return null;
        }
        return value.trim();
    }

    private String currentTmId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            return null;
        }
        return authentication.getName();
    }

}
