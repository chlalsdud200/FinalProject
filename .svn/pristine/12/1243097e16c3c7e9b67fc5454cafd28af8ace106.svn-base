package kr.or.tacs.officer.dash.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.tacs.dto.officer.DashboardDTO;
import kr.or.tacs.officer.dash.service.IDashboardService;

@Controller
@RequestMapping("/officer")
public class OfficerController {

    @Autowired
    private IDashboardService service;

    @GetMapping("/dashboard.do")
    public String dashboard(Authentication authentication, Model model) {

        String officerId = authentication.getName();

        DashboardDTO stat = service.getStatCounts(officerId);
        model.addAttribute("receiptWaitCount",  stat.getReceiptWaitCount());
        model.addAttribute("myReviewCount",     stat.getReviewCount());
        model.addAttribute("mySupplementCount", stat.getSupplementCount());
        model.addAttribute("myTaxWaitCount",    stat.getTaxWaitCount());

        List<DashboardDTO> list = service.getNewReceiptList();
        model.addAttribute("list", list);

        List<DashboardDTO> dashboardAlertList = service.getDashboardAlertList(officerId);
        model.addAttribute("dashboardAlertList", dashboardAlertList);

        return "officer/dashboard";
    }

    @GetMapping("/docs.do")
    public String retriveDocs(Model model) {
        model.addAttribute("menuKey", "docs");
        model.addAttribute("activeSub", "myDocs");
        return "officer/docs";
    }

    @GetMapping("/docs/trash.do")
    public String trash(Model model) {
        model.addAttribute("menuKey", "docs");
        model.addAttribute("activeSub", "trash");
        return "officer/docs";
    }
}