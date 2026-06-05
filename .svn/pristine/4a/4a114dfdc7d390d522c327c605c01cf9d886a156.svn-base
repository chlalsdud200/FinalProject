<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/fieldofficer/common/taglibs.jsp" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="activeMenu" value="receipt" />
<c:set var="activeSub" value="" />

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/fieldofficer/header/head.jsp" %>
    <link rel="stylesheet" href="${ctx}/resources/css/fieldofficer/inspectionRequest.css">
    <link rel="stylesheet" href="${ctx}/resources/lib/tui-grid/tui-pagination.min.css">
	<link rel="stylesheet" href="${ctx}/resources/lib/tui-grid/tui-grid.min.css">
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/fieldofficer/header/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/fieldofficer/header/header.jsp" %>

        <div class="content">
            <div class="page active" id="pg-receipt">
                <div class="sub-page" id="receipt-list-view">
                    <h2><span class="material-symbols-outlined">inbox</span> 검역 요청 조회</h2>

                    <!-- 검역 요청 조회 검색 조건 -->
					<form id="receiptSearchForm" class="receipt-search-panel" method="get">
					
					    <input type="hidden" name="page" id="receiptPage" value="${pagingVO.currentPage}" />
					
					    <div class="receipt-search-title">
					        <span></span>
					        검색 조건
					    </div>
					
					    <div class="form-grid receipt-search-grid">
					
					        <div class="form-item">
					            <label>검역요청번호</label>
					            <input
					                id="receiptSearchNo"
					                name="iirReqNo"
					                value="${searchVO.iirReqNo}"
					                placeholder="검역요청번호 입력"
					            />
					        </div>
					
					        <div class="form-item">
					            <label>수입통관의뢰번호</label>
					            <input
					                id="receiptSearchIrNo"
					                name="iirAplyNo"
					                value="${searchVO.iirAplyNo}"
					                placeholder="수입통관의뢰번호 입력"
					            />
					        </div>
					
					        <div class="form-item">
					            <label>대표품목명</label>
					            <input
					                id="receiptSearchGoods"
					                name="iirMainGoodsNm"
					                value="${searchVO.iirMainGoodsNm}"
					                placeholder="대표품목명 입력"
					            />
					        </div>
					
					        <div class="form-item">
					            <label>대표 HS코드</label>
					            <input
					                id="receiptSearchHs"
					                name="iirMainHsCd"
					                value="${searchVO.iirMainHsCd}"
					                placeholder="대표 HS코드 입력"
					            />
					        </div>
					
					        <div class="form-item">
					            <label>요청상태</label>
					            <select id="receiptAcceptStatus" name="iirStatusCd">
								    <option value="">전체</option>
								    <option value="REQ" ${searchVO.iirStatusCd == 'REQ' ? 'selected' : ''}>요청</option>
								    <option value="ASSIGN" ${searchVO.iirStatusCd == 'ASSIGN' ? 'selected' : ''}>배정</option>
								    <option value="INPRG" ${searchVO.iirStatusCd == 'INPRG' ? 'selected' : ''}>진행중</option>
								    <option value="CMPL" ${searchVO.iirStatusCd == 'CMPL' ? 'selected' : ''}>완료</option>
								    <option value="CANCEL" ${searchVO.iirStatusCd == 'CANCEL' ? 'selected' : ''}>취소</option>
								</select>
					        </div>
					
					        <div class="form-item">
					            <label>판정상태</label>
					            <select id="receiptJudgeStatus" name="iirResultStatusCd">
								    <option value="">전체</option>
								    <option value="QRTN_INPRG" ${searchVO.iirResultStatusCd == 'QRTN_INPRG' ? 'selected' : ''}>검역진행중</option>
								    <option value="QRTN_REJ" ${searchVO.iirResultStatusCd == 'QRTN_REJ' ? 'selected' : ''}>검역반려</option>
								    <option value="QRTN_CMPL" ${searchVO.iirResultStatusCd == 'QRTN_CMPL' ? 'selected' : ''}>검역완료</option>
								</select>
					        </div>
					
					        <div class="form-item">
							    <label>회신기한</label>
							    <div class="date-range-wrap">
							        <input type="date"
							               id="rplyDdlineStartDt"
							               name="rplyDdlineStartDt"
							               value="${searchVO.rplyDdlineStartDt}">
							
							        <span class="date-range-separator">~</span>
							
							        <input type="date"
							               id="rplyDdlineEndDt"
							               name="rplyDdlineEndDt"
							               value="${searchVO.rplyDdlineEndDt}">
							    </div>
							</div>
					
					    </div>
					
					    <div class="receipt-search-actions">
					        <button class="btn btn-primary" type="button" id="inspectionSearchBtn">
					            <span class="material-symbols-outlined">search</span>
					            조회
					        </button>
					
					        <button class="btn btn-secondary" type="button" id="inspectionResetBtn">
					            초기화
					        </button>
					
					        <button class="btn btn-outline" type="button" id="inspectionExcelBtn">
							    엑셀 다운로드
							</button>
					    </div>
					</form>
					<div class="table-card">
					    <div id="inspectionRequestGrid"></div>
					</div>
                </div>
            </div>
        </div>

        <%@ include file="/WEB-INF/views/fieldofficer/footer/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/fieldofficer/footer/modals.jsp" %>
<%@ include file="/WEB-INF/views/fieldofficer/footer/scripts.jsp" %>


<script src="${ctx}/resources/lib/tui-grid/tui-pagination.min.js"></script>
<script src="${ctx}/resources/lib/tui-grid/tui-grid.min.js"></script>
<script src="${ctx}/resources/js/common/toast-grid.js"></script>
<script src="${ctx}/resources/js/fieldofficer/inspectionRequest.js"></script>
</body>
</html>
