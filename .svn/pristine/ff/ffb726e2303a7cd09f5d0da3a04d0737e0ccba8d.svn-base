package kr.or.tacs.common.notification.pref.service;

import java.util.List;

import kr.or.tacs.vo.common.notification.NotificationPrefVO;

public interface INotificationPrefService {

    List<NotificationPrefVO> retrievePrefList(String userType, String userId);

    void modifyPref(String userId, String eventCd, boolean on);

    void modifyAllPref(String userType, String userId, boolean on);
}
