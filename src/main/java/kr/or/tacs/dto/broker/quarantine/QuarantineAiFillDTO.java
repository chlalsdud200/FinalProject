package kr.or.tacs.dto.broker.quarantine;

import java.util.List;

import lombok.Data;

@Data
public class QuarantineAiFillDTO {

    // 수출자 및 공급자 정보
    private String iirExporterNm;
    private String iirExporterCompanyNm;
    private String iirExporterAdres;
    private String iirExportCountryCd;
    private String iirOriginCountryCd;
    private String iirPhytoCertNo;
    private String iirPhytoCertIssueDt;

    // 운송 및 입항 정보
    private String iirTransportNm;
    private String iirLoadPortCd;
    private String iirShipDt;
    private String iirArrvPortCd;
    private String iirArrvDt;

    // 대표 품목 및 포장 정보
    private String iirMainGoodsNm;
    private String iirMainHsCd;
    private String iirTotalWeight;
    private String iirTotalPkgCnt;
    private String iirPkgUnitCd;
    private String iirPkgMaterial;
    private String iirWoodPkgYn;
    private String iirWoodPkgMarkNo;

    // 품목 목록
    private List<Item> itemList;

    @Data
    public static class Item {
        private String hsCd;
        private String goodsNm;
        private String scientificNm;
        private String useCd;
        private String qty;
        private String qtyUnitCd;
        private String netWeight;
        private String pkgCnt;
        private String originCountryCd;
    }
}