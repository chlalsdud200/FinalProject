<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/broker/common/meta.jsp" %>
    <link rel="stylesheet" href="${ctx}/resources/css/broker/common.css">
    <link rel="stylesheet" href="${ctx}/resources/css/broker/pages/community.css">
    <title>자료실 | TACS</title>
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/broker/common/sidebar.jsp" %>
    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/broker/common/header.jsp" %>
        <div class="content">
            <div class="page active" id="pg-community">
                <div class="sub-page">
                    <h2><span class="material-symbols-outlined">forum</span> 커뮤니티</h2>
                    <div class="sub-tabs" id="tabs-cm">
                        <a class="sub-tab" data-community-tab="notice" href="${ctx}/broker/community/notice.do">공지사항</a>
                        <a class="sub-tab active" data-community-tab="download" href="${ctx}/broker/community/download.do">자료실</a>
                        <a class="sub-tab" data-community-tab="cs" href="${ctx}/broker/community/cs.do">고객센터</a>
                    </div>
                    <%@ include file="/WEB-INF/views/common/community/resourceArchive.jsp" %>
                </div>
            </div>
        </div>
        <%@ include file="/WEB-INF/views/broker/common/footer.jsp" %>
    </div>
</div>
<%@ include file="/WEB-INF/views/broker/common/modals.jsp" %>
<script>window.contextPath = '${ctx}';</script>
<script src="${ctx}/resources/js/broker/common.js"></script>
</body>
</html>
