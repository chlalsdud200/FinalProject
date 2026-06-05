<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/officer/common/taglibs.jsp" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="activeMenu" value="cargo" />
<c:set var="activeSub" value="exportAndFulfillment" />

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/officer/header/head.jsp" %>
    <title>TACS · 반출 및 이행 관리</title>
    <link rel="stylesheet" href="${ctx}/resources/css/officer/pages/exportAndFulfillment.css">
</head>
<body>
<%@ include file="/WEB-INF/views/officer/header/sidebar.jsp" %>
<%@ include file="/WEB-INF/views/officer/header/header.jsp" %>

<main class="officer-main">
    <div class="page-content exportAndFulfillment-page">
        <div class="mb-5">
            <h2 class="text-xl font-black text-slate-900">반출 및 이행 관리</h2>
            <p class="page-desc">수입 반출, 즉시반출, 수출 적재이행 대상을 실제 신고/화물 데이터 기준으로 조회합니다.</p>
        </div>

        <div class="inline-screen-host active" id="screen-host-TACS-AD-018">
            <div class="inline-screen-header">
                <h3 class="font-black text-base">반출 및 이행 관리</h3>
            </div>
            <div class="inline-screen-body">

                <form class="receipt-search-panel white-bg" method="get" action="${ctx}/officer/exportAndFulfillment.do">
                    <p class="section-title receipt-search-title">검색 조건</p>

                    <div class="fulfillment-search-grid">
                        <div class="receipt-search-row fulfillment-search-req-item">
                            <div class="receipt-search-label">신고번호</div>
                            <div class="receipt-search-field receipt-search-field-wide">
                                <input name="reqNo" class="receipt-search-input" placeholder="신고번호 입력" type="text" value="${reqNo}" />
                            </div>
                        </div>

                        <div class="receipt-search-row fulfillment-search-work-item">
                            <div class="receipt-search-label">업무 구분</div>
                            <div class="receipt-search-field receipt-search-field-md">
                                <select name="workType" class="receipt-search-select w-full">
                                    <option value="ALL" ${workType eq 'ALL' ? 'selected' : ''}>전체</option>
                                    <option value="IMP_REL" ${workType eq 'IMP_REL' ? 'selected' : ''}>수입 반출</option>
                                    <option value="IMM_REL" ${workType eq 'IMM_REL' ? 'selected' : ''}>즉시반출</option>
                                    <option value="EXP_LOAD" ${workType eq 'EXP_LOAD' ? 'selected' : ''}>수출 적재이행</option>
                                </select>
                            </div>
                        </div>

                        <div class="receipt-search-row fulfillment-search-status-item">
                            <div class="receipt-search-label">현재상태</div>
                            <div class="receipt-search-field receipt-search-field-md">
                                <select name="statusCd" class="receipt-search-select w-full">
                                    <option value="ALL" ${statusCd eq 'ALL' ? 'selected' : ''}>전체</option>
                                    <option value="TAX_UNPAID" ${statusCd eq 'TAX_UNPAID' ? 'selected' : ''}>세금납부대기</option>
                                    <option value="TAX_PAID" ${statusCd eq 'TAX_PAID' ? 'selected' : ''}>세금납부완료</option>
                                    <option value="DCLR_REVIEW" ${statusCd eq 'DCLR_REVIEW' ? 'selected' : ''}>심사중</option>
                                    <option value="DCLR_DONE" ${statusCd eq 'DCLR_DONE' ? 'selected' : ''}>신고완료</option>
                                    <option value="DCLR_REJ" ${statusCd eq 'DCLR_REJ' ? 'selected' : ''}>반려</option>
                                </select>
                            </div>
                        </div>

                        <div class="receipt-search-row fulfillment-search-date-item">
                            <div class="receipt-search-label">기준 일자</div>
                            <div class="receipt-search-date-wrap">
                                <input name="startDate" class="receipt-search-date" type="date" value="${startDate}" />
                                <span class="receipt-search-date-sep">~</span>
                                <input name="endDate" class="receipt-search-date" type="date" value="${endDate}" />
                                <button type="button" class="receipt-inline-btn" id="btnRecentWeek">최근 1주일</button>
                            </div>
                        </div>

                        <div class="receipt-search-row receipt-search-row-last fulfillment-search-keyword-item">
                            <div class="receipt-search-label">통합 검색</div>
                            <div class="receipt-search-bottom">
                                <input name="keyword" class="receipt-search-input" placeholder="신고번호, 화주명, 품명, 화물관리번호, B/L번호" type="text" value="${keyword}" />
                            </div>
                        </div>

                        <div class="fulfillment-search-actions">
                            <button type="submit" class="btn-primary receipt-action-btn">조회</button>
                            <button type="button" class="btn-secondary receipt-action-btn" id="btnResetFulfillment">초기화</button>
                        </div>
                    </div>
                </form>

                <div class="flex items-center justify-between mb-3">
                    <div class="text-[15px] font-bold text-slate-800">
                        반출 및 이행 처리 대상
                        <span class="text-blue-600 ml-2"><c:out value="${fulfillmentCount}" />건</span>
                    </div>
                </div>

                <div class="bg-white border border-slate-200 mb-4">
                    <table class="data-table fulfillment-table">
                        <thead>
                        <tr>
                            <th>No.</th>
                            <th>업무 구분</th>
                            <th>신고번호</th>
                            <th>화주명</th>
                            <th>품명</th>
                            <th>화물관리번호 / B/L</th>
                            <th>현재상태</th>
                            <th>상세</th>
                        </tr>
                        </thead>
                        <tbody>
                        <c:forEach var="row" items="${fulfillmentList}" varStatus="st">
                            <tr class="fulfillment-row"
                                data-work-type="${row.workType}"
                                data-detail-type="${row.detailType}"
                                data-req-no="${row.reqNo}"
                                data-declare-type="${row.declareType}"
                                data-declare-type-nm="${row.declareTypeNm}"
                                data-owner-name="${row.ownerName}"
                                data-goods-name="${row.goodsName}"
                                data-cargo-mng-no="${row.cargoMngNo}"
                                data-bl-no="${row.blNo}"
                                data-mbl-no="${row.mblNo}"
                                data-arrival-port="${row.arrivalPort}"
                                data-declare-date="${row.declareDate}"
                                data-approve-date="${row.approveDate}"
                                data-base-date="${row.baseDate}"
                                data-status-nm="${row.statusNm}"
                                data-total-qty="${row.totalQty}"
                                data-total-weight="${row.totalWeight}"
                                data-memo="${row.memo}">
                                <td><c:out value="${st.count}" /></td>
                                <td><span class="${empty row.statusClass ? 'badge-progress' : row.statusClass}"><c:out value="${row.workTypeNm}" /></span></td>
                                <td class="font-bold text-blue-600"><c:out value="${row.reqNo}" /></td>
                                <td><c:out value="${empty row.ownerName ? '-' : row.ownerName}" /></td>
                                <td><c:out value="${empty row.goodsName ? '-' : row.goodsName}" /></td>
                                <td>
                                    <c:choose>
                                        <c:when test="${row.declareType eq 'IMPORT'}"><c:out value="${empty row.cargoMngNo ? '-' : row.cargoMngNo}" /></c:when>
                                        <c:otherwise><c:out value="${empty row.blNo ? '-' : row.blNo}" /></c:otherwise>
                                    </c:choose>
                                </td>
                                <td><span class="${empty row.statusClass ? 'badge-progress' : row.statusClass}"><c:out value="${empty row.statusNm ? '-' : row.statusNm}" /></span></td>
                                <td><button type="button" class="btn-secondary btn-sm btn-detail-toggle">상세</button></td>
                            </tr>
                        </c:forEach>

                        <c:if test="${empty fulfillmentList}">
                            <tr>
                                <td colspan="8" class="empty-cell">조회된 반출 및 이행 대상이 없습니다.</td>
                            </tr>
                        </c:if>
                        </tbody>
                    </table>
                </div>

                <div class="fulfillment-detail-panel" id="fulfillmentDetailPanel" style="display:none;">
                    <div class="detail-header">
                        <div>
                            <p class="detail-title" id="detailTitle">상세정보</p>
                            <p class="detail-sub" id="detailSubTitle">선택한 건의 반출 및 이행 정보를 확인합니다.</p>
                        </div>
                    </div>

                    <div class="detail-section">
                        <p class="section-title">신고 기본정보</p>
                        <div class="detail-grid detail-grid-base">
                            <div class="detail-item di-sm"><span>업무구분</span><strong data-detail="workTypeNm">-</strong></div>
                            <div class="detail-item di-sm"><span>신고구분</span><strong data-detail="declareTypeNm">-</strong></div>
                            <div class="detail-item di-md"><span>신고번호</span><strong data-detail="reqNo">-</strong></div>
                            <div class="detail-item di-md"><span>현재상태</span><strong data-detail="statusNm">-</strong></div>
                            <div class="detail-item di-sm"><span>화주명</span><strong data-detail="ownerName">-</strong></div>
                            <div class="detail-item di-lg"><span>품명</span><strong data-detail="goodsName">-</strong></div>
                            <div class="detail-item di-sm"><span>총수량</span><strong data-detail="totalQty">-</strong></div>
                            <div class="detail-item di-sm"><span>총중량</span><strong data-detail="totalWeight">-</strong></div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <p class="section-title">화물 / 이행 정보</p>
                        <div class="detail-grid detail-grid-base">
                            <div class="detail-item di-md"><span>화물관리번호</span><strong data-detail="cargoMngNo">-</strong></div>
                            <div class="detail-item di-md"><span>B/L번호</span><strong data-detail="blNo">-</strong></div>
                            <div class="detail-item di-md"><span>MBL번호</span><strong data-detail="mblNo">-</strong></div>
                            <div class="detail-item di-sm"><span>도착항</span><strong data-detail="arrivalPort">-</strong></div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <p class="section-title">일자 정보</p>
                        <div class="detail-grid detail-grid-base">
                            <div class="detail-item di-sm"><span>신고일</span><strong data-detail="declareDate">-</strong></div>
                            <div class="detail-item di-sm"><span>처리기준일</span><strong data-detail="baseDate">-</strong></div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <p class="section-title">품목 상세내역</p>
                        <div class="fulfillment-item-table-wrap">
                            <table class="data-table fulfillment-item-table">
                                <thead>
                                <tr>
                                    <th>품명</th>
                                    <th>수량</th>
                                    <th>중량</th>
                                </tr>
                                </thead>
                                <tbody id="fulfillmentItemBody">
                                <tr>
                                    <td colspan="3" class="empty-cell">상세 행을 선택하면 품목 내역이 표시됩니다.</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="detail-section detail-section-last">
                        <p class="section-title">처리 메모</p>
                        <div class="fulfillment-memo-box">
                            <textarea id="fulfillmentMemo" class="fulfillment-memo-textarea" data-detail="memo" placeholder="확인 내용, 추가 확인 필요사항, 증빙 확인 결과 등을 입력하세요."></textarea>
                            <div class="fulfillment-memo-actions">
                                <button type="button" class="btn-primary" id="btnSaveFulfillmentMemo">메모 저장</button>
                                <span id="fulfillmentMemoSavedText" class="fulfillment-memo-saved"></span>
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
<script src="${ctx}/resources/js/officer/pages/exportAndFulfillment.js"></script>
</body>
</html>
