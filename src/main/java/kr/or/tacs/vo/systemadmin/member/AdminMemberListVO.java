package kr.or.tacs.vo.systemadmin.member;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AdminMemberListVO {

    // 로그인 ID
    private String loginId;

    // 사용자 이름
    private String loginNm;

    // 권한 코드
    private String roleCd;

    // 권한명
    private String roleNm;

    // 액터 유형 코드
    private String actorTypeCd;

    // 원본 액터 테이블명
    private String actorTableNm;

    // 소속/기관/업체명
    private String orgNm;

    // 이메일
    private String email;

    // 전화번호
    private String telno;

    // 사용 여부
    private String useYn;

    // 공무원 세부유형 코드
    private String officerTyCd;

    // 공무원 세부유형명
    private String officerTyNm;
}
