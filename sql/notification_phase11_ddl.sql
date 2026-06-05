SET DEFINE OFF;

-- 11차 정책 1건
-- 도착통지서 발송완료 시 화주에게 통지하는 알림. 기존엔 정책도 트리거도 없어
-- 운송담당자의 도착통지서 발송이 화주에게 전달되지 않았다.
-- (나머지 _REQUESTED/DO_READY/TAX_CHARGED 정책은 운영 DB에 이미 등록되어 있음)

-- 도착통지서 발송완료 → 화주 (refKey: TRC-)
INSERT INTO noti_policy (
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_body_tpl
  , np_link_tpl
  , np_use_yn
) VALUES (
    'ARRIVAL_NOTICE_SENT'
  , '도착통지서 발송'
  , 'OWNER'
  , '도착통지서가 발송되었습니다'
  , '운송의뢰 ${trcNo} 의 도착통지서가 발송되었습니다.'
  , '${linkUrl}'
  , 'Y'
);

COMMIT;
