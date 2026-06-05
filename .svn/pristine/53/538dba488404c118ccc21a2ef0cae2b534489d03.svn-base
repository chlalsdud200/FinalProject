package kr.or.tacs.dto.owner;

import lombok.Data;

@Data
public class TossConfirmResponseDTO {

    private String paymentKey;
    private String orderId;
    private String orderName;
    private String status;
    private String method;
    private Long totalAmount;
    private String approvedAt;
    private Receipt receipt;

    @Data
    public static class Receipt {
        private String url;
    }
}
