package kr.or.tacs.vo.systemadmin.commoncode;

import lombok.Data;

@Data
public class AdminCommonCodeSearchVO {

    private String ccgId;
    private String keyword;
    private String useYn = "all";
}
