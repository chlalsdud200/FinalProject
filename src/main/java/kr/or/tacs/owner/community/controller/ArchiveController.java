package kr.or.tacs.owner.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/owner/community/archive")
public class ArchiveController {

    @GetMapping("/list.do")
    public String list(){
        return "owner/community/archive";
    }
}

