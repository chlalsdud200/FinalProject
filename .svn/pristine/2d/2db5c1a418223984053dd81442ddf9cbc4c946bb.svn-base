package kr.or.tacs.dto.warehouse;

import java.util.List;

import lombok.Data;

@Data
public class WarehouseDashboardDTO {

	// 입고 요청 대기 건수
	// WH_IN_RPT.WIR_STATUS_CD = 'WAIT'
	private int wirWaitCnt;
	
	//입고 보완제출 확인 건수
	// WH_IN_RPT.WIR_STATUS_CD = 'REQ_SENT'
	private int wirReqSentCnt;
	
	// 반출 요청 대기 건수
	// CARGO_RELEASE.CRR_STATUS_CD = 'REL_WAIT'
	private int crrWaitCnt;
	
	//현재 보관중 재고 건수
	// WAREHOUSE_ITEM 또는 WAREHOUSE_ITEM_LOCATION 기준
	private int wirStoredCnt;
	
	// 최근 입출고 현황
	private List<WarehouseDashboardDTO> recentFlowList;
	
	// 창고 구역별 적재 현황
	private List<WarehouseZoneDTO> zoneStatusList;
	
	
	
	/*
	 * 입출고 현황에서 사용할 필드명들
	 */
	private String wirIoSeCd; 		// 입출고 구분코드
	private String wirIoSeNm;		// 입출고 구분명
	private String wirNo;			// 입고 의뢰번호
	private String crrNo;			// 반출 요청번호
	private String wirOwrNm;		// 화주명
	private String goodsSummary;	// 대표 품명
	private String wirStatusCd;		// 입고 상태 코드
	private String wirStatusNm;		// 입고 상태명
	private String crrStatusCd;		// 반출 상태 코드
	private String crrStatusNm;		// 반출 상태명
	private String wirDt;			// 입고 기준 일시
	private String crrDt;			// 반출 기준 일시
	
}














