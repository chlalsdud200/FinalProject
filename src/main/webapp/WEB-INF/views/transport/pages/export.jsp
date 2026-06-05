<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<%
  String initialItem = request.getParameter("page");
  String initialTab = request.getParameter("tab");

  if (initialItem == null || initialItem.trim().isEmpty()) {
    if ("manifest".equals(initialTab)) {
      initialItem = "TACS-FW-011";
    } else {
      initialItem = "TACS-FW-001";
    }
  }

  request.setAttribute("transportInitialGroup", "export");
  request.setAttribute("transportInitialItem", initialItem);

  String contextPath = request.getContextPath();
%>

<!DOCTYPE html>
<html lang="ko" class="light">
<head>
  <%@ include file="/WEB-INF/views/transport/common/head.jsp" %>
<link rel="stylesheet" href="<%= contextPath %>/resources/css/transport/pages/export.css?v=20260602-dashboard-detail-link">
</head>

<body class="bg-background text-on-surface">

<%@ include file="/WEB-INF/views/transport/common/sidebar.jsp" %>
<%@ include file="/WEB-INF/views/transport/common/topbar.jsp" %>
<%@ include file="/WEB-INF/views/transport/common/main-content.jsp" %>
<%@ include file="/WEB-INF/views/transport/common/footer.jsp" %>
<%@ include file="/WEB-INF/views/transport/common/modals.jsp" %>

<script>
  window.contextPath = '<%= contextPath %>';
  window.TRANSPORT_INITIAL_VIEW = {
    group: 'export',
    item: '<%= initialItem %>'
  };
  window.TRANSPORT_EXPORT_REQUESTS = ${empty exportRequestJson ? '[]' : exportRequestJson};
  window.TRANSPORT_EXPORT_INBOUND_REQUESTS = ${empty exportInboundRequestJson ? '[]' : exportInboundRequestJson};
  window.TRANSPORT_EXPORT_RELEASE_REQUESTS = ${empty exportReleaseRequestJson ? '[]' : exportReleaseRequestJson};
  window.TRANSPORT_CSRF = {
    header: '${_csrf.headerName}',
    token: '${_csrf.token}'
  };
</script>

<script src="<%= contextPath %>/resources/js/transport/common.js?v=20260602-dashboard-detail-link"></script>
<script src="<%= contextPath %>/resources/js/transport/pages/export.js?v=20260602-dashboard-detail-link"></script>

</body>
</html>
