<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<%
    request.setAttribute("activeMenu", "dashboard");
    request.setAttribute("activeGroup", "");
    request.setAttribute("activeSub", "");
%>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <title>TACS 화주 대시보드</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet">

    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner.css">
</head>

<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/owner/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/common/header.jsp" %>

        <main class="content">
            <div class="page active" id="pg-dash">

                <!-- 타이틀 -->
                <div class="page-title-row">
                    <h2>업무 현황</h2>
                    <span class="date-label">화주 대시보드</span>
                </div>

                <!-- KPI 4개 -->
                <div class="stats-grid">
                    <div class="stat-card"
                         onclick="location.href='${pageContext.request.contextPath}/owner/export/list.do'">
                        <div class="s-label">수출통관 진행</div>
                        <div class="s-num">${summary.exportProgressCnt}</div>
                        <div class="s-sub">진행 중 ${summary.exportProgressCnt}건</div>
                    </div>

                    <div class="stat-card c2"
                         onclick="location.href='${pageContext.request.contextPath}/owner/import/list.do'">
                        <div class="s-label">수입통관 진행</div>
                        <div class="s-num">${summary.importProgressCnt}</div>
                        <div class="s-sub">진행 중 ${summary.importProgressCnt}건</div>
                    </div>

                    <div class="stat-card c3"
                         onclick="location.href='${pageContext.request.contextPath}/owner/arrival-notice/list.do'">
                        <div class="s-label">도착 통지</div>
                        <div class="s-num">${summary.arrivalNoticeCnt}</div>
                        <div class="s-sub">미확인 ${summary.arrivalNoticeCnt}건</div>
                    </div>

                    <div class="stat-card c4"
                         onclick="location.href='${pageContext.request.contextPath}/owner/tariff/duty/list.do'">
                        <div class="s-label">관세 납부</div>
                        <div class="s-num">${summary.taxWaitCnt}</div>
                        <div class="s-sub">납부 대기 ${summary.taxWaitCnt}건</div>
                    </div>
                </div>

                <!-- 3컬럼 메인 영역 -->
                <div class="dash-3col">

                    <!-- ① 진행 건 목록 -->
                    <div class="card-section" style="margin-bottom:0">
                        <div class="card-header">
                            <h3>진행 중인 통관 건</h3>
                            <div style="display:flex;gap:6px">
                                <button type="button"
                                        onclick="location.href='${pageContext.request.contextPath}/owner/export/list.do'">
                                    수출
                                </button>
                                <button type="button"
                                        onclick="location.href='${pageContext.request.contextPath}/owner/import/list.do'">
                                    수입
                                </button>
                            </div>
                        </div>

                        <div class="prog-tab-bar">
                            <button type="button"
                                    class="prog-tab active"
                                    onclick="switchProgTab('export', this)">
                                수출 (${summary.exportProgressCnt}건)
                            </button>
                            <button type="button"
                                    class="prog-tab"
                                    onclick="switchProgTab('import', this)">
                                수입 (${summary.importProgressCnt}건)
                            </button>
                        </div>

                        <!-- 수출 목록 -->
                        <div class="prog-list active" id="prog-export">
                            <c:choose>
                                <c:when test="${not empty exportProgressList}">
                                    <c:forEach var="item" items="${exportProgressList}">
                                        <div class="prog-item">
                                            <div class="prog-item-left">
                                                <div class="prog-item-id">${item.reqNo}</div>
                                                <div class="prog-item-party">
                                                    <c:choose>
                                                        <c:when test="${not empty item.traderNm}">
                                                            ${item.traderNm}
                                                        </c:when>
                                                        <c:otherwise>
                                                            수출통관 의뢰
                                                        </c:otherwise>
                                                    </c:choose>
                                                </div>
                                            </div>

                                            <div class="prog-item-right">
                                                <span class="${item.badgeClass}">${item.statusNm}</span>
                                                <button type="button"
                                                        class="${item.buttonClass}"
                                                        onclick="location.href='${pageContext.request.contextPath}${item.detailUrl}'">
                                                        ${item.buttonText}
                                                </button>
                                            </div>
                                        </div>
                                    </c:forEach>
                                </c:when>

                                <c:otherwise>
                                    <div class="prog-item">
                                        <div class="prog-item-left">
                                            <div class="prog-item-id">진행 중인 수출 통관 건이 없습니다.</div>
                                            <div class="prog-item-party">새로운 수출 통관 의뢰를 등록해 주세요.</div>
                                        </div>
                                        <div class="prog-item-right">
                                            <button type="button"
                                                    class="mini mini-view"
                                                    onclick="location.href='${pageContext.request.contextPath}/owner/export/list.do'">
                                                목록
                                            </button>
                                        </div>
                                    </div>
                                </c:otherwise>
                            </c:choose>
                        </div>

                        <!-- 수입 목록 -->
                        <div class="prog-list" id="prog-import">
                            <c:choose>
                                <c:when test="${not empty importProgressList}">
                                    <c:forEach var="item" items="${importProgressList}">
                                        <div class="prog-item">
                                            <div class="prog-item-left">
                                                <div class="prog-item-id">${item.reqNo}</div>
                                                <div class="prog-item-party">
                                                    <c:choose>
                                                        <c:when test="${not empty item.traderNm}">
                                                            B/L · ${item.traderNm}
                                                        </c:when>
                                                        <c:otherwise>
                                                            수입통관 의뢰
                                                        </c:otherwise>
                                                    </c:choose>
                                                </div>
                                            </div>

                                            <div class="prog-item-right">
                                                <span class="${item.badgeClass}">${item.statusNm}</span>
                                                <button type="button"
                                                        class="${item.buttonClass}"
                                                        onclick="location.href='${pageContext.request.contextPath}${item.detailUrl}'">
                                                        ${item.buttonText}
                                                </button>
                                            </div>
                                        </div>
                                    </c:forEach>
                                </c:when>

                                <c:otherwise>
                                    <div class="prog-item">
                                        <div class="prog-item-left">
                                            <div class="prog-item-id">진행 중인 수입 통관 건이 없습니다.</div>
                                            <div class="prog-item-party">새로운 수입 통관 의뢰를 등록해 주세요.</div>
                                        </div>
                                        <div class="prog-item-right">
                                            <button type="button"
                                                    class="mini mini-view"
                                                    onclick="location.href='${pageContext.request.contextPath}/owner/import/list.do'">
                                                목록
                                            </button>
                                        </div>
                                    </div>
                                </c:otherwise>
                            </c:choose>
                        </div>
                    </div>

                    <!-- ② 보완요청 -->
                    <div class="card-section" style="margin-bottom:0">
                        <div class="card-header">
                            <h3>
                                보완요청
                                <span style="background:#fe8983;color:#752121;font-size:10px;font-weight:800;padding:2px 8px;margin-left:6px">
                ${summary.exportSuppCnt + summary.importSuppCnt}건
            </span>
                            </h3>
                            <div style="display:flex;gap:6px">
                                <button type="button"
                                        onclick="location.href='${pageContext.request.contextPath}/owner/export/list.do'">
                                    수출
                                </button>
                                <button type="button"
                                        onclick="location.href='${pageContext.request.contextPath}/owner/import/list.do'">
                                    수입
                                </button>
                            </div>
                        </div>

                        <div class="prog-tab-bar">
                            <button type="button"
                                    class="prog-tab active"
                                    onclick="switchDocReqTab('export', this)">
                                수출 (${summary.exportSuppCnt}건)
                            </button>
                            <button type="button"
                                    class="prog-tab"
                                    onclick="switchDocReqTab('import', this)">
                                수입 (${summary.importSuppCnt}건)
                            </button>
                        </div>

                        <!-- 수출 보완요청 -->
                        <div class="prog-list active" id="doc-req-export">
                            <c:choose>
                                <c:when test="${not empty exportSuppList}">
                                    <c:forEach var="item" items="${exportSuppList}">
                                        <div class="doc-req-item">
                                            <div class="doc-req-icon broker"></div>

                                            <div class="doc-req-body">
                                                <div class="doc-req-title">
                                                    <c:choose>
                                                        <c:when test="${not empty item.suppTitle}">
                                                            ${item.suppTitle}
                                                        </c:when>
                                                        <c:otherwise>
                                                            보완요청
                                                        </c:otherwise>
                                                    </c:choose>
                                                </div>
                                                <div class="doc-req-meta">
                                                    관세사 요청 &nbsp;·&nbsp; ${item.reqNo} &nbsp;·&nbsp; ${item.requesterNm}
                                                </div>
                                            </div>

                                            <div class="doc-req-right">
                                                <span class="doc-req-dday ${item.ddayClass}">${item.statusNm}</span>
                                                <button type="button"
                                                        class="${item.buttonClass}"
                                                        onclick="location.href='${pageContext.request.contextPath}${item.detailUrl}'">
                                                        ${item.buttonText}
                                                </button>
                                            </div>
                                        </div>
                                    </c:forEach>
                                </c:when>

                                <c:otherwise>
                                    <div class="doc-req-item">
                                        <div class="doc-req-icon broker"></div>
                                        <div class="doc-req-body">
                                            <div class="doc-req-title">수출 보완요청이 없습니다.</div>
                                            <div class="doc-req-meta">현재 처리할 보완요청이 없습니다.</div>
                                        </div>
                                    </div>
                                </c:otherwise>
                            </c:choose>
                        </div>

                        <!-- 수입 보완요청 -->
                        <div class="prog-list" id="doc-req-import">
                            <c:choose>
                                <c:when test="${not empty importSuppList}">
                                    <c:forEach var="item" items="${importSuppList}">
                                        <div class="doc-req-item">
                                            <div class="doc-req-icon broker"></div>

                                            <div class="doc-req-body">
                                                <div class="doc-req-title">
                                                    <c:choose>
                                                        <c:when test="${not empty item.suppTitle}">
                                                            ${item.suppTitle}
                                                        </c:when>
                                                        <c:otherwise>
                                                            보완요청
                                                        </c:otherwise>
                                                    </c:choose>
                                                </div>
                                                <div class="doc-req-meta">
                                                    관세사 요청 &nbsp;·&nbsp; ${item.reqNo} &nbsp;·&nbsp; ${item.requesterNm}
                                                </div>
                                            </div>

                                            <div class="doc-req-right">
                                                <span class="doc-req-dday ${item.ddayClass}">${item.statusNm}</span>
                                                <button type="button"
                                                        class="${item.buttonClass}"
                                                        onclick="location.href='${pageContext.request.contextPath}${item.detailUrl}'">
                                                        ${item.buttonText}
                                                </button>
                                            </div>
                                        </div>
                                    </c:forEach>
                                </c:when>

                                <c:otherwise>
                                    <div class="doc-req-item">
                                        <div class="doc-req-icon broker"></div>
                                        <div class="doc-req-body">
                                            <div class="doc-req-title">수입 보완요청이 없습니다.</div>
                                            <div class="doc-req-meta">현재 처리할 보완요청이 없습니다.</div>
                                        </div>
                                    </div>
                                </c:otherwise>
                            </c:choose>
                        </div>

                        <c:if test="${summary.exportSuppCnt + summary.importSuppCnt gt 0}">
                            <div style="padding:12px 16px;background:#fff8f8;border-top:1px solid #f1f5f9">
                                <div style="font-size:11px;color:#9f403d;font-weight:600">
                                    ⚠ 처리해야 할 보완요청이 ${summary.exportSuppCnt + summary.importSuppCnt}건 있습니다. 확인 후 제출하세요.
                                </div>
                            </div>
                        </c:if>
                    </div>

                    <!-- ③ 최근 알림 피드 -->
                    <div class="card-section" style="margin-bottom:0">
                        <div class="card-header">
                            <h3>최근 알림</h3>
                        </div>

                        <c:choose>
                            <c:when test="${not empty recentNotificationList}">
                                <c:forEach var="noti" items="${recentNotificationList}">
                                    <div class="feed-item"
                                         style="cursor:pointer"
                                         onclick="goNotiLink('${noti.linkUrl}')">
                                        <div class="feed-dot ${noti.dotClass}"></div>
                                        <div class="feed-body">
                                            <div class="feed-time">${noti.timeText}</div>
                                            <div class="feed-text">${noti.title}</div>
                                        </div>
                                    </div>
                                </c:forEach>
                            </c:when>

                            <c:otherwise>
                                <div class="feed-item">
                                    <div class="feed-dot"></div>
                                    <div class="feed-body">
                                        <div class="feed-time">-</div>
                                        <div class="feed-text">최근 알림이 없습니다.</div>
                                    </div>
                                </div>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>

                <!-- ④ 운송 ETA · 선박 위치 요약 -->
                <div class="card-section" style="margin-bottom:20px">
                    <div class="card-header">
                        <h3>운송 ETA · 선박 위치 요약</h3>
                        <button type="button" onclick="goAisVessels()">전체</button>
                    </div>

                    <div class="eta-strip" style="padding:16px;margin-bottom:0">
                        <div class="eta-card">
                            <div class="eta-route">상하이 → 인천</div>
                            <div class="eta-vessel">Ever Given &nbsp;·&nbsp; IMP-OW-004</div>
                            <div class="eta-footer">
                                <div class="eta-date">ETA 04/22</div>
                            </div>
                        </div>

                        <div class="eta-card">
                            <div class="eta-route">부산 → LA</div>
                            <div class="eta-vessel">Maersk Star &nbsp;·&nbsp; EXP-OW-003</div>
                            <div class="eta-footer">
                                <div class="eta-date">ETA 04/27</div>
                            </div>
                        </div>

                        <div class="eta-card">
                            <div class="eta-route">인천 → 함부르크</div>
                            <div class="eta-vessel">MSC Luna &nbsp;·&nbsp; EXP-OW-006</div>
                            <div class="eta-footer">
                                <div class="eta-date">ETA 05/10</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>

        <%@ include file="/WEB-INF/views/common/ownerModals.jsp" %>
        <%@ include file="/WEB-INF/views/common/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/ownerScripts.jsp" %>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof initExportRankChart === 'function') {
            initExportRankChart();
        }
    });

    function goAisVessels() {
        window.location.href = "http://127.0.0.1:5173/admin-react/ais/vessels";
    }

    function goNotiLink(linkUrl) {
        if (!linkUrl || linkUrl === '#') {
            return;
        }

        if (linkUrl.startsWith('http')) {
            window.location.href = linkUrl;
            return;
        }

        const ctx = document.querySelector('meta[name="ctx-path"]')?.content || '';
        window.location.href = ctx + linkUrl;
    }
</script>
</body>
</html>