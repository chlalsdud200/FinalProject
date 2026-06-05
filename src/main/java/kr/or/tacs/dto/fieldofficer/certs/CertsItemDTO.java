package kr.or.tacs.dto.fieldofficer.certs;

import lombok.Data;

/*
 * 검역 합격 증명서 품목 상세 내역 DTO
 *
 * 역할:
 * - 상세 발급 화면의 품목 상세 내역 한 줄을 표현한다.
 * - 품목이 3개면 CertsItemDTO 객체가 3개 생성된다.
 */
@Data
public class CertsItemDTO {
	
	 // 품목 순번
    private Integer itemSn;

    // 품목명
    private String itemNm;

    // HS CODE
    private String hsCode;

    // 품목 수량
    private String itemQty;

    // 수량 단위
    private String itemQtyUnitCd;

    // 순중량
    private String itemNetWt;

    // 원산지 코드
    private String itemOriginCd;

    // 품목별 판정 결과
    private String itemJudgeResult;

}
