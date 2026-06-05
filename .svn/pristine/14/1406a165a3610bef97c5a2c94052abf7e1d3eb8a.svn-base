package kr.or.tacs.officer.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.officer.api.service.IHsApiService;

@RestController
public class HsApiController {

    @Autowired
    private IHsApiService hsApiService;

    @GetMapping("/officer/api/hs-code-search")
    @ResponseBody
    public String getHsCodeSearch(
            @RequestParam String hsCode) {

        return hsApiService.getHsCodeSearchRaw(hsCode);
    }

    @GetMapping("/officer/api/hs-navigation")
    @ResponseBody
    public String getHsNavigation(
            @RequestParam String hsCode) {

        return hsApiService.getHsNavigationRaw(hsCode);
    }
    
    @GetMapping("/officer/api/hs-code-url")
    public String getHsCodeUrl(@RequestParam String hsCode) {
        return hsApiService.makeHsCodeSearchUrl(hsCode);
    }
}
