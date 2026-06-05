-- 1) 정책 13건 확인 (DCLR_SUBMITTED + ITEM_* 4 + CSTM_DONE + TAX_PAID + WH_* 4 + 10차 신규 2)
SELECT
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_use_yn
FROM noti_policy
WHERE np_event_cd IN ('CSTM_REQUESTED', 'TR_REQUESTED')
ORDER BY np_event_cd;

-- 2) trcNo 기반 운송담당자 산출 동작 확인 (검증자가 :trc_no 바인딩)
SELECT
    tm_id
FROM (
    SELECT
        tm.tm_id
    FROM tran_rcp t
    INNER JOIN transport_manager tm
        ON tm.tm_no = t.trc_tm_no
    WHERE t.trc_no = :trc_no
      AND tm.tm_id IS NOT NULL
      AND tm.tm_use_yn = 'Y'
    ORDER BY t.trc_rcept_dt DESC NULLS LAST, t.trc_no DESC
)
WHERE ROWNUM = 1;

-- 3) 10차 신규 알림 발송 이력
SELECT
    noti_no
  , noti_event_cd
  , noti_ref_key
  , noti_receiver_id
  , noti_sender_id
  , noti_title
  , noti_body
  , noti_link_url
  , TO_CHAR(noti_send_dt, 'YYYY-MM-DD HH24:MI:SS') AS send_dt
FROM notification
WHERE noti_event_cd IN ('CSTM_REQUESTED', 'TR_REQUESTED')
ORDER BY noti_send_dt DESC, noti_no DESC
FETCH FIRST 20 ROWS ONLY;