SET DEFINE OFF;

-- 관세사가 화주 납부 건을 최종 완료 처리(확인) → 세금을 부여한 행정공무원에게 알림
INSERT INTO noti_policy (
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_body_tpl
  , np_link_tpl
  , np_use_yn
) VALUES (
    'CSTM_TAX_PAID'
  , '세금납부 완료(공무원)'
  , 'OFFICER'
  , '세금납부가 완료되었습니다'
  , '신고건 ${irNo} 의 관부가세가 납부 완료되어 관세사가 통관 업무를 완료 처리했습니다.'
  , '/officer/basicScreenDetail.do?reqNo=${irNo}&mode=edit'
  , 'Y'
);

COMMIT;
