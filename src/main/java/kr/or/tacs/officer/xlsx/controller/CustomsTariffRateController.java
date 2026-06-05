package kr.or.tacs.officer.xlsx.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.dto.officer.xlsx.CustomsTariffRateDTO;
import kr.or.tacs.officer.xlsx.service.CustomsTariffRateService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tariff")
public class CustomsTariffRateController {

    private final CustomsTariffRateService service;

    @GetMapping("/rate")
    public List<CustomsTariffRateDTO> getTariffRate(
            @RequestParam String hsCode,
            @RequestParam(required = false) String countryCd) {

        return service.getTariffRateByHsCode(hsCode, countryCd);
    }
}