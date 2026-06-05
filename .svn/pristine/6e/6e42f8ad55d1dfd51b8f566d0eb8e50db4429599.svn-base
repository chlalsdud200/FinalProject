package kr.or.tacs.officer.dash.service;

import java.util.List;

import kr.or.tacs.dto.officer.DashboardDTO;

public interface IDashboardService {

	  /**
     * 상단 통계 카드 건수 조회
     * @param officerId 로그인한 공무원 ID
     */
    DashboardDTO getStatCounts(String officerId);
 
    /**
     * 신규 신고접수 목록 조회 (24시간 이내 DCLR_WAIT)
     */
    List<DashboardDTO> getNewReceiptList();

    /**
     * 대시보드 업무알림 목록 조회
     * - 보완제출 도착
     * - 세금납부완료 / 필증발급 가능
     */
    List<DashboardDTO> getDashboardAlertList(String officerId);
}
