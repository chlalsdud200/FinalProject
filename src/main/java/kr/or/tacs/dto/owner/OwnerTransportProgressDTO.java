package kr.or.tacs.dto.owner;

import lombok.Data;

import java.util.Date;

@Data
public class OwnerTransportProgressDTO {

    // 운송의뢰 기본
    private String trcNo;          // 운송의뢰번호
    private Long trcTmNo;          // 운송담당자번호
    private String trcOwrId;       // 화주ID
    private String trcSeCd;        // 수출/수입구분 EXP / IMP
    private String trcSeNm;        // 수출/수입 표시명
    private String trcRqstCn;

    // 운송업체
    private String tmCpNm;         // 운송업체명
    private String tmName;         // 운송담당자명
    private String tmCpTelno;      // 운송업체 연락처

    // 운송 구간
    private String deptPortCd;     // 출발항 코드
    private String deptPortNm;     // 출발항명
    private String arvlPortCd;     // 도착항 코드
    private String arvlPortNm;     // 도착항명

    // B/L, D/O
    private Long trcBiNo;          // B/L 번호
    private String doStatusCd;     // D/O 판단용 상태코드

    // 도착통지
    private String ianNo;          // 도착통지서번호
    private String ianSendSttsCd;  // 도착통지 발송상태코드
    private String ianSendSttsNm;  // 도착통지 발송상태명
    private Date ianSendDt;        // 도착통지 발송일시
    private Date ianRegistDt;      // 도착통지 등록일시
    private String arrvCurrLoc;    // 현재위치
    private String arrvStatusCd;   // 도착상태코드
    private String arrvStatusNm;   // 도착상태명

    // 일정
    private Date etaDt;            // 도착예정일 = IMP_ARRV_NTC.IAN_ARRV_DT
    private Date trcRqstDt;        // 요청일
    private Date trcRceptDt;       // 접수일
    private Date lastUpdateDt;     // 최종 업데이트

    // 운송 진행 상태
    private String trcStatusCd;    // 실제 운송상태코드
    private String trcStatusNm;    // 실제 운송상태명
}