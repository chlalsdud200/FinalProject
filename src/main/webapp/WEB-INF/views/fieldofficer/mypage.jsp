<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/fieldofficer/common/taglibs.jsp" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="activeMenu" value="mypage" scope="request" />
<c:if test="${empty activeSub}"><c:set var="activeSub" value="profile" scope="request" /></c:if>
<c:if test="${empty mypageActorPath}"><c:set var="mypageActorPath" value="fieldofficer" scope="request" /></c:if>
<c:if test="${empty mypageTab}"><c:set var="mypageTab" value="profile" scope="request" /></c:if>

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/fieldofficer/header/head.jsp" %>
    <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=0700f58516db42a305d088fbd91cf300&libraries=services"></script>
    <link rel="stylesheet" href="${ctx}/resources/css/common/mypage.css">
    <link rel="stylesheet" href="${ctx}/resources/css/fieldofficer/mypage.css">
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/fieldofficer/header/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/fieldofficer/header/header.jsp" %>

        <div class="content">
            <%@ include file="/WEB-INF/views/common/mypage/mypageContent.jsp" %>
        </div>

        <%@ include file="/WEB-INF/views/fieldofficer/footer/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/fieldofficer/footer/modals.jsp" %>
<%@ include file="/WEB-INF/views/fieldofficer/footer/scripts.jsp" %>
<script src="${ctx}/resources/js/common/mypage.js"></script>
<script src="${ctx}/resources/js/fieldofficer/mypage.js"></script>
</body>
</html>
