<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
    request.setAttribute("activeMenu", "transport");
    request.setAttribute("activeGroup", "transport");
    request.setAttribute("activeSub", "forwarder");
    request.setAttribute("transportTab", "export");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <title>TACS 수출 운송</title>
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
                <div id="trans-export-trans">
                    <div class="filter-bar" style="margin-bottom:20px; border-left:3px solid #565e74;">
                        <div class="search-wrap" style="flex:1">
                            <span class="material-symbols-outlined">search</span>
                            <input placeholder="의뢰번호 · 운송업체 · 운송구간 검색" style="width:100%"/>
                        </div>
                        <select style="min-width:120px">
                            <option>전체 상태</option>
                            <option>운송중</option>
                            <option>선적대기</option>
                            <option>예약확정</option>
                        </select>
                        <input style="padding:6px 8px;border:1px solid #e2e8f0;font-size:12px" type="date"/>
                        <span style="font-size:11px;color:#94a3b8">~</span>
                        <input style="padding:6px 8px;border:1px solid #e2e8f0;font-size:12px" type="date"/>
                        <button class="btn btn-dark">조회</button>
                    </div>
                    <div style="font-size:12px;font-weight:700;color:#475569;margin-bottom:10px">수출 운송 진행 현황</div>
                    <div class="card-section">
                        <table class="data-table">
                            <thead>
                            <tr>
                                <th>의뢰번호</th>
                                <th>운송 구간</th>
                                <th>운송업체</th>
                                <th>선적일(ETD)</th>
                                <th>도착예정일(ETA)</th>
                                <th>수출신고필증</th>
                                <th>상태</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><span
                                        style="background:#dbeafe;color:#1d4ed8;font-size:10px;font-weight:700;padding:2px 6px;margin-right:6px">수출</span><a
                                        href="${pageContext.request.contextPath}/owner/transport/export/detail.do/EXP-001"
                                        style="cursor:pointer;text-decoration:underline;color:#1d4ed8;font-size:13px;font-weight:800">EXP-001</a>
                                </td>
                                <td style="font-weight:600"><span class="material-symbols-outlined"
                                                                  style="font-size:14px;vertical-align:middle;margin-right:4px;color:#94a3b8">directions_boat</span>부산
                                    <span style="color:#cbd5e1">→</span> LA
                                </td>
                                <td>대한포워딩</td>
                                <td>2026-04-20</td>
                                <td style="font-weight:700;color:#0f172a">04/27</td>
                                <td><span class="badge badge-ok">수령</span></td>
                                <td><span class="badge badge-ok">운송중</span></td>
                                <td><a class="mini mini-view"
                                       href="${pageContext.request.contextPath}/owner/transport/export/detail.do/EXP-001"
                                       style="text-decoration:none">상세보기</a></td>
                            </tr>
                            <tr>
                                <td><span
                                        style="background:#dbeafe;color:#1d4ed8;font-size:10px;font-weight:700;padding:2px 6px;margin-right:6px">수출</span><a
                                        href="${pageContext.request.contextPath}/owner/transport/export/detail.do/EXP-003"
                                        style="cursor:pointer;text-decoration:underline;color:#1d4ed8;font-size:13px;font-weight:800">EXP-003</a>
                                </td>
                                <td style="font-weight:600"><span class="material-symbols-outlined"
                                                                  style="font-size:14px;vertical-align:middle;margin-right:4px;color:#94a3b8">directions_boat</span>인천
                                    <span style="color:#cbd5e1">→</span> 함부르크
                                </td>
                                <td>글로벌로지스</td>
                                <td>2026-04-25</td>
                                <td style="font-weight:700;color:#0f172a">05/10</td>
                                <td><span class="badge badge-ok">수령</span></td>
                                <td><span class="badge badge-wait">선적대기</span></td>
                                <td><a class="mini mini-view"
                                       href="${pageContext.request.contextPath}/owner/transport/export/detail.do/EXP-003"
                                       style="text-decoration:none">상세보기</a></td>
                            </tr>
                            <tr>
                                <td><span
                                        style="background:#dbeafe;color:#1d4ed8;font-size:10px;font-weight:700;padding:2px 6px;margin-right:6px">수출</span><a
                                        href="${pageContext.request.contextPath}/owner/transport/export/detail.do/EXP-006"
                                        style="cursor:pointer;text-decoration:underline;color:#1d4ed8;font-size:13px;font-weight:800">EXP-006</a>
                                </td>
                                <td style="font-weight:600"><span class="material-symbols-outlined"
                                                                  style="font-size:14px;vertical-align:middle;margin-right:4px;color:#94a3b8">flight</span>인천
                                    <span style="color:#cbd5e1">→</span> 싱가포르
                                </td>
                                <td>대한포워딩</td>
                                <td>2026-05-12</td>
                                <td style="font-weight:700;color:#0f172a">05/15</td>
                                <td><span class="badge badge-wait">미수령</span></td>
                                <td><span class="badge badge-new">예약확정</span></td>
                                <td><a class="mini mini-view"
                                       href="${pageContext.request.contextPath}/owner/transport/export/detail.do/EXP-006"
                                       style="text-decoration:none">상세보기</a></td>
                            </tr>
                            </tbody>
                        </table>
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
