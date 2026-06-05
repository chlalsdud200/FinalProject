package kr.or.tacs.broker.docs.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 문서함 페이지 컨트롤러
 */
@Controller
public class BrokerDocsController {

    @GetMapping("/broker/docs.do")
    public String docs(Model model) {
        model.addAttribute("activeMenu", "docs");
        model.addAttribute("activeSub", "myDocs");
        return "broker/pages/docs";
    }

    @GetMapping("/broker/docs/trash.do")
    public String trash(Model model) {
        model.addAttribute("activeMenu", "docs");
        model.addAttribute("activeSub", "trash");
        return "broker/pages/docs";
    }

}
