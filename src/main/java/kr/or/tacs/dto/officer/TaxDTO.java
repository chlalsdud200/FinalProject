package kr.or.tacs.dto.officer;

import lombok.Data;

/**
	 * 세금납부 탭 데이터 DTO
	 * CUSTOMS_TAX + IMP_DCLR + CUSTOMS_TAX_PAY 조인 결과
	 */
	@Data
	public class TaxDTO {

	    private Long   ctNo;            // CUSTOMS_TAX PK

	    /* 납부기한·고지번호 */
	    private String payDueDate;      // CT_PAY_DDLINE_DT → 납부기한
	    private String taxNoticeNo;     // CT_NO 기반 표시용 고지번호

	    /* 관세 */
	    private String customsBase;     // ID_TOT_TAXT_PRC_KRW → 관세 과세표준
	    private String customsRate;     // 표시용 (N/A - 품목별 다름)
	    private String customsAmount;   // CT_DUTY_AMT → 확정 관세액
	    private String customsStatus;   // 납부상태 한글 표시
	    private String customsPaidDate; // CUSTOMS_TAX_PAY.CTP_DT → 관세 납부일시

	    /* 부가세 */
	    private String vatBase;         // ID_VAT_BASE_AMT → 부가세 과세표준
	    private String vatAmount;       // CT_VAT_AMT → 확정 부가세액
	    private String vatPaidDate;     // CUSTOMS_TAX_PAY.CTP_DT → 부가세 납부일시

	    /* 합계 */
	    private String totalAmount;     // CT_TOTAL_TAX_AMT → 총납부세액

	    /* 납부상태 (전체) */
	    private String taxStatus;       // CT_PAY_STATUS_CD 한글 표시

	    /* 관세사 전달일시 (UI 표시용, DB 미저장) */
	    private String sendDate;
	}

