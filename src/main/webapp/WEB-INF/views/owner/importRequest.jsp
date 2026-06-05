<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<%
    request.setAttribute("activeMenu", "import");
    request.setAttribute("activeGroup", "");
    request.setAttribute("activeSub", "");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <title>TACS 수입통관 의뢰 목록</title>

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
            <div class="page active" id="pg-import">
                <div class="page-title-row">
                    <div>
                        <div style="font-size:11px;color:#94a3b8;font-weight:600;letter-spacing:.5px;margin-bottom:4px;text-transform:uppercase">
                            통관관리
                        </div>
                        <h2>수입통관관리</h2>
                    </div>

                    <div class="btn-row">
                        <a class="btn btn-primary" href="${pageContext.request.contextPath}/owner/import/list.do">
                            <span class="material-symbols-outlined" style="font-size:16px">list</span>
                            의뢰 목록
                        </a>
                        <a class="btn btn-secondary" href="${pageContext.request.contextPath}/owner/import/form.do">
                            <span class="material-symbols-outlined" style="font-size:16px">add</span>
                            신규 의뢰
                        </a>
                    </div>
                </div>

                <div id="import-list-view">

                    <!-- 검색 영역 -->
                    <form method="get"
                          action="${pageContext.request.contextPath}/owner/import/list.do"
                          class="filter-bar"
                          style="margin-bottom:20px;border-left:3px solid #565e74;display:flex;gap:8px;flex-wrap:wrap;align-items:center">

                        <input type="text"
                               name="irNo"
                               value="${searchDTO.irNo}"
                               placeholder="의뢰번호"
                               style="width:170px;padding:8px 10px;border:1px solid #e2e8f0;font-size:12px">

                        <select name="statusCd"
                                style="width:140px;padding:8px 10px;border:1px solid #e2e8f0;font-size:12px">
                            <option value="">전체 상태</option>
                            <option value="CSTM_REQ" ${searchDTO.statusCd eq 'CSTM_REQ' ? 'selected' : ''}>접수대기</option>
                            <option value="CSTM_ACPT" ${searchDTO.statusCd eq 'CSTM_ACPT' ? 'selected' : ''}>접수완료</option>
                            <option value="CSTM_INPRG" ${searchDTO.statusCd eq 'CSTM_INPRG' ? 'selected' : ''}>진행중</option>
                            <option value="CSTM_SUPP" ${searchDTO.statusCd eq 'CSTM_SUPP' ? 'selected' : ''}>보완요청</option>
                            <option value="CSTM_SUPP_SUB" ${searchDTO.statusCd eq 'CSTM_SUPP_SUB' ? 'selected' : ''}>보완제출</option>
                            <option value="CSTM_REJ" ${searchDTO.statusCd eq 'CSTM_REJ' ? 'selected' : ''}>반려</option>
                            <option value="CSTM_DONE" ${searchDTO.statusCd eq 'CSTM_DONE' ? 'selected' : ''}>수리완료</option>
                            <option value="CSTM_CANCEL" ${searchDTO.statusCd eq 'CSTM_CANCEL' ? 'selected' : ''}>취소</option>
                            <option value="CSTM_TAX_REQ" ${searchDTO.statusCd eq 'CSTM_TAX_REQ' ? 'selected' : ''}>납부요청</option>
                            <option value="CSTM_TAX_PAID" ${searchDTO.statusCd eq 'CSTM_TAX_PAID' ? 'selected' : ''}>납부완료</option>
                        </select>

                        <input type="date"
                               name="startDate"
                               value="${searchDTO.startDate}"
                               style="width:145px;padding:8px 10px;border:1px solid #e2e8f0;font-size:12px">

                        <span style="font-size:11px;color:#94a3b8">~</span>

                        <input type="date"
                               name="endDate"
                               value="${searchDTO.endDate}"
                               style="width:145px;padding:8px 10px;border:1px solid #e2e8f0;font-size:12px">

                        <input type="text"
                               name="blAwbNo"
                               value="${searchDTO.blAwbNo}"
                               placeholder="B/L 또는 AWB 번호"
                               style="width:180px;padding:8px 10px;border:1px solid #e2e8f0;font-size:12px">

                        <input type="text"
                               name="brokerNm"
                               value="${searchDTO.brokerNm}"
                               placeholder="관세사명"
                               style="width:150px;padding:8px 10px;border:1px solid #e2e8f0;font-size:12px">

                        <input type="text"
                               name="keyword"
                               value="${searchDTO.keyword}"
                               placeholder="품목/내용"
                               style="width:160px;padding:8px 10px;border:1px solid #e2e8f0;font-size:12px">

                        <input type="hidden" name="page" value="1">
                        <input type="hidden" name="size" value="${searchDTO.size}">

                        <button type="submit"
                                class="btn btn-dark"
                                style="padding:8px 18px;font-size:12px">
                            조회
                        </button>

                        <a class="btn btn-secondary"
                           href="${pageContext.request.contextPath}/owner/import/list.do"
                           style="padding:8px 18px;font-size:12px">
                            초기화
                        </a>

                        <a class="btn btn-primary"
                           href="${pageContext.request.contextPath}/owner/import/form.do"
                           style="padding:8px 18px;font-size:12px">
                            신규 의뢰
                        </a>
                    </form>

                    <!-- 목록 제목 -->
                    <div style="font-size:12px;font-weight:700;color:#475569;margin-bottom:10px">
                        수입통관 의뢰 목록
                        <span style="color:#94a3b8;font-weight:600">
                            총 ${searchDTO.totalCount}건 / ${searchDTO.page}페이지
                        </span>
                    </div>

                    <div class="card-section" style="margin-bottom:20px">
                        <table class="data-table">
                            <thead>
                            <tr>
                                <th>의뢰번호</th>
                                <th>B/L 번호</th>
                                <th>도착항</th>
                                <th>관세사</th>
                                <th>진행 단계</th>
                                <th>최종 업데이트</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody id="import-list-tbody">
                            <c:forEach items="${importList}" var="impList">
                                <c:set var="trStyle" value="" />
                                <c:set var="idStyle" value="" />
                                <c:set var="badgeClass" value="badge badge-done" />
                                <c:set var="statusText" value="${impList.irStatusCd}" />
                                <c:set var="dateStyle" value="color:#94a3b8;font-size:11px" />
                                <c:set var="btnClass" value="mini mini-view" />
                                <c:set var="btnText" value="상세" />

                                <c:choose>
                                    <c:when test="${impList.irStatusCd eq 'CSTM_REQ'}">
                                        <c:set var="badgeClass" value="badge badge-cstm-req" />
                                        <c:set var="statusText" value="접수대기" />
                                    </c:when>

                                    <c:when test="${impList.irStatusCd eq 'CSTM_ACPT'}">
                                        <c:set var="badgeClass" value="badge badge-cstm-acpt" />
                                        <c:set var="statusText" value="접수완료" />
                                    </c:when>

                                    <c:when test="${impList.irStatusCd eq 'CSTM_INPRG'}">
                                        <c:set var="badgeClass" value="badge badge-cstm-inprg" />
                                        <c:set var="statusText" value="진행중" />
                                    </c:when>

                                    <c:when test="${impList.irStatusCd eq 'CSTM_SUPP'}">
                                        <c:set var="trStyle" value="background:#fff5f5" />
                                        <c:set var="idStyle" value="color:#991b1b" />
                                        <c:set var="badgeClass" value="badge badge-cstm-supp" />
                                        <c:set var="statusText" value="보완요청" />
                                        <c:set var="dateStyle" value="color:#dc2626;font-size:11px;font-weight:700" />
                                        <c:set var="btnClass" value="mini mini-reject" />
                                        <c:set var="btnText" value="확인" />
                                    </c:when>

                                    <c:when test="${impList.irStatusCd eq 'CSTM_SUPP_SUB'}">
                                        <c:set var="badgeClass" value="badge badge-cstm-supp-sub" />
                                        <c:set var="statusText" value="보완제출" />
                                    </c:when>

                                    <c:when test="${impList.irStatusCd eq 'CSTM_REJ'}">
                                        <c:set var="trStyle" value="background:#fff5f5" />
                                        <c:set var="idStyle" value="color:#991b1b" />
                                        <c:set var="badgeClass" value="badge badge-cstm-rej" />
                                        <c:set var="statusText" value="반려" />
                                        <c:set var="btnClass" value="mini mini-reject" />
                                        <c:set var="btnText" value="확인" />
                                    </c:when>

                                    <c:when test="${impList.irStatusCd eq 'CSTM_DONE'}">
                                        <c:set var="badgeClass" value="badge badge-cstm-done" />
                                        <c:set var="statusText" value="수리완료" />
                                    </c:when>

                                    <c:when test="${impList.irStatusCd eq 'CSTM_CANCEL'}">
                                        <c:set var="badgeClass" value="badge badge-cstm-cancel" />
                                        <c:set var="statusText" value="취소" />
                                    </c:when>

                                    <c:when test="${impList.irStatusCd eq 'CSTM_TAX_REQ'}">
                                        <c:set var="badgeClass" value="badge badge-cstm-done" />
                                        <c:set var="statusText" value="납부요청" />
                                    </c:when>

                                    <c:when test="${impList.irStatusCd eq 'CSTM_TAX_PAID'}">
                                        <c:set var="badgeClass" value="badge badge-cstm-done" />
                                        <c:set var="statusText" value="납부완료" />
                                    </c:when>

                                    <c:otherwise>
                                        <c:set var="badgeClass" value="badge badge-done" />
                                        <c:set var="statusText" value="관리자에게 문의" />
                                    </c:otherwise>
                                </c:choose>

                                <tr style="${trStyle}">
                                    <td class="td-id" style="${idStyle}">${impList.irNo}</td>
                                    <td>${impList.irBlAwbNo}</td>
                                    <td>${impList.irArrvPortCd}</td>
                                    <td>${impList.brokerNm}</td>
                                    <td><span class="${badgeClass}">${statusText}</span></td>
                                    <td style="${dateStyle}">
                                        <fmt:formatDate value="${impList.irRegistDt}" pattern="yyyy-MM-dd"/>
                                    </td>
                                    <td>
                                        <a class="${btnClass}"
                                           href="${pageContext.request.contextPath}/owner/import/detail.do/${impList.irNo}">
                                                ${btnText}
                                        </a>
                                    </td>
                                </tr>
                            </c:forEach>

                            <c:if test="${empty importList}">
                                <tr>
                                    <td colspan="7"
                                        style="text-align:center;padding:28px;color:#94a3b8;font-size:13px">
                                        조회된 수입통관 의뢰가 없습니다.
                                    </td>
                                </tr>
                            </c:if>
                            </tbody>
                        </table>

                        <!-- 페이지네이션 -->
                        <div class="pagination"
                             style="display:flex;justify-content:center;gap:4px;margin:20px 0">

                            <c:if test="${searchDTO.prev}">
                                <c:url var="prevUrl" value="/owner/import/list.do">
                                    <c:param name="page" value="${searchDTO.startPage - 1}" />
                                    <c:param name="size" value="${searchDTO.size}" />
                                    <c:param name="irNo" value="${searchDTO.irNo}" />
                                    <c:param name="statusCd" value="${searchDTO.statusCd}" />
                                    <c:param name="startDate" value="${searchDTO.startDate}" />
                                    <c:param name="endDate" value="${searchDTO.endDate}" />
                                    <c:param name="blAwbNo" value="${searchDTO.blAwbNo}" />
                                    <c:param name="brokerNm" value="${searchDTO.brokerNm}" />
                                    <c:param name="keyword" value="${searchDTO.keyword}" />
                                </c:url>

                                <a class="mini mini-view" href="${prevUrl}">
                                    이전
                                </a>
                            </c:if>

                            <c:forEach begin="${searchDTO.startPage}" end="${searchDTO.endPage}" var="p">
                                <c:url var="pageUrl" value="/owner/import/list.do">
                                    <c:param name="page" value="${p}" />
                                    <c:param name="size" value="${searchDTO.size}" />
                                    <c:param name="irNo" value="${searchDTO.irNo}" />
                                    <c:param name="statusCd" value="${searchDTO.statusCd}" />
                                    <c:param name="startDate" value="${searchDTO.startDate}" />
                                    <c:param name="endDate" value="${searchDTO.endDate}" />
                                    <c:param name="blAwbNo" value="${searchDTO.blAwbNo}" />
                                    <c:param name="brokerNm" value="${searchDTO.brokerNm}" />
                                    <c:param name="keyword" value="${searchDTO.keyword}" />
                                </c:url>

                                <a class="mini ${p eq searchDTO.page ? 'mini-primary' : 'mini-view'}"
                                   href="${pageUrl}">
                                        ${p}
                                </a>
                            </c:forEach>

                            <c:if test="${searchDTO.next}">
                                <c:url var="nextUrl" value="/owner/import/list.do">
                                    <c:param name="page" value="${searchDTO.endPage + 1}" />
                                    <c:param name="size" value="${searchDTO.size}" />
                                    <c:param name="irNo" value="${searchDTO.irNo}" />
                                    <c:param name="statusCd" value="${searchDTO.statusCd}" />
                                    <c:param name="startDate" value="${searchDTO.startDate}" />
                                    <c:param name="endDate" value="${searchDTO.endDate}" />
                                    <c:param name="blAwbNo" value="${searchDTO.blAwbNo}" />
                                    <c:param name="brokerNm" value="${searchDTO.brokerNm}" />
                                    <c:param name="keyword" value="${searchDTO.keyword}" />
                                </c:url>

                                <a class="mini mini-view" href="${nextUrl}">
                                    다음
                                </a>
                            </c:if>

                        </div>
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
