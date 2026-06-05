package kr.or.tacs.vo.fieldofficer.certs;

import lombok.Data;

/*
 * 현장공무원(검역기관) - 검역 합격 증명서 VO
 *
 * 역할:
 * - IMP_INS_CERT 테이블 한 행을 표현하는 VO
 * - DB의 증명서 발급 정보 자체를 담는 용도
 *
 * 주의:
 * - 목록 검색, 상세 화면, 보완요청, 품목 상세 내역은 DTO에서 처리한다.
 * - 화면용 데이터는 CertsDTO, 품목 상세는 CertsItemDTO를 사용한다.
 */
@Data
public class CertsVO {

	// =========================
    // IMP_INS_CERT 검역 합격 증명서 정보
    // =========================

    // 증명서 번호
    private String iicCertNo;

    // 검역결과번호
    private String iicResultNo;

    // 검역요청번호
    private String iicReqNo;

    // 발급 담당 공무원 ID
    private String iicIssueOfficerId;

    // 발급 상태 코드
    // 예: 발급 대기 / 발급 완료 / 발급 불가
    private String iicIssueStatusCd;

    // 문서 유형 코드
    // 예: QRTN_PASS_CERT
    private String iicDocTypeCd;

    // 발급 일시
    private String iicIssueDt;

    // 등록 일시
    private String iicRegistDt;

    // 수정 일시
    private String iicUpdtDt;
    
}
