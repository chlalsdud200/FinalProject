<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<main class="ml-72 pt-16 min-h-screen bg-surface">
  <c:set var="initialGroup" value="${transportInitialGroup}" />
  <c:set var="initialItem" value="${transportInitialItem}" />
  <c:set var="showInitialDetail" value="${not empty initialGroup and initialGroup ne 'dashboard'}" />

  <style>
    #dashboard-view.tacs-dashboard-shell {
      padding: 32px 36px !important;
      display: block;
    }
    #dashboard-view.tacs-dashboard-shell.hidden {
      display: none !important;
    }
    #dashboard-view .tacs-dashboard-hero {
      min-height: 58px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 14px 24px;
      border-left: 6px solid #475569;
      background: #dbe7ff;
      color: #0f172a;
      box-sizing: border-box;
    }
    #dashboard-view .tacs-dashboard-hero h2 {
      margin: 0 0 4px;
      font-size: 15px;
      font-weight: 900;
      line-height: 1.2;
    }
    #dashboard-view .tacs-dashboard-hero p {
      margin: 0;
      font-size: 12px;
      font-weight: 700;
      color: #475569;
    }
    #dashboard-view .tacs-dashboard-kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 20px;
      margin-top: 22px;
    }
    #dashboard-view .tacs-dashboard-kpi {
      display: block;
      width: 100%;
      min-height: 112px;
      padding: 22px 26px 18px;
      border: 0;
      border-bottom: 4px solid #475569;
      background: #fff;
      text-align: left;
      cursor: pointer;
      box-sizing: border-box;
    }
    #dashboard-view .tacs-dashboard-kpi span {
      display: block;
      margin-bottom: 12px;
      font-size: 12px;
      font-weight: 900;
      color: #0f172a;
    }
    #dashboard-view .tacs-dashboard-kpi strong {
      display: block;
      font-size: 42px;
      font-weight: 900;
      line-height: 1;
      color: #020617;
    }
    #dashboard-view .tacs-dashboard-panel {
      margin-top: 24px;
      background: #eaf3ff;
      padding: 18px 22px 32px;
      box-sizing: border-box;
    }
    #dashboard-view .tacs-dashboard-panel-title {
      margin: -18px -22px 22px;
      padding: 16px 24px;
      background: #334155;
      color: #fff;
      font-size: 15px;
      font-weight: 900;
    }
    #dashboard-view .tacs-dashboard-table-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }
    #dashboard-view .tacs-dashboard-table-card {
      min-height: 190px;
      padding: 18px 18px 22px;
      border: 1px solid #cbd5e1;
      background: #fff;
      box-sizing: border-box;
    }
    #dashboard-view .tacs-dashboard-table-card h4 {
      margin: 0 0 16px;
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
    }
    #dashboard-view .tacs-dashboard-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
    }
    #dashboard-view .tacs-dashboard-table th {
      height: 34px;
      background: #eaf3ff;
      color: #475569;
      font-size: 10px;
      font-weight: 900;
      text-align: center;
    }
    #dashboard-view .tacs-dashboard-table td {
      height: 38px;
      border-bottom: 1px solid #dbe4f0;
      text-align: center;
      vertical-align: middle;
      word-break: keep-all;
    }
    #dashboard-view .tacs-dashboard-empty {
      padding: 22px 8px !important;
      color: #64748b !important;
      text-align: center !important;
    }
    #dashboard-view .tacs-dashboard-request-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #0f172a;
      font-weight: 900;
      text-decoration: none;
      cursor: pointer;
    }
    #dashboard-view .tacs-dashboard-request-link:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }
    @media (max-width: 1280px) {
      #dashboard-view .tacs-dashboard-kpi-grid,
      #dashboard-view .tacs-dashboard-table-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 900px) {
      #dashboard-view.tacs-dashboard-shell { padding: 24px 18px !important; }
      #dashboard-view .tacs-dashboard-hero { align-items: flex-start; flex-direction: column; }
      #dashboard-view .tacs-dashboard-kpi-grid,
      #dashboard-view .tacs-dashboard-table-grid { grid-template-columns: 1fr; }
    }
  </style>

  <c:if test="${not showInitialDetail}">
  <section id="dashboard-view" class="tacs-dashboard-shell ${showInitialDetail ? 'hidden' : ''}">
    <section class="tacs-dashboard-hero">
      <div>
        <h2>수출·수입운송 운영 현황</h2>
        <p>DB 조회 기준 · 수출/수입 운송의뢰 접수와 진행 현황을 확인합니다.</p>
      </div>
    </section>

    <section class="tacs-dashboard-kpi-grid">
      <button type="button" class="tacs-dashboard-kpi" data-dashboard-go-group="export" data-dashboard-go-item="TACS-FW-001" data-dashboard-go-url="${pageContext.request.contextPath}/transport/export.do?tab=request">
        <span>수출 운송 의뢰접수</span>
        <strong data-dashboard-export-count>${empty exportDashboardCount ? 0 : exportDashboardCount}</strong>
      </button>
      <button type="button" class="tacs-dashboard-kpi" data-dashboard-go-group="import" data-dashboard-go-item="TACS-FW-015" data-dashboard-go-url="${pageContext.request.contextPath}/transport/import.do?tab=request">
        <span>수입운송 의뢰접수</span>
        <strong data-dashboard-import-count>${empty importDashboardCount ? 0 : importDashboardCount}</strong>
      </button>
      <button type="button" class="tacs-dashboard-kpi" data-dashboard-go-group="import" data-dashboard-go-item="TACS-FW-023" data-dashboard-go-url="${pageContext.request.contextPath}/transport/import.do?tab=manifest">
        <span>적하목록 조회</span>
        <strong data-dashboard-import-manifest-count>${empty importManifestDashboardCount ? 0 : importManifestDashboardCount}</strong>
      </button>
      <button type="button" class="tacs-dashboard-kpi" data-dashboard-go-group="import" data-dashboard-go-item="TACS-FW-035" data-dashboard-go-url="${pageContext.request.contextPath}/transport/import.do?tab=inland">
        <span>내륙운송 배차처리</span>
        <strong data-dashboard-import-inland-count>${empty importInlandDashboardCount ? 0 : importInlandDashboardCount}</strong>
      </button>
    </section>

    <section class="tacs-dashboard-panel">
      <h3 class="tacs-dashboard-panel-title">수출·수입 의뢰접수 현황</h3>

      <div class="tacs-dashboard-table-grid">
        <article class="tacs-dashboard-table-card">
          <h4>수출 운송 의뢰접수</h4>
          <div class="overflow-x-auto">
            <table class="tacs-dashboard-table">
              <thead>
              <tr>
                <th>의뢰번호</th>
                <th>화주</th>
                <th>요청일시</th>
                <th>요청사항</th>
              </tr>
              </thead>
              <tbody id="dashboard-export-request-tbody">
              <c:choose>
                <c:when test="${not empty exportRequestList}">
                  <c:forEach var="req" items="${exportRequestList}" end="4">
                      <tr>
                        <td><a class="tacs-dashboard-request-link" data-dashboard-request-link="true" data-dashboard-request-group="export" data-dashboard-request-no="${req.trcNo}" href="${pageContext.request.contextPath}/transport/export.do?tab=request&amp;trcNo=${req.trcNo}"><c:out value="${req.trcNo}" /></a></td>
                        <td><c:out value="${req.ownerNm}" /></td>
                        <td><c:out value="${req.requestDt}" /></td>
                        <td><span class="status-chip"><c:out value="${empty req.requestDisplayStatusNm ? req.statusNm : req.requestDisplayStatusNm}" /></span></td>
                      </tr>
                  </c:forEach>
                </c:when>
                <c:otherwise>
                  <tr><td colspan="4" class="tacs-dashboard-empty">표시할 수출 운송의뢰가 없습니다.</td></tr>
                </c:otherwise>
              </c:choose>
              </tbody>
            </table>
          </div>
        </article>

        <article class="tacs-dashboard-table-card">
          <h4>수입운송 의뢰접수</h4>
          <div class="overflow-x-auto">
            <table class="tacs-dashboard-table">
              <thead>
              <tr>
                <th>의뢰번호</th>
                <th>화주</th>
                <th>요청일시</th>
                <th>요청사항</th>
              </tr>
              </thead>
              <tbody id="dashboard-import-request-tbody">
              <c:choose>
                <c:when test="${not empty importRequestList}">
                  <c:forEach var="req" items="${importRequestList}" end="4">
                      <tr>
                        <td><a class="tacs-dashboard-request-link" data-dashboard-request-link="true" data-dashboard-request-group="import" data-dashboard-request-no="${req.trcNo}" href="${pageContext.request.contextPath}/transport/import.do?tab=detail&amp;trcNo=${req.trcNo}"><c:out value="${req.trcNo}" /></a></td>
                        <td><c:out value="${req.ownerNm}" /></td>
                        <td><c:out value="${req.requestDt}" /></td>
                        <td><span class="status-chip"><c:out value="${empty req.requestDisplayStatusNm ? req.statusNm : req.requestDisplayStatusNm}" /></span></td>
                      </tr>
                  </c:forEach>
                </c:when>
                <c:otherwise>
                  <tr><td colspan="4" class="tacs-dashboard-empty">표시할 수입 운송의뢰가 없습니다.</td></tr>
                </c:otherwise>
              </c:choose>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  </section>

  </c:if>
<section id="detail-view" class="${showInitialDetail ? '' : 'hidden'}">
    <div class="p-8" id="detail-body">
      <c:if test="${initialGroup eq 'import' and initialItem eq 'TACS-FW-015'}">
        <div class="space-y-6 import-request-server-render">
          <div class="section-card import-left-list-card">
            <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div><h4 class="text-sm font-bold text-slate-900">운송의뢰</h4></div>
            </div>
            <div class="p-6 space-y-6">
              <div class="list-search-grid">
                <div>
                  <label class="field-label">의뢰번호</label>
                  <input class="field-input js-import-filter-request-no" type="text" placeholder="IMP 의뢰번호 검색" />
                </div>
                <div>
                  <label class="field-label">화주명</label>
                  <input class="field-input js-import-filter-shipper" type="text" placeholder="화주명 검색" />
                </div>
                <div>
                  <label class="field-label">Master B/L</label>
                  <input class="field-input js-import-filter-bl" type="text" placeholder="Master B/L 번호 검색" />
                </div>
                <div>
                  <label class="field-label">접수상태</label>
                  <select class="field-select js-import-filter-receipt-status">
                    <option value="전체">전체</option>
                    <option value="접수대기">접수대기</option>
                    <option value="접수완료">접수완료</option>
                    <option value="접수반려">접수반려</option>
                  </select>
                </div>
                <div>
                  <label class="field-label">입고 및 반출상태</label>
                  <select class="field-select js-import-filter-inout-status">
                    <option value="전체">전체</option>
                    <option value="입고대기">입고대기</option>
                    <option value="입고완료">입고완료</option>
                    <option value="입고 보완요청">입고 보완요청</option>
                    <option value="반출대기">반출대기</option>
                    <option value="반출완료">반출완료</option>
                    <option value="반출 보완요청">반출 보완요청</option>
                  </select>
                </div>
                <div>
                  <label class="field-label">도착통지서 발급상태</label>
                  <select class="field-select js-import-filter-arrival-status">
                    <option value="전체">전체</option>
                    <option value="미발급">미발급</option>
                    <option value="발급완료">발급완료</option>
                  </select>
                </div>
                <button type="button" class="js-import-request-refresh">조회</button>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full tbl">
                  <thead>
                  <tr>
                    <th>의뢰번호</th>
                    <th>화주명</th>
                    <th>바이어명</th>
                    <th>Master B/L</th>
                    <th>도착항</th>
                    <th>접수상태</th>
                    <th>등록일시</th>
                    <th>처리</th>
                  </tr>
                  </thead>
                  <tbody class="js-import-request-tbody text-sm text-slate-700">
                  <c:forEach var="req" items="${importRequestList}">
                    <c:set var="requestNo" value="${req.trcNo}" />
                    <c:set var="buyerNm" value="${req.buyerNm}" />
                    <c:set var="mblNo" value="${empty req.mblNo ? req.blNo : req.mblNo}" />
                    <c:set var="statusNm" value="${empty req.requestDisplayStatusNm ? req.statusNm : req.requestDisplayStatusNm}" />
                    <tr>
                      <td class="font-bold"><c:out value="${requestNo}" /></td>
                      <td><c:out value="${req.ownerNm}" /></td>
                      <td><c:out value="${buyerNm}" /></td>
                      <td><c:out value="${mblNo}" /></td>
                      <td><c:out value="${empty req.arvlPortCd ? req.arvlPortNm : req.arvlPortCd}" /></td>
                      <td><span class="inline-flex px-3 py-1 border text-xs font-bold bg-slate-50 text-slate-900 border-slate-300"><c:out value="${statusNm}" /></span></td>
                      <td><c:out value="${req.requestDt}" /></td>
                      <td><button type="button" class="import-list-action-btn import-request-detail-btn bg-slate-800 text-white text-xs font-bold" data-request-no="${requestNo}">상세</button></td>
                    </tr>
                  </c:forEach>
                  <c:if test="${empty importRequestList}">
                    <tr><td colspan="8" class="text-center py-8 text-slate-500">조회 조건에 맞는 수입 운송의뢰가 없습니다.</td></tr>
                  </c:if>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </c:if>
      <c:if test="${initialGroup eq 'docs'}">
        <c:set var="docsRole" value="TRANSPORT_MANAGER" scope="request" />
        <c:choose>
          <c:when test="${initialItem eq 'TACS-DC-002'}">
            <jsp:include page="/WEB-INF/views/common/trashContent.jsp" />
          </c:when>
          <c:otherwise>
            <jsp:include page="/WEB-INF/views/common/docsContent.jsp" />
          </c:otherwise>
        </c:choose>
      </c:if>
    </div>
  </section>
</main>
