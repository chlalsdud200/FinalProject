package kr.or.tacs.fieldofficer.dashboard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FieldOfficerController {

    @GetMapping("/fieldofficer/docs.do")
    public String docs(org.springframework.ui.Model model) {
        model.addAttribute("activeSub", "myDocs");
        return "fieldofficer/docs";
    }

    @GetMapping("/fieldofficer/docs/trash.do")
    public String trash(org.springframework.ui.Model model) {
        model.addAttribute("activeSub", "trash");
        return "fieldofficer/docs";
    }

    @GetMapping("/fieldofficer/community.do")
    public String community() {
        return "fieldofficer/community";
    }


    @GetMapping("/fieldofficer/search.do")
    public String search() {
        return "fieldofficer/search";
    }
}
