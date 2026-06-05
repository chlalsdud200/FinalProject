package kr.or.tacs.vo.common;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SmsAuthVO {
    private Long saNo;
    private String saAuthPrposCd;
    private String saTargetId;
    private String saPhoneNo;
    private String saAuthCd;
    private String saVerifyYn;
    private LocalDateTime saVerifyDt;
    private Integer saFailCnt;
    private LocalDateTime saExprDt;
    private LocalDateTime saRegistDt;
}
