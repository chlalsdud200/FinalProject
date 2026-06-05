SELECT
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_use_yn
FROM noti_policy
ORDER BY np_reg_dt, np_event_cd;

SELECT
    noti_no
  , noti_event_cd
  , noti_ref_key
  , noti_receiver_id
  , noti_sender_id
  , noti_title
  , noti_body
  , noti_link_url
  , noti_read_yn
  , noti_send_status
  , noti_send_dt
FROM notification
WHERE noti_event_cd IN ('ITEM_SUPP_REQUESTED', 'ITEM_SUPP_SUBMITTED', 'ITEM_ACCEPTED')
ORDER BY noti_send_dt DESC, noti_no DESC
FETCH FIRST 30 ROWS ONLY;
