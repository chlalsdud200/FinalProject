<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<%
    request.setAttribute("activeMenu", "arrivalNotice");
    request.setAttribute("activeGroup", "");
    request.setAttribute("activeSub", "");
%>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <title>TACS 도착통지서 상세</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet">

    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner/arrivalNotice.css">
</head>

<body>
<div class="app" id="app">

    <%@ include file="/WEB-INF/views/owner/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/common/header.jsp" %>

        <main class="content">
            <div class="page active" id="pg-arrival-notice-detail">

                <div class="page-title-row">
                    <h2>도착통지서 상세</h2>

                    <a class="arrival-detail-btn"
                       href="${pageContext.request.contextPath}/owner/arrival-notice/list.do">
                        목록으로
                    </a>
                </div>

                <div class="alert-bar info arrival-alert">
                    <span class="material-symbols-outlined">description</span>
                    운송업체가 발송한 도착통지서 상세 정보를 조회합니다.
                </div>

                <c:choose>
                    <c:when test="${empty arrival}">
                        <div class="card-section arrival-card">
                            <div class="card-header">
                                <h3>조회 결과 없음</h3>
                            </div>
                            <div class="arrival-detail-body">
                                <div class="arrival-empty">
                                    도착통지서를 찾을 수 없거나 조회 권한이 없습니다.
                                </div>
                            </div>
                        </div>
                    </c:when>

                    <c:otherwise>
                        <div class="card-section arrival-card">
                            <div class="card-header">
                                <h3>기본 정보</h3>
                            </div>

                            <div class="arrival-detail-body">
                                <div class="arrival-detail-grid">
                                    <div class="arrival-detail-label">도착통지서번호</div>
                                    <div class="arrival-detail-value">
                                        <c:out value="${arrival.ianNo}"/>
                                    </div>

                                    <div class="arrival-detail-label">운송의뢰번호</div>
                                    <div class="arrival-detail-value">
                                        <c:out value="${arrival.ianTrcNo}" default="-"/>
                                    </div>

                                    <div class="arrival-detail-label">화주아이디</div>
                                    <div class="arrival-detail-value">
                                        <c:out value="${arrival.ianOwrId}" default="-"/>
                                    </div>

                                    <div class="arrival-detail-label">현재위치</div>
                                    <div class="arrival-detail-value">
                                        <c:out value="${arrival.ianCurrLoc}" default="-"/>
                                    </div>

                                    <div class="arrival-detail-label">도착예정일</div>
                                    <div class="arrival-detail-value">
                                        <c:choose>
                                            <c:when test="${not empty arrival.ianArrvDt}">
                                                <fmt:formatDate value="${arrival.ianArrvDt}" pattern="yyyy-MM-dd"/>
                                            </c:when>
                                            <c:otherwise>-</c:otherwise>
                                        </c:choose>
                                    </div>

                                    <div class="arrival-detail-label">발송일시</div>
                                    <div class="arrival-detail-value">
                                        <c:choose>
                                            <c:when test="${not empty arrival.ianSendDt}">
                                                <fmt:formatDate value="${arrival.ianSendDt}" pattern="yyyy-MM-dd HH:mm"/>
                                            </c:when>
                                            <c:otherwise>-</c:otherwise>
                                        </c:choose>
                                    </div>

                                    <div class="arrival-detail-label">등록일시</div>
                                    <div class="arrival-detail-value">
                                        <c:choose>
                                            <c:when test="${not empty arrival.ianRegistDt}">
                                                <fmt:formatDate value="${arrival.ianRegistDt}" pattern="yyyy-MM-dd HH:mm"/>
                                            </c:when>
                                            <c:otherwise>-</c:otherwise>
                                        </c:choose>
                                    </div>

                                    <div class="arrival-detail-label">발송상태</div>
                                    <div class="arrival-detail-value">
                                        <c:choose>
                                            <c:when test="${arrival.arrvStatusNm eq 'TRC_NTC_NSENT'}">
                                                <span class="arrival-status wait">
                                                    발송대기
                                                </span>
                                            </c:when>

                                            <c:when test="${arrival.arrvStatusNm eq 'TRC_NTC_SENT'}">
                                                <span class="arrival-status sent">
                                                    수신완료
                                            </c:when>

                                            <c:otherwise>
                                                <span class="arrival-status default">
                                                    <c:out value="${arrival.arrvStatusNm}" default="-"/>
                                                </span>
                                            </c:otherwise>
                                        </c:choose>
                                    </div>
                                </div>

                                <div class="arrival-detail-actions">
                                    <a class="arrival-detail-btn"
                                       href="${pageContext.request.contextPath}/owner/arrival-notice/list.do">
                                        목록으로
                                    </a>
                                </div>
                            </div>
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>
        </main>

        <%@ include file="/WEB-INF/views/common/ownerModals.jsp" %>
        <%@ include file="/WEB-INF/views/common/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/ownerScripts.jsp" %>

</body>
</html>
