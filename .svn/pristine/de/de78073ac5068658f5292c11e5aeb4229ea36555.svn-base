package kr.or.tacs.officer.fulfillmentandexport.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.tacs.dto.officer.LoadedCargoListDTO;
import kr.or.tacs.officer.fulfillmentandexport.mapper.ILoadedCargoListMapper;

@Service
public class LoadedCargoListServiceImpl implements ILoadedCargoListService {

    @Autowired
    private ILoadedCargoListMapper mapper;

    @Override
    public List<LoadedCargoListDTO> selectLoadedCargoList(
            String reqNo,
            String declareStatusCd,
            String declareType,
            String startDate,
            String endDate,
            String keyword) {
        return mapper.selectLoadedCargoList(reqNo, declareStatusCd, declareType, startDate, endDate, keyword);
    }

    @Override
    public List<LoadedCargoListDTO> selectMixedCargoList(
            String reqNo,
            String declareStatusCd,
            String declareType,
            String startDate,
            String endDate,
            String keyword) {
        return mapper.selectMixedCargoList(reqNo, declareStatusCd, declareType, startDate, endDate, keyword);
    }

    @Override
    public List<LoadedCargoListDTO> selectCargoItemList(String reqNo, String declareType) {
        return mapper.selectCargoItemList(reqNo, declareType);
    }
}
