package kr.or.tacs.dto.owner;

import lombok.Data;

@Data
public class OwnerPaymentTargetDTO {

    private String claimNo;       // TCS_NO 또는 BC_NO
    private String owrId;         // 화주 ID
    private Long amount;          // 결제금액
    private String statusCd;      // 원천 청구 상태
    private String orderName;     // 토스 주문명
    private String recordTy;      // FREIGHT 또는 BROKER
}
