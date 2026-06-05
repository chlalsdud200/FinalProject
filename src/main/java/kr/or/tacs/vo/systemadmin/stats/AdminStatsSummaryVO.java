package kr.or.tacs.vo.systemadmin.stats;

import lombok.Data;

/**
 * 통계 대시보드 상단 KPI 카드 집계.
 */
@Data
public class AdminStatsSummaryVO {

    /** 기간 내 수입신고 건수 (imp_rqst, 사용 'Y'). */
    private long importCnt;

    /** 기간 내 수출신고 건수 (exp_rqst, 사용 'Y'). */
    private long exportCnt;

    /** 수입 + 수출 총 신고 건수. */
    private long totalDeclarationCnt;

    /** 기간 내 수리완료(ir_acpt_dt 존재) 수입신고 건수. */
    private long acceptedCnt;

    /** 수입신고 수리율(%) = 수리완료 / 수입신고 * 100. */
    private double acceptRate;

    /** 평균 처리기간(일) = AVG(ir_acpt_dt - ir_regist_dt). */
    private double avgProcessDays;

    /** 활성 회원 수 (vw_actor_login use_yn='Y'). */
    private long activeMemberCnt;

    /** 오늘 신규 수입신고 건수. */
    private long todayImportCnt;
}
