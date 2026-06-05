<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<%
    request.setAttribute("activeMenu", "payment");
    request.setAttribute("activeGroup", "");
    request.setAttribute("activeSub", "");
%>

<c:set var="isCancel"
       value="${code eq 'USER_CANCEL'
            or code eq 'PAY_PROCESS_CANCELED'
            or code eq 'PAYMENT_CANCELED'}" />

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <title>TACS 결제 실패</title>

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
                <span class="current">
                    <c:choose>
                        <c:when test="${isCancel}">결제 취소</c:when>
                        <c:otherwise>결제 실패</c:otherwise>
                    </c:choose>
                </span>
            </div>

            <div class="card-section pay-result-wrap">
                <div class="card-header">
                    <h3>
                        <c:out value="${paymentTitle}" default="결제" />
                        <c:choose>
                            <c:when test="${isCancel}"> 취소</c:when>
                            <c:otherwise> 실패</c:otherwise>
                        </c:choose>
                    </h3>
                </div>

                <div class="pay-result-body">
                    <c:choose>
                        <c:when test="${isCancel}">
                            <div class="pay-result-icon cancel">
                                <span class="material-symbols-outlined">cancel</span>
                            </div>

                            <h2 class="pay-result-title">
                                <c:out value="${paymentTitle}" default="결제" />가 취소되었습니다.
                            </h2>

                            <p class="pay-result-desc">
                                결제 요청이 사용자에 의해 취소되었습니다.
                            </p>
                        </c:when>

                        <c:otherwise>
                            <div class="pay-result-icon fail">
                                <span class="material-symbols-outlined">error</span>
                            </div>

                            <h2 class="pay-result-title">
                                <c:out value="${paymentTitle}" default="결제" /> 처리에 실패했습니다.
                            </h2>

                            <p class="pay-result-desc">
                                결제 중 오류가 발생했습니다. 다시 시도해 주세요.
                            </p>
                        </c:otherwise>
                    </c:choose>

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
                                <c:out value="${orderId}" default="-" />
                            </div>

                            <div class="pay-info-label">처리코드</div>
                            <div class="pay-info-value ${isCancel ? 'cancel' : 'fail'}">
                                <c:out value="${code}" default="-" />
                            </div>

                            <div class="pay-info-label">메시지</div>
                            <div class="pay-info-value">
                                <c:out value="${message}" default="-" />
                            </div>

                            <div class="pay-info-label">결제금액</div>
                            <div class="pay-info-value strong">
                                <c:choose>
                                    <c:when test="${not empty amount}">
                                        <fmt:formatNumber value="${amount}" pattern="#,###" /> 원
                                    </c:when>
                                    <c:otherwise>
                                        -
                                    </c:otherwise>
                                </c:choose>
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
                                onclick="history.back();">
                            이전 화면으로
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