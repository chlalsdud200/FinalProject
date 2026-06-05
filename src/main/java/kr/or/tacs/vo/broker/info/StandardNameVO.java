package kr.or.tacs.vo.broker.info;

import lombok.Data;

@Data
public class StandardNameVO {
    private Integer goodsNo;
    private String goodsHsCode;
    private String goodsName;
    private String hsName;
    private Double hsTariffRate;
}
