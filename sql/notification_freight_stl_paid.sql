SET DEFINE OFF;

-- 화주가 운임 정산금을 결제 완료 → 운임정산을 요청한 운송담당자에게 알림
INSERT INTO noti_policy (
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_body_tpl
  , np_link_tpl
  , np_use_yn
) VALUES (
    'FREIGHT_STL_PAID'
  , '운임 정산완료'
  , 'TRANSPORT_MANAGER'
  , '운임 정산이 완료되었습니다'
  , '운송의뢰 ${trcNo} 의 운임 정산금이 화주로부터 납부 완료되었습니다.'
  , '${linkUrl}'
  , 'Y'
);

COMMIT;
