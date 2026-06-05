<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<%
    request.setAttribute("activeMenu", "transport");
    request.setAttribute("activeGroup", "transport");
    request.setAttribute("activeSub", "freight");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <meta name="_csrf" content="${_csrf.token}">
    <meta name="_csrf_header" content="${_csrf.headerName}">
    <title>TACS 운임 정산 상세</title>

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

                <div id="trans-freight-detail">

                    <div class="freight-detail-head">
                        <a class="btn btn-secondary freight-back-btn"
                           href="${pageContext.request.contextPath}/owner/transport/freight/list.do">
                            <span class="material-symbols-outlined freight-back-icon">arrow_back</span>
                            목록
                        </a>

                        <div>
                            <div class="freight-detail-title">운임 정산 상세</div>
                            <div class="freight-detail-sub">청구 내역과 납부 상태를 확인합니다.</div>
                        </div>
                    </div>

                    <div class="card-section freight-detail-card">
                        <div class="freight-detail-top">
                            <div>
                                <div class="freight-detail-label">정산번호</div>
                                <div class="freight-detail-no">${freight.tcsNo}</div>
                                <div class="freight-detail-desc">
                                    운송의뢰번호 ${freight.tcsTrcNo}
                                </div>
                            </div>

                            <div class="freight-detail-status">
                                <c:choose>
                                    <c:when test="${freight.tcsStlStatusCd eq 'TRC_STL_PAID'}">
                                        <span class="doc-status ok">납부완료</span>
                                    </c:when>
                                    <c:when test="${freight.tcsStlStatusCd eq 'TRC_STL_REQ'}">
                                        <span class="doc-status wait">확인 대기</span>
                                    </c:when>
                                    <c:otherwise>
                                        <span class="doc-status none">청구서 검토</span>
                                    </c:otherwise>
                                </c:choose>
                            </div>
                        </div>

                        <div class="freight-summary-grid">
                            <div class="freight-summary-item">
                                <div class="freight-summary-label">화주 ID</div>
                                <div class="freight-summary-value">${freight.tcsOwrId}</div>
                            </div>

                            <div class="freight-summary-item">
                                <div class="freight-summary-label">물품그룹번호</div>
                                <div class="freight-summary-value">${freight.tcsGgNo}</div>
                            </div>

                            <div class="freight-summary-item">
                                <div class="freight-summary-label">M B/L 번호</div>
                                <div class="freight-summary-value">
                                    <c:choose>
                                        <c:when test="${not empty freight.tcsMblNo}">
                                            ${freight.tcsMblNo}
                                        </c:when>
                                        <c:otherwise>-</c:otherwise>
                                    </c:choose>
                                </div>
                            </div>

                            <div class="freight-summary-item">
                                <div class="freight-summary-label">H B/L 번호</div>
                                <div class="freight-summary-value">
                                    <c:choose>
                                        <c:when test="${not empty freight.tcsHblNo}">
                                            ${freight.tcsHblNo}
                                        </c:when>
                                        <c:otherwise>-</c:otherwise>
                                    </c:choose>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-section freight-detail-card">
                        <div class="freight-section-title">청구 금액 상세</div>

                        <div class="freight-bill-grid">
                            <div class="freight-bill-row">
                                <div class="freight-bill-label">운임 금액</div>
                                <div class="freight-bill-value">
                                    <fmt:formatNumber value="${freight.tcsFrgtAmt}" pattern="#,##0"/>
                                </div>
                            </div>

                            <div class="freight-bill-row">
                                <div class="freight-bill-label">창고 금액</div>
                                <div class="freight-bill-value">
                                    <fmt:formatNumber value="${freight.tcsWhAmt}" pattern="#,##0"/>
                                </div>
                            </div>

                            <div class="freight-bill-row total">
                                <div class="freight-bill-label">총 청구금액</div>
                                <div class="freight-bill-value">
                                    <fmt:formatNumber value="${freight.tcsTotBillAmt}" pattern="#,##0"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-section freight-detail-card">
                        <div class="freight-section-title">정산 설명</div>

                        <div class="freight-explain-box">
                            <c:choose>
                                <c:when test="${not empty freight.tcsStlExpln}">
                                    ${freight.tcsStlExpln}
                                </c:when>
                                <c:otherwise>
                                    등록된 정산 설명이 없습니다.
                                </c:otherwise>
                            </c:choose>
                        </div>
                    </div>

                    <c:if test="${freight.tcsStlStatusCd eq 'TRC_STL_PAID'}">
                        <div class="card-section freight-detail-card freight-cert-card">
                            <div class="freight-section-title">신고필증 업로드</div>

                            <div class="alert-bar info">
                                <span class="material-symbols-outlined">verified</span>
                                운송업체에게 전달할 신고필증을 업로드하세요. 필증에 적힌 B/L 번호와 정산 상세의 B/L 번호를 대조한 뒤 전달됩니다.
                            </div>

                            <div class="freight-cert-compare-box">
                                <div class="freight-summary-grid">
                                    <div class="freight-summary-item">
                                        <div class="freight-summary-label">상세 M B/L 번호</div>
                                        <div class="freight-summary-value" id="freightMblNo">
                                            <c:choose>
                                                <c:when test="${not empty freight.tcsMblNo}">
                                                    ${freight.tcsMblNo}
                                                </c:when>
                                                <c:otherwise>-</c:otherwise>
                                            </c:choose>
                                        </div>
                                    </div>

                                    <div class="freight-summary-item">
                                        <div class="freight-summary-label">상세 H B/L 번호</div>
                                        <div class="freight-summary-value" id="freightHblNo">
                                            <c:choose>
                                                <c:when test="${not empty freight.tcsHblNo}">
                                                    ${freight.tcsHblNo}
                                                </c:when>
                                                <c:otherwise>-</c:otherwise>
                                            </c:choose>
                                        </div>
                                    </div>

                                    <div class="freight-summary-item">
                                        <div class="freight-summary-label">파일에서 추출한 B/L 번호</div>
                                        <div class="freight-summary-value" id="certExtractedBlNo">
                                            파일 업로드 후 자동 판독
                                        </div>
                                    </div>

                                    <div class="freight-summary-item">
                                        <div class="freight-summary-label">AI 대조 결과</div>
                                        <div class="freight-summary-value" id="certMatchResult">
                                            대조 전
                                        </div>
                                    </div>
                                </div>

                                <div class="alert-bar info" id="certAiMessage" style="margin-top:12px">
                                    <span class="material-symbols-outlined">smart_toy</span>
                                    신고필증 파일을 선택한 뒤 전달하면 PDF 텍스트 분석과 OCR 판독으로 B/L 번호를 자동 대조합니다.
                                </div>
                            </div>

                            <form id="freightCertUploadForm"
                                  method="post"
                                  enctype="multipart/form-data"
                                  action="${pageContext.request.contextPath}/owner/transport/freight/cert/upload.do"
                                  onsubmit="return validateFreightCertUploadForm()">

                                <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
                                <input type="hidden" name="tcsNo" value="${freight.tcsNo}">
                                <input type="hidden" name="trcNo" value="${freight.tcsTrcNo}">
                                <input type="hidden" name="mblNo" value="${freight.tcsMblNo}">
                                <input type="hidden" name="hblNo" value="${freight.tcsHblNo}">
                                <input type="hidden" name="certMatchYn" id="certMatchYn" value="N">
                                <input type="hidden" name="extractedBlNo" id="extractedBlNo" value="">
                                <input type="hidden" name="matchMethodCd" id="matchMethodCd" value="">

                                <div class="form-doc-divider"></div>

                                <div class="form-group" style="margin-bottom:0">
                                    <div class="form-group-title">신고필증 파일 첨부</div>

                                    <input id="freightCertFile"
                                           name="certFile"
                                           type="file"
                                           style="display:none"
                                           accept=".pdf,.jpg,.jpeg,.png"
                                           onchange="handleFreightCertFiles(this)">

                                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                                        <label style="font-size:11px;font-weight:700;color:#475569">
                                            신고필증 <span class="req">*</span>
                                        </label>

                                        <div style="display:flex;gap:8px">
                                            <button type="button"
                                                    class="btn btn-secondary"
                                                    style="padding:9px 16px;font-size:12px;white-space:nowrap"
                                                    onclick="document.getElementById('freightCertFile').click()">
                                                파일 선택
                                            </button>
                                        </div>
                                    </div>

                                    <div class="upload-drop"
                                         style="margin-bottom:16px"
                                         onclick="document.getElementById('freightCertFile').click()">
                                        <span class="material-symbols-outlined">upload_file</span>
                                        <p>파일을 이곳에 드래그하거나 <strong>클릭하여 선택</strong>하세요</p>
                                        <p id="freightCertFileName" style="margin-top:4px;font-size:11px;color:#94a3b8">
                                            PDF · JPG · PNG — 최대 20MB
                                        </p>
                                    </div>

                                    <table class="doc-table" id="freightCertUploadTable">
                                        <thead>
                                        <tr>
                                            <th>문서종류</th>
                                            <th>파일명</th>
                                            <th>상태</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody id="freightCertUploadTbody">
                                        <tr class="empty-row">
                                            <td colspan="4" style="text-align:center;color:#94a3b8;padding:18px;">
                                                첨부된 신고필증이 없습니다.
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>

                                    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
                                        <button type="button"
                                                class="btn btn-secondary"
                                                onclick="compareFreightCertFile()">
                                            AI 대조
                                        </button>

                                        <button type="submit"
                                                id="freightCertSubmitBtn"
                                                class="btn btn-dark">
                                            운송업체에게 필증 전달
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </c:if>

                    <div class="freight-action-row">
                        <c:choose>
                            <c:when test="${freight.tcsStlStatusCd eq 'TRC_STL_PAID'}">
                                <a class="btn btn-dark"
                                   href="${pageContext.request.contextPath}/owner/payment/receipt.do/FREIGHT/${freight.tcsNo}">
                                    영수증 보기
                                </a>
                            </c:when>

                            <c:when test="${freight.tcsStlStatusCd eq 'TRC_STL_REQ'}">
                                <button type="button"
                                        class="btn btn-dark btn-toss-pay"
                                        data-tcs-no="${freight.tcsNo}"
                                        data-record-ty="FREIGHT">
                                    결제하기
                                </button>
                            </c:when>

                            <c:when test="${freight.tcsStlStatusCd eq 'TRC_STL_UNPAID'}">
                                <%-- 미결제 상태는 액션 버튼 없음 --%>
                            </c:when>
                        </c:choose>
                    </div>

                </div>
            </div>
        </main>

        <%@ include file="/WEB-INF/views/common/ownerModals.jsp" %>
        <%@ include file="/WEB-INF/views/common/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/ownerScripts.jsp" %>
<script src="https://js.tosspayments.com/v2/standard"></script>
<script src="${pageContext.request.contextPath}/resources/js/owner/payment.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/owner/freight.js"></script>

</body>
</html>