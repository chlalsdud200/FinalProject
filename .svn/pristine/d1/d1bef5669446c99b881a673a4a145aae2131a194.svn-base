package kr.or.tacs.systemadmin.notification.service;

import java.util.List;

import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationEventOptionVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationHistorySearchVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationHistoryVO;

public interface IAdminNotificationHistoryService {

    PaginationInfoVO<AdminNotificationHistoryVO> retrieveHistoryList(AdminNotificationHistorySearchVO search);

    AdminNotificationHistoryVO retrieveHistory(Long notiNo);

    List<AdminNotificationEventOptionVO> retrieveEventOptionList();
}
