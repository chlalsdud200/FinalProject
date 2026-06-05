package kr.or.tacs.fieldofficer.dashboard.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.tacs.fieldofficer.dashboard.service.IFieldOfficerDashboardService;
import kr.or.tacs.vo.fieldofficer.dashboard.DashboardDeadlineVO;
import kr.or.tacs.vo.fieldofficer.dashboard.DashboardRecentRequestVO;
import kr.or.tacs.vo.fieldofficer.dashboard.DashboardVO;

@Controller("fieldOfficerDashboardController")
@RequestMapping("/fieldofficer")
public class FieldOfficerDashboardController {
	
	private final IFieldOfficerDashboardService dashboardService;
	
	public FieldOfficerDashboardController(IFieldOfficerDashboardService dashboardService) {
		this.dashboardService = dashboardService;
	}
	
	/*
	 * 현장 공무원 대시보드 화면
	 * 
	 * 하는 일:
	 * 1. 대시보드 상단 통계 정보를 조회한다.
	 * 2. 최근 검역 요청 목록을 조회한다.
	 * 3. 회신기한이 가까운 검역 요청 목록을 조회한다.
	 * 4. 조회한 데이터를 dashboard.jsp로 전달한다.
	 */
	@GetMapping("/dashboard.do")
	public String dashboard(Model model) {
		
		// 대시보드 상단 통계 + 하단 처리 상세 통계
		DashboardVO dashboard = dashboardService.retriveDashboard();
		
		// 최근 검역 요청 내역
		List<DashboardRecentRequestVO> recentRequestList = dashboardService.retriveRecentRequestList();
		
		// 다가오는 회신기한 목록
		List<DashboardDeadlineVO> deadlineList = dashboardService.retriveDeadlineList();
		
		model.addAttribute("dashboard", dashboard);
		model.addAttribute("recentRequestList", recentRequestList);
		model.addAttribute("deadlineList", deadlineList);
		
		return "fieldofficer/dashboard";
		
	}

}









