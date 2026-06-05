package kr.or.tacs.vo.systemadmin.member;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminMemberDetailFieldVO {

    private String fieldName;
    private String columnName;
    private String label;
    private boolean editable;
    private boolean masked;
    private String inputType;
}
