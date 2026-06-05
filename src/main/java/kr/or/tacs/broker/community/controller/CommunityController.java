package kr.or.tacs.broker.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 커뮤니티 페이지 컨트롤러
 *  - URL : /community/notice, /community/cs, /community/download
 *  - View: pages/community.jsp
 */
@Controller
@RequestMapping("/broker/community")
public class CommunityController {

    @GetMapping("/notice.do")
    public String notice(Model model) {
        model.addAttribute("activeMenu", "community");
        model.addAttribute("activeSub", "notice");
        return "broker/pages/community";
    }

    @GetMapping("/cs.do")
    public String cs(Model model) {
        model.addAttribute("activeMenu", "community");
        model.addAttribute("activeSub", "cs");
        return "broker/pages/community";
    }

    @GetMapping("/download.do")
    public String download(Model model) {
        model.addAttribute("activeMenu", "community");
        model.addAttribute("activeSub", "download");
        return "broker/pages/community";
    }
}
