<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<%
    request.setAttribute("activeMenu", "certs");
    request.setAttribute("activeGroup", "");
    request.setAttribute("activeSub", "");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <title>TACS 수출입신고필증 조회</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet">

    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner-certs.css">
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/owner/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/common/header.jsp" %>

        <main class="content">
            <div class="page active" id="pg-certs">
                <div class="page-title-row">
                    <div>
                        <div class="certs-page-kicker">현황 · 관리</div>
                        <h2>수출입신고필증 조회</h2>
                    </div>
                </div>

                <div class="filter-bar certs-filter-bar">
                    <div class="certs-filter-row">
                        <label for="certs-type-filter">구분</label>

                        <select id="certs-type-filter" class="certs-type-filter">
                            <option value="">전체</option>
                            <option value="EXPORT">수출</option>
                            <option value="IMPORT">수입</option>
                        </select>

                        <input id="certs-date-from" class="certs-date-input" type="date">
                        <span class="certs-date-sep">~</span>
                        <input id="certs-date-to" class="certs-date-input" type="date">

                        <div class="filter-sep"></div>

                        <div class="search-wrap certs-search-wrap">
                            <span class="material-symbols-outlined">search</span>
                            <input id="certs-search-input"
                                   class="certs-search-input"
                                   placeholder="신고번호 또는 의뢰번호를 입력하세요">
                        </div>
                    </div>

                    <button type="button" class="btn btn-dark" onclick="filterCertsList()">조회</button>
                </div>

                <div class="card-section">
                    <div class="certs-list-title">발급 완료된 신고필증 목록</div>

                    <table class="data-table">
                        <thead>
                        <tr>
                            <th>구분</th>
                            <th>신고번호 (필증번호)</th>
                            <th>의뢰번호</th>
                            <th>발급상태</th>
                            <th>발급일자</th>
                            <th>관리</th>
                        </tr>
                        </thead>

                        <tbody id="certs-list-body">
                        <c:choose>
                            <c:when test="${empty certList}">
                                <tr>
                                    <td colspan="6" class="certs-empty">
                                        발급 완료된 신고필증이 없습니다.
                                    </td>
                                </tr>
                            </c:when>

                            <c:otherwise>
                                <c:forEach var="cert" items="${certList}">
                                    <tr data-cert-type="${cert.ciDclrTypeCd}"
                                        data-cert-date="<fmt:formatDate value='${cert.ciIssueDt}' pattern='yyyy-MM-dd'/>"
                                        data-cert-keyword="${cert.ciNo} ${cert.ciDclrNo} ${cert.itemName}">
                                        <td>
                                            <c:choose>
                                                <c:when test="${cert.ciDclrTypeCd eq 'IMPORT'}">
                                                    <span class="badge badge-ok">수입</span>
                                                </c:when>
                                                <c:when test="${cert.ciDclrTypeCd eq 'EXPORT'}">
                                                    <span class="badge badge-ok">수출</span>
                                                </c:when>
                                                <c:otherwise>
                                                    <span class="badge badge-done">${cert.ciDclrTypeCd}</span>
                                                </c:otherwise>
                                            </c:choose>
                                        </td>

                                        <td class="td-id">${cert.ciNo}</td>
                                        <td>${cert.ciDclrNo}</td>

                                        <c:choose>
                                            <c:when test="${cert.ciStatusCd eq 'CERT_ISSUED'}">
                                                <td>발급완료</td>
                                            </c:when>
                                            <c:when test="${cert.ciStatusCd eq 'CERT_REISSUED'}">
                                                <td>재발급</td>
                                            </c:when>
                                            <c:otherwise>
                                                <td>발급취소</td>
                                            </c:otherwise>
                                        </c:choose>

                                        <td class="td-muted">
                                            <fmt:formatDate value="${cert.ciIssueDt}" pattern="yyyy-MM-dd"/>
                                        </td>

                                        <td>
                                            <c:choose>
                                                <c:when test="${not empty cert.fileNo}">
                                                    <div class="certs-actions">
                                                        <a class="mini mini-view"
                                                           href="${pageContext.request.contextPath}/common/file/download.do?fileNo=${cert.fileNo}">
                                                            필증 다운로드
                                                        </a>
                                                        <a class="mini mini-view"
                                                           target="_blank"
                                                           rel="noopener"
                                                           href="${pageContext.request.contextPath}/common/file/preview.do?fileNo=${cert.fileNo}">
                                                            미리보기
                                                        </a>
                                                    </div>
                                                </c:when>
                                                <c:otherwise>
                                                    <span class="td-muted">파일 없음</span>
                                                </c:otherwise>
                                            </c:choose>
                                        </td>
                                    </tr>
                                </c:forEach>
                            </c:otherwise>
                        </c:choose>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <%@ include file="/WEB-INF/views/common/ownerModals.jsp" %>
        <%@ include file="/WEB-INF/views/common/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/ownerScripts.jsp" %>

<script>
    function filterCertsList() {
        const type = document.getElementById("certs-type-filter")?.value || "";
        const from = document.getElementById("certs-date-from")?.value || "";
        const to = document.getElementById("certs-date-to")?.value || "";
        const keyword = (document.getElementById("certs-search-input")?.value || "").trim().toLowerCase();

        const rows = document.querySelectorAll("#certs-list-body tr[data-cert-type]");
        let visibleCount = 0;

        rows.forEach(row => {
            const rowType = row.dataset.certType || "";
            const rowDate = row.dataset.certDate || "";
            const rowKeyword = (row.dataset.certKeyword || "").toLowerCase();

            let visible = true;

            if (type && rowType !== type) {
                visible = false;
            }

            if (from && rowDate < from) {
                visible = false;
            }

            if (to && rowDate > to) {
                visible = false;
            }

            if (keyword && !rowKeyword.includes(keyword)) {
                visible = false;
            }

            row.style.display = visible ? "" : "none";

            if (visible) {
                visibleCount++;
            }
        });

        const emptyRow = document.getElementById("certs-filter-empty-row");

        if (visibleCount === 0 && rows.length > 0) {
            if (!emptyRow) {
                const tbody = document.getElementById("certs-list-body");
                const tr = document.createElement("tr");
                tr.id = "certs-filter-empty-row";
                tr.innerHTML = '<td colspan="6" class="certs-empty">조회 조건에 맞는 신고필증이 없습니다.</td>';
                tbody.appendChild(tr);
            }
        } else if (emptyRow) {
            emptyRow.remove();
        }
    }
</script>
</body>
</html>