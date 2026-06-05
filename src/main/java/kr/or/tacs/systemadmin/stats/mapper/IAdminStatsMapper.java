package kr.or.tacs.systemadmin.stats.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.tacs.vo.systemadmin.stats.AdminStatsSearchVO;
import kr.or.tacs.vo.systemadmin.stats.AdminStatsSummaryVO;

/**
 * 관리자 통계 대시보드 조회 매퍼.
 * 랭킹/분포/추이는 컬럼 별칭을 그대로 담은 Map 리스트로 반환한다.
 */
@Mapper
public interface IAdminStatsMapper {

    AdminStatsSummaryVO selectSummary(AdminStatsSearchVO search);

    List<Map<String, Object>> selectDeclarationStatus(AdminStatsSearchVO search);

    List<Map<String, Object>> selectMonthlyTrend(AdminStatsSearchVO search);

    List<Map<String, Object>> selectTopItems(AdminStatsSearchVO search);

    List<Map<String, Object>> selectOriginDistribution(AdminStatsSearchVO search);

    List<Map<String, Object>> selectTopBrokers(AdminStatsSearchVO search);

    List<Map<String, Object>> selectTopTransportManagers(AdminStatsSearchVO search);

    List<Map<String, Object>> selectWarehouseUsage(AdminStatsSearchVO search);

    List<Map<String, Object>> selectWarehouseFlow(AdminStatsSearchVO search);

    List<Map<String, Object>> selectMemberDistribution(AdminStatsSearchVO search);

    List<Map<String, Object>> selectQuarantineStats(AdminStatsSearchVO search);

    List<Map<String, Object>> selectNotificationStats(AdminStatsSearchVO search);
}
