package kr.or.tacs.vo.systemadmin.notification;

import lombok.Data;

@Data
public class AdminNotificationPolicySearchVO {

    private String keyword;
    private String useYn;
    private String receiverType;
    private int currentPage = 1;
    private int screenSize = 20;
}
