package kr.or.tacs.vo.systemadmin.stats;

import java.util.List;
import java.util.Map;

import lombok.Data;

/**
 * 통계 대시보드 한 화면에 필요한 모든 섹션을 묶은 응답 객체.
 * 랭킹/분포/추이 데이터는 컬럼 별칭(camelCase)을 그대로 담은 Map 리스트로 전달한다.
 */
@Data
public class AdminStatsOverviewVO {

    /** A. 상단 KPI 카드. */
    private AdminStatsSummaryVO summary;

    /** A. 비교: 직전 동일길이 기간(전기) 요약. 조회기간 미지정 시 null. */
    private AdminStatsSummaryVO summaryPrevPeriod;

    /** A. 비교: 1년 전 동기 요약. 조회기간 미지정 시 null. */
    private AdminStatsSummaryVO summaryPrevYear;

    /** A. 전기 비교 구간 라벨 (YYYY-MM-DD ~ YYYY-MM-DD). null 가능. */
    private String prevPeriodLabel;

    /** A. 전년 동기 비교 구간 라벨 (YYYY-MM-DD ~ YYYY-MM-DD). null 가능. */
    private String prevYearLabel;

    /** A. 수입신고 상태별 분포 (code, label, cnt). */
    private List<Map<String, Object>> declarationStatus;

    /** B. 최근 12개월 신고 건수/금액 추이 (ym, cnt, amt). */
    private List<Map<String, Object>> monthlyTrend;

    /** B. 품목(HS) TOP (hsCd, goodsNm, cnt, qty). */
    private List<Map<String, Object>> topItems;

    /** B. 원산지(국가)별 분포 (country, cnt). */
    private List<Map<String, Object>> originDistribution;

    /** C. 관세사별 처리 건수 TOP (brokerNm, cnt). */
    private List<Map<String, Object>> topBrokers;

    /** C. 운송담당자별 처리 건수 TOP (tmNm, cnt). */
    private List<Map<String, Object>> topTransportManagers;

    /** D. 창고 구역별 적재 현황 (whNm, wzNm, ttl, used, useRt). */
    private List<Map<String, Object>> warehouseUsage;

    /** D. 창고 입출고 흐름 요약 (label, cnt). */
    private List<Map<String, Object>> warehouseFlow;

    /** A/E. 액터 유형별 회원 수 (code, label, totalCnt, activeCnt). */
    private List<Map<String, Object>> memberDistribution;

    /** E. 검역 판정 결과 분포 (result, cnt). */
    private List<Map<String, Object>> quarantineStats;

    /** E. 알림 이벤트별 발송/읽음 (eventCd, label, cnt, readCnt). */
    private List<Map<String, Object>> notificationStats;
}
