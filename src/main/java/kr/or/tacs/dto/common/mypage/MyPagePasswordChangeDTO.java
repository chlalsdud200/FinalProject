package kr.or.tacs.dto.common.mypage;

import lombok.Data;

@Data
public class MyPagePasswordChangeDTO {

    private String newPassword;
    private String newPasswordConfirm;
}
