package kr.or.tacs.vo.broker.declare;

import java.math.BigDecimal;

/**
 * 수입신고서 모델/규격 VO (IMP_DCLR_ITEM_MDLSPEC 테이블)
 *  · 부모: IMP_DCLR (idim_ir_no = id_ir_no)
 *  · 1:N — 한 신고서에 여러 모델/규격
 *    (테이블명에 ITEM 이 들어가지만 DB 코멘트상 IDIM_IR_NO 가 PK 이므로
 *     각 란번호가 아닌 신고서 전체에 묶임)
 *  · KEY 컬럼은 용도 미상 → 일단 NULL 로 두고 추후 필요 시 채움
 */
public class ImpDclrItemMdlspecVO {

	private Integer idimMdlspecSn;
    /** 일련번호 (1, 2, 3...) — 서버에서 재채번 */
    private Integer idimSn;
    /** 통관의뢰번호 (FK to IMP_DCLR.id_ir_no) */
    private String idimIrNo;

    /** 규격번호 */
    private String idimMdlspecNo;
    /** 규격명 (긴 텍스트) */
    private String idimMdlspecNm;
    /** 순중량 (현재 폼엔 노출 안 됨, NULL) */
    private BigDecimal idimNetWt;
    /** 수량1 */
    private BigDecimal idimQty1;
    /** 수량1 단위 */
    private String idimQty1UnitCd;
    /** 수량2 (현재 폼엔 노출 안 됨, NULL) */
    private BigDecimal idimQty2;
    /** 수량2 단위 (현재 폼엔 노출 안 됨, NULL) */
    private String idimQty2UnitCd;
    /** 단가 */
    private BigDecimal idimUnitPrc;
    /** 금액 */
    private BigDecimal idimAmt;

    // ===== getters / setters =====

    public Integer getIdimSn() { return idimSn; }
    public void setIdimSn(Integer idimSn) { this.idimSn = idimSn; }

    public String getIdimIrNo() { return idimIrNo; }
    public void setIdimIrNo(String idimIrNo) { this.idimIrNo = idimIrNo; }

    public String getIdimMdlspecNo() { return idimMdlspecNo; }
    public void setIdimMdlspecNo(String idimMdlspecNo) { this.idimMdlspecNo = idimMdlspecNo; }

    public String getIdimMdlspecNm() { return idimMdlspecNm; }
    public void setIdimMdlspecNm(String idimMdlspecNm) { this.idimMdlspecNm = idimMdlspecNm; }

    public BigDecimal getIdimNetWt() { return idimNetWt; }
    public void setIdimNetWt(BigDecimal idimNetWt) { this.idimNetWt = idimNetWt; }

    public BigDecimal getIdimQty1() { return idimQty1; }
    public void setIdimQty1(BigDecimal idimQty1) { this.idimQty1 = idimQty1; }

    public String getIdimQty1UnitCd() { return idimQty1UnitCd; }
    public void setIdimQty1UnitCd(String idimQty1UnitCd) { this.idimQty1UnitCd = idimQty1UnitCd; }

    public BigDecimal getIdimQty2() { return idimQty2; }
    public void setIdimQty2(BigDecimal idimQty2) { this.idimQty2 = idimQty2; }

    public String getIdimQty2UnitCd() { return idimQty2UnitCd; }
    public void setIdimQty2UnitCd(String idimQty2UnitCd) { this.idimQty2UnitCd = idimQty2UnitCd; }

    public BigDecimal getIdimUnitPrc() { return idimUnitPrc; }
    public void setIdimUnitPrc(BigDecimal idimUnitPrc) { this.idimUnitPrc = idimUnitPrc; }

    public BigDecimal getIdimAmt() { return idimAmt; }
    public void setIdimAmt(BigDecimal idimAmt) { this.idimAmt = idimAmt; }
    
    public Integer getIdimMdlspecSn() {
        return idimMdlspecSn;
    }

    public void setIdimMdlspecSn(Integer idimMdlspecSn) {
        this.idimMdlspecSn = idimMdlspecSn;
    }
}
