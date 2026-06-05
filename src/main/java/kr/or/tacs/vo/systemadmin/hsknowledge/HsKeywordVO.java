package kr.or.tacs.vo.systemadmin.hsknowledge;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class HsKeywordVO {

    private Long hsKeywordNo;
    private String hsCode;
    private String hsName;
    private String keyword;
    private BigDecimal keywordWeight;
    private String useYn;
    private String registDt;
}
