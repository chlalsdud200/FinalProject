package kr.or.tacs.vo.systemadmin.notification;

import lombok.Data;

@Data
public class AdminNotificationPolicyVO {

    private String npEventCd;
    private String npBizNm;
    private String npReceiverUserType;
    private String npTitleTpl;
    private String npBodyTpl;
    private String npLinkTpl;
    private String npUseYn;
    private String npRegDt;
}
