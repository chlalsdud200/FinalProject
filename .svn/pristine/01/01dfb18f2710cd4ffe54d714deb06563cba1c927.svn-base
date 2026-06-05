<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/officer/common/taglibs.jsp" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
    <head>
        <%@ include file="/WEB-INF/views/officer/header/head.jsp" %>
        <title>TACS · 검역대상 확인·기관 요청</title>
        <link rel="stylesheet" href="${ctx}/resources/css/officer/pages/confirmationQuarantine.css">
    </head>

    <body>
        <%@ include file="/WEB-INF/views/officer/header/sidebar.jsp" %>
        <%@ include file="/WEB-INF/views/officer/header/header.jsp" %>

        <main class="officer-main">
            <div class="page-content confirmationQuarantine-page">
                <div class="mb-5">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] font-black text-on-surface-variant">검사·검역 관리</span>
                        <span class="text-on-surface-variant">›</span><span class="text-[10px] font-black text-on-surface-variant">검역 관리</span>
                        <span class="text-on-surface-variant">›</span>
                        <span class="bg-primary text-on-primary text-[10px] font-black px-2 py-0.5">TACS-AD-008Q</span>
                    </div>
                    <h2 class="text-xl font-black text-slate-900">검역대상 확인·기관 요청</h2>
                </div>

                <div class="inline-screen-host active" id="screen-host-TACS-AD-008Q">
                    <div class="inline-screen-header">
                        <h3 class="font-black text-base">검역대상 확인·기관 요청</h3>
                        <p class="text-[10px] text-primary-fixed mt-0.5">검역대상 여부와 기관 요청 사유를 확인하고 검역기관 요청 또는 보완요청을 처리합니다.</p>
                    </div>
                    <form class="search-panel" id="receiptSearchForm" method="get" action="${ctx}/officer/reportReceiptList.do">
                        <div class="search-title">검색 조건</div>

                        <div class="search-row">
                            <label class="search-label" for="reqNo">신고번호</label>
                            <div class="search-field">
                                <input type="text" id="reqNo" name="reqNo" class="form-input input-md" placeholder="신고번호 입력">
                            </div>
                        </div>

                        <div class="search-row">
                            <label class="search-label" for="statusCd">현재상태</label>
                            <div class="search-field">
                                <select id="statusCd" name="statusCd" class="form-select select-sm">
                                    <option value="">전체</option>
                                    <option value="WAIT">접수대기</option>
                                    <option value="RECEIVED">접수완료</option>
                                    <option value="REJECTED">반려</option>
                                </select>
                            </div>
                        </div>

                        <div class="search-row">
                            <span class="search-label">신고구분</span>
                            <div class="search-field radio-group">
                                <label><input type="radio" name="declareType" value="" checked> 전체</label>
                                <label><input type="radio" name="declareType" value="IMPORT"> 수입</label>
                                <label><input type="radio" name="declareType" value="EXPORT"> 수출</label>
                            </div>
                        </div>

                        <div class="search-row">
                            <label class="search-label">신고일시</label>
                            <div class="search-field date-group">
                                <input type="date" name="startDate" class="form-input date-input">
                                <span class="date-sep">~</span>
                                <input type="date" name="endDate" class="form-input date-input">
                                <button type="button" class="btn-secondary btn-quick" data-range="7">최근 1주일</button>
                                <button type="button" class="btn-secondary btn-quick" data-range="30">1개월</button>
                            </div>
                        </div>

                        <div class="search-row">
                            <label class="search-label" for="companyName">업체명</label>
                            <div class="search-field">
                                <input type="text" id="companyName" name="companyName" class="form-input input-md" placeholder="업체명 입력">
                            </div>
                        </div>

                        <div class="search-row last-row">
                            <label class="search-label" for="riskGrade">AI위험도</label>
                            <div class="search-field">
                                <select id="riskGrade" name="riskGrade" class="form-select select-sm">
                                    <option value="">전체</option>
                                    <option value="HIGH">높음</option>
                                    <option value="MID">보통</option>
                                    <option value="LOW">낮음</option>
                                </select>
                                <button type="submit" class="btn-primary">조회</button>
                                <button type="button" class="btn-secondary" id="btnReset">초기화</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="receipt-search-row">
                    <div class="receipt-search-label">처리 상태</div>
                    <div class="receipt-search-field receipt-search-field-md">
                        <select class="receipt-search-select w-full">
                            <option>전체</option>
                            <option>접수대기</option>
                            <option>심사중</option>
                            <option>처리대기</option>
                            <option>완료</option>
                        </select>
                    </div>
                </div>
                <div class="receipt-search-row">
                    <div class="receipt-search-label">구분</div>
                    <div class="receipt-search-radio-group">
                        <label class="receipt-check-item"><input checked="" type="checkbox"/> 전체</label>
                        <label class="receipt-check-item"><input type="checkbox"/> 수입</label>
                        <label class="receipt-check-item"><input type="checkbox"/> 수출</label>
                    </div>
                </div>
                <div class="receipt-search-row">
                    <div class="receipt-search-label">신고 일자</div>
                    <div class="receipt-search-date-wrap">
                        <input class="receipt-search-date" type="date" value="2026-04-01"/>
                        <span class="receipt-search-date-sep">~</span>
                        <input class="receipt-search-date" type="date" value="2026-04-14"/>
                        <button class="receipt-inline-btn">최근 1주일</button>
                    </div>
                </div>
                <div class="receipt-search-row receipt-search-row-last">
                    <div class="receipt-search-label">통합 검색</div>
                    <div class="receipt-search-bottom">
                        <input class="receipt-search-input" placeholder="신고번호 또는 업체명 입력" type="text"/>
                        <button class="btn-primary receipt-action-btn"><span class="material-symbols-outlined text-[16px]">search</span>조회</button>
                        <button class="btn-secondary receipt-action-btn">초기화</button>
                    </div>
                </div>
            </div> <div class="flex items-center justify-between mb-3"><div class="text-[15px] font-bold text-slate-800">검역대상 목록 <span class="text-blue-600 ml-2">2건</span></div></div>
            <div class="bg-white border border-slate-200 mb-4"><table class="data-table"><thead><tr><th>No.</th><th>신고번호</th><th>구분</th><th>업체명</th><th>품명</th><th>검역기관</th><th>검역사유</th><th>상태</th><th>처리</th></tr></thead><tbody>
                <tr><td>1</td><td class="font-bold text-blue-600">IMP-2026-0418-014</td><td>수입</td><td>정다운무역</td><td>냉동망고</td><td>식품의약품안전처</td><td>식품검사 대상</td><td>요청대기</td><td><button class="btn-secondary btn-sm" onclick="toggleSimpleDetail(this,'quarantine-detail-row')">상세</button></td></tr>
                <tr class="quarantine-detail-row" style="display:none;"><td class="p-0" colspan="9"><div class="bg-white border-t border-slate-200 p-6"><div class="bg-slate-50 border border-slate-200 px-4 py-3 mb-5"><p class="text-[14px] font-black text-slate-900">IMP-2026-0418-014 · 정다운무역 · 냉동망고</p><p class="text-[12px] text-slate-500 mt-1">확인 포인트: 검역대상 여부, 요청기관, 보완서류 필요 여부 확인</p></div><div class="grid grid-cols-2 gap-4 mb-5"><div class="border border-slate-200 p-4"><p class="section-title">기본정보</p><table class="data-table"><tbody><tr><td class="font-bold">품명</td><td>냉동망고</td></tr><tr><td class="font-bold">원산지</td><td>베트남</td></tr><tr><td class="font-bold">수량</td><td>500KG</td></tr></tbody></table></div><div class="border border-slate-200 p-4"><p class="section-title">검역정보</p><table class="data-table"><tbody><tr><td class="font-bold">검역기관</td><td>식품의약품안전처</td></tr><tr><td class="font-bold">검역사유</td><td>수입식품 위생검사 대상</td></tr><tr><td class="font-bold">보완서류</td><td>위생증명서 확인 필요</td></tr></tbody></table></div></div><label class="form-label">기관 요청내용</label><textarea class="form-textarea mb-4" rows="3">냉동과일류 수입식품 검역 대상입니다. 식약처 검역요청 후 결과 및 증명서 수신 여부를 확인합니다.</textarea><div class="flex gap-3 flex-wrap"><button class="btn-primary">검역요청</button><button class="btn-secondary" onclick="openSupplementRequestDraft('검역대상 확인·기관 요청')">보완요청</button><button class="btn-danger" onclick="showPage('cat8')">통관보류</button></div></div></td></tr>
                <tr><td>2</td><td class="font-bold text-blue-600">EXP-2026-0418-019</td><td>수출</td><td>한빛식품</td><td>가공식품</td><td>검역기관</td><td>목적국 증명 필요</td><td>검역중</td><td><button class="btn-secondary btn-sm" onclick="toggleSimpleDetail(this,'quarantine-detail-row')">상세</button></td></tr>
                <tr class="quarantine-detail-row" style="display:none;"><td class="p-0" colspan="9"><div class="bg-white border-t border-slate-200 p-6"><div class="bg-slate-50 border border-slate-200 p-4 mb-4 text-[12px] text-slate-700"><b>EXP-2026-0418-019</b> · 검역기관 결과 수신 대기 건입니다.</div><div class="flex gap-3"><button class="btn-secondary">진행현황 확인</button><button class="btn-primary" onclick="location.href=(window.contextPath||'') + '/officer/quarantineResults.do'">검역결과 확인으로 이동</button></div></div></td></tr>
            </tbody></table></div></div>
        </div>
    </div>
</main>

<%@ include file="/WEB-INF/views/officer/footer/footer.jsp" %>
<%@ include file="/WEB-INF/views/officer/footer/scripts.jsp" %>

<script defer src="${ctx}/resources/js/officer/pages/confirmationQuarantine.js"></script>
</body>
</html>
