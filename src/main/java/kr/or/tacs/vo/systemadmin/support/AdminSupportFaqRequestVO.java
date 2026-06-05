package kr.or.tacs.vo.systemadmin.support;

import java.util.List;

import lombok.Data;

@Data
public class AdminSupportFaqRequestVO {

    private String question;
    private String answer;
    private String categoryCd;
    private Integer sortOrder;
    private String useYn;
    private List<String> selectedTargetRoles;
    private List<String> targetRoleCds;
}
