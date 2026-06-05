SET DEFINE OFF;

UPDATE noti_policy
SET
    np_receiver_user_type = 'OWNER,OFFICER'
  , np_body_tpl = '의뢰번호 ${irNo} 신고서가 세관에 접수 대기 상태로 전송되었습니다.'
  , np_link_tpl = '${linkUrl}'
WHERE np_event_cd = 'DCLR_SUBMITTED';

MERGE INTO noti_policy p
USING (
    SELECT
        'ITEM_REJECTED' np_event_cd
      , '품목 반려' np_biz_nm
      , 'BROKER,OWNER' np_receiver_user_type
      , '품목이 반려되었습니다' np_title_tpl
      , '의뢰번호 ${irNo} 신고건의 ${itemSn}번 품목이 반려되었습니다.' np_body_tpl
      , '${linkUrl}' np_link_tpl
      , 'Y' np_use_yn
    FROM dual
) s
ON (p.np_event_cd = s.np_event_cd)
WHEN MATCHED THEN
    UPDATE SET
        p.np_biz_nm = s.np_biz_nm
      , p.np_receiver_user_type = s.np_receiver_user_type
      , p.np_title_tpl = s.np_title_tpl
      , p.np_body_tpl = s.np_body_tpl
      , p.np_link_tpl = s.np_link_tpl
      , p.np_use_yn = s.np_use_yn
WHEN NOT MATCHED THEN
    INSERT (
        np_event_cd
      , np_biz_nm
      , np_receiver_user_type
      , np_title_tpl
      , np_body_tpl
      , np_link_tpl
      , np_use_yn
    ) VALUES (
        s.np_event_cd
      , s.np_biz_nm
      , s.np_receiver_user_type
      , s.np_title_tpl
      , s.np_body_tpl
      , s.np_link_tpl
      , s.np_use_yn
    );

MERGE INTO noti_policy p
USING (
    SELECT
        'CSTM_DONE' np_event_cd
      , '통관 완료' np_biz_nm
      , 'OWNER,BROKER,WAREHOUSE_MANAGER' np_receiver_user_type
      , '통관이 완료되었습니다' np_title_tpl
      , '의뢰번호 ${irNo} 신고건이 최종 수리되어 통관 완료 처리되었습니다.' np_body_tpl
      , '${linkUrl}' np_link_tpl
      , 'Y' np_use_yn
    FROM dual
) s
ON (p.np_event_cd = s.np_event_cd)
WHEN MATCHED THEN
    UPDATE SET
        p.np_biz_nm = s.np_biz_nm
      , p.np_receiver_user_type = s.np_receiver_user_type
      , p.np_title_tpl = s.np_title_tpl
      , p.np_body_tpl = s.np_body_tpl
      , p.np_link_tpl = s.np_link_tpl
      , p.np_use_yn = s.np_use_yn
WHEN NOT MATCHED THEN
    INSERT (
        np_event_cd
      , np_biz_nm
      , np_receiver_user_type
      , np_title_tpl
      , np_body_tpl
      , np_link_tpl
      , np_use_yn
    ) VALUES (
        s.np_event_cd
      , s.np_biz_nm
      , s.np_receiver_user_type
      , s.np_title_tpl
      , s.np_body_tpl
      , s.np_link_tpl
      , s.np_use_yn
    );

MERGE INTO noti_policy p
USING (
    SELECT
        'TAX_PAID' np_event_cd
      , '관부가세 납부 완료' np_biz_nm
      , 'BROKER,OFFICER' np_receiver_user_type
      , '관부가세 납부가 완료되었습니다' np_title_tpl
      , '의뢰번호 ${irNo} 신고건의 관부가세 납부가 완료되었습니다.' np_body_tpl
      , '${linkUrl}' np_link_tpl
      , 'Y' np_use_yn
    FROM dual
) s
ON (p.np_event_cd = s.np_event_cd)
WHEN MATCHED THEN
    UPDATE SET
        p.np_biz_nm = s.np_biz_nm
      , p.np_receiver_user_type = s.np_receiver_user_type
      , p.np_title_tpl = s.np_title_tpl
      , p.np_body_tpl = s.np_body_tpl
      , p.np_link_tpl = s.np_link_tpl
      , p.np_use_yn = s.np_use_yn
WHEN NOT MATCHED THEN
    INSERT (
        np_event_cd
      , np_biz_nm
      , np_receiver_user_type
      , np_title_tpl
      , np_body_tpl
      , np_link_tpl
      , np_use_yn
    ) VALUES (
        s.np_event_cd
      , s.np_biz_nm
      , s.np_receiver_user_type
      , s.np_title_tpl
      , s.np_body_tpl
      , s.np_link_tpl
      , s.np_use_yn
    );

COMMIT;
