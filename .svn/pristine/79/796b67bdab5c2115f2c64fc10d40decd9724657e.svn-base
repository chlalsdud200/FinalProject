package kr.or.tacs.dto.warehouse;

import java.util.List;

import kr.or.tacs.dto.PageDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class WarehouseWhInRptDTO extends PageDTO {

    private String wirNo;
    private String wirGgNo;
    private String wirOwrId;
    private String wirWmId;
    private String wirwzno;
    
    private String locationCode;
    
    private String wirInPlanDt;
    private String wirAccessTargetCn;
    private String wirStatusCd;
    private String wirWhReplyStatusCd;
    private String wirInvoiceNo;
    private String wirInvoiceYmd;
    private String wirCargoMgmtNo;
    private String wirIncoTermsCd;
    private String wirTrdrNo;
    private String wirRqstCn;
    
    // 물품별 위치 배정 리스트(입고의뢰 1건 전체를 담는것) -> 물품별 위치 배정 리스트 추가
    private List<WarehouseGoodsDTO> goodsList;
    private String wirOwrNm;
    private String wirIoSeCd;   // IMP / EXP
    // 추가 필드임 ( 하나의 입고의뢰신청에 여러 물품들이 있어 ex 엔진 부품 외 3건 이런식으로 나타낼려고 함)
    private String firstItemName; 
    private int itemCnt;        
    private double wirWeight;   // SUM(CG_WEIGHT)
    private int wirPkgQty;     // SUM(CG_QTY)
    
    private String wirStatusNm;
    
    private String tmId;
    private String tmCpNm;
    private String tmName;
    private String tmCpTelno;
    

}

