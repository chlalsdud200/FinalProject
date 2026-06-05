package kr.or.tacs.vo.common;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;

@Getter
public class CustomUser extends User {

    private static final long serialVersionUID = 1L;

    private final AuthUserVO authUser;

    public CustomUser(AuthUserVO authUser) {
        super(
            authUser.getLoginId(),
            authUser.getLoginPw(),
            "Y".equalsIgnoreCase(authUser.getUseYn()),
            true,
            true,
            true,
            List.of(new SimpleGrantedAuthority("ROLE_" + authUser.getRoleCd()))
        );

        this.authUser = authUser;
    }

    public String getLoginId() {
        return authUser.getLoginId();
    }

    public String getLoginNm() {
        return authUser.getLoginNm();
    }

    public String getRoleCd() {
        return authUser.getRoleCd();
    }

    public String getRoleNm() {
        return authUser.getRoleNm();
    }

    public String getOfficerTyCd() {
        return authUser.getOfficerTyCd();
    }

    public String getUserType() {
        return authUser.getRoleCd();
    }
}
