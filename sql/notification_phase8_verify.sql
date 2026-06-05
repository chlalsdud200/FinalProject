-- 1) 실제 사용자(receiverId)의 미읽음 카운트 + 최신 send_dt
--    검증자가 :receiver_id 바인딩
SELECT
    COUNT(CASE WHEN noti_read_yn = 'N' THEN 1 END) AS unread_count
  , TO_CHAR(MAX(CASE WHEN noti_read_yn = 'N' THEN noti_send_dt END), 'YYYY-MM-DD HH24:MI:SS') AS latest_send_dt
FROM notification
WHERE noti_receiver_id = :receiver_id;

-- 2) 실제 사용자의 최근 10건 (수신함 미리보기)
SELECT
    n.noti_no
  , n.noti_event_cd
  , p.np_biz_nm
  , n.noti_title
  , n.noti_read_yn
  , TO_CHAR(n.noti_send_dt, 'YYYY-MM-DD HH24:MI:SS') AS send_dt
FROM notification n
LEFT JOIN noti_policy p
  ON p.np_event_cd = n.noti_event_cd
WHERE n.noti_receiver_id = :receiver_id
ORDER BY n.noti_no DESC
OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;

-- 3) 인덱스 사용 여부 확인용 EXPLAIN PLAN (선택)
EXPLAIN PLAN FOR
SELECT noti_no
FROM notification
WHERE noti_receiver_id = :receiver_id
  AND noti_read_yn = 'N';
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY());