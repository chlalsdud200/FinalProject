-- 패치: DCLR_SUBMITTED 수신자에서 OFFICER 제거
-- 사유: 모든 신고 접수마다 공무원 전체가 알림 받으면 폭주 (하루 수천 건 가능)
--      공무원은 자기 화면(미처리 목록)에서 능동 확인. 알림은 보완 제출/세금 납부 등 핵심 이벤트에만.
-- 작성일: 2026-05-29

UPDATE noti_policy
SET    np_receiver_user_type = 'OWNER'
WHERE  np_event_cd = 'DCLR_SUBMITTED'
  AND  np_receiver_user_type = 'OWNER,OFFICER';

COMMIT;

-- 확인용
SELECT np_event_cd, np_receiver_user_type
FROM   noti_policy
WHERE  np_event_cd = 'DCLR_SUBMITTED';
