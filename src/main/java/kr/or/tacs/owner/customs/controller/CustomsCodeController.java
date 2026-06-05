package kr.or.tacs.owner.customs.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/orders/customs")
public class CustomsCodeController {

    @GetMapping("/form.do")
    public String customsCodeForm(){
        return "owner/customs/customsCode";
    }
}
