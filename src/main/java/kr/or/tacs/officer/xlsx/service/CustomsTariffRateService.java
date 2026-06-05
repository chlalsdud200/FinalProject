package kr.or.tacs.officer.xlsx.service;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.or.tacs.dto.officer.xlsx.CustomsTariffRateDTO;
import kr.or.tacs.officer.xlsx.mapper.ICustomsTariffRateMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomsTariffRateService {

    private final ICustomsTariffRateMapper mapper;

    public List<CustomsTariffRateDTO> getTariffRateByHsCode(String hsCode, String countryCd) {
        String cleanHsCode = hsCode == null ? "" : hsCode.replaceAll("[^0-9]", "");
        String cleanCountryCd = countryCd == null ? null : countryCd.trim().toUpperCase();

        return mapper.selectTariffRateByHsCode(cleanHsCode, cleanCountryCd);
    }
}