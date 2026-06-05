package kr.or.tacs.owner.dashboard.service;

import kr.or.tacs.dto.owner.*;
import kr.or.tacs.owner.dashboard.mapper.IDashboardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashBoardServiceImpl implements IDashboardService{

    @Autowired
    private IDashboardMapper dashboardMapper;

    @Override
    public OwnerDashboardSummaryDTO retrieveDashboardSummary(String owrId) {
        return dashboardMapper.selectDashboardSummary(owrId);
    }

    @Override
    public List<OwnerDashboardCustomsDTO> retrieveExportProgressList(String owrId) {
        return dashboardMapper.selectExportProgressList(owrId);
    }

    @Override
    public List<OwnerDashboardCustomsDTO> retrieveImportProgressList(String owrId) {
        return dashboardMapper.selectImportProgressList(owrId);
    }

    @Override
    public List<OwnerDashboardSuppDTO> retrieveExportSuppList(String owrId) {
        return dashboardMapper.selectExportSuppList(owrId);
    }

    @Override
    public List<OwnerDashboardSuppDTO> retrieveImportSuppList(String owrId) {
        return dashboardMapper.selectImportSuppList(owrId);
    }

    @Override
    public List<OwnerDashboardNotificationDTO> retrieveRecentNotificationList(String owrId) {
        return dashboardMapper.selectRecentNotificationList(owrId);
    }
}
