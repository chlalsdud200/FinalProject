package kr.or.tacs.dto.owner;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Data
public class OwnerTranRequestDTO {

    private String trcNo;       // 운송의뢰 번호
    private Long trcTmNo;       // 운송담당자번호
    private String trcOwrId;    // 화주아이디
    private Long trcTfgNo;      // 파일 그룹번호
    private String trcSeCd;     // 수출/수입구분
    private String trcRqstCn;   // 요청사항
    private String trcStatusCd; // 접수상태
    private String trcOwrPicNm; // 화주담당자명

    private Date trcRqstDt;     // 신청일시
    private Date trcRceptDt;    // 접수일자

    // 목록 표시용
    private String tmCpNm;      // 운송업체명
    private String tmName;      // 운송담당자명
    private String tmCpTelno;   // 운송업체 연락처

    private String trcSeNm;     // 수출/수입 표시명
    private String trcStatusNm; // 상태 표시명
    private Date lastUpdateDt;  // 최종 업데이트

    // 화주관련
    private String owrNm;       // 화주명
    private String owrTelno;    // 화주 연락처
    private String owrEmail;    // 화주 이메일

    private List<MultipartFile> docFiles;
}
