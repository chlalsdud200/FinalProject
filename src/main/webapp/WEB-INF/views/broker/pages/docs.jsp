<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<%
    request.setAttribute("docsRole", "BROKER");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/broker/common/meta.jsp" %>
    <meta name="ctx-path" content="${ctx}">
    <meta name="_csrf" content="${_csrf.token}">
    <meta name="_csrf_header" content="${_csrf.headerName}">
    <link rel="stylesheet" href="${ctx}/resources/css/broker/common.css">
    <link rel="stylesheet" href="${ctx}/resources/css/common/docs.css">
    <title>&#47928;&#49436;&#54632; | TACS</title>
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/broker/common/sidebar.jsp" %>
    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/broker/common/header.jsp" %>
        <main class="content">
          <c:choose>
            <c:when test="${activeSub eq 'trash'}">
              <jsp:include page="/WEB-INF/views/common/trashContent.jsp" />
            </c:when>
            <c:otherwise>
              <jsp:include page="/WEB-INF/views/common/docsContent.jsp" />
            </c:otherwise>
          </c:choose>
        </main>
        <%@ include file="/WEB-INF/views/broker/common/footer.jsp" %>
    </div>
</div>
<%@ include file="/WEB-INF/views/broker/common/modals.jsp" %>
<script>window.contextPath = '${ctx}';</script>
<script src="${ctx}/resources/js/broker/common.js"></script>
<script src="${ctx}/resources/js/common/docs.js"></script>
</body>
</html>
