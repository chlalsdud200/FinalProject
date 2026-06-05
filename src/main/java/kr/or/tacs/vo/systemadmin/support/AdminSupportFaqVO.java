package kr.or.tacs.vo.systemadmin.support;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class AdminSupportFaqVO {

    private Long faqNo;
    private String question;
    private String answer;
    private String categoryCd;
    private String categoryName;
    private Integer sortOrder;
    private Long hit;
    private String useYn;
    private String adminId;
    private String createdAt;
    private String updatedAt;
    private List<String> selectedTargetRoles = new ArrayList<>();
    private String targetRoleText;
}
