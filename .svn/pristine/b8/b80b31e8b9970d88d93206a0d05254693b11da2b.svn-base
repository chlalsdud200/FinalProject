SET DEFINE OFF;

UPDATE noti_policy
SET
    np_body_tpl = '의뢰번호 ${irNo} 신고서가 세관에 접수 대기 상태로 전송되었습니다.'
  , np_link_tpl = '/owner/import/detail.do/${irNo}'
WHERE np_event_cd = 'DCLR_SUBMITTED';

INSERT INTO noti_policy (
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_body_tpl
  , np_link_tpl
  , np_use_yn
) VALUES (
    'ITEM_SUPP_REQUESTED'
  , '품목 보완요청'
  , 'BROKER'
  , '품목 보완요청이 도착했습니다'
  , '의뢰번호 ${irNo} 신고건의 ${itemSn}번 품목에 대해 보완요청이 접수되었습니다.'
  , '/broker/status/detail.do?idIrNo=${irNo}'
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
    'ITEM_SUPP_SUBMITTED'
  , '품목 보완제출'
  , 'OFFICER'
  , '품목 보완 제출이 도착했습니다'
  , '의뢰번호 ${irNo} 신고건의 ${itemSn}번 품목 보완자료가 제출되었습니다.'
  , '/officer/basicScreenDetail.do?reqNo=${irNo}&mode=edit'
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
    'ITEM_ACCEPTED'
  , '품목 수리(승인)'
  , 'BROKER'
  , '품목이 수리되었습니다'
  , '의뢰번호 ${irNo} 신고건의 ${itemSn}번 품목이 수리(승인) 처리되었습니다.'
  , '/broker/status/detail.do?idIrNo=${irNo}'
  , 'Y'
);

COMMIT;
