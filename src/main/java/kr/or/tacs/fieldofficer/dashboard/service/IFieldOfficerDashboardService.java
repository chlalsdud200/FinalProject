package kr.or.tacs.fieldofficer.dashboard.service;

import java.util.List;

import kr.or.tacs.vo.fieldofficer.dashboard.DashboardDeadlineVO;
import kr.or.tacs.vo.fieldofficer.dashboard.DashboardRecentRequestVO;
import kr.or.tacs.vo.fieldofficer.dashboard.DashboardVO;

public interface IFieldOfficerDashboardService {

	// 대시보드 통계 조회
	public DashboardVO retriveDashboard();

	// 최근 검역 요청 목록 조회
	public List<DashboardRecentRequestVO> retriveRecentRequestList();

	// 회신기한 임박 목록 조회
	public List<DashboardDeadlineVO> retriveDeadlineList();

}
