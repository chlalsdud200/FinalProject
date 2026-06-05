package kr.or.tacs.dto.owner;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Data
public class OwnerImportRequestDTO {

    // IMP_RQST 기본 정보
    private String irNo;              // 수입통관의뢰번호
    private String irOwrId;           // 화주 ID
    private String irBrokerId;        // 관세사 ID
    private String irArrvPortCd;      // 도착항 코드
    private Long irTfgNo;             // 첨부파일그룹번호
    private String irStatusCd;        // 의뢰상태코드

    // 화주/수입 기본 입력 정보
    private String irCstmIdfNo;       // 통관고유부호
    private String irCorpRegNo;       // 법인등록번호/개인 식별번호
    private String irArrvSchdYmd;     // 도착예정일자 YYYYMMDD
    private String irBlAwbNo;         // B/L 또는 AWB 번호
    private String irDclrCurrCd;      // 신고통화코드
    private BigDecimal irInvcAmt;     // 인보이스 금액
    private String irCn;              // 요청 내용

    // 처리 일시
    private Date irDt;                // 의뢰일시
    private String irUseYn;           // 사용여부
    private Date irRegistDt;          // 등록일시

    // 반려/결제 관련
    private String irPayMthdCd;       // 납부방법코드: 사전/사후
    private String irPayTypeCd;       // 납부유형코드: 완납/분할
    private int irInstlPayCnt;    // 분할납부횟수

    private List<MultipartFile> docFiles;

    // 수입 물품/메모
    private String irComment;         // 코멘트

    private String brokerNm;

    private String submitType;
    private String srSubmitCn;
    private String srReqCn;

    // SUPP_RQST 처리용
    private String srRefBizCd;        // IMPORT
    private String srStatusCd;        // SUB
    private String beforeSrStatusCd;  // REQ

    // IMP_RQST 상태 변경용
    private String beforeIrStatusCd;  // CSTM_SUPP

    private List<Long> deleteDfiFileNoList;     // 파일 삭제예약

    public Date getirArrvSchdYmdAsDate() {
        if (this.irArrvSchdYmd == null || this.irArrvSchdYmd.isEmpty()) return null;
        try {
            return new SimpleDateFormat("yyyyMMdd").parse(this.irArrvSchdYmd);
        } catch (Exception e) {
            return null;
        }
    }
}
