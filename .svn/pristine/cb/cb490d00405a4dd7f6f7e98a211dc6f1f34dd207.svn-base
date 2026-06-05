package kr.or.tacs.dto.officer;

import lombok.Data;

@Data
public class WorkHistoryDTO {

    // ── 공통 ──────────────────────────────────────────
    private String workHistoryId; // SR_NO 또는 TO_CHAR(CSH_PAY_SCHD_NO)
    private String reqNo;         // 신고번호
    private String workType;      // supplement | hold | hold_release
    private String reason;        // 처리사유 (보완요청 내용 → SR_REQ_CN)
    private String dueDate;       // 답변기한 (보완요청만)
    private String status;        // ACTIVE | CANCELLED | 진행중 | 보완제출
    private String registDt;      // 등록일시 (표시용)
    private String officerId;     // 처리 공무원 ID

    // ── 보완요청 전용 (SUPP_RQST) ─────────────────────
    private String srNo;          // SR_NO (PK, selectKey)
    private String refBizCd;      // IMP_RQST | EXP_RQST
    private String receiverId;    // 관세사 ID

    // ── 보완제출 전용 ──────────────────────────────────
    private String submitContent; // 관세사 보완제출 내용 (SR_SUBMIT_CN)
    private String submitDt;      // 보완제출 일시 (SR_SUBMIT_DT, 표시용)

    // ── 통관보류 전용 (CUSTOMS_STATUS_HISTORY) ─────────
    private Long   cshNo;         // CSH_PAY_SCHD_NO (PK, selectKey)
    private String scopeCd;       // IMPORT | EXPORT
    private Long   fileNo;
    private String fileName;
    private String beforeStatus;
}