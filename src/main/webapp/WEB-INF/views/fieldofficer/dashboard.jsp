<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/fieldofficer/common/taglibs.jsp" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="activeMenu" value="dashboard" />
<c:set var="activeSub" value="" />

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/fieldofficer/header/head.jsp" %>
    <link rel="stylesheet" href="${ctx}/resources/css/fieldofficer/dashboard.css">
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/fieldofficer/header/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/fieldofficer/header/header.jsp" %>

        <div class="content">
			<div class="page active" id="pg-dash">
			
			    <!-- 대시보드 통계 카드 -->
			    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
			        <div class="stat-card" onclick="location.href='${ctx}/fieldofficer/inspectionRequest.do'">
			            <div class="s-label">신규 요청</div>
			            <div class="s-row">
			                <span class="s-num">${dashboard.newRequestCnt}</span>
			                <span class="s-sub" style="color:#565e74">오늘 기준</span>
			            </div>
			        </div>
			
			        <div class="stat-card c2" onclick="location.href='${ctx}/fieldofficer/inspectionRequest.do'">
			            <div class="s-label">검역 판정 대기</div>
			            <div class="s-row">
			                <span class="s-num">${dashboard.judgeWaitCnt}</span>
			                <span class="s-sub" style="color:#d97706">판정 필요</span>
			            </div>
			        </div>
			
			        <div class="stat-card c4" onclick="location.href='${ctx}/fieldofficer/certs.do'">
			            <div class="s-label">결과 통보 완료</div>
			            <div class="s-row">
			                <span class="s-num">${dashboard.resultCompleteCnt}</span>
			                <span class="s-sub" style="color:#1d6b4f">금일 누적</span>
			            </div>
			        </div>
			
			        <div class="stat-card c3" onclick="location.href='${ctx}/fieldofficer/inspectionRequest.do'">
			            <div class="s-label">접수 처리율</div>
			            <div class="s-row">
			                <span class="s-num">${dashboard.processRate}</span>
			                <span class="s-sub" style="color:#605c78">금일 기준 %</span>
			            </div>
			        </div>
			    </div>
			
			    <!-- 최근 검역 요청 내역 -->
			    <div class="grid-2col" style="grid-template-columns:1fr">
			        <div class="card-section">
			            <div class="card-header">
			                <h3>최근 검역 요청 내역</h3>
			                <button type="button" onclick="location.href='${ctx}/fieldofficer/inspectionRequest.do'">전체 보기 →</button>
			            </div>
			
			            <c:choose>
			                <c:when test="${empty recentRequestList}">
			                    <div class="req-item">
			                        <div class="req-left">
			                            <div class="req-title">최근 검역 요청 내역이 없습니다.</div>
			                            <div class="req-sub">신규 검역 요청이 접수되면 이 영역에 표시됩니다.</div>
			                        </div>
			                    </div>
			                </c:when>
			
			                <c:otherwise>
			                    <c:forEach var="item" items="${recentRequestList}">
			                        <div class="req-item ${item.urgentYn eq 'Y' ? 'urgent' : ''} ${item.newYn eq 'Y' ? 'new-item' : ''}">
			                            <div class="req-left">
			                                <div class="req-title">
			                                    수입 검역 요청 - ${item.iirMainGoodsNm}
			
			                                    <c:if test="${item.newYn eq 'Y'}">
			                                        <span class="badge badge-new">NEW</span>
			                                    </c:if>
			
			                                    <c:if test="${item.urgentYn eq 'Y'}">
			                                        <span class="badge badge-urgent">긴급</span>
			                                    </c:if>
			
			                                    <c:if test="${item.iirResultStatusCd eq '검역진행중'}">
			                                        <span class="badge badge-rev">판정대기</span>
			                                    </c:if>
			                                </div>
			
			                                <div class="req-sub">
			                                    ${item.iirReqNo}
			                                    · ${item.iirQrtnInstCd}
			                                    · ${item.iirStatusCd}
			                                    · ${item.iirDt}
			                                </div>
			                            </div>
			
			                            <div class="req-right">
			                                <button type="button"
			                                        class="mini mini-view"
			                                        onclick="location.href='${ctx}/fieldofficer/inspectionRequest/detail.do?reqNo=${item.iirReqNo}'">
			                                    상세
			                                </button>
			                            </div>
			                        </div>
			                    </c:forEach>
			                </c:otherwise>
			            </c:choose>
			        </div>
			    </div>
			
			    <!-- 하단 처리 상세 / 마감 일정 -->
			    <div class="bottom-grid">
			        <div class="data-block">
			            <h3>검역 처리 상세</h3>
			
			            <div class="data-grid">
			                <div class="d-item">
			                    <div class="d-label">보완요청</div>
			                    <div class="d-val">${dashboard.supplementCnt}<span class="d-unit">건</span></div>
			                </div>
			
			                <div class="d-item">
			                    <div class="d-label">판정대기</div>
			                    <div class="d-val">${dashboard.judgeWaitCnt}<span class="d-unit">건</span></div>
			                </div>
			            </div>
			        </div>
			
			        <div class="deadline-block">
			            <h3>다가오는 기한</h3>
			
			            <c:choose>
			                <c:when test="${empty deadlineList}">
			                    <div class="dl-item">
			                        <div class="dl-left">
			                            마감 예정 검역 요청이 없습니다.
			                            <span>회신기한이 있는 요청이 접수되면 표시됩니다.</span>
			                        </div>
			                        <div class="dl-right safe">-</div>
			                    </div>
			                </c:when>
			
			                <c:otherwise>
			                    <c:forEach var="item" items="${deadlineList}">
			                        <div class="dl-item">
			                            <div class="dl-left">
			                                ${item.iirMainGoodsNm}
			                                <span>${item.iirReqNo}</span>
			                            </div>
			
			                            <div class="dl-right ${item.ddayClass}">
			                                ${item.ddayText}
			                            </div>
			                        </div>
			                    </c:forEach>
			                </c:otherwise>
			            </c:choose>
			        </div>
			    </div>
			
			</div>
        </div>

        <%@ include file="/WEB-INF/views/fieldofficer/footer/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/fieldofficer/footer/modals.jsp" %>
<%@ include file="/WEB-INF/views/fieldofficer/footer/scripts.jsp" %>
</body>
</html>
