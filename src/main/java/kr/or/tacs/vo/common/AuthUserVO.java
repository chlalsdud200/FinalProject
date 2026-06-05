package kr.or.tacs.vo.common;

import lombok.Data;

@Data
public class AuthUserVO {

    private String loginId;
    private String loginPw;
    private String loginNm;

    private String roleCd;
    private String roleNm;

    private String actorTypeCd;
    private String actorTableNm;
    private String officerTyCd;

    private String orgNm;
    private String email;
    private String telno;
    private String useYn;
}
