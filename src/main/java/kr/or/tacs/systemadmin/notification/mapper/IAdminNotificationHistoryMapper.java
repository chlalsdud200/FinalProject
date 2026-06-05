package kr.or.tacs.systemadmin.notification.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.systemadmin.notification.AdminNotificationEventOptionVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationHistorySearchVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationHistoryVO;

@Mapper
public interface IAdminNotificationHistoryMapper {

    List<AdminNotificationHistoryVO> selectHistoryList(AdminNotificationHistorySearchVO search);

    long countHistory(AdminNotificationHistorySearchVO search);

    AdminNotificationHistoryVO selectHistory(@Param("notiNo") Long notiNo);

    List<AdminNotificationEventOptionVO> selectEventOptionList();
}
