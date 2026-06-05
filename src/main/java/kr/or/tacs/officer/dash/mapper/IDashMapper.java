package kr.or.tacs.officer.dash.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.dto.officer.DashboardDTO;

@Mapper
public interface IDashMapper {

    int selectReceiptWaitCount();

    int selectReviewCount(@Param("officerId") String officerId);

    int selectSupplementCount(@Param("officerId") String officerId);

    int selectTaxWaitCount(@Param("officerId") String officerId);

    List<DashboardDTO> selectNewReceiptList();

    List<DashboardDTO> selectDashboardAlertList(@Param("officerId") String officerId);
}