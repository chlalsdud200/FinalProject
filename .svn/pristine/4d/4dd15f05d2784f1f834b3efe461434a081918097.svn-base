-- 정책 11건 (1~6차 7건 + 7차 4건) 확인
SELECT
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_use_yn
FROM noti_policy
WHERE np_event_cd LIKE 'WH\_%' ESCAPE '\'
ORDER BY np_event_cd;

-- 7차 신규 알림 발송 이력 확인
SELECT
    noti_no
  , noti_event_cd
  , noti_ref_key
  , noti_receiver_id
  , noti_sender_id
  , noti_title
  , noti_body
  , noti_link_url
  , noti_send_status
  , TO_CHAR(noti_send_dt, 'YYYY-MM-DD HH24:MI:SS') AS send_dt
FROM notification
WHERE noti_event_cd IN ('WH_INBOUND_DONE', 'WH_INBOUND_SUPP_REQ', 'WH_OUTBOUND_DONE', 'WH_OUTBOUND_SUPP_REQ')
ORDER BY noti_send_dt DESC, noti_no DESC
FETCH FIRST 30 ROWS ONLY;

-- WIR 기준 OWNER 산출 매핑 동작 확인 (검증자가 :wir_no 채울 것)
SELECT
    trc_owr_id
FROM (
    SELECT
        t.trc_owr_id
    FROM wh_in_rpt w
    INNER JOIN tran_rcp t
        ON (
              T.TRC_SE_CD = W.WIR_IO_SE_CD
           OR (T.TRC_SE_CD = 'IMPORT' AND W.WIR_IO_SE_CD = 'IMP')
           OR (T.TRC_SE_CD = 'EXPORT' AND W.WIR_IO_SE_CD = 'EXP')
           OR (T.TRC_SE_CD = 'IMP'    AND W.WIR_IO_SE_CD = 'IMPORT')
           OR (T.TRC_SE_CD = 'EXP'    AND W.WIR_IO_SE_CD = 'EXPORT')
        )
       AND (
              t.trc_no = w.wir_no
           OR t.trc_no = 'TRC-' || w.wir_no
           OR REPLACE(t.trc_no, 'TRC-', '') = w.wir_no
           OR t.trc_tfg_no = w.wir_gg_no
        )
    WHERE w.wir_no = :wir_no
      AND t.trc_owr_id IS NOT NULL
    ORDER BY t.trc_rcept_dt DESC NULLS LAST, t.trc_no DESC
)
WHERE ROWNUM = 1;