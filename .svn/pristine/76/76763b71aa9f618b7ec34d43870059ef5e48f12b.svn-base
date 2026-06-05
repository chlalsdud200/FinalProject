package kr.or.tacs.transport.export.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.tacs.vo.transport.TransportInboundRequestVO;
import kr.or.tacs.vo.transport.TransportRequestVO;

public interface ExportTransportService {

    List<TransportRequestVO> retriveExpTransportReqList();

    List<TransportInboundRequestVO> retriveExpInboundReqList();

    List<TransportRequestVO> retriveExpManifestList();

    int registExpCargoManifest(TransportRequestVO vo,
                               String actorId,
                               MultipartFile invoicePdfFile,
                               MultipartFile packingListPdfFile,
                               MultipartFile manifestPdfFile);

    int modifyExpCargoManifestSupplement(TransportRequestVO vo,
                                         String actorId,
                                         MultipartFile invoicePdfFile,
                                         MultipartFile packingListPdfFile,
                                         MultipartFile manifestPdfFile);

    boolean modifyExpTransportReqStatus(String trcNo, String statusCd, String rejectType, String rejectMemo);


    boolean registExpInboundReq(String trcNo,
                                String wirNo,
                                String wmId,
                                String wzNo,
                                String inPlanDt,
                                String cargoMgmtNo,
                                String invoiceNo,
                                String incoTermsCd,
                                String remark);

}
