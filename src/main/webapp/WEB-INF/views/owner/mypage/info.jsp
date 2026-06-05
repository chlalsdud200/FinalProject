<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
    request.setAttribute("activeMenu", "mypage");
    request.setAttribute("activeGroup", "mypage");
    if (request.getAttribute("activeSub") == null) {
        request.setAttribute("activeSub", "profile");
    }
    if (request.getAttribute("mypageActorPath") == null) {
        request.setAttribute("mypageActorPath", "owner");
    }
    if (request.getAttribute("mypageTab") == null) {
        request.setAttribute("mypageTab", request.getParameter("tab") == null ? "profile" : request.getParameter("tab"));
    }
%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="ctx-path" content="${pageContext.request.contextPath}">
  <title>TACS 마이페이지</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet">
  <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
  <script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=0700f58516db42a305d088fbd91cf300&libraries=services"></script>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/mypage.css">
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/owner/sidebar.jsp" %>

  <div class="main-wrap">
    <%@ include file="/WEB-INF/views/common/header.jsp" %>

    <main class="content">
        <%@ include file="/WEB-INF/views/common/mypage/mypageContent.jsp" %>
    </main>

    <%@ include file="/WEB-INF/views/common/ownerModals.jsp" %>
    <%@ include file="/WEB-INF/views/common/footer.jsp" %>
  </div>
</div>

<%@ include file="/WEB-INF/views/common/ownerScripts.jsp" %>
<script src="${pageContext.request.contextPath}/resources/js/common/mypage.js"></script>
</body>
</html>
