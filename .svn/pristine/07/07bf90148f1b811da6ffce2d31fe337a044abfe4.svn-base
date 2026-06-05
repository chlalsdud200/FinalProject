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
  , noti_retry_count
  , noti_send_dt
FROM notification
ORDER BY noti_send_dt DESC
FETCH FIRST 10 ROWS ONLY;
