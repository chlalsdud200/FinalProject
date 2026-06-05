package kr.or.tacs.owner.dashboard.controller;

import kr.or.tacs.owner.dashboard.service.IDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/owner/dashboard")
public class DashboardController {

    @Autowired
    private IDashboardService dashboardService;

    @GetMapping("/list.do")
    public String dashboard(Authentication authentication, Model model) {

        String owrId = authentication.getName();

        model.addAttribute("summary", dashboardService.retrieveDashboardSummary(owrId));

        model.addAttribute("exportProgressList", dashboardService.retrieveExportProgressList(owrId));
        model.addAttribute("importProgressList", dashboardService.retrieveImportProgressList(owrId));

        model.addAttribute("exportSuppList", dashboardService.retrieveExportSuppList(owrId));
        model.addAttribute("importSuppList", dashboardService.retrieveImportSuppList(owrId));

        model.addAttribute("recentNotificationList", dashboardService.retrieveRecentNotificationList(owrId));

        return "owner/dashboard";
    }
}
