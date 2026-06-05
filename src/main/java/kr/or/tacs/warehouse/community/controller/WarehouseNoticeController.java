package kr.or.tacs.warehouse.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/warehouse/community/notice")
public class WarehouseNoticeController {

    @GetMapping("/list.do")
    public String retriveNoticeList(){
      return "warehouse/community/notice";
    }
}