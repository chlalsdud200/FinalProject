package kr.or.tacs.common.notification.inbox.service;

import java.util.List;

import kr.or.tacs.vo.common.notification.inbox.NotificationInboxItemVO;
import kr.or.tacs.vo.common.notification.inbox.NotificationUnreadCountVO;

public interface INotificationInboxService {

    NotificationUnreadCountVO retrieveUnreadSummary(String receiverId);

    List<NotificationInboxItemVO> retrieveInboxList(String receiverId, int limit, int offset);

    void modifyRead(Long notiNo, String receiverId);

    int modifyReadAll(String receiverId);

    int remove(Long notiNo, String receiverId);

    int removeAll(String receiverId);
}
