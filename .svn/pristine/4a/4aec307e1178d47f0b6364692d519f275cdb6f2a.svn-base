package kr.or.tacs.owner.docs.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/owner/docs")
public class DocsController {

    @GetMapping("/list.do")
    public String list(Model model){
        model.addAttribute("activeSub", "myDocs");
        return "owner/docs";
    }

    @GetMapping("/trash.do")
    public String trash(Model model){
        model.addAttribute("activeSub", "trash");
        return "owner/docs";
    }
}
