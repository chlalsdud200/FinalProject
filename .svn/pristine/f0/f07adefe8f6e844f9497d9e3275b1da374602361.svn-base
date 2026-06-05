<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<%
    request.setAttribute("activeMenu", "payment");
    request.setAttribute("activeGroup", "");
    request.setAttribute("activeSub", "");
%>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <title>TACS 결제 완료</title>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner.css">
</head>

<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/owner/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/common/header.jsp" %>

        <main class="content">
            <div class="breadcrumb">
                <span>Home</span>
                <span class="sep">›</span>
                <span>결제</span>
                <span class="sep">›</span>
                <span class="current">결제 완료</span>
            </div>

            <div class="card-section pay-result-wrap">
                <div class="card-header">
                    <h3>
                        <c:out value="${paymentTitle}" default="결제" /> 완료
                    </h3>
                </div>

                <div class="pay-result-body">
                    <div class="pay-result-icon success">
                        <span class="material-symbols-outlined">check_circle</span>
                    </div>

                    <h2 class="pay-result-title">
                        <c:out value="${paymentTitle}" default="결제" />가 완료되었습니다.
                    </h2>

                    <p class="pay-result-desc">
                        결제 승인 정보가 정상적으로 저장되었습니다.
                    </p>

                    <div class="pay-info-box">
                        <div class="pay-info-grid">
                            <div class="pay-info-label">결제구분</div>
                            <div class="pay-info-value">
                                <c:out value="${paymentTitle}" default="결제" />
                            </div>

                            <div class="pay-info-label">청구번호</div>
                            <div class="pay-info-value">
                                <c:out value="${claimNo}" default="-" />
                            </div>

                            <div class="pay-info-label">주문번호</div>
                            <div class="pay-info-value">
                                <c:out value="${payment.orderId}" default="-" />
                            </div>

                            <div class="pay-info-label">결제키</div>
                            <div class="pay-info-value break">
                                <c:out value="${payment.paymentKey}" default="-" />
                            </div>

                            <div class="pay-info-label">결제수단</div>
                            <div class="pay-info-value">
                                <c:out value="${payment.method}" default="-" />
                            </div>

                            <div class="pay-info-label">결제상태</div>
                            <div class="pay-info-value success">
                                <c:out value="${payment.status}" default="-" />
                            </div>

                            <div class="pay-info-label">결제금액</div>
                            <div class="pay-info-value strong">
                                <c:choose>
                                    <c:when test="${not empty payment.totalAmount}">
                                        <fmt:formatNumber value="${payment.totalAmount}" pattern="#,###" /> 원
                                    </c:when>
                                    <c:when test="${not empty amount}">
                                        <fmt:formatNumber value="${amount}" pattern="#,###" /> 원
                                    </c:when>
                                    <c:otherwise>
                                        -
                                    </c:otherwise>
                                </c:choose>
                            </div>

                            <div class="pay-info-label">승인일시</div>
                            <div class="pay-info-value">
                                <c:out value="${payment.approvedAt}" default="-" />
                            </div>
                        </div>
                    </div>

                    <div class="pay-action-row">
                        <a href="${pageContext.request.contextPath}${empty listUrl ? '/owner/dashboard/list.do' : listUrl}"
                           class="btn btn-primary">
                            목록으로
                        </a>

                        <button type="button"
                                class="btn btn-secondary"
                                onclick="window.print();">
                            영수증 인쇄
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <%@ include file="/WEB-INF/views/common/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/ownerScripts.jsp" %>
</body>
</html>