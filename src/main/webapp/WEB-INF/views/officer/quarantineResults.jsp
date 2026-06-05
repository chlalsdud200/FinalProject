<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/officer/common/taglibs.jsp" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
    <head>
        <%@ include file="/WEB-INF/views/officer/header/head.jsp" %>
        <title>TACS · 검역결과 확인</title>
        <link rel="stylesheet" href="${ctx}/resources/css/officer/pages/quarantineResults.css">
    </head>

    <body>
        <%@ include file="/WEB-INF/views/officer/header/sidebar.jsp" %>
        <%@ include file="/WEB-INF/views/officer/header/header.jsp" %>

        <main class="officer-main">
            <div class="page-content quarantineResults-page">
                <div class="mb-5">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] font-black text-on-surface-variant">검사·검역 관리</span>
                        <span class="text-on-surface-variant">›</span><span class="text-[10px] font-black text-on-surface-variant">검역 관리</span>
                        <span class="text-on-surface-variant">›</span>
                        <span class="bg-primary text-on-primary text-[10px] font-black px-2 py-0.5">TACS-AD-010Q</span>
                    </div>
                    <h2 class="text-xl font-black text-slate-900">검역결과 확인</h2>
                </div>

                <div class="inline-screen-host active" id="screen-host-TACS-AD-010Q">
                    <div class="inline-screen-header">
                        <h3 class="font-black text-base">검역결과 확인</h3>
                        <p class="text-[10px] text-primary-fixed mt-0.5">검역기관 결과의 결과·사유·증빙을 확인하고 수리진행, 보완요청, 통관보류를 판단합니다.</p>
                    </div>
                    <div class="inline-screen-body">
                        <div class="receipt-search-panel white-bg">
                            <p class="section-title receipt-search-title">검색 조건</p>
                            <div class="receipt-search-row">
                                <div class="receipt-search-label">신고번호</div>
                                <div class="receipt-search-field receipt-search-field-wide">
                                    <input class="receipt-search-input" placeholder="신고번호 입력" style="width:100%;" type="text"/>
                                </div>
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
                        </div> <div class="flex items-center justify-between mb-3"><div class="text-[15px] font-bold text-slate-800">검역결과 목록 <span class="text-blue-600 ml-2">2건</span></div></div>
                        <div class="bg-white border border-slate-200 mb-4"><table class="data-table"><thead><tr><th>No.</th><th>신고번호</th><th>구분</th><th>업체명</th><th>품명</th><th>검역기관</th><th>결과</th><th>증빙</th><th>처리</th></tr></thead><tbody>
                            <tr><td>1</td><td class="font-bold text-blue-600">IMP-2026-0418-014</td><td>수입</td><td>정다운무역</td><td>냉동망고</td><td>식품의약품안전처</td><td><span class="badge-pass">적합</span></td><td>수신완료</td><td><button class="btn-secondary btn-sm" onclick="toggleSimpleDetail(this,'quarantine-result-row')">상세</button></td></tr>
                            <tr class="quarantine-result-row" style="display:none;"><td class="p-0" colspan="9"><div class="bg-white border-t border-slate-200 p-6"><div class="bg-slate-50 border border-slate-200 px-4 py-3 mb-4 flex items-center justify-between gap-4 flex-wrap"><div><p class="text-[13px] font-black text-slate-900">IMP-2026-0418-014 · 정다운무역 · 냉동망고</p><p class="text-[11px] text-slate-500 mt-1">확인 포인트: 기관 결과, 검역사유 해소 여부, 증명서 수신 여부 확인</p></div><span class="badge-pass">수리 진행 가능</span></div><div class="grid grid-cols-3 gap-4 mb-4"><div class="info-card mb-0"><p class="section-title">기본정보</p><table class="data-table"><tbody><tr><td class="font-bold">품명</td><td>냉동망고</td></tr><tr><td class="font-bold">원산지</td><td>베트남</td></tr><tr><td class="font-bold">수량</td><td>500KG</td></tr></tbody></table></div><div class="info-card mb-0"><p class="section-title">검역결과</p><table class="data-table"><tbody><tr><td class="font-bold">결과</td><td>적합</td></tr><tr><td class="font-bold">검역기관</td><td>식품의약품안전처</td></tr><tr><td class="font-bold">수신일시</td><td>2026-04-18 15:10</td></tr></tbody></table></div><div class="info-card mb-0"><p class="section-title">증빙</p><table class="data-table"><tbody><tr><td class="font-bold">증명서</td><td><button class="btn-secondary btn-sm">검역증명서.pdf</button></td></tr><tr><td class="font-bold">증명서번호</td><td>Q-PASS-2026-00112</td></tr></tbody></table></div></div><div class="info-card mb-4"><p class="section-title">판단근거</p><table class="data-table"><thead><tr><th>확인항목</th><th>기관 결과내용</th><th>판단</th></tr></thead><tbody><tr><td>검역사유</td><td>수입식품 위생검사 완료</td><td>해소</td></tr><tr><td>위생검사</td><td>부적합 항목 없음</td><td>문제없음</td></tr><tr><td>증명서</td><td>검역증명서 수신완료</td><td>확인완료</td></tr></tbody></table></div><label class="form-label">검토메모</label><textarea class="form-textarea mb-4" rows="3">검역결과 적합 및 증명서 수신 완료. 통관 진행 가능.</textarea><div class="flex gap-3 flex-wrap"><button class="btn-primary" onclick="showPage('cat9')">수리 진행</button><button class="btn-secondary" onclick="openSupplementRequestDraft('검역결과 확인')">보완요청</button><button class="btn-danger" onclick="showPage('cat8')">통관보류</button></div></div></td></tr>
                            <tr><td>2</td><td class="font-bold text-blue-600">IMP-2026-0417-021</td><td>수입</td><td>한빛유통</td><td>식물종자</td><td>농림축산검역본부</td><td><span class="badge-wait">조건부</span></td><td>수신완료</td><td><button class="btn-secondary btn-sm" onclick="toggleSimpleDetail(this,'quarantine-result-row')">상세</button></td></tr>
                            <tr class="quarantine-result-row" style="display:none;"><td class="p-0" colspan="9"><div class="bg-white border-t border-slate-200 p-6"><div class="bg-slate-50 border border-slate-200 px-4 py-3 mb-4"><p class="text-[13px] font-black text-slate-900">IMP-2026-0417-021 · 한빛유통 · 식물종자</p><p class="text-[11px] text-slate-500 mt-1">조건부 적합 건입니다. 소독확인서 추가 제출 여부 확인 필요.</p></div><div class="info-card mb-4"><p class="section-title">판단근거</p><table class="data-table"><tbody><tr><td class="font-bold">결과</td><td>조건부 적합</td></tr><tr><td class="font-bold">조건</td><td>소독확인서 추가 제출</td></tr><tr><td class="font-bold">증빙</td><td><button class="btn-secondary btn-sm">검역결과서.pdf</button></td></tr></tbody></table></div><div class="flex gap-3 flex-wrap"><button class="btn-primary" onclick="openSupplementRequestDraft('검역결과 확인')">보완요청</button><button class="btn-danger" onclick="showPage('cat8')">통관보류</button><button class="btn-secondary">기관결과 재확인</button></div></div></td></tr>
                        </tbody></table></div>
                    </div>
                </div>
            </div>
        </main>

        <%@ include file="/WEB-INF/views/officer/footer/footer.jsp" %>
        <%@ include file="/WEB-INF/views/officer/footer/scripts.jsp" %>

        <script defer src="${ctx}/resources/js/officer/pages/quarantineResults.js"></script>
    </body>
</html>
