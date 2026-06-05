package kr.or.tacs.owner.transport.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/owner/transport/export")
public class TransportExportController {

    @GetMapping("/list.do")
    public String retrieveExportTransportList() {
        return "owner/transport/exportTransportList";
    }

    @GetMapping("/detail.do/{trNo}")
    public String retrieveTransportDetail(@PathVariable String trNo) {
        return "owner/transport/transportDetail";
    }
}
