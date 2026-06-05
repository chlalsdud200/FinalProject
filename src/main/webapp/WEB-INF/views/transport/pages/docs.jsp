<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%
    request.setAttribute("docsRole", "TRANSPORT_MANAGER");
    if(request.getAttribute("transportInitialGroup") == null) request.setAttribute("transportInitialGroup", "docs");
    if(request.getAttribute("transportInitialItem") == null) request.setAttribute("transportInitialItem", "TACS-DC-001");
%>
<!DOCTYPE html>
<html lang="ko" class="light">
<head>
    <%@ include file="/WEB-INF/views/transport/common/head.jsp" %>
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/docs.css">
    <script>window.contextPath = '${pageContext.request.contextPath}';</script>
</head>
<body class="bg-background text-on-surface">
    <%@ include file="/WEB-INF/views/transport/common/sidebar.jsp" %>
    <%@ include file="/WEB-INF/views/transport/common/topbar.jsp" %>
    <%@ include file="/WEB-INF/views/transport/common/main-content.jsp" %>

    <%@ include file="/WEB-INF/views/transport/common/footer.jsp" %>
    <%@ include file="/WEB-INF/views/transport/common/modals.jsp" %>
    <script>
      window.TRANSPORT_INITIAL_VIEW = { group: '${transportInitialGroup}', item: '${transportInitialItem}' };
    </script>
<script src="${pageContext.request.contextPath}/resources/js/transport/common.js?v=20260601-export-single-style2"></script>
    <script src="${pageContext.request.contextPath}/resources/js/common/docs.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/common/trash.js"></script>
</body>
</html>
