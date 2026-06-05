-- 5차 작업 후 현재 정책 상태 확인
SELECT
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_use_yn
  , TO_CHAR(np_reg_dt, 'YYYY-MM-DD HH24:MI:SS') AS reg_dt
FROM noti_policy
ORDER BY np_reg_dt DESC, np_event_cd ASC;

-- 화면에서 ON/OFF 토글 한 번씩 했을 때, 변경된 정책의 현재 use_yn 확인 (검증자 수동 확인용)
-- (UI 조작 후 다시 실행해서 값 변경 확인)
