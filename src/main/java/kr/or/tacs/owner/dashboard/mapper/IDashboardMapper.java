package kr.or.tacs.owner.dashboard.mapper;

import kr.or.tacs.dto.owner.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IDashboardMapper {

    OwnerDashboardSummaryDTO selectDashboardSummary(@Param("owrId") String owrId);

    List<OwnerDashboardCustomsDTO> selectExportProgressList(@Param("owrId") String owrId);

    List<OwnerDashboardCustomsDTO> selectImportProgressList(@Param("owrId") String owrId);

    List<OwnerDashboardSuppDTO> selectExportSuppList(@Param("owrId") String owrId);

    List<OwnerDashboardSuppDTO> selectImportSuppList(@Param("owrId") String owrId);

    List<OwnerDashboardNotificationDTO> selectRecentNotificationList(@Param("owrId") String owrId);
}
