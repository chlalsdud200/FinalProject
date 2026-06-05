package kr.or.tacs.vo.systemadmin.member;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class AdminMemberChangeLogVO {

    // 변경이력번호. DB INSERT 시 생성한다. 예: AMCL-20260518-000001
    private String amclNo;

    // 대상 액터유형 코드. OWNER, BROKER, OFFICER, TRANSPORT_MANAGER, WAREHOUSE_MANAGER, SYSTEM_ADMIN
    private String targetActorTyCd;

    // 대상 로그인ID. 각 액터 원본 테이블의 로그인ID를 논리적으로 참조한다.
    private String targetLoginId;

    // 변경유형 코드. USE_YN, OFFICER_TY_CD, BROKER_OFFICE, PASSWORD_RESET, LOCK_RELEASE 등
    private String chgTyCd;

    // 변경 대상 필드명. 예: USE_YN, OFFICER_TY_CD, BROKER_OFFICE_NM
    private String targetFieldNm;

    // 변경 전 값. 비밀번호 등 민감정보는 저장하지 않는다.
    private String beforeVal;

    // 변경 후 값. 비밀번호 등 민감정보는 저장하지 않는다.
    private String afterVal;

    // 변경 사유 내용.
    private String rsnCn;

    // 처리 관리자ID. SYSTEM_ADMIN 계정의 로그인ID를 저장한다.
    private String adminId;

    // 처리일시. DB SYSDATE 기준으로 저장한다.
    private LocalDateTime registDt;
}
