package kr.or.tacs.vo.transport;

import lombok.Data;

@Data
// 운송담당자 로그인 및 업체 기본 정보를 담는 VO.
public class TransportManagerVO {
    private String tmNo;          // 운송담당자번호 = 로그인 ID
    private String tmPassword;    // 운송담당자 비밀번호
    private String tmCpNm;        // 운송업체명
    private String tmCpTelno;     // 운송업체 전화번호
    private String tmMnCd;        // 운송수단코드
    private String tmName;        // 운송담당자명
    private String tmUse;         // 운송담당자 사용여부
}
