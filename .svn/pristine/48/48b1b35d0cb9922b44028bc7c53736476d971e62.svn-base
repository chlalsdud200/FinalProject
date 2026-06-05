SET DEFINE OFF;

-- 10차 정책 2건
INSERT INTO noti_policy (
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_body_tpl
  , np_link_tpl
  , np_use_yn
) VALUES (
    'CSTM_REQUESTED'
  , '통관 의뢰 접수'
  , 'BROKER'
  , '신규 통관 의뢰가 접수되었습니다'
  , '의뢰번호 ${refKey} 통관 의뢰가 신규 접수되었습니다.'
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
    'TR_REQUESTED'
  , '운송 의뢰 접수'
  , 'TRANSPORT_MANAGER'
  , '신규 운송 의뢰가 접수되었습니다'
  , '운송의뢰 ${trcNo} 가 신규 접수되었습니다. 배차 진행 부탁드립니다.'
  , '${linkUrl}'
  , 'Y'
);

COMMIT;