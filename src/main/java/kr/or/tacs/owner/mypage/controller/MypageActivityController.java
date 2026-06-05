package kr.or.tacs.owner.mypage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/owner/mypage/activity")
public class MypageActivityController {

    @GetMapping("/list.do")
    public String list(){
        return "owner/mypage/activity";
    }
}

