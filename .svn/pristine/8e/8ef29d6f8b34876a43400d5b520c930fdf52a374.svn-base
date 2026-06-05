<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/broker/common/meta.jsp" %>
    <link rel="stylesheet" href="${ctx}/resources/css/broker/common.css">
    <link rel="stylesheet" href="${ctx}/resources/css/broker/pages/info.css">
    <title>정보조회 | TACS</title>
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/broker/common/sidebar.jsp" %>
    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/broker/common/header.jsp" %>
        <div class="content">
<%-- 정보조회 페이지 --%>
<div class="page active" id="pg-info">
  <div class="sub-page">

    <div id="info-empty" style="text-align:center;padding:60px 0;color:#a0b4c8">
      <span class="material-symbols-outlined" style="font-size:48px;display:block;margin-bottom:12px">manage_search</span>
      <p style="font-size:14px;font-weight:600;color:#697d8f">왼쪽 메뉴에서 조회할 항목을 선택해주세요.</p>
    </div>

    <div id="info-form" style="display:none">
      <div id="info-form-content"></div>
    </div>

  </div>
</div>
        </div>
        <%@ include file="/WEB-INF/views/broker/common/footer.jsp" %>
    </div>
</div>
<%@ include file="/WEB-INF/views/broker/common/modals.jsp" %>
<script>
window.contextPath = '${ctx}';
window.infoActiveType = '${activeSub}';
</script>
<script src="${ctx}/resources/js/broker/common.js"></script>
<script src="${ctx}/resources/js/broker/pages/info.js"></script>
</body>
</html>
