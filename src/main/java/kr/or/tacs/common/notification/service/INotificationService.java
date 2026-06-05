package kr.or.tacs.common.notification.service;

import java.util.Map;

public interface INotificationService {

    /**
     * 본 업무 트랜잭션과 함께 커밋되어야 신고 상태와 인앱 알림이 어긋나지 않는다.
     */
    void registNotification(String eventCd, String refKey, String senderId, Map<String, String> bindings);
}
