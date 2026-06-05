<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TACS 공지사항 관리</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, sans-serif; background: #f3f6fb; color: #172033; }
        .wrap { padding: 28px; }
        .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        h1 { margin: 0; font-size: 24px; }
        .grid { display: grid; grid-template-columns: 360px 1fr; gap: 18px; align-items: start; }
        .panel { background: #fff; border: 1px solid #d8e1ef; padding: 18px; }
        .panel h2 { margin: 0 0 14px; font-size: 16px; }
        label { display: block; font-size: 12px; font-weight: 700; margin: 12px 0 6px; color: #40516c; }
        input, select, textarea { width: 100%; border: 1px solid #c7d2e3; padding: 9px 10px; font-size: 13px; font-family: inherit; background: #fff; }
        textarea { min-height: 180px; resize: vertical; line-height: 1.5; }
        .row { display: flex; gap: 8px; align-items: center; }
        .row > * { flex: 1; }
        button { border: 1px solid #46516a; background: #46516a; color: #fff; height: 34px; padding: 0 14px; font-weight: 700; cursor: pointer; }
        button.secondary { background: #fff; color: #46516a; }
        button.danger { background: #fff4f4; color: #c32626; border-color: #efb7b7; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; }
        th, td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; }
        th { background: #eef3f9; color: #40516c; }
        .badge { display: inline-block; padding: 3px 7px; font-size: 11px; font-weight: 800; }
        .badge.NOTICE { background: #dbeafe; color: #1d4ed8; }
        .badge.URGENT { background: #fee2e2; color: #b91c1c; }
        .badge.UPDATE { background: #dcfce7; color: #047857; }
        .filters { display: grid; grid-template-columns: 150px 1fr 140px 140px 80px; gap: 8px; margin-bottom: 12px; }
        .muted { color: #718096; font-size: 12px; }
        .actions { display: flex; gap: 6px; justify-content: flex-end; }
    </style>
</head>
<body>
<div class="wrap">
    <div class="head">
        <h1>공지사항 관리</h1>
        <a href="${pageContext.request.contextPath}/systemadmin/dashboard.do">관리자 홈</a>
    </div>

    <div class="grid">
        <section class="panel">
            <h2 id="form-title">공지 등록</h2>
            <input type="hidden" id="notice-no">

            <label for="notice-type">분류</label>
            <select id="notice-type">
                <option value="NOTICE">공지</option>
                <option value="URGENT">긴급</option>
                <option value="UPDATE">업데이트</option>
            </select>

            <label for="notice-title">제목</label>
            <input id="notice-title" maxlength="300" placeholder="공지 제목">

            <label for="notice-content">내용</label>
            <textarea id="notice-content" placeholder="공지 내용"></textarea>

            <div class="row" style="margin-top:14px">
                <button type="button" onclick="saveNotice()">저장</button>
                <button type="button" class="secondary" onclick="resetNoticeForm()">초기화</button>
            </div>
        </section>

        <section class="panel">
            <h2>공지 목록</h2>
            <div class="filters">
                <select id="admin-notice-type">
                    <option value="all">전체 분류</option>
                    <option value="NOTICE">공지</option>
                    <option value="URGENT">긴급</option>
                    <option value="UPDATE">업데이트</option>
                </select>
                <input id="admin-notice-keyword" placeholder="제목 또는 내용 검색">
                <input id="admin-notice-from" type="date">
                <input id="admin-notice-to" type="date">
                <button type="button" onclick="loadAdminNotices()">조회</button>
            </div>
            <table>
                <thead>
                <tr>
                    <th style="width:70px">NO</th>
                    <th style="width:90px">분류</th>
                    <th>제목</th>
                    <th style="width:110px">등록일</th>
                    <th style="width:80px">조회수</th>
                    <th style="width:150px">관리</th>
                </tr>
                </thead>
                <tbody id="admin-notice-body"></tbody>
            </table>
            <div class="muted" id="admin-notice-count" style="margin-top:10px"></div>
        </section>
    </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/common/notice-admin.js"></script>
</body>
</html>
