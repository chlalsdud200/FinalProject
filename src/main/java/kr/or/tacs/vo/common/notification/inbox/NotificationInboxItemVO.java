package kr.or.tacs.vo.common.notification.inbox;

import lombok.Data;

@Data
public class NotificationInboxItemVO {

    private Long notiNo;
    private String notiEventCd;
    private String npBizNm;          // noti_policy JOIN
    private String notiTitle;
    private String notiBody;
    private String notiLinkUrl;
    private String notiReadYn;
    private String notiSendDt;       // 문자열 yyyy-MM-dd HH:mm:ss (프론트가 상대시각 계산)
}