package kr.or.tacs.warehouse.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/warehouse/community/support")
public class WarehouseSupportController {

    @GetMapping("/list.do")
    public String retriveSupportList(){
      return "warehouse/community/support";
    }
}