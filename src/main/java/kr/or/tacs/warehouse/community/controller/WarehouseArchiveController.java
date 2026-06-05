package kr.or.tacs.warehouse.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/warehouse/community/archive")
public class WarehouseArchiveController {

    @GetMapping("/list.do")
    public String retriveArchiveList(){
      return "warehouse/community/archive";
    }
}