package kr.or.tacs.vo;

import java.util.List;

import lombok.Data;

@Data
public class FaqVO {

    private Long faqNo;

    // 공통코드. FAQ_CTGRY
    private String faqCtgryCd;
    private String faqCtgryNm;

    // FAQ는 공지사항과 다르게 질문/답변을 분리해서 관리한다.
    private String faqQstnCn;
    private String faqAnsCn;

    private Integer faqSortSn;
    private Long faqHit;
    private String faqUseYn;

    // SYSTEM_ADMIN.SA_ID
    private String faqAdminId;

    private String faqRegistDt;
    private String faqUpdtDt;

    // FAQ_AUTH에 저장되는 노출 대상 역할코드 목록
    private List<String> targetRoleCds;

    // 목록 표시용 문자열. 예: ALL 또는 OWNER, BROKER
    private String targetRoleText;
}
