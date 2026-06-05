package kr.or.tacs.dto.warehouse;

import lombok.Data;

/**
 * 반출서류 수령관리 전용  DTO
 */
@Data
public class WarehouseOutboundDocDTO {

	private String wirNo;				// 입고 의뢰번호(WH_IN_RPT.WIR_NO)
	private String wirIoSeCd;			// 수출입 구분 코드( WH_IN_RPT.WIR_IO_SE_CD)
	private String wirIoSeNm;			// 수출입 구분명
	
	private String wirOwrNm;			// 화주명
	private String firstItemName;		// 대표 품명
	private int itemCnt;				// 품목 수
	
	private String wirCompleteDt;		// 입고 완료일
	private String diStatusCd;			// D/O 업무 상태 코드(READY/ISSUED/DELIVERED)
	private String docStatusNm;			// D/O +  신고 필증 상태명(수령전/수령완료로 표시할 한글명)
	private Long diTfgNo;				// D/O + 신고필증 파일그룹번호
	private  int fileCnt;				// 첨부파일 개수(DI_TFG_NO에 연결된 실제 파일 개수)
}
