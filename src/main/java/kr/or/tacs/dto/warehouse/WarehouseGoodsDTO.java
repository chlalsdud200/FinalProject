package kr.or.tacs.dto.warehouse;

import lombok.Data;

@Data
public class WarehouseGoodsDTO {

    private String cgNo;        // 통관물품번호
    private String goodsNo;     // 물품번호
    private String goodsName;   // 물품명
    private Integer cgQty;      // 수량
    private Double cgWeight;    // 중량
    private String cgOrigin;    // 원산지
    
    // 물품별 창고 배정 정보
    private String wzNo;
    private String locationCode;
    
    private String wiUseYn;				// 창고물품 현재 사용 여부(Y:현재 보관중,N:반출완료)
    private String locationStatusNm;	// 화면 표시용 위치 상태명(현재 보관중,반출완료 위치...)
}
