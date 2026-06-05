<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
  String initialItem = request.getParameter("page");
  String initialTab = request.getParameter("tab");
  String initialTrcNo = request.getParameter("trcNo");

  if (initialItem == null || initialItem.trim().isEmpty()) {
    if (initialTrcNo != null && !initialTrcNo.trim().isEmpty()) {
      initialItem = "TACS-FW-016";
    } else if (initialTab != null) {
      String tab = initialTab.trim().toLowerCase();
      if ("detail".equals(tab)) {
        initialItem = "TACS-FW-016";
      } else if ("request".equals(tab)) {
        initialItem = "TACS-FW-015";
      } else if ("arrival".equals(tab)) {
        initialItem = "TACS-FW-020";
      } else if ("manifest".equals(tab)) {
        initialItem = "TACS-FW-023";
      } else if ("inbound".equals(tab)) {
        initialItem = "TACS-FW-025";
      } else if ("do".equals(tab)) {
        initialItem = "TACS-FW-030";
      } else if ("release".equals(tab)) {
        initialItem = "TACS-FW-033";
      } else if ("inland".equals(tab)) {
        initialItem = "TACS-FW-035";
      }
    }
  }

  if (initialItem == null || initialItem.trim().isEmpty()) initialItem = "TACS-FW-015";

  request.setAttribute("transportInitialGroup", "import");
  request.setAttribute("transportInitialItem", initialItem);
%>
<!DOCTYPE html>
<html lang="ko" class="light">
<head>
  <%@ include file="/WEB-INF/views/transport/common/head.jsp" %>
  <meta name="_csrf" content="${_csrf.token}">
  <meta name="_csrf_header" content="${_csrf.headerName}">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/transport/pages/import.css?v=20260601-import-detail-refresh-restore">
</head>

<body class="bg-background text-on-surface">
<%@ include file="/WEB-INF/views/transport/common/sidebar.jsp" %>
<%@ include file="/WEB-INF/views/transport/common/topbar.jsp" %>
<%@ include file="/WEB-INF/views/transport/common/main-content.jsp" %>
<%@ include file="/WEB-INF/views/transport/common/footer.jsp" %>
<%@ include file="/WEB-INF/views/transport/common/modals.jsp" %>

<script>
  window.TRANSPORT_INITIAL_VIEW = { group: 'import', item: '<%= initialItem %>' };
  window.TRANSPORT_CSRF = { token: '${_csrf.token}', header: '${_csrf.headerName}' };
  window.TRANSPORT_IMPORT_REQUESTS = ${empty importRequestJson ? '[]' : importRequestJson};
  window.TRANSPORT_IMPORT_ARRIVAL_TRACKING = ${empty importArrivalTrackingJson ? '[]' : importArrivalTrackingJson};
  window.TRANSPORT_IMPORT_WAREHOUSE_IN_LIST = ${empty importUnloadingInJson ? '[]' : importUnloadingInJson};
  window.TRANSPORT_IMPORT_INBOUND_LIST = window.TRANSPORT_IMPORT_WAREHOUSE_IN_LIST;
  window.TRANSPORT_IMPORT_DO_LIST = ${empty importDoJson ? '[]' : importDoJson};
  window.TRANSPORT_IMPORT_RELEASE_LIST = ${empty importReleaseJson ? '[]' : importReleaseJson};
  window.IMPORT_RELEASE_LIST = window.TRANSPORT_IMPORT_RELEASE_LIST;
  window.TRANSPORT_IMPORT_INLAND_DISPATCH_LIST = ${empty importInlandDispatchJson ? '[]' : importInlandDispatchJson};
  window.TRANSPORT_IMPORT_INLAND_CAR_LIST = ${empty importInlandCarJson ? '[]' : importInlandCarJson};
  // import-main.js가 split JS를 순서대로 전부 로드한 뒤 1번만 boot합니다.
  window.TRANSPORT_DEFER_PAGE_BOOT = true;
</script>
<script src="${pageContext.request.contextPath}/resources/js/transport/common.js?v=20260601-import-detail-refresh-restore"></script>
<script src="${pageContext.request.contextPath}/resources/js/transport/pages/import-main.js?v=20260604-inland-car-options"></script>
<script>
  // 알림 딥링크: URL에 ?trcNo=&work= 가 있으면 해당 운송의뢰 상세(프로세스)를 그 작업탭으로 연다.
  // 페이지 부팅(import-main.js split 로드)이 끝나 renderImportRequestDetailPage가 준비될 때까지 폴링.
  (function () {
    try {
      var params = new URLSearchParams(window.location.search);
      var trcNo = params.get('trcNo');
      if (!trcNo) return;
      var work = params.get('work') || params.get('workId') || 'request';
      var tries = 0;
      (function tryOpen() {
        var ready = (window.TRANSPORT_PAGE_READY || {}).import === true
                 && typeof window.renderImportRequestDetailPage === 'function';
        if (ready) {
          window.renderImportRequestDetailPage({ type: 'request-detail', trcNo: trcNo, workId: work });
          return;
        }
        if (tries++ < 60) setTimeout(tryOpen, 150);
      })();
    } catch (e) {}
  })();
</script>
</body>
</html>
