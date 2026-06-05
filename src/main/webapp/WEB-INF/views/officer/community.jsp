<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/officer/common/taglibs.jsp" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<c:set var="ctx" value="${ctx}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  
    <%@ include file="/WEB-INF/views/officer/header/head.jsp" %>
<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="ctx-path" content="${ctx}">
  <title>TACS - 행정공무원 커뮤니티</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet">
  <link rel="stylesheet" href="${ctx}/resources/css/officer/pages/header.css">
  <link rel="stylesheet" href="${ctx}/resources/css/officer/pages/footer.css">
  <link rel="stylesheet" href="${ctx}/resources/css/officer/pages/community.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script>
    window.contextPath = '${ctx}';
    window.officerCommunityInitialTab = '${empty activeSub ? "notice" : activeSub}';
  </script>
  <script defer data-common-notice="Y" src="${ctx}/resources/js/common/notice.js"></script>
  <script defer src="${ctx}/resources/js/common/resourceArchive.js"></script>
  <script defer src="${ctx}/resources/js/common/faq.js"></script>
  <script defer src="${ctx}/resources/js/officer/officer-community.js"></script>
</head>
<body>
<%@ include file="/WEB-INF/views/officer/header/sidebar.jsp" %>
<%@ include file="/WEB-INF/views/officer/header/header.jsp" %>

<main class="officer-main officer-community-page">
  <div id="page-community" class="p-8 active">
    <div class="page-wrap">
      <div class="breadcrumb">Home &gt; 커뮤니티</div>
      <div class="content-shell">
        <div class="page-header">
          <span class="material-symbols-outlined">forum</span>
          커뮤니티
        </div>
        <div class="prog-tab-bar" id="tabs-community-admin" style="margin-bottom:24px">
          <button type="button" class="prog-tab ${activeSub eq 'notice' ? 'active' : ''}" data-officer-community-tab="notice" onclick="return switchOfficerCommunityTab('notice')">공지사항</button>
          <button type="button" class="prog-tab ${activeSub eq 'download' ? 'active' : ''}" data-officer-community-tab="download" onclick="return switchOfficerCommunityTab('download')">자료실</button>
          <button type="button" class="prog-tab ${activeSub eq 'cs' ? 'active' : ''}" data-officer-community-tab="cs" onclick="return switchOfficerCommunityTab('cs')">고객센터</button>
        </div>
        <div id="cm-notice-admin" style="display:${activeSub eq 'notice' ? 'block' : 'none'}"></div>
        <div id="cm-download-admin" style="display:${activeSub eq 'download' ? 'block' : 'none'}">
          <%@ include file="/WEB-INF/views/common/community/resourceArchive.jsp" %>
        </div>
        <div id="cm-cs-admin" style="display:${activeSub eq 'cs' ? 'block' : 'none'}">
          <%@ include file="/WEB-INF/views/common/community/faq.jsp" %>
        </div>
      </div>
      <div class="fake-footer">
        <span>© 2024 KOREA CUSTOMS SERVICE. ALL RIGHTS RESERVED. &nbsp;&nbsp; 이용약관 &nbsp;&nbsp; 개인정보처리방침</span>
        <span>정보보안 암호화 적용(AES-256)</span>
      </div>
    </div>
  </div>
</main>

<%@ include file="/WEB-INF/views/officer/footer/footer.jsp" %>

<div id="toast-container" style="position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;"></div>
    <%@ include file="/WEB-INF/views/officer/footer/scripts.jsp" %>

</body>
</html>
