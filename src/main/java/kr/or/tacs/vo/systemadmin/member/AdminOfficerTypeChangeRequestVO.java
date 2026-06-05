package kr.or.tacs.vo.systemadmin.member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AdminOfficerTypeChangeRequestVO {

    @NotBlank(message = "공무원 유형은 필수입니다.")
    @Pattern(regexp = "^(OFFICER|FIELD_OFFICER)$", message = "올바른 공무원 유형이 아닙니다.")
    private String officerTyCd;

    @NotBlank(message = "사유는 필수입니다.")
    @Size(max = 1000, message = "사유는 1000자 이하로 입력해야 합니다.")
    private String reason;
}
