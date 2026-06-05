<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/fieldofficer/common/taglibs.jsp" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="activeMenu" value="community" />
<c:set var="activeSub" value="${empty param.tab ? 'notice' : param.tab}" />

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/fieldofficer/header/head.jsp" %>
    <link rel="stylesheet" href="${ctx}/resources/css/fieldofficer/community.css">
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/fieldofficer/header/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/fieldofficer/header/header.jsp" %>

        <div class="content">
<div class="page active" id="pg-community">
<div class="breadcrumb"><span onclick="go('dash')">Home</span><span class="sep">›</span><span>커뮤니티</span></div>
<div class="sub-page">
<h2><span class="material-symbols-outlined">forum</span> 커뮤니티</h2>
<div class="sub-tabs" id="tabs-cm">
<button class="sub-tab active" data-community-tab="notice" onclick="switchFieldCommunityTab('notice', this)">공지사항</button>
<button class="sub-tab" data-community-tab="archive" onclick="switchFieldCommunityTab('archive', this)">자료실</button>
<button class="sub-tab" data-community-tab="center" onclick="switchFieldCommunityTab('center', this)">고객센터</button>
</div>
<!-- 공지사항 -->
<div id="cm-notice">
<div class="alert-bar info"><span class="material-symbols-outlined" style="font-size:18px">campaign</span> TACS 시스템 공지사항 및 관세청 주요 안내를 확인하세요.</div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
<div style="font-size:12px;color:#697d8f">총 <strong>8</strong>건</div>
<select id="notice-type-filter" onchange="renderNoticeList()" style="height:30px;border:1px solid #cbd5e1;background:#fff;font-size:12px;color:#334155;padding:0 8px;margin-left:auto;margin-right:8px">
<option value="all">전체 분류</option>
<option value="URGENT">긴급</option>
<option value="UPDATE">업데이트</option>
<option value="NOTICE">공지</option>
</select>
<div class="search-wrap" style="position:relative">
<span class="material-symbols-outlined" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);font-size:16px;color:#697d8f">search</span>
<input placeholder="공지사항 검색..." style="width:220px;padding:6px 10px 6px 30px;border:1px solid #cbd5e1;font-size:12px;background:#fff"/>
</div>
</div>
<table class="data-table">
<thead><tr><th style="width:50px">NO</th><th>제목</th><th style="width:80px">작성자</th><th style="width:140px">등록일시</th><th style="width:70px">조회수</th></tr></thead>
<tbody id="notice-table-body"></tbody>
</table>
<!-- 공지사항 상세 보기 -->
<div id="notice-detail-view" style="display:none">
<div class="notice-detail">
<button class="btn btn-outline" onclick="closeNoticeDetail()" style="margin-bottom:16px;font-size:12px"><span class="material-symbols-outlined" style="font-size:14px">arrow_back</span> 목록으로</button>
<div class="nd-header">
<div class="nd-title">
<span class="badge badge-urgent" id="nd-badge">긴급</span>
<span id="nd-title-text">[긴급] 2026년 4월 관세율표 개정 안내</span>
</div>
<div class="nd-meta">
<div>작성자: <span id="nd-author">관리자</span></div>
<div>등록일시: <span id="nd-date">2026-04-15 09:00</span></div>
<div>조회수: <span id="nd-views">342</span></div>
</div>
</div>
<div class="nd-body" id="nd-body">
<!-- 동적으로 내용 삽입 -->
</div>
<div class="nd-attach" id="nd-attach">
<h5><span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle">attach_file</span> 첨부파일</h5>
<div id="nd-attach-list">
<!-- 동적으로 첨부파일 삽입 -->
</div>
</div>
<div class="nd-nav">
<div class="nd-prev-next">
<span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle">arrow_upward</span>
              이전글: <a data-idx="" id="nd-prev" onclick="openNoticeByIdx(this.dataset.idx)">—</a>
</div>
<div>
<button class="btn btn-outline" onclick="closeNoticeDetail()">목록</button>
</div>
<div class="nd-prev-next">
<span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle">arrow_downward</span>
              다음글: <a data-idx="" id="nd-next" onclick="openNoticeByIdx(this.dataset.idx)">—</a>
</div>
</div>
</div>
</div>

</div>
<!-- 고객센터 -->
<div id="cm-cs" style="display:none">
<%@ include file="/WEB-INF/views/common/community/faq.jsp" %>
</div>
<!-- 자료실 -->
<div id="cm-download" style="display:none">
<%@ include file="/WEB-INF/views/common/community/resourceArchive.jsp" %>
</div>
</div>
</div>
        </div>

        <%@ include file="/WEB-INF/views/fieldofficer/footer/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/fieldofficer/footer/modals.jsp" %>
<%@ include file="/WEB-INF/views/fieldofficer/footer/scripts.jsp" %>
<script src="${ctx}/resources/js/fieldofficer/common.js"></script>
<script src="${ctx}/resources/js/fieldofficer/community.js"></script>
<script src="${ctx}/resources/js/common/notice.js"></script>
<script src="${ctx}/resources/js/common/faq.js"></script>
</body>
</html>