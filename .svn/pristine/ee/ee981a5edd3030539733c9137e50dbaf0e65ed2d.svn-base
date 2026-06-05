SET DEFINE OFF;

INSERT INTO noti_policy (
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_body_tpl
  , np_link_tpl
  , np_use_yn
) VALUES (
    'CSTM_SUPP_SUBMITTED'
  , '업무처리 보완제출'
  , 'OFFICER'
  , '업무처리 보완 제출이 도착했습니다'
  , '신고건 ${irNo} 에 대한 업무처리 보완 자료/답변이 제출되었습니다.'
  , '/officer/basicScreenDetail.do?reqNo=${irNo}&mode=edit'
  , 'Y'
);

COMMIT;