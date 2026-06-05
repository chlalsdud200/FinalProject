package kr.or.tacs.dto.owner;

import lombok.Data;

import java.util.Date;

@Data
public class OwnerDashboardNotificationDTO {

    private Long notiNo;

    private String eventCd;

    private String refKey;

    private String title;

    private String body;

    private String linkUrl;

    private String readYn;

    private Date sendDt;

    // 화면 표시용
    private String timeText;

    private String dotClass;
}