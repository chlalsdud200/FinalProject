package kr.or.tacs.vo.broker.quarantine;

import lombok.Data;

@Data
public class QuarantineItemVO {

    // 품목순번
    private Integer iiriSn;

    // 수입검역요청번호
    private String iiriReqNo;

    // HS코드
    private String hsCd;

    // 품명
    private String goodsNm;

    // 학명
    private String scientificNm;

    // 용도코드
    private String useCd;

    // 수량
    private String qty;

    // 수량단위코드
    private String qtyUnitCd;

    // 순중량
    private String netWeight;

    // 포장개수
    private String pkgCnt;

    // 포장재질
    private String pkgMaterial;

    // 원산지국가코드
    private String originCountryCd;
}