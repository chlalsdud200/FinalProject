package kr.or.tacs.vo.broker.declare;


import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 수입신고서 VO (IMP_DCLR 테이블)
 *  - 1차 MVP: 핵심 10개
 *  - 2차    : 사용자가 입력하는 나머지 컬럼 추가
 *  - (자식 테이블 IMP_DCLR_ITEM, IMP_DCLR_ITEM_MDLSPEC 는 추후 단계)
 *
 * Form에 있지만 DB 컬럼이 없는 항목(수입자구분, 납세의무자 상호 등)은 제외.
 */
public class ImpDclrVO {

    // ===== PK / 시스템 =====
    /** 통관의뢰번호 (PK, 트리거 자동 채번) */
    private String idIrNo;
    /** 상태코드 — TEMP / SUBMIT 등 */
    private String idStatusCd;
    /** 담당 관세사 ID (Principal에서) */
    private String idOfficerId;
    /** 등록일시 */
    private Date idRegistDt;
    /** 수정일시 */
    private Date idUpdtDt;

    // ===== 신고인 =====
    /** 신고인 상호/성명 */
    private String idDclrntNm;
    /** 신고인 이메일 (local@domain 합쳐서 저장) */
    private String idDclrntEml;
    /** 신고인 전화번호 (내선 포함, "010-1234-5678(101)" 형식) */
    private String idDclrntTelno;

    // ===== 수입자 =====
    /** 수입자 상호 */
    private String idImprNm;
    /** 수입자 통관고유부호 */
    private String idImprClncCd;

    // ===== 납세의무자 =====
    /** 납세의무자 상호 */
    private String idTaxpyrNm;
    /** 납세의무자 통관고유부호 */
    private String idTaxpyrClncCd;
    /** 납세의무자 전화번호 */
    private String idTaxpyrTelno;
    /** 납세의무자 식별부호 구분 (사업자/주민/여권) */
    private String idTaxpyrIdntSe;
    /** 납세의무자 식별번호 */
    private String idTaxpyrIdntNo;
    /** 납세의무자 우편번호 */
    private String idTaxpyrZip;
    /** 납세의무자 도로명주소 */
    private String idTaxpyrAddr;
    /** 납세의무자 상세주소 */
    private String idTaxpyrDtlAddr;

    // ===== 해외공급자 =====
    /** 해외공급자 상호 */
    private String idOvrssNm;
    /** 해외공급자 부호 */
    private String idOvrssCd;
    /** 해외공급자 국적 코드 (2자리) */
    private String idOvrssCntryCd;

    // ===== 기본신고사항 =====
    /** 신고구분 (수입신고/갑지/...) */
    private String idDclrSeCd;
    /** 거래구분 (11일반/21무상/...) */
    private String idTrdngSeCd;
    /** 수입통류 (AO일반/AP자가/AQ위탁) */
    private String idImportClfcCd;
    /** 화물관리번호 */
    private String idCgoMngNo;
    /** 검사반입장소/위치번호 */
    private String idInspPlceCd;
    /** 입항일자 (YYYYMMDD) */
    private String idArvlYmd;
    /** 적출국 (2자리 코드) */
    private String idShipoutCntryCd;
    /** Master B/L 번호 */
    private String idMblNo;
    /** 운송수단 (10선박/20철도/...) */
    private String idTrnspMnCd;
    /** 컨테이너 구분 */
    private String idCntnrSeCd;

    // ===== 공통사항2 — 포장/가격/결제 =====
    /** 총포장개수 */
    private Integer idTotPkgCnt;
    /** 총포장단위코드 */
    private String idTotPkgUnitCd;
    /** 총중량 (KG) */
    private BigDecimal idTotWt;
    /** 원산지증명서유무 (Y/N) */
    private String idOrgnCertYn;
    /** 결제금액 */
    private BigDecimal idStlmAmt;
    /** 인도조건 (FOB/CIF/CFR/EXW) */
    private String idDlvrCndtnCd;
    /*
     * 8E-SAVE
     * 총 란 수
     * IMP_DCLR.ID_TOT_LN_CNT
     *
     * 저장 시 ServiceImpl에서 items.size() 기준으로 세팅한다.
     */
    private Integer idTotLnCnt;
    // ===== 공통사항2 — 세액 =====
    /** 총과세가격 (원화) */
    private BigDecimal idTotTaxtPrcKrw;
    /** 총과세가격 (미화) */
    private BigDecimal idTotTaxtPrcUsd;
    /** 총관세 */
    private BigDecimal idTotCstmsAmt;
    /** 부가세 과세표준 */
    private BigDecimal idVatBaseAmt;
    /** 총부가세 */
    private BigDecimal idTotVatAmt;
    /** 총세액 합계 */
    private BigDecimal idTotTaxAmt;

    // ===== 자식 — 란사항 목록 (1:N) =====
    /** 란사항 (IMP_DCLR_ITEM 1:N) */
    private List<ImpDclrItemVO> items;

    // ===== 자식 — 모델/규격 목록 (1:N) =====
    /** 모델/규격 (IMP_DCLR_ITEM_MDLSPEC 1:N) */
    private List<ImpDclrItemMdlspecVO> mdlspecs;

    // ===== getters / setters =====
    public Integer getIdTotLnCnt() {
        return idTotLnCnt;
    }

    public void setIdTotLnCnt(Integer idTotLnCnt) {
        this.idTotLnCnt = idTotLnCnt;
    }
    
    public String getIdTaxpyrNm() { return idTaxpyrNm; }
    public void setIdTaxpyrNm(String idTaxpyrNm) { this.idTaxpyrNm = idTaxpyrNm; }

    public String getIdTaxpyrClncCd() { return idTaxpyrClncCd; }
    public void setIdTaxpyrClncCd(String idTaxpyrClncCd) { this.idTaxpyrClncCd = idTaxpyrClncCd; }

    public String getIdTaxpyrTelno() { return idTaxpyrTelno; }
    public void setIdTaxpyrTelno(String idTaxpyrTelno) { this.idTaxpyrTelno = idTaxpyrTelno; }
    
    public String getIdIrNo() { return idIrNo; }
    public void setIdIrNo(String idIrNo) { this.idIrNo = idIrNo; }

    public String getIdStatusCd() { return idStatusCd; }
    public void setIdStatusCd(String idStatusCd) { this.idStatusCd = idStatusCd; }

    public String getIdOfficerId() { return idOfficerId; }
    public void setIdOfficerId(String idOfficerId) { this.idOfficerId = idOfficerId; }

    public Date getIdRegistDt() { return idRegistDt; }
    public void setIdRegistDt(Date idRegistDt) { this.idRegistDt = idRegistDt; }

    public Date getIdUpdtDt() { return idUpdtDt; }
    public void setIdUpdtDt(Date idUpdtDt) { this.idUpdtDt = idUpdtDt; }

    public String getIdDclrntNm() { return idDclrntNm; }
    public void setIdDclrntNm(String idDclrntNm) { this.idDclrntNm = idDclrntNm; }

    public String getIdDclrntEml() { return idDclrntEml; }
    public void setIdDclrntEml(String idDclrntEml) { this.idDclrntEml = idDclrntEml; }

    public String getIdDclrntTelno() { return idDclrntTelno; }
    public void setIdDclrntTelno(String idDclrntTelno) { this.idDclrntTelno = idDclrntTelno; }

    public String getIdImprNm() { return idImprNm; }
    public void setIdImprNm(String idImprNm) { this.idImprNm = idImprNm; }

    public String getIdImprClncCd() { return idImprClncCd; }
    public void setIdImprClncCd(String idImprClncCd) { this.idImprClncCd = idImprClncCd; }

    public String getIdTaxpyrIdntSe() { return idTaxpyrIdntSe; }
    public void setIdTaxpyrIdntSe(String idTaxpyrIdntSe) { this.idTaxpyrIdntSe = idTaxpyrIdntSe; }

    public String getIdTaxpyrIdntNo() { return idTaxpyrIdntNo; }
    public void setIdTaxpyrIdntNo(String idTaxpyrIdntNo) { this.idTaxpyrIdntNo = idTaxpyrIdntNo; }

    public String getIdTaxpyrZip() { return idTaxpyrZip; }
    public void setIdTaxpyrZip(String idTaxpyrZip) { this.idTaxpyrZip = idTaxpyrZip; }

    public String getIdTaxpyrAddr() { return idTaxpyrAddr; }
    public void setIdTaxpyrAddr(String idTaxpyrAddr) { this.idTaxpyrAddr = idTaxpyrAddr; }

    public String getIdTaxpyrDtlAddr() { return idTaxpyrDtlAddr; }
    public void setIdTaxpyrDtlAddr(String idTaxpyrDtlAddr) { this.idTaxpyrDtlAddr = idTaxpyrDtlAddr; }

    public String getIdOvrssNm() { return idOvrssNm; }
    public void setIdOvrssNm(String idOvrssNm) { this.idOvrssNm = idOvrssNm; }

    public String getIdOvrssCd() { return idOvrssCd; }
    public void setIdOvrssCd(String idOvrssCd) { this.idOvrssCd = idOvrssCd; }

    public String getIdOvrssCntryCd() { return idOvrssCntryCd; }
    public void setIdOvrssCntryCd(String idOvrssCntryCd) { this.idOvrssCntryCd = idOvrssCntryCd; }

    public String getIdDclrSeCd() { return idDclrSeCd; }
    public void setIdDclrSeCd(String idDclrSeCd) { this.idDclrSeCd = idDclrSeCd; }

    public String getIdTrdngSeCd() { return idTrdngSeCd; }
    public void setIdTrdngSeCd(String idTrdngSeCd) { this.idTrdngSeCd = idTrdngSeCd; }

    public String getIdImportClfcCd() { return idImportClfcCd; }
    public void setIdImportClfcCd(String idImportClfcCd) { this.idImportClfcCd = idImportClfcCd; }

    public String getIdCgoMngNo() { return idCgoMngNo; }
    public void setIdCgoMngNo(String idCgoMngNo) { this.idCgoMngNo = idCgoMngNo; }

    public String getIdInspPlceCd() { return idInspPlceCd; }
    public void setIdInspPlceCd(String idInspPlceCd) { this.idInspPlceCd = idInspPlceCd; }

    public String getIdArvlYmd() { return idArvlYmd; }
    public void setIdArvlYmd(String idArvlYmd) { this.idArvlYmd = idArvlYmd; }

    public String getIdShipoutCntryCd() { return idShipoutCntryCd; }
    public void setIdShipoutCntryCd(String idShipoutCntryCd) { this.idShipoutCntryCd = idShipoutCntryCd; }

    public String getIdMblNo() { return idMblNo; }
    public void setIdMblNo(String idMblNo) { this.idMblNo = idMblNo; }

    public String getIdTrnspMnCd() { return idTrnspMnCd; }
    public void setIdTrnspMnCd(String idTrnspMnCd) { this.idTrnspMnCd = idTrnspMnCd; }

    public String getIdCntnrSeCd() { return idCntnrSeCd; }
    public void setIdCntnrSeCd(String idCntnrSeCd) { this.idCntnrSeCd = idCntnrSeCd; }

    public Integer getIdTotPkgCnt() { return idTotPkgCnt; }
    public void setIdTotPkgCnt(Integer idTotPkgCnt) { this.idTotPkgCnt = idTotPkgCnt; }

    public String getIdTotPkgUnitCd() { return idTotPkgUnitCd; }
    public void setIdTotPkgUnitCd(String idTotPkgUnitCd) { this.idTotPkgUnitCd = idTotPkgUnitCd; }

    public BigDecimal getIdTotWt() { return idTotWt; }
    public void setIdTotWt(BigDecimal idTotWt) { this.idTotWt = idTotWt; }

    public String getIdOrgnCertYn() { return idOrgnCertYn; }
    public void setIdOrgnCertYn(String idOrgnCertYn) { this.idOrgnCertYn = idOrgnCertYn; }

    public BigDecimal getIdStlmAmt() { return idStlmAmt; }
    public void setIdStlmAmt(BigDecimal idStlmAmt) { this.idStlmAmt = idStlmAmt; }

    public String getIdDlvrCndtnCd() { return idDlvrCndtnCd; }
    public void setIdDlvrCndtnCd(String idDlvrCndtnCd) { this.idDlvrCndtnCd = idDlvrCndtnCd; }

    public BigDecimal getIdTotTaxtPrcKrw() { return idTotTaxtPrcKrw; }
    public void setIdTotTaxtPrcKrw(BigDecimal idTotTaxtPrcKrw) { this.idTotTaxtPrcKrw = idTotTaxtPrcKrw; }

    public BigDecimal getIdTotTaxtPrcUsd() { return idTotTaxtPrcUsd; }
    public void setIdTotTaxtPrcUsd(BigDecimal idTotTaxtPrcUsd) { this.idTotTaxtPrcUsd = idTotTaxtPrcUsd; }

    public BigDecimal getIdTotCstmsAmt() { return idTotCstmsAmt; }
    public void setIdTotCstmsAmt(BigDecimal idTotCstmsAmt) { this.idTotCstmsAmt = idTotCstmsAmt; }

    public BigDecimal getIdVatBaseAmt() { return idVatBaseAmt; }
    public void setIdVatBaseAmt(BigDecimal idVatBaseAmt) { this.idVatBaseAmt = idVatBaseAmt; }

    public BigDecimal getIdTotVatAmt() { return idTotVatAmt; }
    public void setIdTotVatAmt(BigDecimal idTotVatAmt) { this.idTotVatAmt = idTotVatAmt; }

    public BigDecimal getIdTotTaxAmt() { return idTotTaxAmt; }
    public void setIdTotTaxAmt(BigDecimal idTotTaxAmt) { this.idTotTaxAmt = idTotTaxAmt; }

    public List<ImpDclrItemVO> getItems() { return items; }
    public void setItems(List<ImpDclrItemVO> items) { this.items = items; }

    public List<ImpDclrItemMdlspecVO> getMdlspecs() { return mdlspecs; }
    public void setMdlspecs(List<ImpDclrItemMdlspecVO> mdlspecs) { this.mdlspecs = mdlspecs; }

    @Override
    public String toString() {
        return "ImpDclrVO{idIrNo='" + idIrNo + "', idStatusCd='" + idStatusCd
             + "', idImprNm='" + idImprNm + "', idOfficerId='" + idOfficerId + "'}";
    }
}
