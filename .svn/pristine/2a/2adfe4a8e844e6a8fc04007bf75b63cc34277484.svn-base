package kr.or.tacs.officer.fulfillmentandexport.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.tacs.dto.officer.ExportAndFulfillmentDTO;
import kr.or.tacs.officer.fulfillmentandexport.mapper.IExportAndFulfillmentMapper;
import kr.or.tacs.officer.fulfillmentandexport.service.IExportAndFulfillmentService;

@Service
public class ExportAndFulfillmentServiceImpl implements IExportAndFulfillmentService {

    @Autowired
    private IExportAndFulfillmentMapper exportAndFulfillmentMapper;

    @Override
    public List<ExportAndFulfillmentDTO> selectExportAndFulfillmentList(
            String reqNo,
            String workType,
            String statusCd,
            String startDate,
            String endDate,
            String keyword) {

        Map<String, Object> param = new HashMap<>();
        param.put("reqNo", reqNo);
        param.put("workType", workType);
        param.put("statusCd", statusCd);
        param.put("startDate", startDate);
        param.put("endDate", endDate);
        param.put("keyword", keyword);

        return exportAndFulfillmentMapper.selectExportAndFulfillmentList(param);
    }

    @Override
    public List<ExportAndFulfillmentDTO> selectExportAndFulfillmentItemList(String reqNo, String declareType) {
        Map<String, Object> param = new HashMap<>();
        param.put("reqNo", reqNo);
        param.put("declareType", declareType);
        return exportAndFulfillmentMapper.selectExportAndFulfillmentItemList(param);
    }
}
