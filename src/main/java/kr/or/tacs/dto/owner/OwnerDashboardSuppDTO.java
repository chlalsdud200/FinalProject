package kr.or.tacs.dto.owner;

import lombok.Data;

import java.util.Date;

@Data
public class OwnerDashboardSuppDTO {

    // EXPORT / IMPORT
    private String bizType;

    // 수출입 의뢰번호
    private String reqNo;

    // 요청 제목
    private String suppTitle;

    // 요청자명
    private String requesterNm;

    // 상태코드
    private String statusCd;

    // 상태명
    private String statusNm;

    // 요청일자
    private Date reqDt;

    // 상세 URL
    private String detailUrl;

    // 버튼명
    private String buttonText;

    // 버튼 CSS
    private String buttonClass;

    // 마감/상태 CSS
    private String ddayClass;
}