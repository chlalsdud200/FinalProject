/*
  TACS menu permission DDL

  This script adds the minimum RBAC extension that fits the current actor login
  model. ROLE_MENU.role_cd uses the same fixed values exposed by vw_actor_login.

  ROLE and USER_ROLE tables are intentionally not created here.
*/

CREATE TABLE menu (
  menu_id        NUMBER         PRIMARY KEY,
  menu_nm        VARCHAR2(100)  NOT NULL,
  menu_url       VARCHAR2(300),
  parent_menu_id NUMBER,
  sort_order     NUMBER         DEFAULT 0 NOT NULL,
  menu_icon      VARCHAR2(100),
  use_yn         CHAR(1)        DEFAULT 'Y' NOT NULL,
  regist_dt      DATE           DEFAULT SYSDATE NOT NULL,
  CONSTRAINT fk_menu_parent
    FOREIGN KEY (parent_menu_id) REFERENCES menu(menu_id),
  CONSTRAINT ck_menu_use_yn
    CHECK (use_yn IN ('Y', 'N'))
);

CREATE TABLE role_menu (
  rm_no      NUMBER        PRIMARY KEY,
  role_cd    VARCHAR2(30)  NOT NULL,
  menu_id    NUMBER        NOT NULL,
  read_yn    CHAR(1)       DEFAULT 'Y' NOT NULL,
  write_yn   CHAR(1)       DEFAULT 'N' NOT NULL,
  delete_yn  CHAR(1)       DEFAULT 'N' NOT NULL,
  regist_dt  DATE          DEFAULT SYSDATE NOT NULL,
  CONSTRAINT fk_role_menu_menu
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id),
  CONSTRAINT uk_role_menu
    UNIQUE (role_cd, menu_id),
  CONSTRAINT ck_role_menu_read_yn
    CHECK (read_yn IN ('Y', 'N')),
  CONSTRAINT ck_role_menu_write_yn
    CHECK (write_yn IN ('Y', 'N')),
  CONSTRAINT ck_role_menu_delete_yn
    CHECK (delete_yn IN ('Y', 'N'))
);

CREATE SEQUENCE seq_menu START WITH 10000 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_role_menu START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE INDEX ix_menu_parent_sort ON menu(parent_menu_id, sort_order);
CREATE INDEX ix_menu_url ON menu(menu_url);
CREATE INDEX ix_role_menu_role ON role_menu(role_cd);

/* OWNER menu seed */
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1000, '대시보드', '/owner/dashboard/list.do', NULL, 1000, 'dashboard', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1010, '수출통관 의뢰', '/owner/export/list.do', NULL, 1010, 'upload_file', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1020, '수입통관 의뢰', '/owner/import/list.do', NULL, 1020, 'download', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1030, '운송', NULL, NULL, 1030, 'local_shipping', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1031, '운송업체계약 관리', '/owner/transport/forwarder/list.do', 1030, 1031, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1032, '운임 정산', '/owner/transport/freight/list.do', 1030, 1032, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1040, '도착통지', '/owner/arrival-notice/list.do', NULL, 1040, 'mark_email_unread', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1050, '관세', NULL, NULL, 1050, 'payments', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1051, '관세 납부', '/owner/tariff/duty/list.do', 1050, 1051, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1060, '통관고유부호', '/orders/customs/form.do', NULL, 1060, 'verified_user', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1070, '수출입신고필증 조회', '/owner/certs/list.do', NULL, 1070, 'description', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1080, '문서함', NULL, NULL, 1080, 'folder', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1081, '내문서', '/owner/docs/list.do', 1080, 1081, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1082, '휴지통', '/owner/docs/trash.do', 1080, 1082, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1090, '커뮤니티', NULL, NULL, 1090, 'forum', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1091, '공지사항', '/owner/community/notice/list.do', 1090, 1091, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1092, '자료실', '/owner/community/archive/list.do', 1090, 1092, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1093, '고객센터', '/owner/community/support/list.do', 1090, 1093, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1100, '마이페이지', NULL, NULL, 1100, 'manage_accounts', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1101, '회원정보 수정', '/owner/mypage.do?tab=profile', 1100, 1101, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1102, '알림 수신 설정', '/owner/mypage.do?tab=alarm', 1100, 1102, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (1110, '신규 의뢰 등록', '/owner/export/form.do', NULL, 1110, 'add', 'Y');

/* BROKER menu seed */
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2000, '대시보드', '/broker/dashboard.do', NULL, 2000, 'dashboard', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2010, '의뢰주 관리', '/broker/clients.do', NULL, 2010, 'group', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2020, '신고서 작성', NULL, NULL, 2020, 'edit_note', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2021, '수입신고서', '/broker/declare/imp.do', 2020, 2021, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2022, '수출신고서', '/broker/declare/exp.do', 2020, 2022, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2030, '처리현황', NULL, NULL, 2030, 'fact_check', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2031, '통합조회', '/broker/status/search.do', 2030, 2031, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2032, '세금납부관리', '/broker/status/tax.do', 2030, 2032, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2033, '신고필증 관리', '/broker/status/cert.do', 2030, 2033, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2040, '정보조회', NULL, NULL, 2040, 'search', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2041, '통관고유부호', '/broker/info/customs-code.do', 2040, 2041, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2042, '표준품명규격코드', '/broker/info/standard-name.do', 2040, 2042, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2043, '세율세번조회', '/broker/info/tariff-rate.do', 2040, 2043, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2044, '품목분류', '/broker/info/item-class.do', 2040, 2044, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2050, '검역 관리', NULL, NULL, 2050, 'health_and_safety', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2051, '검역결과조회', '/broker/quarantine/result.do', 2050, 2051, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2052, '수입검역신청', '/broker/quarantine/import.do', 2050, 2052, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2053, '수출검역신청', '/broker/quarantine/export.do', 2050, 2053, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2060, '문서함', NULL, NULL, 2060, 'folder', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2061, '내문서', '/broker/docs.do', 2060, 2061, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2062, '휴지통', '/broker/docs/trash.do', 2060, 2062, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2070, '마이페이지', NULL, NULL, 2070, 'person', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2071, '회원정보 수정', '/broker/mypage.do?tab=profile', 2070, 2071, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2072, '알림 수신 설정', '/broker/mypage.do?tab=alarm', 2070, 2072, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2080, '커뮤니티', NULL, NULL, 2080, 'forum', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2081, '공지사항', '/broker/community/notice.do', 2080, 2081, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2082, '자료실', '/broker/community/download.do', 2080, 2082, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (2083, '고객센터', '/broker/community/cs.do', 2080, 2083, NULL, 'Y');

/* OFFICER menu seed. Field officer pages are also granted to OFFICER because current auth uses role_cd only. */
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3000, '대시보드', '/officer/dashboard.do', NULL, 3000, 'dashboard', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3010, '신고 접수 및 기본심사', NULL, NULL, 3010, 'fact_check', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3011, '기본접수목록', '/officer/reportReceiptList.do', 3010, 3011, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3012, '기본심사목록', '/officer/basicScreenList.do', 3010, 3012, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3020, '이행/반출 및 화물 조회', NULL, NULL, 3020, 'inventory_2', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3021, '반출 및 이행 관리', '/officer/exportAndFulfillment.do', 3020, 3021, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3022, '적재화물목록 조회', '/officer/loadedCargoList.do', 3020, 3022, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3023, '창고/화물 조회', '/officer/warehouseCargoTracking.do', 3020, 3023, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3030, '문서함', NULL, NULL, 3030, 'folder', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3031, '내문서', '/officer/docs.do', 3030, 3031, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3032, '휴지통', '/officer/docs/trash.do', 3030, 3032, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3040, '커뮤니티', NULL, NULL, 3040, 'forum', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3041, '공지사항', '/officer/community/notice.do', 3040, 3041, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3042, '자료실', '/officer/community/archive.do', 3040, 3042, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3043, '고객센터', '/officer/community/cs.do', 3040, 3043, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3050, '마이페이지', NULL, NULL, 3050, 'account_circle', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3051, '회원정보 수정', '/officer/mypage.do?tab=profile', 3050, 3051, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3052, '알림 수신 설정', '/officer/mypage.do?tab=alarm', 3050, 3052, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3100, '현장공무원 대시보드', '/fieldofficer/dashboard.do', NULL, 3100, 'dashboard', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3110, '검사요청 조회', '/fieldofficer/inspectionRequest.do', NULL, 3110, 'inbox', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3120, '검사합격 증명서 발급', '/fieldofficer/certs.do', NULL, 3120, 'science', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3130, '현장공무원 문서함', NULL, NULL, 3130, 'folder', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3131, '내문서', '/fieldofficer/docs.do', 3130, 3131, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3132, '휴지통', '/fieldofficer/docs/trash.do', 3130, 3132, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3140, '현장공무원 커뮤니티', NULL, NULL, 3140, 'forum', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3141, '공지사항', '/fieldofficer/community.do?tab=notice', 3140, 3141, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3142, '자료실', '/fieldofficer/community.do?tab=archive', 3140, 3142, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3143, '고객센터', '/fieldofficer/community.do?tab=center', 3140, 3143, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3150, '현장공무원 마이페이지', NULL, NULL, 3150, 'account_circle', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3151, '회원정보 수정', '/fieldofficer/mypage.do?tab=profile', 3150, 3151, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (3152, '알림 수신 설정', '/fieldofficer/mypage.do?tab=alarm', 3150, 3152, NULL, 'Y');

/* TRANSPORT_MANAGER menu seed */
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4000, '대시보드', '/transport/dashboard.do', NULL, 4000, 'dashboard', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4010, '수출운송', NULL, NULL, 4010, 'local_shipping', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4011, '운송의뢰', '/transport/export.do?page=TACS-FW-001', 4010, 4011, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4012, '적하목록 작성 및 제출', '/transport/export.do?page=TACS-FW-011', 4010, 4012, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4020, '수입운송', NULL, NULL, 4020, 'inventory_2', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4021, '운송의뢰', '/transport/import.do?page=TACS-FW-015', 4020, 4021, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4022, '도착예정 및 입항추적', '/transport/import.do?page=TACS-FW-020', 4020, 4022, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4023, '적하목록 조회', '/transport/import.do?page=TACS-FW-023', 4020, 4023, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4024, '보세구역 입고관리', '/transport/import.do?page=TACS-FW-025', 4020, 4024, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4025, 'D/O 관리', '/transport/import.do?page=TACS-FW-030', 4020, 4025, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4026, '보세구역 반출관리', '/transport/import.do?page=TACS-FW-033', 4020, 4026, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4027, '내륙운송 배차처리', '/transport/import.do?page=TACS-FW-035', 4020, 4027, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4030, '문서함', NULL, NULL, 4030, 'folder', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4031, '내문서', '/transport/docs.do', 4030, 4031, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4032, '휴지통', '/transport/docs/trash.do', 4030, 4032, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4040, '커뮤니티', NULL, NULL, 4040, 'forum', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4041, '공지사항', '/transport/community.do?page=TACS-CM-001', 4040, 4041, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4042, '자료실', '/transport/community.do?page=TACS-CM-003', 4040, 4042, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4043, '고객센터', '/transport/community.do?page=TACS-CM-004', 4040, 4043, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4050, '마이페이지', NULL, NULL, 4050, 'person', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4051, '회원정보 수정', '/transport/mypage.do?tab=profile', 4050, 4051, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (4052, '알림 수신 설정', '/transport/mypage.do?tab=alarm', 4050, 4052, NULL, 'Y');

/* WAREHOUSE_MANAGER menu seed */
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5000, '대시보드', '/warehouse/dashboard.do', NULL, 5000, 'dashboard', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5010, '보세입고 처리', '/warehouse/inbound.do', NULL, 5010, 'archive', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5020, '보세재고 조회', '/warehouse/inventory.do', NULL, 5020, 'inventory_2', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5030, '보세반출 처리', '/warehouse/outbound.do', NULL, 5030, 'unarchive', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5040, '문서함', NULL, NULL, 5040, 'folder', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5041, '내문서', '/warehouse/docs.do', 5040, 5041, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5042, '휴지통', '/warehouse/docs/trash.do', 5040, 5042, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5050, '커뮤니티', NULL, NULL, 5050, 'forum', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5051, '공지사항', '/warehouse/community.do?tab=notice', 5050, 5051, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5052, '자료실', '/warehouse/community.do?tab=archive', 5050, 5052, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5053, '고객센터', '/warehouse/community.do?tab=support', 5050, 5053, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5060, '마이페이지', NULL, NULL, 5060, 'manage_accounts', 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5061, '회원정보 수정', '/warehouse/mypage.do?tab=profile', 5060, 5061, NULL, 'Y');
INSERT INTO menu(menu_id, menu_nm, menu_url, parent_menu_id, sort_order, menu_icon, use_yn)
VALUES (5062, '알림 수신 설정', '/warehouse/mypage.do?tab=alarm', 5060, 5062, NULL, 'Y');

/* Initial role permissions. Leaf menus start with read/write enabled and delete disabled. */
INSERT INTO role_menu(rm_no, role_cd, menu_id, read_yn, write_yn, delete_yn)
SELECT seq_role_menu.NEXTVAL,
       'OWNER',
       menu_id,
       'Y',
       CASE WHEN menu_url IS NULL THEN 'N' ELSE 'Y' END,
       'N'
FROM menu
WHERE menu_id BETWEEN 1000 AND 1999;

INSERT INTO role_menu(rm_no, role_cd, menu_id, read_yn, write_yn, delete_yn)
SELECT seq_role_menu.NEXTVAL,
       'BROKER',
       menu_id,
       'Y',
       CASE WHEN menu_url IS NULL THEN 'N' ELSE 'Y' END,
       'N'
FROM menu
WHERE menu_id BETWEEN 2000 AND 2999;

INSERT INTO role_menu(rm_no, role_cd, menu_id, read_yn, write_yn, delete_yn)
SELECT seq_role_menu.NEXTVAL,
       'OFFICER',
       menu_id,
       'Y',
       CASE WHEN menu_url IS NULL THEN 'N' ELSE 'Y' END,
       'N'
FROM menu
WHERE menu_id BETWEEN 3000 AND 3999;

INSERT INTO role_menu(rm_no, role_cd, menu_id, read_yn, write_yn, delete_yn)
SELECT seq_role_menu.NEXTVAL,
       'TRANSPORT_MANAGER',
       menu_id,
       'Y',
       CASE WHEN menu_url IS NULL THEN 'N' ELSE 'Y' END,
       'N'
FROM menu
WHERE menu_id BETWEEN 4000 AND 4999;

INSERT INTO role_menu(rm_no, role_cd, menu_id, read_yn, write_yn, delete_yn)
SELECT seq_role_menu.NEXTVAL,
       'WAREHOUSE_MANAGER',
       menu_id,
       'Y',
       CASE WHEN menu_url IS NULL THEN 'N' ELSE 'Y' END,
       'N'
FROM menu
WHERE menu_id BETWEEN 5000 AND 5999;

COMMIT;
