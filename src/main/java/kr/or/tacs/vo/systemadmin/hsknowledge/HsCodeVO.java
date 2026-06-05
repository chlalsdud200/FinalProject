package kr.or.tacs.vo.systemadmin.hsknowledge;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class HsCodeVO {

    private String hsCode;
    private String hsName;
    private BigDecimal hsTariffRate;
    private String hsClassLevelCd;
    private String hsClassNm;
    private String hsClassDesc;
    private String parentHsClassCd;
    private String selectableYn;
    private BigDecimal sortSn; // Integer → BigDecimal로 변경
    private String useYn;
}
