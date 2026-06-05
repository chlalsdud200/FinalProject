SET DEFINE OFF;

SELECT
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_link_tpl
  , np_use_yn
FROM noti_policy
WHERE np_event_cd IN (
    'DCLR_SUBMITTED'
  , 'ITEM_REJECTED'
  , 'CSTM_DONE'
  , 'TAX_PAID'
)
ORDER BY np_event_cd;

SELECT
    noti_event_cd
  , noti_ref_key
  , noti_receiver_id
  , noti_sender_id
  , noti_title
  , noti_link_url
  , noti_send_status
  , TO_CHAR(noti_send_dt, 'YYYY-MM-DD HH24:MI:SS') noti_send_dt
FROM notification
WHERE noti_event_cd IN (
    'ITEM_SUPP_REQUESTED'
  , 'ITEM_ACCEPTED'
  , 'ITEM_REJECTED'
  , 'CSTM_DONE'
  , 'TAX_PAID'
)
ORDER BY noti_no DESC;
