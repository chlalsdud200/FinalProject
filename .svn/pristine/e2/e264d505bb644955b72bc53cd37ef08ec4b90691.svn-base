<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>창고료 산정 및 정산 - TACS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/warehouse/base.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/warehouse/sidebar.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/warehouse/topbar.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/warehouse/settlement.css">
</head>
<body>
<div class="app" id="app">
    <jsp:include page="/WEB-INF/views/warehouse/common/sidebar.jsp" />
    
    <div class="main-wrap">
        <jsp:include page="/WEB-INF/views/warehouse/common/header.jsp" />
        
        <div class="content">
            <div class="page-title-row">
                <h2>창고료 산정 및 정산 (WH-023)</h2>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="s-label">정산 확정 대기</div>
                    <div class="s-num">12</div>
                    <div class="s-sub">산정 완료 건</div>
                </div>
                <div class="stat-card c2">
                    <div class="s-label">미납 금액</div>
                    <div class="s-num">32.2</div>
                    <div class="s-sub">백만원 · 12건</div>
                </div>
                <div class="stat-card c4">
                    <div class="s-label">완납 완료</div>
                    <div class="s-num">201.6</div>
                    <div class="s-sub">백만원 · 136건</div>
                </div>
            </div>

            <div class="filter-bar" style="margin-bottom: 20px; border-left: 3px solid #1d6b4f;">
                <div class="search-wrap" style="position:relative; flex:1">
                    <span class="material-symbols-outlined" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:18px; color:#94a3b8">search</span>
                    <input placeholder="B/L 번호, 화주명, 또는 정산 번호 입력" style="padding:10px 12px 10px 40px; border:1px solid #e2e8f0; width:100%; font-size:13px; outline:none;">
                </div>
                <button class="btn btn-dark" style="padding:10px 24px;">조회</button>
            </div>

            <div class="card-section">
                <div class="card-header"><h3>화물별 정산 현황</h3></div>
                <table class="data-table">
                    <thead><tr><th>B/L 번호</th><th>화주명</th><th>최종 청구액</th><th>상태</th></tr></thead>
                    <tbody>
                        <tr>
                            <td class="td-id">HDMU-1029384</td>
                            <td>한성로지스</td>
                            <td class="td-id">₩450,000</td>
                            <td><span class="badge badge-urgent">미납</span> <button class="mini mini-reject" onclick="openReminderModal('HDMU-1029384', '한성로지스', '450,000')">알림</button></td>
                        </tr>
                        <tr style="background:#f0fdf4">
                            <td class="td-id">ONEU-2233445</td>
                            <td>신선유통</td>
                            <td class="td-id">₩280,000</td>
                            <td><span class="badge badge-ok">완납</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <jsp:include page="/WEB-INF/views/warehouse/common/footer.jsp" />
    </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/warehouse/common.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/warehouse/navigation.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/warehouse/settlement.js"></script>
</body>
</html>
