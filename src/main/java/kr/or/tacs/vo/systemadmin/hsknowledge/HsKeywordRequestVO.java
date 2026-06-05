package kr.or.tacs.vo.systemadmin.hsknowledge;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class HsKeywordRequestVO {

    private String hsCode;
    private String keyword;
    private BigDecimal keywordWeight;
    private String useYn;
}
