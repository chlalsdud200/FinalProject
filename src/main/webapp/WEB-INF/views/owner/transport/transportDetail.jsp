<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<%
    request.setAttribute("activeMenu", "transport");
    request.setAttribute("activeGroup", "transport");

    String activeSub = (String) request.getAttribute("activeSub");
    if (activeSub == null) activeSub = "export-trans";
    request.setAttribute("activeSub", activeSub);
%>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <title>TACS 운송 상세</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet">

    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner.css">
</head>

<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/owner/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/common/header.jsp" %>

        <main class="content">
            <div class="page active" id="pg-transport">

                <div class="page-title-row">
                    <h2>
                        <c:choose>
                            <c:when test="${detail.trcSeCd eq 'EXP'}">수출 운송 상세</c:when>
                            <c:when test="${detail.trcSeCd eq 'IMP'}">수입 운송 상세</c:when>
                            <c:otherwise>운송 상세</c:otherwise>
                        </c:choose>
                    </h2>
                </div>

                <%@ include file="/WEB-INF/views/owner/transport/fragments/transportTabs.jsp" %>

                <div class="transport-detail-head">
                    <a class="btn btn-outline transport-detail-back"
                       href="${pageContext.request.contextPath}${returnUrl}">
                        <span class="material-symbols-outlined">arrow_back</span>
                        목록으로
                    </a>

                    <h3 class="transport-detail-title">
                        <c:choose>
                            <c:when test="${detail.trcSeCd eq 'EXP'}">수출 운송의뢰 상세</c:when>
                            <c:when test="${detail.trcSeCd eq 'IMP'}">수입 운송의뢰 상세</c:when>
                            <c:otherwise>운송의뢰 상세</c:otherwise>
                        </c:choose>
                    </h3>
                </div>

                <div class="card-section transport-summary-card">
                    <div class="transport-summary-top">
                        <div>
                            <div class="transport-summary-label">운송 의뢰번호</div>

                            <div class="transport-summary-no">
                                <c:out value="${detail.trcNo}" default="-"/>
                            </div>

                            <div class="transport-summary-desc">
                                <c:choose>
                                    <c:when test="${detail.trcSeCd eq 'EXP'}">
                                        수출 운송의뢰 · 선적/B/L 발급 진행 정보를 확인합니다.
                                    </c:when>
                                    <c:when test="${detail.trcSeCd eq 'IMP'}">
                                        수입 운송의뢰 · B/L 제출/D/O/반출 진행 정보를 확인합니다.
                                    </c:when>
                                    <c:otherwise>
                                        운송업체 · 운송구간 · 진행 정보를 확인합니다.
                                    </c:otherwise>
                                </c:choose>
                            </div>
                        </div>

                        <span class="badge badge-ok">
                            <c:out value="${detail.trcStatusNm}" default="운송중"/>
                        </span>
                    </div>

                    <div class="transport-summary-grid">
                        <div class="transport-summary-item">
                            <div class="transport-summary-item-label">운송 구간</div>
                            <div class="transport-summary-item-value">
                                <c:out value="${detail.deptPortNm}" default="-"/>
                                →
                                <c:out value="${detail.arvlPortNm}" default="-"/>
                            </div>
                        </div>

                        <div class="transport-summary-item">
                            <div class="transport-summary-item-label">운송업체</div>
                            <div class="transport-summary-item-value">
                                <c:out value="${detail.tmCpNm}" default="-"/>
                                <c:if test="${not empty detail.tmName}">
                                    / <c:out value="${detail.tmName}"/>
                                </c:if>
                            </div>
                        </div>

                        <div class="transport-summary-item">
                            <div class="transport-summary-item-label">
                                <c:choose>
                                    <c:when test="${detail.trcSeCd eq 'EXP'}">선적 예정일</c:when>
                                    <c:otherwise>도착 예정일</c:otherwise>
                                </c:choose>
                            </div>
                            <div class="transport-summary-item-value">
                                <c:choose>
                                    <c:when test="${detail.trcSeCd eq 'IMP' and not empty detail.etaDt}">
                                        <fmt:formatDate value="${detail.etaDt}" pattern="yyyy-MM-dd"/>
                                    </c:when>
                                    <c:otherwise>
                                        <fmt:formatDate value="${detail.trcRqstDt}" pattern="yyyy-MM-dd"/>
                                    </c:otherwise>
                                </c:choose>
                            </div>
                        </div>

                        <div class="transport-summary-item">
                            <div class="transport-summary-item-label">의뢰 수락일</div>
                            <div class="transport-summary-item-value">
                                <c:choose>
                                    <c:when test="${not empty detail.trcRceptDt}">
                                        <fmt:formatDate value="${detail.trcRceptDt}" pattern="yyyy-MM-dd"/>
                                    </c:when>
                                    <c:otherwise>-</c:otherwise>
                                </c:choose>
                            </div>
                        </div>
                    </div>

                    <div class="transport-request-box">
                        <div class="transport-request-label">요청사항</div>
                        <div class="transport-request-content">
                            <c:out value="${detail.trcRqstCn}" default="등록된 요청사항이 없습니다."/>
                        </div>
                    </div>
                </div>

                <c:choose>
                    <c:when test="${detail.trcSeCd eq 'EXPORT'}">
                        <%@ include file="/WEB-INF/views/owner/transport/fragments/exportTransportDetail.jsp" %>
                    </c:when>

                    <c:when test="${detail.trcSeCd eq 'IMPORT'}">
                        <%@ include file="/WEB-INF/views/owner/transport/fragments/importTransportDetail.jsp" %>
                    </c:when>

                    <c:otherwise>
                        <div class="card-section transport-process-card">
                            <div class="transport-process-title">
                                운송 구분값을 확인할 수 없습니다.
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