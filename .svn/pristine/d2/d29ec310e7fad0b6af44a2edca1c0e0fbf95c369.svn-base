<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<%
    request.setAttribute("activeMenu", "transport");
    request.setAttribute("activeGroup", "transport");
    request.setAttribute("activeSub", "freight");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <title>TACS 운임 정산</title>
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
                    <h2>운송</h2>
                </div>
                <%@ include file="/WEB-INF/views/owner/transport/fragments/transportTabs.jsp" %>
                <div id="trans-freight">
                    <div class="filter-bar freight-filter-bar">
                        <div class="search-wrap freight-search-wrap">
                            <span class="material-symbols-outlined">search</span>
                            <input class="freight-search-input" placeholder="청구번호 · 운송업체 · B/L 번호 검색"/>
                        </div>

                        <select class="freight-status-select">
                            <option>전체 상태</option>
                            <option>납부완료</option>
                            <option>확인 대기</option>
                            <option>청구서 검토</option>
                        </select>

                        <input class="freight-date-input" type="date"/>
                        <span class="freight-date-sep">~</span>
                        <input class="freight-date-input" type="date"/>

                        <button class="btn btn-dark">조회</button>
                    </div>

                    <div class="freight-list-title">운임 청구 / 정산 목록</div>

                    <div class="card-section">
                        <table class="data-table">
                            <thead>
                            <tr>
                                <th>정산번호</th>
                                <th>화주ID</th>
                                <th>B/L 번호</th>
                                <th>청구금액</th>
                                <th>청구일</th>
                                <th>상태</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <c:choose>
                                <c:when test="${not empty freightList}">
                                    <c:forEach var="freight" items="${freightList}">
                                        <tr>
                                            <td class="freight-invoice-no">
                                                    ${freight.tcsNo}
                                            </td>

                                            <td>
                                                    ${freight.tcsOwrId}
                                            </td>

                                            <td>
                                                <c:choose>
                                                    <c:when test="${not empty freight.tcsMblNo}">
                                                        ${freight.tcsMblNo}
                                                    </c:when>
                                                    <c:otherwise>
                                                        ${freight.tcsHblNo}
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>

                                            <td class="freight-amount">
                                                <fmt:formatNumber value="${freight.tcsTotBillAmt}" pattern="#,##0"/>
                                            </td>

                                            <td class="freight-amount">
                                                <c:choose>
                                                    <c:when test="${not empty freight.tcsDt}">
                                                        <fmt:formatDate value="${freight.tcsDt}" pattern="yy/MM/dd"/>
                                                    </c:when>
                                                    <c:otherwise>-</c:otherwise>
                                                </c:choose>
                                            </td>

                                            <td>
                                                <c:choose>
                                                    <c:when test="${freight.tcsStlStatusCd eq 'TRC_STL_PAID'}">
                                                        <span class="doc-status ok">납부완료</span>
                                                    </c:when>
                                                    <c:when test="${freight.tcsStlStatusCd eq 'TRC_STL_REQ'}">
                                                        <span class="doc-status wait">확인 대기</span>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span class="doc-status none">청구서 검토</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>

                                            <td>
                                                <a class="mini mini-view" href="/owner/transport/freight/detail.do/${freight.tcsNo}">
                                                    상세
                                                </a>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </c:when>

                                <c:otherwise>
                                    <tr>
                                        <td colspan="7" class="freight-empty-cell">
                                            조회된 운임 정산 내역이 없습니다.
                                        </td>
                                    </tr>
                                </c:otherwise>
                            </c:choose>
                            </tbody>
                        </table>
                    </div>

                    <div class="freight-guide-box">
                        운임 납부 전 반드시 청구 내역(해상운임·부대비용·세금)을 확인하세요. 이의 제기는 청구일로부터 7일 이내 가능합니다.
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
