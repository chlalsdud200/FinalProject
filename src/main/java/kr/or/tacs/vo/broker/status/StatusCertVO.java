package kr.or.tacs.vo.broker.status;

import java.math.BigDecimal;

public class StatusCertVO {
	private Long dfiFileNo;
    private String ciNo;
    private String ciDclrTypeCd;
    private String ciDclrTypeNm;
    private String ciDclrNo;
    private Long tfgNo;
    private String ciStatusCd;
    private String ciStatusNm;
    private String ciIssueDtText;

    private String ownerId;
    private String ownerNm;
    private String ownerBizrno;
    private String ownerCstmIdfNo;

    private String brokerId;
    private String brokerNm;

    private String itemNm;
    private String hsCd;
    private String blNo;
    private BigDecimal totalTaxAmt;
    private String totalTaxAmtText;

    private String payStatusNm;
    private String payDateText;

    private String officerNm;
    private String customsNm;

    private String dfiOrgNm;
    private String dfiStrNm;
    private String dfiPath;
    private String dfiMimeTy;

    
    public Long getDfiFileNo() {
        return dfiFileNo;
    }

    public void setDfiFileNo(Long dfiFileNo) {
        this.dfiFileNo = dfiFileNo;
    }
    
    public String getCiNo() { return ciNo; }
    public void setCiNo(String ciNo) { this.ciNo = ciNo; }

    public String getCiDclrTypeCd() { return ciDclrTypeCd; }
    public void setCiDclrTypeCd(String ciDclrTypeCd) { this.ciDclrTypeCd = ciDclrTypeCd; }

    public String getCiDclrTypeNm() { return ciDclrTypeNm; }
    public void setCiDclrTypeNm(String ciDclrTypeNm) { this.ciDclrTypeNm = ciDclrTypeNm; }

    public String getCiDclrNo() { return ciDclrNo; }
    public void setCiDclrNo(String ciDclrNo) { this.ciDclrNo = ciDclrNo; }

    public Long getTfgNo() { return tfgNo; }
    public void setTfgNo(Long tfgNo) { this.tfgNo = tfgNo; }

    public String getCiStatusCd() { return ciStatusCd; }
    public void setCiStatusCd(String ciStatusCd) { this.ciStatusCd = ciStatusCd; }

    public String getCiStatusNm() { return ciStatusNm; }
    public void setCiStatusNm(String ciStatusNm) { this.ciStatusNm = ciStatusNm; }

    public String getCiIssueDtText() { return ciIssueDtText; }
    public void setCiIssueDtText(String ciIssueDtText) { this.ciIssueDtText = ciIssueDtText; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public String getOwnerNm() { return ownerNm; }
    public void setOwnerNm(String ownerNm) { this.ownerNm = ownerNm; }

    public String getOwnerBizrno() { return ownerBizrno; }
    public void setOwnerBizrno(String ownerBizrno) { this.ownerBizrno = ownerBizrno; }

    public String getOwnerCstmIdfNo() { return ownerCstmIdfNo; }
    public void setOwnerCstmIdfNo(String ownerCstmIdfNo) { this.ownerCstmIdfNo = ownerCstmIdfNo; }

    public String getBrokerId() { return brokerId; }
    public void setBrokerId(String brokerId) { this.brokerId = brokerId; }

    public String getBrokerNm() { return brokerNm; }
    public void setBrokerNm(String brokerNm) { this.brokerNm = brokerNm; }

    public String getItemNm() { return itemNm; }
    public void setItemNm(String itemNm) { this.itemNm = itemNm; }

    public String getHsCd() { return hsCd; }
    public void setHsCd(String hsCd) { this.hsCd = hsCd; }

    public String getBlNo() { return blNo; }
    public void setBlNo(String blNo) { this.blNo = blNo; }

    public BigDecimal getTotalTaxAmt() { return totalTaxAmt; }
    public void setTotalTaxAmt(BigDecimal totalTaxAmt) { this.totalTaxAmt = totalTaxAmt; }

    public String getTotalTaxAmtText() { return totalTaxAmtText; }
    public void setTotalTaxAmtText(String totalTaxAmtText) { this.totalTaxAmtText = totalTaxAmtText; }

    public String getPayStatusNm() { return payStatusNm; }
    public void setPayStatusNm(String payStatusNm) { this.payStatusNm = payStatusNm; }

    public String getPayDateText() { return payDateText; }
    public void setPayDateText(String payDateText) { this.payDateText = payDateText; }

    public String getOfficerNm() { return officerNm; }
    public void setOfficerNm(String officerNm) { this.officerNm = officerNm; }

    public String getCustomsNm() { return customsNm; }
    public void setCustomsNm(String customsNm) { this.customsNm = customsNm; }

    public String getDfiOrgNm() { return dfiOrgNm; }
    public void setDfiOrgNm(String dfiOrgNm) { this.dfiOrgNm = dfiOrgNm; }

    public String getDfiStrNm() { return dfiStrNm; }
    public void setDfiStrNm(String dfiStrNm) { this.dfiStrNm = dfiStrNm; }

    public String getDfiPath() { return dfiPath; }
    public void setDfiPath(String dfiPath) { this.dfiPath = dfiPath; }

    public String getDfiMimeTy() { return dfiMimeTy; }
    public void setDfiMimeTy(String dfiMimeTy) { this.dfiMimeTy = dfiMimeTy; }
}