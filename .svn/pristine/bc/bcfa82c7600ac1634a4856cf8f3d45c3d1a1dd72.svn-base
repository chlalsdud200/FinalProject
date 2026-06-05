package kr.or.tacs.officer.fulfillmentandexport.service;

import java.util.List;

import kr.or.tacs.dto.officer.ExportAndFulfillmentDTO;

public interface IExportAndFulfillmentService {

    List<ExportAndFulfillmentDTO> selectExportAndFulfillmentList(
            String reqNo,
            String workType,
            String statusCd,
            String startDate,
            String endDate,
            String keyword
    );

    List<ExportAndFulfillmentDTO> selectExportAndFulfillmentItemList(
            String reqNo,
            String declareType
    );
}
