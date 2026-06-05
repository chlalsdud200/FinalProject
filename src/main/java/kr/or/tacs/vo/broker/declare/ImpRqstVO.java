package kr.or.tacs.vo.broker.declare;


import java.math.BigDecimal;
import java.util.Date;

/**
 * 수입통관의뢰서 VO (IMP_RQST 테이블)
 *  · 화주가 등록한 통관 의뢰
 *  · 관세사가 이걸 받아서 IMP_DCLR (신고서) 작성
 *  · IR_NO 는 IMP_DCLR.ID_IR_NO 의 FK
 */
public class ImpRqstVO {

    /** 통관의뢰 식별번호 (PK) */
    private String irNo;
    /** 화주 로그인 ID */
    private String irOwrId;
    /** 담당 관세사 BROKER_ID */
    private String irBrokerId;
    /** 도착항 코드 */
    private String irArrvPortCd;
    /** 첨부파일 그룹 번호 */
    private Long irTfgNo;
    /** 상태 코드 (TMP, REQ 등) */
    private String irStatusCd;
    /** 통관고유부호 */
    private String irCstmIdfNo;
    /** 사업자/주민등록번호 */
    private String irCorpRegNo;
    /** 도착예정일 (YYYYMMDD) */
    private String irArrvSchdYmd;
    /** B/L 또는 AWB 번호 */
    private String irBlAwbNo;
    /** 신고통화 (USD, KRW 등) */
    private String irDclrCurrCd;
    /** Invoice 결제 금액 */
    private BigDecimal irInvcAmt;
    /** 화주가 작성한 요청 내용 */
    private String irCn;
    /** 의뢰일시 */
    private Date irDt;
    /** 관세사 수락일시 */
    private Date irAcptDt;
    /** 사용여부 (Y/N) */
    private String irUseYn;
    /** 등록일시 */
    private Date irRegistDt;
    /** 결제방식 코드 */
    private String irPayMthdCd;
    /** 결제유형 코드 */
    private String irPayTypeCd;
    /** 분할 횟수 */
    private Integer irInstlPayCnt;
    /** 코멘트 */
    private String irComment;
    
    private String irArrvPortNm;
    

    /* ===== 화주 정보 자동채움용 OWNER 조인 컬럼 ===== */
    private String owrNm;
    private String owrBizrno;
    private String owrCstmIdfNo;
    private String owrTelno;
    private String owrZip;
    private String owrAdres;
    private String owrDetailAdres;
    // ===== getters / setters =====
    public String getOwrNm() {
        return owrNm;
    }

    public void setOwrNm(String owrNm) {
        this.owrNm = owrNm;
    }

    public String getOwrBizrno() {
        return owrBizrno;
    }

    public void setOwrBizrno(String owrBizrno) {
        this.owrBizrno = owrBizrno;
    }

    public String getOwrCstmIdfNo() {
        return owrCstmIdfNo;
    }

    public void setOwrCstmIdfNo(String owrCstmIdfNo) {
        this.owrCstmIdfNo = owrCstmIdfNo;
    }

    public String getOwrTelno() {
        return owrTelno;
    }

    public void setOwrTelno(String owrTelno) {
        this.owrTelno = owrTelno;
    }

    public String getOwrZip() {
        return owrZip;
    }

    public void setOwrZip(String owrZip) {
        this.owrZip = owrZip;
    }

    public String getOwrAdres() {
        return owrAdres;
    }

    public void setOwrAdres(String owrAdres) {
        this.owrAdres = owrAdres;
    }

    public String getOwrDetailAdres() {
        return owrDetailAdres;
    }

    public void setOwrDetailAdres(String owrDetailAdres) {
        this.owrDetailAdres = owrDetailAdres;
    }
    
    
    public String getIrNo() { return irNo; }
    public void setIrNo(String irNo) { this.irNo = irNo; }

    public String getIrOwrId() { return irOwrId; }
    public void setIrOwrId(String irOwrId) { this.irOwrId = irOwrId; }

    public String getIrBrokerId() { return irBrokerId; }
    public void setIrBrokerId(String irBrokerId) { this.irBrokerId = irBrokerId; }

    public String getIrArrvPortCd() { return irArrvPortCd; }
    public void setIrArrvPortCd(String irArrvPortCd) { this.irArrvPortCd = irArrvPortCd; }

    public Long getIrTfgNo() { return irTfgNo; }
    public void setIrTfgNo(Long irTfgNo) { this.irTfgNo = irTfgNo; }

    public String getIrStatusCd() { return irStatusCd; }
    public void setIrStatusCd(String irStatusCd) { this.irStatusCd = irStatusCd; }

    public String getIrCstmIdfNo() { return irCstmIdfNo; }
    public void setIrCstmIdfNo(String irCstmIdfNo) { this.irCstmIdfNo = irCstmIdfNo; }

    public String getIrCorpRegNo() { return irCorpRegNo; }
    public void setIrCorpRegNo(String irCorpRegNo) { this.irCorpRegNo = irCorpRegNo; }

    public String getIrArrvSchdYmd() { return irArrvSchdYmd; }
    public void setIrArrvSchdYmd(String irArrvSchdYmd) { this.irArrvSchdYmd = irArrvSchdYmd; }

    public String getIrBlAwbNo() { return irBlAwbNo; }
    public void setIrBlAwbNo(String irBlAwbNo) { this.irBlAwbNo = irBlAwbNo; }

    public String getIrDclrCurrCd() { return irDclrCurrCd; }
    public void setIrDclrCurrCd(String irDclrCurrCd) { this.irDclrCurrCd = irDclrCurrCd; }

    public BigDecimal getIrInvcAmt() { return irInvcAmt; }
    public void setIrInvcAmt(BigDecimal irInvcAmt) { this.irInvcAmt = irInvcAmt; }

    public String getIrCn() { return irCn; }
    public void setIrCn(String irCn) { this.irCn = irCn; }

    public Date getIrDt() { return irDt; }
    public void setIrDt(Date irDt) { this.irDt = irDt; }

    public Date getIrAcptDt() { return irAcptDt; }
    public void setIrAcptDt(Date irAcptDt) { this.irAcptDt = irAcptDt; }

    public String getIrUseYn() { return irUseYn; }
    public void setIrUseYn(String irUseYn) { this.irUseYn = irUseYn; }

    public Date getIrRegistDt() { return irRegistDt; }
    public void setIrRegistDt(Date irRegistDt) { this.irRegistDt = irRegistDt; }

    public String getIrPayMthdCd() { return irPayMthdCd; }
    public void setIrPayMthdCd(String irPayMthdCd) { this.irPayMthdCd = irPayMthdCd; }

    public String getIrPayTypeCd() { return irPayTypeCd; }
    public void setIrPayTypeCd(String irPayTypeCd) { this.irPayTypeCd = irPayTypeCd; }

    public Integer getIrInstlPayCnt() { return irInstlPayCnt; }
    public void setIrInstlPayCnt(Integer irInstlPayCnt) { this.irInstlPayCnt = irInstlPayCnt; }

    public String getIrComment() { return irComment; }
    public void setIrComment(String irComment) { this.irComment = irComment; }
    
    public String getIrArrvPortNm() {
        return irArrvPortNm;
    }

    public void setIrArrvPortNm(String irArrvPortNm) {
        this.irArrvPortNm = irArrvPortNm;
    }
}
