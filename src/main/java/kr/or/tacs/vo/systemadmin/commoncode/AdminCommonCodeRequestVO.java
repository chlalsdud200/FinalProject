package kr.or.tacs.vo.systemadmin.commoncode;

import lombok.Data;

@Data
public class AdminCommonCodeRequestVO {

    private String ccgId;
    private String ccCd;
    private String ccName;
    private String description;
    private Integer sortOrder;
    private String externalYn;
    private String endYn;
    private String remark;
    private String useYn;
}
