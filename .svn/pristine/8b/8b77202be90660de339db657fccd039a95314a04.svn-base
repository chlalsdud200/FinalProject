package kr.or.tacs.broker.dash.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface IBrokerDashboardMapper {

    Map<String, Object> selectDashboardSummary(@Param("brokerId") String brokerId);

    List<Map<String, Object>> selectNewRequestList(@Param("brokerId") String brokerId);

    List<Map<String, Object>> selectSupplementList(@Param("brokerId") String brokerId);

    List<Map<String, Object>> selectTopOwnerList(@Param("brokerId") String brokerId);

    Map<String, Object> selectMonthSummary(@Param("brokerId") String brokerId);

    List<Map<String, Object>> selectDeadlineList(@Param("brokerId") String brokerId);
}