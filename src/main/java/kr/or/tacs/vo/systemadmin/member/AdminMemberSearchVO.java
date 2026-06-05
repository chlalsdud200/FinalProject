package kr.or.tacs.vo.systemadmin.member;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AdminMemberSearchVO {

    // 액터 유형 코드
    // 예: OWNER, BROKER, OFFICER, TRANSPORT_MANAGER, WAREHOUSE_MANAGER, SYSTEM_ADMIN
    private String actorTypeCd;

    // 사용 여부
    // 예: Y, N
    private String useYn;

    // 공무원 세부유형 코드 (actorTypeCd가 OFFICER일 때 사용)
    // 예: OFFICER, FIELD_OFFICER
    private String officerTyCd;

    // 검색어
    // login_id, login_nm, org_nm 기준 LIKE 검색에 사용
    private String keyword;
    
    // 가입일 검색 (시작일)
    private String startDate;
    
    // 가입일 검색 (종료일)
    private String endDate;

    // 현재 페이지
    // 화면에서 넘어오지 않으면 1페이지로 조회한다.
    private int currentPage = 1;

    // 한 페이지에 보여줄 회원 수
    // 화면에서 넘어오지 않으면 10개씩 조회한다.
    private int screenSize = 10;
}
