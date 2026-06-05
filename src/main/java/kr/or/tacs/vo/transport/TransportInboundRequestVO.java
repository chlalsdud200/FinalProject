package kr.or.tacs.vo.transport;

import lombok.Data;

@Data
// 운송 입고요청 화면에서 창고 입고 신청 정보를 담는 VO.
public class TransportInboundRequestVO {
    private String requestNo;             // 운송 입고요청번호
    private String owner;                 // 화주
    private String listParty;             // 목록 대상자
    private String listAt;                // 목록 일시
    private String listStatus;            // 목록 상태
    private String inboundRequestNo;      // 창고 입고요청번호
    private String warehouseManagerId;    // 창고관리자ID
    private String warehouseAreaNo;       // 창고구역번호
    private String targetWarehouse;       // 대상 창고
    private String inboundPlanDt;         // 입고예정일시
    private String requestStatus;         // 요청상태
    private String warehouseReplyStatus;  // 창고 응답상태
    private String invoiceNo;             // 송장번호
    private String invoiceDt;             // 송장일자
    private String inboundCargoNo;        // 입고화물번호
    private String shipper;               // 송하인
    private String consignee;             // 수하인
    private String incoterms;             // 인코텀즈
    private String requestNote;           // 요청사항
    private String rejectReason;          // 반려사유

}
