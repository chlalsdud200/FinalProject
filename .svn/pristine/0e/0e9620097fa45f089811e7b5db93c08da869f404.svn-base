<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
    request.setAttribute("activeMenu", "transport");
    request.setAttribute("activeGroup", "transport");
    request.setAttribute("activeSub", "forwarder");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <title>TACS 운송업체 상세</title>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet">

    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner/transport.css">
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/owner/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/common/header.jsp" %>

        <main class="content">
            <div class="page active" id="pg-transport">
                <div class="page-title-row">
                    <h2>운송업체 상세</h2>
                </div>

                <%@ include file="/WEB-INF/views/owner/transport/fragments/transportTabs.jsp" %>

                <div class="forwarder-detail-head">
                    <a class="btn btn-outline forwarder-back-btn"
                       href="${pageContext.request.contextPath}/owner/transport/forwarder/list.do">
                        <span class="material-symbols-outlined forwarder-back-icon">arrow_back</span>
                        목록으로
                    </a>
                    <h3 class="forwarder-detail-title">운송업체 상세</h3>
                </div>

                <div class="card-section forwarder-profile-card">
                    <div class="forwarder-profile-top">
                        <div>
                            <div class="forwarder-profile-label">운송업체</div>
                            <div class="forwarder-profile-name">${forwarder.tmCpNm}</div>
                            <div class="forwarder-profile-meta">
                                ${forwarder.tmName} · ${forwarder.tmCpTelno}
                            </div>
                        </div>

                        <c:choose>
                            <c:when test="${forwarder.tmUseYn eq 'Y'}">
                                <span class="doc-status ok">이용중</span>
                            </c:when>
                            <c:otherwise>
                                <span class="doc-status wait">이용중지</span>
                            </c:otherwise>
                        </c:choose>
                    </div>

                    <div class="forwarder-summary-grid">
                        <div class="forwarder-summary-card">
                            <div class="forwarder-summary-label">계약완료건수</div>
                            <div class="forwarder-summary-value">
                                ${forwarder.completeCount}건
                            </div>
                        </div>

                        <div class="forwarder-summary-card">
                            <div class="forwarder-summary-label">진행중계약</div>
                            <div class="forwarder-summary-value">
                                ${forwarder.activeCount}건
                            </div>
                        </div>

                        <div class="forwarder-summary-card">
                            <div class="forwarder-summary-label">등록 담당자 수</div>
                            <div class="forwarder-summary-value">
                                ${forwarder.employeeCount}명
                            </div>
                        </div>

                        <div class="forwarder-summary-card">
                            <div class="forwarder-summary-label">운송수단</div>
                            <div class="forwarder-summary-value">
                                ${forwarder.transportMethodNm}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>

        <%@ include file="/WEB-INF/views/common/ownerModals.jsp" %>
        <%@ include file="/WEB-INF/views/common/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/ownerScripts.jsp" %>

</body>
</html>