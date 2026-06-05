package kr.or.tacs.officer.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 행정공무원 커뮤니티 화면 컨트롤러.
 *
 * 기존 업무 JSP 내부의 숨김 영역으로 커뮤니티를 여는 방식과 별개로,
 * 다른 액터와 동일하게 커뮤니티 전용 URL에서 officer/community.jsp 하나로 진입시키기 위한 컨트롤러다.
 */
@Controller
@RequestMapping("/officer/community")
public class OfficerCommunityController {

    @GetMapping({"", "/", "/notice.do"})
    public String notice(Model model) {
        model.addAttribute("menuKey", "community");
        model.addAttribute("activeSub", "notice");
        return "officer/community";
    }

    @GetMapping({"/download.do", "/archive.do"})
    public String download(Model model) {
        model.addAttribute("menuKey", "community");
        model.addAttribute("activeSub", "download");
        return "officer/community";
    }

    @GetMapping({"/cs.do", "/support.do"})
    public String cs(Model model) {
        model.addAttribute("menuKey", "community");
        model.addAttribute("activeSub", "cs");
        return "officer/community";
    }
}
