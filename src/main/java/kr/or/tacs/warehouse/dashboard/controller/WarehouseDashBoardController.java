package kr.or.tacs.warehouse.dashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.tacs.dto.warehouse.WarehouseDashboardDTO;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.warehouse.dashboard.service.IWarehouseDashboardService;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/warehouse")
@Slf4j
public class WarehouseDashBoardController {
	
	@Autowired
	private IWarehouseDashboardService warehouseDashboardService;
	
	private String getLoginId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CustomUser user = (CustomUser) auth.getPrincipal();
		return user.getLoginId();
	}
	

	 @GetMapping({"/dashboard.do", "/dashboard", "/page/dashBoard"})
	  public String warehouseDashBoard(Model model) {
		 
		 String wmId = getLoginId();
		 WarehouseDashboardDTO dashboard = warehouseDashboardService.selectWarehouseDashboard(wmId);
		 model.addAttribute("dashboard", dashboard);
		 log.info("창고관리자 대시보드 조회 wmId : {}, dashboard : {}", wmId, dashboard);
	      return "warehouse/dashboard";
	  }
	 
	 
}
