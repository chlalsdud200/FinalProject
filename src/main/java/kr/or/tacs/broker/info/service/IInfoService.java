package kr.or.tacs.broker.info.service;

import java.util.List;
import java.util.Map;

public interface IInfoService {
    List<Map<String, Object>> selectCustomsCode(Map<String, Object> paramMap);
    List<Map<String, Object>> selectStandardName(Map<String, Object> paramMap);
    List<Map<String, Object>> selectTariffRate(Map<String, Object> paramMap);
    List<Map<String, Object>> selectItemClass(Map<String, Object> paramMap);
}
