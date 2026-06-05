package kr.or.tacs.vo.systemadmin.member;

import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AdminMemberProfileUpdateRequestVO {

    @NotBlank(message = "사유는 필수입니다.")
    @Size(max = 1000, message = "사유는 1000자 이하로 입력해야 합니다.")
    private String reason;

    @NotEmpty(message = "변경 항목이 없습니다.")
    private Map<String, Object> changes;
}
