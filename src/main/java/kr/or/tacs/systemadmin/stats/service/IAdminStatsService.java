package kr.or.tacs.systemadmin.stats.service;

import kr.or.tacs.vo.systemadmin.stats.AdminStatsOverviewVO;
import kr.or.tacs.vo.systemadmin.stats.AdminStatsSearchVO;

public interface IAdminStatsService {

    /** 통계 대시보드 한 화면에 필요한 전체 섹션을 한 번에 조회한다. */
    AdminStatsOverviewVO retrieveOverview(AdminStatsSearchVO search);
}
