-- 화면이 사용할 페이지 쿼리와 동일한 형태로 1페이지(20행) 확인
SELECT
    n.noti_no
  , n.noti_event_cd
  , p.np_biz_nm
  , n.noti_ref_key
  , n.noti_receiver_id
  , n.noti_sender_id
  , n.noti_title
  , n.noti_read_yn
  , n.noti_send_status
  , TO_CHAR(n.noti_send_dt, 'YYYY-MM-DD HH24:MI:SS') AS send_dt
FROM notification n
LEFT JOIN noti_policy p
  ON p.np_event_cd = n.noti_event_cd
ORDER BY n.noti_no DESC
OFFSET 0 ROWS FETCH NEXT 20 ROWS ONLY;

-- 이벤트 옵션 콤보박스 확인
SELECT
    np_event_cd
  , np_biz_nm
FROM noti_policy
WHERE np_use_yn = 'Y'
ORDER BY np_event_cd;
