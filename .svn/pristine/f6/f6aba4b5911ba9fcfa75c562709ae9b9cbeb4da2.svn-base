package kr.or.tacs.vo;
import lombok.Data;
@Data
public class OwnerVO {
    private String owrId;
    private String owrPassword;
    private String owrTyCd;
    private String owrNm;
    private String owrBizrno;
    private String owrIdentNo;
    private String owrCstmIdfNo;
    private String owrEmail;
    private String owrTelno;
    private String owrZip;
    private String owrAdres;
    private String owrDetailAdres;
    private String owrUseYn;
    private String owrRegistDt;
    private String owrUpdtDt;
    private String owrPrivacyAgreeYn;
    private String owrCorpRegNo;

    public String getMaskedOwrIdentNo() {
        if (owrIdentNo == null || owrIdentNo.isBlank()) {
            return "";
        }

        // 숫자만 남김
        String identNo = owrIdentNo.replaceAll("[^0-9]", "");

        // 13자리 미만이면 무리하게 substring 하지 않음
        if (identNo.length() < 7) {
            return owrIdentNo;
        }

        // 주민등록번호: 9501011234567 -> 950101-1******
        return identNo.substring(0, 6) + "-" + identNo.substring(6, 7) + "******";
    }
}