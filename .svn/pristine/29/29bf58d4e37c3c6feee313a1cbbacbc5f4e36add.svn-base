package kr.or.tacs.transport.importp.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.tacs.vo.transport.TransportRequestVO;

public interface ImportTransportService {

    List<TransportRequestVO> retriveImpTransportReqList();

    boolean modifyImpTransportReqStatus(String trcNo, String statusCd, String rejectType, String rejectMemo, String actorId);

    boolean modifyImpTransportReqDetail(String trcNo,
                                        String buyerNm,
                                        String buyerCountryCd,
                                        String transportMeanCd,
                                        String transportTypeCd,
                                        String incoTermsCd,
                                       String deptPortCd,
                                       String arvlPortCd,
                                       String itemCategory,
                                       String goodsName,
                                       BigDecimal qty,
                                       BigDecimal weight,
                                       String mblNo,
                                       String requestCn);

    boolean modifyImpUnloadingInSupplement(String wirNo,
                                           String receiverId,
                                           String wmId,
                                           String wzNo,
                                           String inPlanDt,
                                           String cargoMgmtNo,
                                           String invoiceNo,
                                           String incoTermsCd,
                                           String remark,
                                           List<TransportRequestVO> goodsList,
                                           String actorId);

    boolean modifyImpReleaseSupplement(String releaseReqNo,
                                       String trcNo,
                                       String receiverId,
                                       String wmId,
                                       String wzNo,
                                       String releaseReqDt,
                                       String releaseDt,
                                       String itemNm,
                                       String remark,
                                       List<TransportRequestVO> goodsList,
                                       String suppTypeCd,
                                       String suppReqCn,
                                       String actorId);

    List<TransportRequestVO> retriveImpArrivalTrackingList();

    String modifyImpArrivalNoticeSent(String reqNo, String arrivalEta);

    boolean modifyImpArrivalTrackingStatus(String reqNo, String currentLoc, String arrivalStatusCd);

    List<TransportRequestVO> retriveImpUnloadingInList();

    TransportRequestVO retriveImpUnloadingInDetail(String wirNo);

    List<TransportRequestVO> retriveImpUnloadingInGoodsList(Integer ggNo);

    List<TransportRequestVO> retriveImportWarehouseManagerList();

    String modifyImpUnloadingInDelivered(String trcNo,
                                          String wirNo,
                                          String wmId,
                                          String wzNo,
                                          String inPlanDt,
                                          String cargoMgmtNo,
                                          String invoiceNo,
                                          String incoTermsCd,
                                          String remark,
                                          List<TransportRequestVO> goodsList);

    // 적하목록 작성/제출은 운송담당자 범위에서 제외. 비교조회만 사용.
    List<TransportRequestVO> retriveImpManifestList();

    List<TransportRequestVO> retriveImpManifestCompareList();

    List<TransportRequestVO> retriveImpDoList();

    void ensureImpDoReadyAfterSettlementPaid(String trcNo);

    boolean modifyImpDoSettlementPaid(String trcNo, Integer freightAmt, Integer warehouseAmt, Integer totalBillAmt, String settlementExpln);

    boolean modifyImpDoFilesUploaded(String trcNo,
                                     String actorId,
                                     List<MultipartFile> docFiles);

    boolean connectImpOwnerCustomsCert(String trcNo, Long fileNo);

    boolean deleteImpDoFile(String trcNo, Long fileNo);

    String modifyImpDoIssued(String trcNo,
                             String doNo,
                             String receiveDt,
                             String actorId,
                             List<MultipartFile> docFiles);

    boolean modifyImpDoDelivered(String trcNo, String deliveryDt, String deliveryTargetNm, String deliveryMethodCd);

    // 수입 보세구역 반출요청
    List<TransportRequestVO> retriveImpReleaseReqList();

    TransportRequestVO retriveImpReleaseReqDetail(String trcNo);

    List<TransportRequestVO> retriveImpReleaseReqGoodsList(Integer ggNo);

    boolean registImpReleaseReq(String trcNo,
                                String wmId,
                                String wzNo,
                                String releaseReqDt,
                                String releaseDt,
                                String itemNm,
                                String remark,
                                List<TransportRequestVO> goodsList);

    List<TransportRequestVO> retriveImpInlandDispatchList();

    List<TransportRequestVO> retriveImpAvailableCarList();

    int modifyImpInlandDispatch(TransportRequestVO vo);
}
