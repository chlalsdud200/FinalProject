package kr.or.tacs.fieldofficer.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.or.tacs.fieldofficer.dashboard.mapper.IFieldOfficerDashboardMapper;
import kr.or.tacs.vo.fieldofficer.dashboard.DashboardDeadlineVO;
import kr.or.tacs.vo.fieldofficer.dashboard.DashboardRecentRequestVO;
import kr.or.tacs.vo.fieldofficer.dashboard.DashboardVO;

@Service
public class FieldOfficerDashboardServiceImpl implements IFieldOfficerDashboardService {
	
	private final IFieldOfficerDashboardMapper dashboardMapper;
	
	public FieldOfficerDashboardServiceImpl(IFieldOfficerDashboardMapper dashboardMapper) {
		this.dashboardMapper = dashboardMapper;
	}

	/*
	 * 대시보드 통계 조회
	 * 
	 * 하는 일:
	 * 1. 신규 요청 수
	 * 2. 판정 대기 수
	 * 3. 결과 통보 완료 수
	 * 4. 접수 처리율
	 * 5. 합격/불합격/보완요청 수를 조회한다.
	 */
	@Override
	public DashboardVO retriveDashboard() {
		return dashboardMapper.selectDashboard();
	}

	/*
	 * 최근 검역 요청 목록 조회
	 * 
	 * 하는 일:
	 * 1. 최근 접수된 검역 요청을 조회한다.
	 * 2. 대시보드의 "최근 검역 요청 내역"에 출력할 데이터를 가져온다.
	 */
	@Override
	public List<DashboardRecentRequestVO> retriveRecentRequestList() {
		return dashboardMapper.selectRecentRequestList();
	}

	/*
	 * 회신기한 임박 목록 조회
	 * 
	 * 하는 일:
	 * 1. 회신기한이 가까운 검역 요청을 조회한다.
	 * 2. 대시보드의 "다가오는 기한" 영역에 출력할 데이터를 가져온다.
	 */
	@Override
	public List<DashboardDeadlineVO> retriveDeadlineList() {
		return dashboardMapper.selectDeadlineList();
	}

}






