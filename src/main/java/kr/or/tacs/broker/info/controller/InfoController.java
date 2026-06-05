package kr.or.tacs.broker.info.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.tacs.vo.BrokerVO;

@Controller
@RequestMapping("/broker/info")
public class InfoController {

    @GetMapping("/customs-code.do")
    public String customsCode(Model model) {
    	
    	BrokerVO brokerVO = new BrokerVO();
    	brokerVO.setBrokerNm("홍길동");
    	brokerVO.setBrokerId("abcd");  
    	
        model.addAttribute("activeMenu", "info");
        model.addAttribute("activeSub", "customs-code");
        model.addAttribute("brokerVO", brokerVO);
        return "broker/pages/info";
    }
    
    @GetMapping("/customs-code2.do")
    @ResponseBody
    public Map<String, Object> customsCode2(Model model) {
        
    	
    	BrokerVO brokerVO = new BrokerVO();
    	brokerVO.setBrokerNm("홍길동");
    	brokerVO.setBrokerId("abcd");   	       
        
    	Map<String, Object> resultMap = new HashMap<>();
    	
    	resultMap.put("brokerVO", brokerVO);
    	resultMap.put("message", "success");
    	resultMap.put("brokerList", brokerVO);
    	
        return resultMap;
    }

    @GetMapping("/standard-name.do")
    public String standardName(Model model) {
        model.addAttribute("activeMenu", "info");
        model.addAttribute("activeSub", "standard-name");
        return "broker/pages/info";
    }

    @GetMapping("/tariff-rate.do")
    public String tariffRate(Model model) {
        model.addAttribute("activeMenu", "info");
        model.addAttribute("activeSub", "tariff-rate");
        return "broker/pages/info";
    }

    @GetMapping("/item-class.do")
    public String itemClass(Model model) {
        model.addAttribute("activeMenu", "info");
        model.addAttribute("activeSub", "item-class");
        return "broker/pages/info";
    }
}
