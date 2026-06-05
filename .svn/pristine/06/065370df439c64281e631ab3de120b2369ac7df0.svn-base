package kr.or.tacs.dto.owner;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Data
public class OwnerExportRequestDTO {

    // 수출통관 신청 관련
    private String erNo;
    private String erOwrId;
    private String erBrokerId;
    private Long erTfgNo;
    private String erStatusCd;
    private String erOnerNm;
    private String erCstmIdfNo;
    private String erCorpRegNo;
    private String erLoadSchdYmd;
    private String erIncoTermsCd;
    private String erLoadPortCd;
    private String erArrvPortCd;
    private String erCoIssueTyCd;
    private String erComment;
    private Date erRqstDt;
    private Date erAcptDt;
    private Date erCnclDt;
    private Date erRegistDt;
    private List<MultipartFile> docFiles;
    private String brokerNm;

    private String erRefundReqYn;
    private String erPrpsCountryCd;
    private String erTrnspMthdCd;

    private String erBizrno;

    private List<Long> deleteDfiFileNoList;

    private String srRefBizCd;
    private String srStatusCd;
    private String beforeSrStatusCd;

    private String submitType;
    private String srSubmitCn;
    private String srReqCn;

    // EXP_RQST 상태 변경용
    private String beforeErStatusCd;  // CSTM_SUPP

    public Date getErLoadSchdYmdAsDate() {
        if (this.erLoadSchdYmd == null || this.erLoadSchdYmd.isEmpty()) return null;
        try {
            return new SimpleDateFormat("yyyyMMdd").parse(this.erLoadSchdYmd);
        } catch (Exception e) {
            return null;
        }
    }

}
