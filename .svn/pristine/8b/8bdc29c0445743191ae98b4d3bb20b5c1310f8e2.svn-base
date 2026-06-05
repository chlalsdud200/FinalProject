<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/fieldofficer/common/taglibs.jsp" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="activeMenu" value="docs" />
<c:if test="${empty activeSub}">
    <c:set var="activeSub" value="myDocs" />
</c:if>

<c:set var="docsActorId" value="${empty officer.officerId ? 'quarantine01' : officer.officerId}" scope="request" />
<c:set var="docsActorType" value="OFFICER" scope="request" />
<c:set var="docsBizType" value="QRTN" scope="request" />
<c:set var="docsRole" value="OFFICER" scope="request" />

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/fieldofficer/header/head.jsp" %>
    <meta name="ctx-path" content="${ctx}">
    <meta name="_csrf" content="${_csrf.token}">
    <meta name="_csrf_header" content="${_csrf.headerName}">
    <link rel="stylesheet" href="${ctx}/resources/css/common/docs.css">
    <script>window.contextPath = '${ctx}';</script>
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/fieldofficer/header/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/fieldofficer/header/header.jsp" %>

        <div class="content">
            <c:choose>
                <c:when test="${activeSub eq 'trash'}">
                    <jsp:include page="/WEB-INF/views/common/trashContent.jsp" />
                </c:when>
                <c:otherwise>
                    <jsp:include page="/WEB-INF/views/common/docsContent.jsp" />
                </c:otherwise>
            </c:choose>
        </div>

        <%@ include file="/WEB-INF/views/fieldofficer/footer/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/fieldofficer/footer/modals.jsp" %>
<%@ include file="/WEB-INF/views/fieldofficer/footer/scripts.jsp" %>
<script src="${ctx}/resources/js/common/docs.js"></script>
</body>
</html>
