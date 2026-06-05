<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%
    request.setAttribute("activeMenu", "docs");
    request.setAttribute("activeGroup", "");
    if(request.getAttribute("activeSub") == null) {
        request.setAttribute("activeSub", "myDocs");
    }
    request.setAttribute("docsRole", "OWNER");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="ctx-path" content="${pageContext.request.contextPath}">
  <meta name="_csrf" content="${_csrf.token}">
  <meta name="_csrf_header" content="${_csrf.headerName}">
  <title>TACS &#47928;&#49436;&#54632;</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/docs.css">
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script>window.contextPath = '${pageContext.request.contextPath}';</script>
</head>
<body>
<div class="app" id="app">
  <%@ include file="/WEB-INF/views/owner/sidebar.jsp" %>

  <div class="main-wrap">
    <%@ include file="/WEB-INF/views/common/header.jsp" %>

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

    <%@ include file="/WEB-INF/views/common/ownerModals.jsp" %>
    <%@ include file="/WEB-INF/views/common/footer.jsp" %>
  </div>
</div>

<%@ include file="/WEB-INF/views/common/ownerScripts.jsp" %>
</body>
</html>
