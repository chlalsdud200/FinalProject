package kr.or.tacs.owner.mypage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/owner/mypage/info")
public class MypageInfoController {

    @GetMapping("/list.do")
    public String list() {
        return "redirect:/owner/mypage.do?tab=profile";
    }
}
