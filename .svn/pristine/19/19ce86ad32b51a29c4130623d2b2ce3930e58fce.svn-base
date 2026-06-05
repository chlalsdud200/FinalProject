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
public class AdminMemberUseYnRequestVO {

    @NotBlank(message = "사용여부는 필수입니다.")
    @Pattern(regexp = "^[YN]$", message = "사용여부는 Y 또는 N만 가능합니다.")
    private String useYn;

    @NotBlank(message = "사유는 필수입니다.")
    @Size(max = 1000, message = "사유는 1000자 이하로 입력해야 합니다.")
    private String reason;
}
