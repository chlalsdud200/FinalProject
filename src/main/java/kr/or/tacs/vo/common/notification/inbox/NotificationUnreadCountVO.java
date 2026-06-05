package kr.or.tacs.vo.common.notification.inbox;

import lombok.Data;

@Data
public class NotificationUnreadCountVO {

    private long count;
    private String latestSendDt;     // 가장 최근 미읽음 알림의 send_dt — 폴링 시 신규 알림 도착 감지에 활용 (없으면 null)
}