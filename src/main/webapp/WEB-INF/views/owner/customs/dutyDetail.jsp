<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<%
    request.setAttribute("activeMenu", "refund");
    request.setAttribute("activeGroup", "refund");
    request.setAttribute("activeSub", "duty");
%>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <meta name="_csrf" content="${_csrf.token}">
    <meta name="_csrf_header" content="${_csrf.headerName}">
    <title>TACS 관세 납부 상세</title>

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
            <div class="page active" id="pg-duty-payment">
                <div class="page-title-row">
                    <h2>관세</h2>
                </div>

                <div id="duty-detail-view">

                    <div class="duty-detail-head">
                        <a class="btn btn-secondary duty-back-btn"
                           href="${pageContext.request.contextPath}/owner/tariff/duty/list.do">
                            <span class="material-symbols-outlined duty-back-icon">arrow_back</span>
                            목록
                        </a>

                        <div>
                            <div class="duty-detail-title">관세 납부 상세</div>
                            <div class="duty-detail-sub">관세사 청구 내역과 납부 상태를 확인합니다.</div>
                        </div>
                    </div>

                    <div class="card-section duty-detail-card">
                        <div class="duty-detail-top">
                            <div>
                                <div class="duty-detail-label">청구번호</div>
                                <div class="duty-detail-no">${charge.bcNo}</div>
                                <div class="duty-detail-desc">
                                    수입의뢰번호
                                    <c:choose>
                                        <c:when test="${not empty charge.bcIrNo}">
                                            ${charge.bcIrNo}
                                        </c:when>
                                        <c:otherwise>-</c:otherwise>
                                    </c:choose>
                                </div>
                            </div>

                            <div class="duty-detail-status">
                                <c:choose>
                                    <c:when test="${charge.bcStatusCd eq 'BC_CHARGED'}">
                                        <span class="doc-status wait">결제요청</span>
                                    </c:when>
                                    <c:when test="${charge.bcStatusCd eq 'BC_PAID'}">
                                        <span class="doc-status ok">납부완료</span>
                                    </c:when>
                                    <c:when test="${charge.bcStatusCd eq 'BC_CANCEL'}">
                                        <span class="doc-status none">취소</span>
                                    </c:when>
                                    <c:otherwise>
                                        <span class="doc-status none">
                                            <c:out value="${empty charge.bcStatusNm ? charge.bcStatusCd : charge.bcStatusNm}"/>
                                        </span>
                                    </c:otherwise>
                                </c:choose>
                            </div>
                        </div>

                        <div class="duty-summary-grid">
                            <div class="duty-summary-item">
                                <div class="duty-summary-label">화주 ID</div>
                                <div class="duty-summary-value">${charge.bcOwrId}</div>
                            </div>

                            <div class="duty-summary-item">
                                <div class="duty-summary-label">관세사</div>
                                <div class="duty-summary-value">
                                    <c:choose>
                                        <c:when test="${not empty charge.brokerNm}">
                                            ${charge.brokerNm}
                                        </c:when>
                                        <c:otherwise>
                                            ${charge.bcBrokerId}
                                        </c:otherwise>
                                    </c:choose>
                                </div>
                            </div>

                            <div class="duty-summary-item">
                                <div class="duty-summary-label">관세사무소</div>
                                <div class="duty-summary-value">
                                    <c:choose>
                                        <c:when test="${not empty charge.brokerOfficeNm}">
                                            ${charge.brokerOfficeNm}
                                        </c:when>
                                        <c:otherwise>-</c:otherwise>
                                    </c:choose>
                                </div>
                            </div>

                            <div class="duty-summary-item">
                                <div class="duty-summary-label">세금번호</div>
                                <div class="duty-summary-value">
                                    <c:choose>
                                        <c:when test="${not empty charge.bcCtNo}">
                                            ${charge.bcCtNo}
                                        </c:when>
                                        <c:otherwise>-</c:otherwise>
                                    </c:choose>
                                </div>
                            </div>

                            <div class="duty-summary-item">
                                <div class="duty-summary-label">M B/L 번호</div>
                                <div class="duty-summary-value">
                                    <c:choose>
                                        <c:when test="${not empty charge.bcMblNo}">
                                            ${charge.bcMblNo}
                                        </c:when>
                                        <c:otherwise>-</c:otherwise>
                                    </c:choose>
                                </div>
                            </div>

                            <div class="duty-summary-item">
                                <div class="duty-summary-label">H B/L 번호</div>
                                <div class="duty-summary-value">
                                    <c:choose>
                                        <c:when test="${not empty charge.bcHblNo}">
                                            ${charge.bcHblNo}
                                        </c:when>
                                        <c:otherwise>-</c:otherwise>
                                    </c:choose>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-section duty-detail-card">
                        <div class="duty-section-title">청구 금액 상세</div>

                        <div class="duty-bill-grid">
                            <div class="duty-bill-row">
                                <div class="duty-bill-label">세금합계</div>
                                <div class="duty-bill-value">
                                    <fmt:formatNumber value="${charge.bcTaxAmt}" pattern="#,##0"/>
                                </div>
                            </div>

                            <div class="duty-bill-row">
                                <div class="duty-bill-label">관세사 수수료</div>
                                <div class="duty-bill-value">
                                    <fmt:formatNumber value="${charge.bcBrokerFeeAmt}" pattern="#,##0"/>
                                </div>
                            </div>

                            <div class="duty-bill-row">
                                <div class="duty-bill-label">수수료 부가세</div>
                                <div class="duty-bill-value">
                                    <fmt:formatNumber value="${charge.bcFeeVatAmt}" pattern="#,##0"/>
                                </div>
                            </div>

                            <div class="duty-bill-row total">
                                <div class="duty-bill-label">최종 청구금액</div>
                                <div class="duty-bill-value">
                                    <fmt:formatNumber value="${charge.bcTotalAmt}" pattern="#,##0"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-section duty-detail-card">
                        <div class="duty-section-title">결제 정보</div>

                        <div class="duty-info-grid">
                            <div class="duty-info-row">
                                <div class="duty-info-label">주문명</div>
                                <div class="duty-info-value">
                                    <c:choose>
                                        <c:when test="${not empty charge.bcOrderNm}">
                                            ${charge.bcOrderNm}
                                        </c:when>
                                        <c:otherwise>-</c:otherwise>
                                    </c:choose>
                                </div>
                            </div>

                            <div class="duty-info-row">
                                <div class="duty-info-label">결제 ID</div>
                                <div class="duty-info-value">
                                    <c:choose>
                                        <c:when test="${not empty charge.bcPaymentId}">
                                            ${charge.bcPaymentId}
                                        </c:when>
                                        <c:otherwise>-</c:otherwise>
                                    </c:choose>
                                </div>
                            </div>

                            <div class="duty-info-row">
                                <div class="duty-info-label">청구일시</div>
                                <div class="duty-info-value">
                                    <c:choose>
                                        <c:when test="${not empty charge.bcChargeDt}">
                                            <fmt:formatDate value="${charge.bcChargeDt}" pattern="yyyy-MM-dd HH:mm"/>
                                        </c:when>
                                        <c:otherwise>-</c:otherwise>
                                    </c:choose>
                                </div>
                            </div>

                            <div class="duty-info-row">
                                <div class="duty-info-label">납부완료일시</div>
                                <div class="duty-info-value">
                                    <c:choose>
                                        <c:when test="${not empty charge.bcPayCmplDt}">
                                            <fmt:formatDate value="${charge.bcPayCmplDt}" pattern="yyyy-MM-dd HH:mm"/>
                                        </c:when>
                                        <c:otherwise>-</c:otherwise>
                                    </c:choose>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="duty-action-row">
                        <c:choose>
                            <c:when test="${charge.bcStatusCd eq 'BC_PAID'}">
                                <a class="btn btn-dark"
                                   href="${pageContext.request.contextPath}/owner/payment/receipt.do/BROKER_CHARGE/${charge.bcNo}">
                                    영수증 보기
                                </a>
                            </c:when>

                            <c:when test="${charge.bcStatusCd eq 'BC_CHARGED'}">
                                <button type="button"
                                        class="btn btn-dark btn-toss-pay"
                                        data-claim-no="${charge.bcNo}"
                                        data-record-ty="BROKER_CHARGE">
                                    결제하기
                                </button>
                            </c:when>

                            <c:when test="${charge.bcStatusCd eq 'BC_PAY_FAIL'}">
                                <span class="doc-status none">결제실패</span>

                                <button type="button"
                                        class="btn btn-dark btn-toss-pay"
                                        data-claim-no="${charge.bcNo}"
                                        data-record-ty="BROKER_CHARGE">
                                    재결제하기
                                </button>
                            </c:when>

                            <c:when test="${charge.bcStatusCd eq 'BC_CANCEL'}">
                                <%-- 취소 상태는 액션 버튼 없음 --%>
                            </c:when>
                        </c:choose>
                    </div>

                </div>
            </div>
        </main>

        <%@ include file="/WEB-INF/views/common/ownerModals.jsp" %>
        <%@ include file="/WEB-INF/views/common/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/ownerScripts.jsp" %>
<script src="https://js.tosspayments.com/v2/standard"></script>
<script src="${pageContext.request.contextPath}/resources/js/owner/payment.js"></script>

</body>
</html>
