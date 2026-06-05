package kr.or.tacs.broker.info.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.broker.info.service.IInfoService;

@RestController
@RequestMapping("/broker/info/api")
public class InfoApiController {

    private final IInfoService infoService;

    public InfoApiController(IInfoService infoService) {
        this.infoService = infoService;
    }

    @GetMapping("/customs-code.do")
    public List<Map<String, Object>> customsCode(@RequestParam Map<String, Object> paramMap) {
        return infoService.selectCustomsCode(paramMap);
    }

    @GetMapping("/standard-name.do")
    public List<Map<String, Object>> standardName(@RequestParam Map<String, Object> paramMap) {
        return infoService.selectStandardName(paramMap);
    }

    @GetMapping("/tariff-rate.do")
    public List<Map<String, Object>> tariffRate(@RequestParam Map<String, Object> paramMap) {
        return infoService.selectTariffRate(paramMap);
    }

    @GetMapping("/item-class.do")
    public List<Map<String, Object>> itemClass(@RequestParam Map<String, Object> paramMap) {
        return infoService.selectItemClass(paramMap);
    }
}
