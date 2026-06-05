package kr.or.tacs.dto.owner;

import lombok.Data;

@Data
public class OwnerDashboardSummaryDTO {

    // 상단 KPI
    private int exportProgressCnt;
    private int importProgressCnt;
    private int arrivalNoticeCnt;
    private int taxWaitCnt;

    // 추가서류 요청 건수
    private int exportSuppCnt;
    private int importSuppCnt;
}