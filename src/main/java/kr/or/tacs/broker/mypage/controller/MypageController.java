package kr.or.tacs.broker.mypage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/broker/mypage")
public class MypageController {

    @GetMapping("/profile.do")
    public String profile(Model model) {
        model.addAttribute("activeMenu", "mypage");
        model.addAttribute("activeSub", "profile");
        model.addAttribute("mypageActorPath", "broker");
        model.addAttribute("mypageTab", "profile");
        return "broker/pages/mypage";
    }

    @GetMapping("/noti.do")
    public String noti(Model model) {
        model.addAttribute("activeMenu", "mypage");
        model.addAttribute("activeSub", "alarm");
        model.addAttribute("mypageActorPath", "broker");
        model.addAttribute("mypageTab", "alarm");
        return "broker/pages/mypage";
    }
}
