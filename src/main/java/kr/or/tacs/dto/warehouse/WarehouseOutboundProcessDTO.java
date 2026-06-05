package kr.or.tacs.dto.warehouse;

import kr.or.tacs.dto.PageDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class WarehouseOutboundProcessDTO extends PageDTO {

    /*
     * =========================================================
     * 1. 반출요청 정보
     * 기준 테이블: CARGO_RELEASE_REQ
     * =========================================================
     */
    private String crrNo;              // 반출요청번호
    private int crReleaseNo;        // 반출처리번호, 화면 노출 X, 상태변경용 hidden

    private String crrTreId;        // 내부 연결용 번호
    private String crrOwrId;        // 화주 ID
    private String crrNm;           // 화주명
    private String crrCertNo;       // D/O 번호
    private String crrReqCn;        // 반출요청내용
    private String crrCrDt;         // 반출요청일시

    /*
     * =========================================================
     * 2. 반출 상태 정보
     * 기준 테이블: CARGO_RELEASE
     * =========================================================
     */
    private String crStatusCd;      // 반출상태 코드
    private String crStatusNm;      // 반출상태명

    private String diTrdeSeCd;      // 수입/수출 코드
    private String diTrdeSeNm;      // 수입/수출명

    private String crDt;            // 반출처리일시

    /*
     * =========================================================
     * 3. 운송업체 정보
     * =========================================================
     */
    private String tmId;            // 운송업체 담당자 ID
    private String tmCpNm;          // 요청업체명
    private String tmName;          // 운송담당자명
    private String tmCpTelno;       // 운송업체 연락처

    /*
     * =========================================================
     * 4. 창고 / 보관 위치 정보
     * =========================================================
     */
    private String crWhNo;          // 창고번호
    private String whNm;            // 창고명

    private String crrWzNo;         // 창고구역번호
    private String wzNm;            // 창고구역명

    private String locationCode;    // 실제 보관위치 원본 코드
    private String locationNm;      // 화면 표시용 보관위치

    /*
     * =========================================================
     * 5. 물품 정보
     * =========================================================
     */
    private String goodsName;       // 대표 물품명
    private int itemCnt;            // 품목 수
    private String goodsSummary;    // 화면 표시용 품명

    private String totalQty;        // 총 수량
    private String totalWeight;     // 총 중량
    private String originSummary;   // 원산지 요약

    /*
     * =========================================================
     * 6. 첨부서류 정보
     * D/O + 수입신고필증 파일
     * =========================================================
     */
    private Long diTfgNo;           		// 파일그룹번호
    private int fileCnt;            		// 첨부파일 개수
    private String docStatusNm;     		// 서류상태명
    private String doStatusNm;              // D/O 수령상태명
    private String declarationStatusNm;     // 수출입신고필증 수령상태명
}