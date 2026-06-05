<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:if test="${empty mypageActorPath}"><c:set var="mypageActorPath" value="broker" scope="request" /></c:if>
<c:if test="${empty mypageTab}"><c:set var="mypageTab" value="profile" scope="request" /></c:if>
<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/broker/common/meta.jsp" %>
    <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=0700f58516db42a305d088fbd91cf300&libraries=services"></script>
    <link rel="stylesheet" href="${ctx}/resources/css/broker/common.css">
    <link rel="stylesheet" href="${ctx}/resources/css/common/mypage.css">
    <link rel="stylesheet" href="${ctx}/resources/css/broker/pages/mypage.css">
    <title>마이페이지 | TACS</title>
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/broker/common/sidebar.jsp" %>
    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/broker/common/header.jsp" %>
        <div class="content">
            <%@ include file="/WEB-INF/views/common/mypage/mypageContent.jsp" %>
        </div>
        <%@ include file="/WEB-INF/views/broker/common/footer.jsp" %>
    </div>
</div>
<%@ include file="/WEB-INF/views/broker/common/modals.jsp" %>
<script>window.contextPath = '${ctx}';</script>
<script src="${ctx}/resources/js/broker/common.js"></script>
<script src="${ctx}/resources/js/common/mypage.js"></script>
<script src="${ctx}/resources/js/broker/pages/mypage.js"></script>
</body>
</html>
