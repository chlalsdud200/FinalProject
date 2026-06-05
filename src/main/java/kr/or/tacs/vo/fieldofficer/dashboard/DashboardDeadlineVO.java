package kr.or.tacs.vo.fieldofficer.dashboard;

import lombok.Data;

@Data
public class DashboardDeadlineVO {

	// 검역요청번호
    private String iirReqNo;

    // 대표 품목명
    private String iirMainGoodsNm;

    // 회신기한
    private String iirRplyDdlineDt;

    // D-Day 표시 문구
    private String ddayText;

    // D-Day 색상 class
    private String ddayClass;
    
}
