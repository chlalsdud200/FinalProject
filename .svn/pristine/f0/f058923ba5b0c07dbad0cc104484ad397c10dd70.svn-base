<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/officer/common/taglibs.jsp" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="activeMenu" value="cargo" />
<c:set var="activeSub" value="loadedCargoList" />

<!DOCTYPE html>
<html lang="ko">
    <head>
        <%@ include file="/WEB-INF/views/officer/header/head.jsp" %>
        <title>TACS · 화물 현황 조회</title>
        <link rel="stylesheet" href="${ctx}/resources/css/officer/pages/loadedCargoList.css">
    </head>

    <body>
        <%@ include file="/WEB-INF/views/officer/header/sidebar.jsp" %>
        <%@ include file="/WEB-INF/views/officer/header/header.jsp" %>

        <main class="officer-main">
            <div class="page-content loadedCargoList-page">
                <div class="mb-5">
                    <h2 class="text-xl font-black text-slate-900">화물 현황 조회</h2>
                </div>

                <div class="inline-screen-host active" id="screen-host-TACS-AD-017">
                    <div class="inline-screen-header">
                        <h3 class="font-black text-base">화물 현황 조회</h3>
                    </div>
                    <div class="inline-screen-body">

                        <%-- 검색 조건 --%>
                        <form method="get" action="${ctx}/officer/loadedCargoList.do" class="loaded-cargo-search-form">
                            <div class="receipt-search-panel loaded-cargo-search-panel">
                                <p class="section-title receipt-search-title">검색 조건</p>

                                <div class="loaded-cargo-search-grid">
                                    <div class="receipt-search-row loaded-cargo-search-item loaded-cargo-search-req-item">
                                        <div class="receipt-search-label">신고번호</div>
                                        <div class="receipt-search-field receipt-search-field-wide">
                                            <input class="receipt-search-input" id="reqNo" name="reqNo" placeholder="신고번호 입력" type="text" value="${reqNo}"/>
                                        </div>
                                    </div>

                                    <div class="receipt-search-row loaded-cargo-search-item loaded-cargo-search-status-item">
                                        <div class="receipt-search-label">신고 상태</div>
                                        <div class="receipt-search-field receipt-search-field-md">
                                            <select class="receipt-search-select" name="declareStatusCd">
                                                <option value="ALL" <c:if test="${declareStatusCd == 'ALL' || empty declareStatusCd}">selected</c:if>>전체</option>
                                                <option value="DCLR_WAIT" <c:if test="${declareStatusCd == 'DCLR_WAIT'}">selected</c:if>>신고대기</option>
                                                <option value="DCLR_REVIEW" <c:if test="${declareStatusCd == 'DCLR_REVIEW'}">selected</c:if>>심사중</option>
                                                <option value="DCLR_DONE" <c:if test="${declareStatusCd == 'DCLR_DONE'}">selected</c:if>>신고완료</option>
                                                <option value="DCLR_REJ" <c:if test="${declareStatusCd == 'DCLR_REJ'}">selected</c:if>>반려</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="receipt-search-row loaded-cargo-search-item loaded-cargo-search-type-item">
                                        <div class="receipt-search-label">구분</div>
                                        <div class="receipt-search-radio-group">
                                            <label class="receipt-check-item"><input type="radio" name="declareType" value="ALL" <c:if test="${declareType == 'ALL' || empty declareType}">checked</c:if>/> 전체</label>
                                            <label class="receipt-check-item"><input type="radio" name="declareType" value="IMPORT" <c:if test="${declareType == 'IMPORT'}">checked</c:if>/> 수입</label>
                                            <label class="receipt-check-item"><input type="radio" name="declareType" value="EXPORT" <c:if test="${declareType == 'EXPORT'}">checked</c:if>/> 수출</label>
                                        </div>
                                    </div>

                                    <div class="receipt-search-row loaded-cargo-search-item loaded-cargo-search-date-item">
                                        <div class="receipt-search-label">제출 일자</div>
                                        <div class="receipt-search-date-wrap">
                                            <input class="receipt-search-date" id="startDate" name="startDate" type="date" value="${startDate}"/>
                                            <span class="receipt-search-date-sep">~</span>
                                            <input class="receipt-search-date" id="endDate" name="endDate" type="date" value="${endDate}"/>
                                            <button class="receipt-inline-btn" id="btnRecentWeek" type="button">최근 1주일</button>
                                        </div>
                                    </div>

                                    <div class="receipt-search-row loaded-cargo-search-item loaded-cargo-search-keyword-item">
                                        <div class="receipt-search-label">통합 검색</div>
                                        <div class="receipt-search-bottom">
                                            <input class="receipt-search-input" name="keyword" placeholder="B/L번호, 화물관리번호, 화주명, 품명 입력" type="text" value="${keyword}"/>
                                        </div>
                                    </div>

                                    <div class="loaded-cargo-search-actions">
                                        <button class="btn-primary receipt-action-btn" type="submit">조회</button>
                                        <button class="btn-secondary receipt-action-btn" id="btnResetLoadedCargoSearch" type="button">초기화</button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <%-- 탭 + 목록 --%>
                        <div class="cargo-tab-table-shell">
                            <div class="line-tabs cargo-bookmark-tabs">
                                <button type="button" class="line-tab active" data-tab-group="cargo-list-type" data-tab-key="all-list">전체</button>
                                <button type="button" class="line-tab" data-tab-group="cargo-list-type" data-tab-key="loading-list">적재화물</button>
                                <button type="button" class="line-tab" data-tab-group="cargo-list-type" data-tab-key="house-list">혼재화물</button>
                            </div>

                            <%-- 전체 화물 --%>
                            <div data-panel-group="cargo-list-type" data-panel-key="all-list" style="display:block;">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="text-[15px] font-bold text-slate-800">화물 현황 조회 대상 <span class="text-blue-600 ml-2">${allCargoCount}건</span></div>
                                </div>
                                <div class="bg-white border border-slate-200 mb-4">
                                    <table class="data-table cargo-list-table">
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>구분</th>
                                                <th>화물구분</th>
                                                <th>신고번호</th>
                                                <th>B/L 번호</th>
                                                <th>화물관리번호</th>
                                                <th>화주명</th>
                                                <th>신고상태</th>
                                                <th>상세</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <c:choose>
                                                <c:when test="${not empty allCargoList}">
                                                    <c:forEach var="item" items="${allCargoList}" varStatus="st">
                                                        <tr class="cargo-click-row"
                                                            data-type="${item.cargoTypeCd == 'MIXED' ? 'house' : 'loading'}"
                                                            data-cargo-type="${item.cargoType}"
                                                            data-bl-no="${item.blNo}"
                                                            data-mbl-no="${item.mblNo}"
                                                            data-req-no="${item.reqNo}"
                                                            data-cargo-manage-no="${item.cargoManageNo}"
                                                            data-declare-type="${item.declareType}"
                                                            data-owner-name="${item.ownerName}"
                                                            data-item-name="${item.itemName}"
                                                            data-submit-status-cd="${item.submitStatusCd}"
                                                            data-submit-status="${item.submitStatus}"
                                                            data-submit-date="${item.submitDate}"
                                                            data-declare-status-cd="${item.declareStatusCd}"
                                                            data-declare-status="${item.declareStatus}"
                                                            data-remark="${item.remark}"
                                                            data-quantity="${item.quantity}"
                                                            data-weight="${item.weight}">
                                                            <td>${st.count}</td>
                                                            <td><c:out value="${item.declareType == 'IMPORT' ? '수입' : '수출'}" /></td>
                                                            <td>${item.cargoType}</td>
                                                            <td>${item.reqNo}</td>
                                                            <td class="font-bold text-blue-600"><c:out value="${not empty item.blNo ? item.blNo : item.mblNo}" /></td>
                                                            <td><c:out value="${not empty item.cargoManageNo ? item.cargoManageNo : '-'}" /></td>
                                                            <td>${item.ownerName}</td>
                                                            <td><span class="badge-wait">${item.declareStatus}</span></td>
                                                            <td><button type="button" class="btn-secondary btn-sm btn-cargo-detail">상세</button></td>
                                                        </tr>
                                                    </c:forEach>
                                                </c:when>
                                                <c:otherwise>
                                                    <tr><td colspan="9" class="empty-cell">조회된 화물 현황이 없습니다.</td></tr>
                                                </c:otherwise>
                                            </c:choose>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <%-- 적재화물 --%>
                            <div data-panel-group="cargo-list-type" data-panel-key="loading-list" style="display:none;">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="text-[15px] font-bold text-slate-800">적재화물 조회 대상 <span class="text-blue-600 ml-2">${loadedCargoCount}건</span></div>
                                </div>
                                <div class="bg-white border border-slate-200 mb-4">
                                    <table class="data-table cargo-list-table">
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>구분</th>
                                                <th>신고번호</th>
                                                <th>B/L 번호</th>
                                                <th>화물관리번호</th>
                                                <th>화주명</th>
                                                <th>품명</th>
                                                <th>신고상태</th>
                                                <th>상세</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <c:choose>
                                                <c:when test="${not empty loadedCargoList}">
                                                    <c:forEach var="item" items="${loadedCargoList}">
                                                        <tr class="cargo-click-row"
                                                            data-type="loading"
                                                            data-cargo-type="${item.cargoType}"
                                                            data-bl-no="${item.blNo}"
                                                            data-mbl-no="${item.mblNo}"
                                                            data-req-no="${item.reqNo}"
                                                            data-cargo-manage-no="${item.cargoManageNo}"
                                                            data-declare-type="${item.declareType}"
                                                            data-owner-name="${item.ownerName}"
                                                            data-item-name="${item.itemName}"
                                                            data-submit-status-cd="${item.submitStatusCd}"
                                                            data-submit-status="${item.submitStatus}"
                                                            data-submit-date="${item.submitDate}"
                                                            data-declare-status-cd="${item.declareStatusCd}"
                                                            data-declare-status="${item.declareStatus}"
                                                            data-remark="${item.remark}"
                                                            data-quantity="${item.quantity}"
                                                            data-weight="${item.weight}">
                                                            <td>${item.no}</td>
                                                            <td><c:out value="${item.declareType == 'IMPORT' ? '수입' : '수출'}" /></td>
                                                            <td>${item.reqNo}</td>
                                                            <td class="font-bold text-blue-600"><c:out value="${not empty item.blNo ? item.blNo : item.mblNo}" /></td>
                                                            <td><c:out value="${not empty item.cargoManageNo ? item.cargoManageNo : '-'}" /></td>
                                                            <td>${item.ownerName}</td>
                                                            <td>${item.itemName}</td>
                                                            <td><span class="badge-wait">${item.declareStatus}</span></td>
                                                            <td><button type="button" class="btn-secondary btn-sm btn-cargo-detail">상세</button></td>
                                                        </tr>
                                                    </c:forEach>
                                                </c:when>
                                                <c:otherwise>
                                                    <tr><td colspan="9" class="empty-cell">조회된 적재화물이 없습니다.</td></tr>
                                                </c:otherwise>
                                            </c:choose>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <%-- 혼재화물 --%>
                            <div data-panel-group="cargo-list-type" data-panel-key="house-list" style="display:none;">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="text-[15px] font-bold text-slate-800">혼재화물 조회 대상 <span class="text-blue-600 ml-2">${mixedCargoCount}건</span></div>
                                </div>
                                <div class="bg-white border border-slate-200 mb-4">
                                    <table class="data-table cargo-list-table">
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>신고번호</th>
                                                <th>MBL 번호</th>
                                                <th>화물관리번호</th>
                                                <th>화주명</th>
                                                <th>품명</th>
                                                <th>신고상태</th>
                                                <th>상세</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <c:choose>
                                                <c:when test="${not empty mixedCargoList}">
                                                    <c:forEach var="item" items="${mixedCargoList}">
                                                        <tr class="cargo-click-row"
                                                            data-type="house"
                                                            data-cargo-type="${item.cargoType}"
                                                            data-bl-no="${item.blNo}"
                                                            data-mbl-no="${item.mblNo}"
                                                            data-req-no="${item.reqNo}"
                                                            data-cargo-manage-no="${item.cargoManageNo}"
                                                            data-declare-type="${item.declareType}"
                                                            data-owner-name="${item.ownerName}"
                                                            data-item-name="${item.itemName}"
                                                            data-submit-status-cd="${item.submitStatusCd}"
                                                            data-submit-status="${item.submitStatus}"
                                                            data-submit-date="${item.submitDate}"
                                                            data-declare-status-cd="${item.declareStatusCd}"
                                                            data-declare-status="${item.declareStatus}"
                                                            data-remark="${item.remark}"
                                                            data-quantity="${item.quantity}"
                                                            data-weight="${item.weight}">
                                                            <td>${item.no}</td>
                                                            <td>${item.reqNo}</td>
                                                            <td class="font-bold text-blue-600">${item.mblNo}</td>
                                                            <td><c:out value="${not empty item.cargoManageNo ? item.cargoManageNo : '-'}" /></td>
                                                            <td>${item.ownerName}</td>
                                                            <td>${item.itemName}</td>
                                                            <td><span class="badge-wait">${item.declareStatus}</span></td>
                                                            <td><button type="button" class="btn-secondary btn-sm btn-cargo-detail">상세</button></td>
                                                        </tr>
                                                    </c:forEach>
                                                </c:when>
                                                <c:otherwise>
                                                    <tr><td colspan="8" class="empty-cell">조회된 혼재화물이 없습니다.</td></tr>
                                                </c:otherwise>
                                            </c:choose>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <%-- 상세패널 --%>
                        <div id="cargo-list-detail-panel" class="detail-panel" style="display:none;">
                            <div class="info-card mb-0">
                                <p class="section-title">신고/화물 기본정보</p>
                                <div class="cargo-detail-grid">
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">화물구분</span><span class="cargo-detail-value" id="detailType">-</span></div>
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">신고구분</span><span class="cargo-detail-value" id="detailDeclareType">-</span></div>
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">신고번호</span><span class="cargo-detail-value" id="detailReqNo">-</span></div>
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">화물관리번호</span><span class="cargo-detail-value" id="detailCargoManageNo">-</span></div>
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">화주명</span><span class="cargo-detail-value" id="detailOwnerName">-</span></div>
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">품명</span><span class="cargo-detail-value" id="detailItemName">-</span></div>
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">총 수량</span><span class="cargo-detail-value" id="detailTotalQuantity">-</span></div>
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">총 중량</span><span class="cargo-detail-value" id="detailTotalWeight">-</span></div>
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">신고상태</span><span class="cargo-detail-value" id="detailDeclareStatus">-</span></div>
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">제출일자</span><span class="cargo-detail-value" id="detailSubmitDate">-</span></div>
                                </div>

                                <p class="section-title">B/L 및 Manifest 정보</p>
                                <div class="cargo-detail-grid">
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">B/L 번호</span><span class="cargo-detail-value" id="detailMainNo">-</span></div>
                                    <div class="cargo-detail-item"><span class="cargo-detail-label">MBL 번호</span><span class="cargo-detail-value" id="detailMblNo">-</span></div>
                                </div>

                                <p class="section-title">보관/비고 정보</p>
                                <div class="cargo-detail-grid">
                                    <div class="cargo-detail-item cargo-detail-item-wide"><span class="cargo-detail-label">비고</span><span class="cargo-detail-value" id="detailRemark">-</span></div>
                                </div>

                                <p class="section-title">품목 상세내역</p>
                                <table class="data-table mb-4">
                                    <thead>
                                        <tr>
                                            <th>품명</th>
                                            <th>수량</th>
                                            <th>중량</th>
                                        </tr>
                                    </thead>
                                    <tbody id="cargoCompareBody"></tbody>
                                </table>

                                <p class="section-title">처리 메모</p>
                                <div class="cargo-memo-box">
                                    <textarea id="cargoMemo" class="cargo-memo-textarea" placeholder="확인 내용, 추가 확인 필요사항, 증빙 확인 결과 등을 입력하세요."></textarea>
                                    <div class="cargo-memo-actions">
                                        <button type="button" id="btnSaveCargoMemo" class="btn-primary receipt-action-btn">메모 저장</button>
                                        <span id="cargoMemoSavedText" class="cargo-memo-saved"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>

        <%@ include file="/WEB-INF/views/officer/footer/footer.jsp" %>
        <%@ include file="/WEB-INF/views/officer/footer/scripts.jsp" %>
        <script src="${ctx}/resources/js/officer/pages/loadedCargoList.js"></script>
    </body>
</html>
