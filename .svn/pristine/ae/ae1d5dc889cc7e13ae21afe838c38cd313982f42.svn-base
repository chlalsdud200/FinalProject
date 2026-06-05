package kr.or.tacs.broker.dash.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.or.tacs.broker.dash.mapper.IBrokerDashboardMapper;
import kr.or.tacs.broker.dash.service.IBrokerDashboardService;

@Service
public class BrokerDashboardServiceImpl implements IBrokerDashboardService {

    private final IBrokerDashboardMapper dashboardMapper;

    public BrokerDashboardServiceImpl(IBrokerDashboardMapper dashboardMapper) {
        this.dashboardMapper = dashboardMapper;
    }

    @Override
    public Map<String, Object> getDashboardData(String brokerId) {
        Map<String, Object> result = new HashMap<>();

        result.put("summary", dashboardMapper.selectDashboardSummary(brokerId));
        result.put("newRequestList", dashboardMapper.selectNewRequestList(brokerId));
        result.put("supplementList", dashboardMapper.selectSupplementList(brokerId));
        result.put("topOwnerList", dashboardMapper.selectTopOwnerList(brokerId));
        result.put("monthSummary", dashboardMapper.selectMonthSummary(brokerId));
        result.put("deadlineList", dashboardMapper.selectDeadlineList(brokerId));

        return result;
    }
}