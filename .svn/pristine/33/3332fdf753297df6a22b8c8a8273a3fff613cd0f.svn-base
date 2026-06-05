-- 1) 운송담당자 산출 매핑 동작 확인
--    실제 데이터가 있는 IR_NO 하나로 바인딩해서 실행 (검증자가 :ir_no에 값 채울 것)
SELECT
    tm_id
FROM (
    SELECT
        tm.tm_id
    FROM tran_rcp t
    INNER JOIN transport_manager tm
        ON tm.tm_no = t.trc_tm_no
    WHERE (
            t.trc_no = :ir_no
         OR t.trc_no = 'TRC-' || :ir_no
         OR REPLACE(t.trc_no, 'TRC-', '') = :ir_no
    )
      AND tm.tm_id IS NOT NULL
      AND tm.tm_use_yn = 'Y'
    ORDER BY t.trc_rcept_dt DESC NULLS LAST, t.trc_no DESC
)
WHERE ROWNUM = 1;

-- 2) TRC_TM_NO 가 채워진 운송건 샘플 5건 (테스트 데이터 식별용)
SELECT
    t.trc_no
  , t.trc_tm_no
  , tm.tm_id
  , tm.tm_use_yn
FROM tran_rcp t
LEFT JOIN transport_manager tm
    ON tm.tm_no = t.trc_tm_no
WHERE t.trc_tm_no IS NOT NULL
  AND ROWNUM <= 5;

-- 3) 정책 7건 + TRANSPORT_MANAGER 수신자 옵션 확인용 — DB 변경 없음
SELECT
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_use_yn
FROM noti_policy
ORDER BY np_reg_dt DESC, np_event_cd ASC;