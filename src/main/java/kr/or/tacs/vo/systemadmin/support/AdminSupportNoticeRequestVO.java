package kr.or.tacs.vo.systemadmin.support;

import lombok.Data;

@Data
public class AdminSupportNoticeRequestVO {

    private String title;
    private String content;
    private String noticeType;
    private String pinnedYn;
    private String useYn;
}
