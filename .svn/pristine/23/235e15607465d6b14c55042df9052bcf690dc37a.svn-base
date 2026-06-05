SET DEFINE OFF;

CREATE TABLE noti_policy (
    np_event_cd            VARCHAR2(40)   NOT NULL
  , np_biz_nm              VARCHAR2(60)   NOT NULL
  , np_receiver_user_type  VARCHAR2(30)   NOT NULL
  , np_title_tpl           VARCHAR2(200)  NOT NULL
  , np_body_tpl            VARCHAR2(1000) NOT NULL
  , np_link_tpl            VARCHAR2(300)  NOT NULL
  , np_use_yn              CHAR(1)        DEFAULT 'Y' NOT NULL
  , np_reg_dt              DATE           DEFAULT SYSDATE NOT NULL
  , CONSTRAINT pk_noti_policy PRIMARY KEY (np_event_cd)
);

CREATE TABLE notification (
    noti_no            NUMBER         NOT NULL
  , noti_event_cd      VARCHAR2(40)   NOT NULL
  , noti_ref_key       VARCHAR2(60)   NOT NULL
  , noti_receiver_id   VARCHAR2(50)   NOT NULL
  , noti_sender_id     VARCHAR2(50)   NULL
  , noti_title         VARCHAR2(200)  NOT NULL
  , noti_body          VARCHAR2(1000) NOT NULL
  , noti_link_url      VARCHAR2(300)  NOT NULL
  , noti_read_yn       CHAR(1)        DEFAULT 'N' NOT NULL
  , noti_read_dt       DATE           NULL
  , noti_send_status   VARCHAR2(20)   DEFAULT 'SENT' NOT NULL
  , noti_retry_count   NUMBER         DEFAULT 0 NOT NULL
  , noti_last_error    VARCHAR2(500)  NULL
  , noti_send_dt       DATE           DEFAULT SYSDATE NOT NULL
  , CONSTRAINT pk_notification PRIMARY KEY (noti_no)
  , CONSTRAINT fk_notification_policy FOREIGN KEY (noti_event_cd) REFERENCES noti_policy (np_event_cd)
  , CONSTRAINT uk_notification_dedup UNIQUE (noti_event_cd, noti_ref_key, noti_receiver_id)
);

CREATE SEQUENCE seq_notification START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE INDEX idx_notification_inbox
    ON notification (noti_receiver_id, noti_read_yn, noti_send_dt DESC);

INSERT INTO noti_policy (
    np_event_cd
  , np_biz_nm
  , np_receiver_user_type
  , np_title_tpl
  , np_body_tpl
  , np_link_tpl
  , np_use_yn
) VALUES (
    'DCLR_SUBMITTED'
  , '수입신고 전송'
  , 'OWNER'
  , '수입신고가 전송되었습니다'
  , '의뢰번호 ${refKey} 신고서가 세관에 접수 대기 상태로 전송되었습니다.'
  , '/owner/import/detail.do/${refKey}'
  , 'Y'
);

COMMIT;
