package kr.or.tacs.dto.owner;

import lombok.Data;

import java.util.Date;

@Data
public class OwnerCertDTO {

    private String ciNo;          // 신고필증 식별번호
    private String ciDclrTypeCd;  // IMPORT / EXPORT
    private String ciDclrTypeNm;  // 수입 / 수출

    private String ciDclrNo;      // 신고번호: IR_NO / ER_NO
    private Long tfgNo;           // 파일그룹번호
    private String ciStatusCd;    // CERT_ISSUED 등
    private Date ciIssueDt;       // 발급일자

    private Long fileNo;          // DFI_NO
    private String fileName;      // 원본파일명

    private String itemName;      // 품명
}