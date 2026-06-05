SET DEFINE OFF;

-- 7차 정책 4건
INSERT INTO noti_policy (
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_body_tpl
  , np_link_tpl
  , np_use_yn
) VALUES (
    'WH_INBOUND_DONE'
  , '입고 완료'
  , 'TRANSPORT_MANAGER'
  , '입고가 완료되었습니다'
  , '입고의뢰 ${wirNo} 가 입고 완료 처리되었습니다.'
  , '${linkUrl}'
  , 'Y'
);

INSERT INTO noti_policy (
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_body_tpl
  , np_link_tpl
  , np_use_yn
) VALUES (
    'WH_INBOUND_SUPP_REQ'
  , '입고 보완요청'
  , 'TRANSPORT_MANAGER,OWNER'
  , '입고 보완요청이 도착했습니다'
  , '입고의뢰 ${wirNo} 에 대해 보완요청이 접수되었습니다.'
  , '${linkUrl}'
  , 'Y'
);

INSERT INTO noti_policy (
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_body_tpl
  , np_link_tpl
  , np_use_yn
) VALUES (
    'WH_OUTBOUND_DONE'
  , '반출 완료'
  , 'TRANSPORT_MANAGER'
  , '반출이 완료되었습니다'
  , '반출요청 ${crrNo} 가 반출 완료 처리되었습니다.'
  , '${linkUrl}'
  , 'Y'
);

INSERT INTO noti_policy (
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_body_tpl
  , np_link_tpl
  , np_use_yn
) VALUES (
    'WH_OUTBOUND_SUPP_REQ'
  , '반출 보완요청'
  , 'TRANSPORT_MANAGER'
  , '반출 보완요청이 도착했습니다'
  , '반출요청 ${crrNo} 에 대해 보완요청이 접수되었습니다.'
  , '${linkUrl}'
  , 'Y'
);

COMMIT;