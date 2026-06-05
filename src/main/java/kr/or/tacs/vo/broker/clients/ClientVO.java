package kr.or.tacs.vo.broker.clients;


import java.util.List;

import lombok.Data;

@Data
public class ClientVO {

    private String reqNo;
    private String reqType;       // 수입 / 수출
    private String reqTypeCd;     // IMPORT / EXPORT

    private String clientId;
    private String clientName;

    private String itemName;
    private String statusCd;
    private String statusName;
    private String requestDate;   // YYYY-MM-DD
    private String requestDateTime;

    private String cstmIdfNo;
    private String bizrno;
    private String corpRegNo;

    private String portFrom;
    private String portTo;
    private String scheduleDate;
    private String blAwbNo;
    private String currencyCd;
    private Long invoiceAmount;

    private String comment;
    
    
    private Long tfgNo;
    private List<ClientFileVO> fileList;
    
    private String payTypeCd;
    private Integer instlPayCnt;
    private Long impCgNo;
    
    private String suppReqCn;       // 관세사가 요청한 보완내용
    private String suppSubmitCn;    // 화주가 제출한 보완 답변내용
    private String suppStatusCd;    // SUPP_RQST 상태 REQ/SUB
    private String suppReqDt;       // 보완요청일시
    private String suppSubmitDt;    // 보완제출일시
    
    
}












