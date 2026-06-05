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
    <title>TACS 관세 납부</title>

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

                <div id="duty-list-view">

                    <form method="get"
                          action="${pageContext.request.contextPath}/owner/tariff/duty/list.do"
                          class="filter-bar duty-list-filter">
                        <input type="hidden" name="page" value="1">

                        <div class="search-wrap duty-search-wrap">
                            <span class="material-symbols-outlined">search</span>
                            <input name="keyword"
                                   value="${searchDTO.keyword}"
                                   class="duty-search-input"
                                   placeholder="청구번호, 수입의뢰번호, 관세사명 검색"/>
                        </div>

                        <select name="statusCd" class="duty-filter-select">
                            <option value="">전체 상태</option>
                            <option value="BC_CHARGED" ${searchDTO.statusCd eq 'BC_CHARGED' ? 'selected' : ''}>결제요청</option>
                            <option value="BC_PAID" ${searchDTO.statusCd eq 'BC_PAID' ? 'selected' : ''}>납부완료</option>
                            <option value="BC_CANCEL" ${searchDTO.statusCd eq 'BC_CANCEL' ? 'selected' : ''}>취소</option>
                        </select>

                        <select name="dateType" class="duty-filter-select">
                            <option value="CHARGE" ${empty searchDTO.dateType or searchDTO.dateType eq 'CHARGE' ? 'selected' : ''}>청구일</option>
                            <option value="PAY_REQ" ${searchDTO.dateType eq 'PAY_REQ' ? 'selected' : ''}>결제요청일</option>
                            <option value="PAY_CMPL" ${searchDTO.dateType eq 'PAY_CMPL' ? 'selected' : ''}>납부완료일</option>
                        </select>

                        <input name="startDate"
                               value="${searchDTO.startDate}"
                               class="duty-date-input"
                               type="date"/>

                        <span class="duty-date-sep">~</span>

                        <input name="endDate"
                               value="${searchDTO.endDate}"
                               class="duty-date-input"
                               type="date"/>

                        <button class="btn btn-dark" type="submit">조회</button>
                    </form>

                    <div class="duty-list-title">관세 납부 목록</div>

                    <div class="card-section">
                        <table class="data-table">
                            <thead>
                            <tr>
                                <th>청구번호</th>
                                <th>수입의뢰번호</th>
                                <th>관세사</th>
                                <th>세금합계</th>
                                <th>수수료</th>
                                <th>부가세</th>
                                <th>최종청구금액</th>
                                <th>청구일</th>
                                <th>상태</th>
                                <th class="duty-manage-col">관리</th>
                            </tr>
                            </thead>

                            <tbody>
                            <c:choose>
                                <c:when test="${empty chargeList}">
                                    <tr>
                                        <td colspan="10" class="duty-empty-cell">
                                            조회된 관세 납부 내역이 없습니다.
                                        </td>
                                    </tr>
                                </c:when>

                                <c:otherwise>
                                    <c:forEach var="charge" items="${chargeList}">
                                        <tr>
                                            <td class="td-id">
                                                    ${charge.bcNo}
                                            </td>

                                            <td>
                                                <c:choose>
                                                    <c:when test="${not empty charge.bcIrNo}">
                                                        <span class="duty-type-badge import">수입</span>
                                                        <strong>${charge.bcIrNo}</strong>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span class="td-muted">-</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>

                                            <td>
                                                <c:choose>
                                                    <c:when test="${not empty charge.brokerNm}">
                                                        ${charge.brokerNm}
                                                        <br>
                                                        <span class="td-muted">${charge.brokerOfficeNm}</span>
                                                    </c:when>
                                                    <c:otherwise>
                                                        ${charge.bcBrokerId}
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>

                                            <td>
                                                ₩<fmt:formatNumber value="${charge.bcTaxAmt}" pattern="#,###"/>
                                            </td>

                                            <td>
                                                ₩<fmt:formatNumber value="${charge.bcBrokerFeeAmt}" pattern="#,###"/>
                                            </td>

                                            <td>
                                                ₩<fmt:formatNumber value="${charge.bcFeeVatAmt}" pattern="#,###"/>
                                            </td>

                                            <td class="duty-amount">
                                                ₩<fmt:formatNumber value="${charge.bcTotalAmt}" pattern="#,###"/>
                                            </td>

                                            <td>
                                                <c:choose>
                                                    <c:when test="${not empty charge.bcChargeDt}">
                                                        <fmt:formatDate value="${charge.bcChargeDt}" pattern="yyyy-MM-dd"/>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span class="td-muted">-</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>

                                            <td>
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
                                            </td>

                                            <td>
                                                <div class="btn-row">
                                                    <a class="mini mini-view"
                                                       href="${pageContext.request.contextPath}/owner/tariff/duty/detail.do/${charge.bcNo}">
                                                        상세
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </c:otherwise>
                            </c:choose>
                            </tbody>
                        </table>
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