package kr.or.tacs.broker.info.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.or.tacs.broker.info.mapper.IInfoMapper;

@Service
public class InfoServiceImpl implements IInfoService {

    private final IInfoMapper infoMapper;

    public InfoServiceImpl(IInfoMapper infoMapper) {
        this.infoMapper = infoMapper;
    }

    @Override
    public List<Map<String, Object>> selectCustomsCode(Map<String, Object> paramMap) {
        return infoMapper.selectCustomsCode(paramMap);
    }

    @Override
    public List<Map<String, Object>> selectStandardName(Map<String, Object> paramMap) {
        return infoMapper.selectStandardName(paramMap);
    }

    @Override
    public List<Map<String, Object>> selectTariffRate(Map<String, Object> paramMap) {
        return infoMapper.selectTariffRate(paramMap);
    }

    @Override
    public List<Map<String, Object>> selectItemClass(Map<String, Object> paramMap) {
        return infoMapper.selectItemClass(paramMap);
    }
}
