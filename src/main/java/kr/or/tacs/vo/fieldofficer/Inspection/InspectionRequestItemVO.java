package kr.or.tacs.vo.fieldofficer.Inspection;

import lombok.Data;

@Data
public class InspectionRequestItemVO {

	 // 품목 순번
    private Integer iiriSn;

    // 검역요청번호
    private String iiriReqNo;

    // HS코드
    private String iiriHsCd;

    // 품명
    private String iiriGoodsNm;

    // 학명
    private String iiriScientificNm;

    // 용도
    private String iiriUseCd;

    // 수량
    private String iiriQty;

    // 수량 단위
    private String iiriQtyUnitCd;

    // 순중량
    private String iiriNetWeight;

    // 포장개수
    private String iiriPkgCnt;

    // 포장 단위
    private String iiriPkgUnitCd;

    // 원산지
    private String iiriOriginCountryCd;

    // 등록일시
    private String iiriRegistDt;
    
}
