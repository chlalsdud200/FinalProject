<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TACS 내부망 신고 현황 - TACS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/warehouse/base.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/warehouse/sidebar.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/warehouse/topbar.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/warehouse/customs.css">
</head>
<body>
<div class="app" id="app">
    <jsp:include page="/WEB-INF/views/warehouse/common/sidebar.jsp" />
    
    <div class="main-wrap">
        <jsp:include page="/WEB-INF/views/warehouse/common/header.jsp" />
        
        <div class="content">
            <div class="page-title-row">
                <h2>TACS 내부망 신고 현황</h2>
            </div>
            
            <div class="prog-tab-bar" style="margin-bottom:24px">
                <button class="prog-tab active" onclick="switchCustomsTab('status', this)">신고현황</button>
                <button class="prog-tab" onclick="switchCustomsTab('docs', this)">서류관리</button>
            </div>

            <div id="customs-status">
                <div class="alert-bar info"><span class="material-symbols-outlined">lock</span>본 정보는 TACS 플랫폼 내에서 관세사 및 세관원과 암호화되어 공유됩니다.</div>
                <div class="stats-grid">
                    <div class="stat-card c3"><div class="s-label">금일 EDI 전송</div><div class="s-num">182</div><div class="s-sub">건</div></div>
                    <div class="stat-card c2"><div class="s-label">세관 검역 대상</div><div class="s-num">2</div><div class="s-sub">건</div></div>
                    <div class="stat-card c3"><div class="s-label">미결제</div><div class="s-num">8</div><div class="s-sub">건</div></div>
                    <div class="stat-card c4"><div class="s-label">반출 가능</div><div class="s-num">45</div><div class="s-sub">건</div></div>
                </div>
                <div class="card-section">
                    <div class="card-header">
                        <h3>실시간 데이터 전송 로그</h3>
                        <div style="display:flex; gap:8px">
                            <input placeholder="B/L 검색" style="padding:4px 8px; border:none; font-size:11px; width:120px;">
                            <button style="background:rgba(255,255,255,0.2); border:none; color:#fff; font-size:11px; padding:0 8px; cursor:pointer">필터</button>
                        </div>
                    </div>
                    <table class="data-table">
                        <thead><tr><th>신고유형</th><th>B/L 번호</th><th>송신처</th><th>수신처</th><th>상태</th><th>시간</th></tr></thead>
                        <tbody>
                            <tr>
                                <td><span class="chip blue">반입신고</span></td>
                                <td class="td-id">HDMU-1029384</td>
                                <td>창고관리자</td>
                                <td>세관원(TACS)</td>
                                <td><span class="badge badge-ok">정상수신</span></td>
                                <td class="td-muted">14:22:01</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="customs-docs" style="display:none">
                <div class="card-section">
                    <div class="card-header">
                        <h3>세관 신고 서류 보관함</h3>
                        <div class="btn-row">
                            <button class="btn btn-secondary" style="font-size:11px;padding:6px 12px">기간별 조회</button>
                        </div>
                    </div>
                    <table class="data-table">
                        <thead><tr><th>구분</th><th>B/L 번호</th><th>서류명</th><th>신고일자</th><th>전자서명</th><th>관리</th></tr></thead>
                        <tbody>
                            <tr>
                                <td><span class="chip gray">수입</span></td>
                                <td class="td-id">ONEU-2233445</td>
                                <td>반입신고서 (WH-016)</td>
                                <td class="td-muted">2026-04-16</td>
                                <td><span class="badge badge-ok">인증완료</span></td>
                                <td><button class="mini mini-view">보기</button></td>
                            </tr>
                            <tr>
                                <td><span class="chip blue">반출</span></td>
                                <td class="td-id">EXP-KOR-8801</td>
                                <td>반출신고서 (WH-019)</td>
                                <td class="td-muted">2026-04-15</td>
                                <td><span class="badge badge-ok">인증완료</span></td>
                                <td><button class="mini mini-view">보기</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="alert-bar warn" style="margin-top:20px">
                    <span class="material-symbols-outlined">gavel</span>
                    보세구역 운영 기록은 관세법에 의거하여 5년간 의무 보관됩니다.
                </div>
            </div>
        </div>

        <jsp:include page="/WEB-INF/views/warehouse/common/footer.jsp" />
    </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/warehouse/common.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/warehouse/navigation.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/warehouse/customs.js"></script>
<script>
    (function () {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab') || 'status';

        if (!window._customsInitialLoaded) {
            if (typeof switchCustomsTab === 'function') {
                setTimeout(function() { switchCustomsTab(tab); }, 10);
            }
            window._customsInitialLoaded = true;
        }
    })();
</script>
</body>
</html>
