package kr.or.tacs.vo.broker.info;

import lombok.Data;

@Data
public class CustomsCodeVO {
    private String tradeType;
    private String reqNo;
    private String ownerId;
    private String ownerName;
    private String bizNo;
    private String customsIdfNo;
}
