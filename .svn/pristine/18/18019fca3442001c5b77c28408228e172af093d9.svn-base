package kr.or.tacs.officer.xlsx.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.dto.officer.xlsx.CustomsTariffRateDTO;

@Mapper
public interface ICustomsTariffRateMapper {

    List<CustomsTariffRateDTO> selectTariffRateByHsCode(
            @Param("hsCode") String hsCode,
            @Param("countryCd") String countryCd
    );
}