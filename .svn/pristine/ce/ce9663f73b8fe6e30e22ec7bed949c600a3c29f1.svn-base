<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/officer/common/taglibs.jsp" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<c:set var="taxStatusNm" value="${not empty tax and not empty tax.taxStatus ? tax.taxStatus : '-'}" />
<c:set var="taxPaid" value="${taxStatusNm eq '납부완료' or (taxStatusNm eq '-' and detail.statusCd eq 'TAX_PAID')}" />
<c:set var="taxUnpaid" value="${taxStatusNm eq '납부대기' or (taxStatusNm eq '-' and detail.statusCd eq 'TAX_UNPAID')}" />
<c:set var="taxOverdue" value="${taxStatusNm eq '기한초과'}" />
<c:set var="taxSent" value="${taxUnpaid or taxPaid or taxOverdue}" />

<c:set var="riskScore" value="${not empty aiRisk.arrScore ? aiRisk.arrScore : detail.riskScore}" />
<c:set var="riskGrade" value="${not empty aiRisk.arrGradeCd ? aiRisk.arrGradeCd : detail.riskGradeCd}" />
<c:set var="riskStatus" value="${not empty aiRisk.arrStatusCd ? aiRisk.arrStatusCd : detail.riskStatusCd}" />
<c:set var="riskResult" value="${not empty aiRisk.arrResultCn ? aiRisk.arrResultCn : detail.riskResultCn}" />
<c:set var="riskDetail" value="${not empty aiRisk.arrDetailCn ? aiRisk.arrDetailCn : ''}" />

<%-- 접수 전/접수 후 화면 판단 공통값
     - 접수목록에서 상세로 들어온 미접수 건은 처리단계/처리이력에 접수완료를 표시하지 않는다.
     - 접수 전 여부는 담당공무원 유무보다 상태코드를 우선한다.
     - 수출 더미데이터처럼 담당공무원이 있어도 상태가 접수대기이면 [반려]/[접수]를 보여준다. --%>
<c:set var="isReceiptBefore" value="${detail.statusCd eq 'CSTM_REQ'
                                  or detail.statusCd eq 'WAIT'
                                  or detail.statusCd eq 'RCP_REJECT'
                                  or detail.statusCd eq 'DCLR_WAIT'
                                  or detail.statusCd eq '접수대기'
                                  or detail.statusCd eq 'EXP_WAIT'
                                  or detail.statusCd eq 'ER_WAIT'}" />
<c:set var="isRejectedOrCancel" value="${detail.statusCd eq 'DCLR_REJ'
                                      or detail.statusCd eq 'CSTM_CANCEL'}" />
<c:set var="isReceiptDone" value="${not isReceiptBefore and not isRejectedOrCancel}" />


<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/officer/header/head.jsp" %>
    <title>TACS · 기본심사 상세</title>
    <link rel="stylesheet" href="${ctx}/resources/css/officer/pages/basicScreenDetail.css">
</head>

<body>
<%@ include file="/WEB-INF/views/officer/header/sidebar.jsp" %>
<%@ include file="/WEB-INF/views/officer/header/header.jsp" %>

<main class="officer-main detail-wrap">
    <div class="det-wrap">
        <div class="det-hdr">
            <div class="det-hdr-inner">
                <div class="det-hdr-left">
                    <div class="det-hdr-top">
                        <button type="button" class="btn-secondary btn-sm" id="btnBack">
                            <span class="material-symbols-outlined">arrow_back</span>목록
                        </button>
                        <span class="det-no">
                            <c:out value="${detail.reqNo}" default="신고번호 없음" />
                        </span>
                    </div>

                    <div class="det-meta">
                        <div class="det-m">업체명: <span><c:out value="${detail.companyName}" default="-" /></span></div>
                        <div class="det-m">관세사: <span><c:out value="${detail.brokerName}" default="-" /></span></div>
                        <div class="det-m hl">담당공무원: <span><c:out value="${detail.officerName}" default="-" /></span></div>
                        <div class="det-m">신고일: <span><c:out value="${detail.requestDate}" default="-" /></span></div>
                        <div class="det-m">B/L: <span><c:out value="${detail.blNo}" default="-" /></span></div>
                    </div>

                    <div class="det-ai">
                        <div class="ai-score-sm">AI 위험도: <c:out value="${riskScore}" default="-" /> / 100</div>
                        <div class="ai-tags-sm">
                            <span class="ai-tag-sm ai-grade-sm ai-grade-${riskGrade}"><c:out value="${riskGrade}" default="분석대기" /></span>
                            <span class="ai-tag-sm ai-status-sm ai-status-${riskStatus}"><c:out value="${riskStatus}" default="분석대기" /></span>
                        </div>
                    </div>
                </div>

                <div class="status-panel sp-${detail.statusCd}" id="statusPanel">
                    <div class="sp-label">현재 처리상태</div>
                    <div class="sp-val" id="detailStatus">
                        <c:choose>
                            <c:when test="${detail.statusCd eq 'DCLR_WAIT'}">접수대기</c:when>
                            <c:when test="${detail.statusCd eq 'DCLR_REVIEW'}">심사중</c:when>
                            <c:when test="${detail.statusCd eq 'DCLR_DONE'}">심사완료</c:when>
                            <c:when test="${detail.statusCd eq 'CSTM_REQ'}">접수대기</c:when>
                            <c:when test="${detail.statusCd eq 'CSTM_ACPT'}">접수완료</c:when>
                            <c:when test="${detail.statusCd eq 'CSTM_INPRG'}">처리중</c:when>
                            <c:when test="${detail.statusCd eq 'CSTM_SUPP'}">보완요청</c:when>
                            <c:when test="${detail.statusCd eq 'CSTM_SUPP_SUB'}">보완제출</c:when>
                            <c:when test="${detail.statusCd eq 'DCLR_SUPP_REQ'}">보완요청</c:when>
                            <c:when test="${detail.statusCd eq 'DCLR_SUPP_SUB'}">보완제출</c:when>
                            <c:when test="${detail.statusCd eq 'DCLR_REJ'}">반려</c:when>
                            <c:when test="${detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE'}">완료</c:when>
                            <c:when test="${taxPaid}">세금납부완료</c:when>
                            <c:when test="${taxUnpaid}">세금납부대기</c:when>
                            <c:when test="${detail.statusCd eq 'CSTM_CANCEL'}">취소</c:when>
                            <c:otherwise><c:out value="${detail.statusCd}" default="심사중" /></c:otherwise>
                        </c:choose>
                    </div>
                    <div class="sp-desc">기본심사 진행상태</div>
                </div>
            </div>
        </div>

        <%-- 품목 카운팅: 탭바/세금탭/act-bar 전체에서 사용하므로 탭바 앞에서 계산 --%>
        <c:set var="itemTotalCount"    value="0" />
        <c:set var="itemAcceptedCount" value="0" />
        <c:set var="itemRejectedCount" value="0" />
        <c:if test="${not empty itemList}">
            <c:forEach var="cntItem" items="${itemList}">
                <c:set var="itemTotalCount" value="${itemTotalCount + 1}" />
                <c:if test="${cntItem.itemStatusCd eq 'ITEM_ACPT'}">
                    <c:set var="itemAcceptedCount" value="${itemAcceptedCount + 1}" />
                </c:if>
                <c:if test="${cntItem.itemStatusCd eq 'ITEM_REJ'}">
                    <c:set var="itemRejectedCount" value="${itemRejectedCount + 1}" />
                </c:if>
            </c:forEach>
        </c:if>
        <c:set var="itemPendingCount"  value="${itemTotalCount - itemAcceptedCount - itemRejectedCount}" />
        <c:set var="allItemsAccepted"  value="${itemTotalCount gt 0 and itemAcceptedCount eq itemTotalCount}" />
        <c:set var="isReviewStarted" value="${isReceiptDone and (
                                              detail.statusCd eq 'DCLR_REVIEW'
                                              or detail.statusCd eq 'CSTM_ACPT'
                                              or detail.statusCd eq 'CSTM_INPRG'
                                              or allItemsAccepted
                                              or taxPaid
                                              or taxSent
                                              or detail.statusCd eq 'DCLR_DONE'
                                              or detail.statusCd eq 'CSTM_DONE')}" />

        <div class="det-tab-bar" role="tablist">
            <button type="button" class="det-tab-i on" data-tab="basic">
                <span class="material-symbols-outlined">description</span>기본정보
            </button>
            <button type="button" class="det-tab-i" data-tab="items">
                <span class="material-symbols-outlined">inventory</span>품목정보
            </button>
            <button type="button" class="det-tab-i" data-tab="files">
                <span class="material-symbols-outlined">attach_file</span>제출서류
            </button>
            <c:if test="${detail.statusCd eq 'DCLR_REJ'
                         or (mode ne 'readonly'
                         and detail.statusCd ne 'CSTM_REQ'
                         and detail.statusCd ne 'CSTM_ACPT'
                         and detail.statusCd ne 'CSTM_DONE'
                         and detail.statusCd ne 'CSTM_CANCEL')}">
                <button type="button" class="det-tab-i" data-tab="work">
                    <span class="material-symbols-outlined">settings</span>
                    업무처리
                </button>
            </c:if>
            <%-- 세금납부 탭: 모든 품목 수리완료 시 자동 활성화 --%>
            <c:set var="taxTabOpen" value="${allItemsAccepted
                or detail.statusCd eq 'CSTM_DONE'}" />
            <button type="button"
                    class="det-tab-i ${not taxTabOpen ? 'locked' : ''}"
                    data-tab="tax"
                    id="taxTabBtn"
                    aria-disabled="${not taxTabOpen}"
                    title="${not taxTabOpen ? '모든 품목 수리 완료 후 활성화됩니다.' : ''}">
                <span class="material-symbols-outlined">payments</span>세금납부
            </button>
            <button type="button" class="det-tab-i" data-tab="history">
                <span class="material-symbols-outlined">history</span>처리이력
            </button>
        </div>

        <div class="tab-body">
            <section class="tab-pane on" id="tab-basic">
                <div class="basic-layout">
                    <div>
                        <div class="fs">
                            <div class="fs-t">신고정보</div>
                            <div class="fg fg2">
                                <div class="fr"><span class="flabel">신고번호</span><span class="fval"><c:out value="${detail.reqNo}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">신고일시</span><span class="fval"><c:out value="${detail.requestDate}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">수입/수출구분</span><span class="fval"><span class="badge badge-recv"><c:out value="${detail.declareType}" default="수입" /></span></span></div>
                                <div class="fr"><span class="flabel">현재상태</span><span class="fval"><span class="badge badge-proc" id="inlineStatus">
                                            <c:choose>
                                                <c:when test="${detail.statusCd eq 'DCLR_WAIT'}">접수대기</c:when>
                                                <c:when test="${detail.statusCd eq 'DCLR_REVIEW'}">심사중</c:when>
                                                <c:when test="${detail.statusCd eq 'DCLR_DONE'}">심사완료</c:when>
                                                <c:when test="${detail.statusCd eq 'CSTM_REQ'}">접수대기</c:when>
                                                <c:when test="${detail.statusCd eq 'CSTM_ACPT'}">접수완료</c:when>
                                                <c:when test="${detail.statusCd eq 'CSTM_INPRG'}">처리중</c:when>
                                                <c:when test="${detail.statusCd eq 'CSTM_SUPP'}">보완요청</c:when>
                                                <c:when test="${detail.statusCd eq 'CSTM_SUPP_SUB'}">보완제출</c:when>
                                                <c:when test="${detail.statusCd eq 'DCLR_SUPP_REQ'}">보완요청</c:when>
                                                <c:when test="${detail.statusCd eq 'DCLR_SUPP_SUB'}">보완제출</c:when>
                                                <c:when test="${detail.statusCd eq 'DCLR_REJ'}">반려</c:when>
                                                <c:when test="${detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE'}">완료</c:when>
                                                <c:when test="${taxPaid}">세금납부완료</c:when>
                                                <c:when test="${taxUnpaid}">세금납부대기</c:when>
                                                <c:when test="${detail.statusCd eq 'CSTM_CANCEL'}">취소</c:when>
                                                <c:otherwise><c:out value="${detail.statusCd}" default="심사중" /></c:otherwise>
                                            </c:choose>
                                        </span></span></div>
                            </div>
                        </div>

                        <div class="fs">
                            <div class="fs-t">업체정보</div>
                            <div class="fg fg2">
                                <div class="fr"><span class="flabel">업체명</span><span class="fval"><c:out value="${detail.companyName}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">사업자번호</span><span class="fval"><c:out value="${detail.corpRegNo}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">통관고유부호</span><span class="fval"><c:out value="${detail.customsIdNo}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">관세사</span><span class="fval"><c:out value="${detail.brokerName}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">연락처</span><span class="fval"><c:out value="${detail.companyTel}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">담당공무원</span><span class="fval officer"><c:out value="${detail.officerName}" default="-" /></span></div>
                            </div>
                        </div>

                        <div class="fs">
                            <div class="fs-t">물류정보</div>
                            <div class="fg fg2">
                                <div class="fr"><span class="flabel">B/L 번호</span><span class="fval"><c:out value="${detail.blNo}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">M/B/L 번호</span><span class="fval"><c:out value="${detail.mblNo}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">도착항</span><span class="fval"><c:out value="${detail.arrivalPort}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">입항예정일</span><span class="fval"><c:out value="${detail.arrivalDate}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">화물관리번호</span><span class="fval"><c:out value="${detail.cargoNo}" default="-" /></span></div>
                            </div>
                        </div>

                        <div class="fs">
                            <div class="fs-t">금액정보</div>
                            <div class="fg fg2">
                                <div class="fr"><span class="flabel">신고총액</span><span class="fval amount"><c:out value="${detail.amount}" default="-" /></span></div>
                                <div class="fr"><span class="flabel">신고통화</span><span class="fval"><c:out value="${detail.currencyCode}" default="-" /></span></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="ai-box ai-risk-${riskGrade}">
                            <div class="ai-t">AI 위험도 분석</div>
                            <div class="ai-num"><c:out value="${riskScore}" default="-" /> <span>/ 100</span></div>

                            <div class="ai-desc">
                                <span class="ai-grade-label">
                                    <c:choose>
                                        <c:when test="${riskGrade eq 'HIGH'}">HIGH — 고위험</c:when>
                                        <c:when test="${riskGrade eq 'MIDDLE'}">MIDDLE — 주의</c:when>
                                        <c:when test="${riskGrade eq 'LOW'}">LOW — 낮음</c:when>
                                        <c:otherwise>분석대기</c:otherwise>
                                    </c:choose>
                                </span>
                                <br>
                                <c:choose>
                                    <c:when test="${riskGrade eq 'HIGH'}">첨부서류와 신고정보 간 주요 항목 불일치가 확인되었습니다.</c:when>
                                    <c:when test="${riskGrade eq 'MIDDLE'}">일부 항목에 재확인이 필요합니다.</c:when>
                                    <c:when test="${riskGrade eq 'LOW'}">주요 불일치 항목이 적습니다.</c:when>
                                    <c:otherwise>AI 분석 결과가 없습니다.</c:otherwise>
                                </c:choose>
                            </div>

                            <div class="ai-tags">
                                <span class="ai-tag ai-status-${riskStatus}">분석상태: <c:out value="${riskStatus}" default="분석대기" /></span>
                                <span class="ai-tag ai-basis-tag">분석기준: 신고정보 / 제출서류 비교</span>
                            </div>

                            <c:if test="${not empty riskDetail}">
                                <div class="ai-reason-box">
                                    <div class="ai-reason-title">
                                        <c:choose>
                                            <c:when test="${riskGrade eq 'HIGH'}">주요 불일치 항목</c:when>
                                            <c:when test="${riskGrade eq 'MIDDLE'}">주요 확인 항목</c:when>
                                            <c:otherwise>검토 결과 요약</c:otherwise>
                                        </c:choose>
                                    </div>

                                    <c:choose>
                                        <c:when test="${riskGrade eq 'HIGH'}">
                                            <div class="ai-reason-tags">
                                                <c:set var="hasReasonChip" value="false" />
                                                <c:if test="${fn:contains(riskDetail, '품명')}">
                                                    <span class="ai-reason-chip">품명</span>
                                                    <c:set var="hasReasonChip" value="true" />
                                                </c:if>
                                                <c:if test="${fn:contains(riskDetail, 'HS코드')}">
                                                    <span class="ai-reason-chip">HS코드</span>
                                                    <c:set var="hasReasonChip" value="true" />
                                                </c:if>
                                                <c:if test="${fn:contains(riskDetail, '수량')}">
                                                    <span class="ai-reason-chip">수량</span>
                                                    <c:set var="hasReasonChip" value="true" />
                                                </c:if>
                                                <c:if test="${fn:contains(riskDetail, '금액')}">
                                                    <span class="ai-reason-chip">금액</span>
                                                    <c:set var="hasReasonChip" value="true" />
                                                </c:if>
                                                <c:if test="${fn:contains(riskDetail, '원산지')}">
                                                    <span class="ai-reason-chip">원산지</span>
                                                    <c:set var="hasReasonChip" value="true" />
                                                </c:if>
                                                <c:if test="${fn:contains(riskDetail, '첨부파일')}">
                                                    <span class="ai-reason-chip">첨부파일</span>
                                                    <c:set var="hasReasonChip" value="true" />
                                                </c:if>
                                                <c:if test="${fn:contains(riskDetail, '신고정보')}">
                                                    <span class="ai-reason-chip">신고정보</span>
                                                    <c:set var="hasReasonChip" value="true" />
                                                </c:if>
                                                <c:if test="${not hasReasonChip}">
                                                    <span class="ai-reason-empty"><c:out value="${riskDetail}" /></span>
                                                </c:if>
                                            </div>
                                        </c:when>
                                        <c:otherwise>
                                            <div class="ai-reason-summary">
                                                <c:out value="${riskDetail}" />
                                            </div>
                                        </c:otherwise>
                                    </c:choose>
                                </div>
                            </c:if>
                        </div>

                        <div class="fs review-memo-card">
                            <div class="fs-t">심사 메모</div>

                            <!-- 조회 모드: 저장된 메모를 읽기 형태로 표시 -->
                            <div class="memo-view-panel" id="reviewMemoView">
                                <div class="memo-view-text ${empty detail.reviewMemo ? 'memo-empty' : ''}" id="reviewMemoViewText"><c:choose><c:when test="${not empty detail.reviewMemo}"><c:out value="${detail.reviewMemo}" /></c:when><c:otherwise>등록된 심사메모가 없습니다.</c:otherwise></c:choose></div>

                                <div class="memo-action-row memo-view-actions">
                                    <div class="memo-save-info" id="reviewMemoStatus">
                                        <c:choose>
                                            <c:when test="${not empty detail.reviewMemo}">
                                                저장완료
                                            </c:when>
                                            <c:otherwise>
                                                필요 시 심사 참고 메모를 작성할 수 있습니다.
                                            </c:otherwise>
                                        </c:choose>
                                    </div>
                                    <button type="button" class="btn-secondary btn-sm" id="btnMemoEdit">
                                        <span class="material-symbols-outlined">edit</span>
                                        <c:choose>
                                            <c:when test="${not empty detail.reviewMemo}">수정</c:when>
                                            <c:otherwise>작성</c:otherwise>
                                        </c:choose>
                                    </button>
                                </div>
                            </div>

                            <!-- 수정 모드: 수정 버튼 클릭 시에만 표시 -->
                            <div class="memo-edit-panel hidden" id="reviewMemoEditPanel">
                                <textarea class="ftarea memo-area"
                                          id="reviewMemo"
                                          name="reviewMemo"
                                          spellcheck="false"
                                          placeholder="심사 내용 및 특이사항 기록..."><c:out value="${detail.reviewMemo}" /></textarea>

                                <div class="memo-action-row memo-edit-actions">      
                                    <button type="button" class="btn-secondary btn-sm" id="btnMemoCancel">취소</button>
                                    <button type="button" class="btn-primary btn-sm" id="btnMemoSave">
                                        <span class="material-symbols-outlined">save</span>저장
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="fs process-card">
                            <div class="fs-t">처리 단계</div>

                            <div class="process-timeline">
                                <%-- 1. 접수 단계: 접수 전이면 완료가 아니라 대기로 표시 --%>
                                <div class="process-row ${isReceiptBefore ? 'on' : (isReceiptDone ? 'done' : 'wait')}">
                                    <div class="process-node">
                                        <c:choose>
                                            <c:when test="${isReceiptDone}">✓</c:when>
                                            <c:otherwise>1</c:otherwise>
                                        </c:choose>
                                    </div>
                                    <div class="process-text">
                                        <strong>${isReceiptBefore ? '접수대기' : '접수완료'}</strong>
                                        <span>
                                            <c:choose>
                                                <c:when test="${isReceiptBefore}">접수 또는 반려 처리를 진행하세요.</c:when>
                                                <c:otherwise>
                                                    <c:out value="${detail.requestDate}" default="-" /> ·
                                                    <c:out value="${detail.officerName}" default="담당자" />
                                                </c:otherwise>
                                            </c:choose>
                                        </span>
                                    </div>
                                </div>

                                <%-- 2. 기본심사 단계 --%>
                                <div class="process-row ${isReceiptBefore ? 'wait' : (allItemsAccepted or taxPaid or detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE' ? 'done' : 'on')}">
                                    <div class="process-node">
                                        <c:choose>
                                            <c:when test="${not isReceiptBefore and (allItemsAccepted or taxPaid or detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE')}">✓</c:when>
                                            <c:otherwise>2</c:otherwise>
                                        </c:choose>
                                    </div>
                                    <div class="process-text">
                                        <strong>${isReceiptBefore ? '기본심사 대기' : '기본심사 진행중'}</strong>
                                        <span>
                                            <c:choose>
                                                <c:when test="${isReceiptBefore}">접수 완료 후 기본심사가 시작됩니다.</c:when>
                                                <c:otherwise>신고 기본사항 및 제출서류 검토</c:otherwise>
                                            </c:choose>
                                        </span>
                                    </div>
                                </div>

                                <%-- 3. 품목심사 단계 --%>
                                <div class="process-row ${isReceiptBefore ? 'wait' : (allItemsAccepted ? (taxPaid or detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE' ? 'done' : 'on') : 'wait')}">
                                    <div class="process-node">
                                        <c:choose>
                                            <c:when test="${not isReceiptBefore and (taxPaid or detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE')}">✓</c:when>
                                            <c:otherwise>3</c:otherwise>
                                        </c:choose>
                                    </div>
                                    <div class="process-text">
                                        <strong>품목심사</strong>
                                        <span>
                                            <c:choose>
                                                <c:when test="${isReceiptBefore}">기본심사 시작 후 품목별 수리 여부를 확인합니다.</c:when>
                                                <c:otherwise>${itemAcceptedCount} / ${itemTotalCount}개 품목 수리완료</c:otherwise>
                                            </c:choose>
                                        </span>
                                    </div>
                                </div>

                                <%-- 4. 세금납부 단계 --%>
                                <div class="process-row ${isReceiptBefore ? 'wait' : (taxPaid ? (detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE' ? 'done' : 'on') : 'wait')}">
                                    <div class="process-node">
                                        <c:choose>
                                            <c:when test="${not isReceiptBefore and (detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE')}">✓</c:when>
                                            <c:otherwise>4</c:otherwise>
                                        </c:choose>
                                    </div>
                                    <div class="process-text">
                                        <strong>세금납부</strong>
                                        <span>
                                            <c:choose>
                                                <c:when test="${isReceiptBefore}">품목심사 완료 후 세금납부 단계로 진행됩니다.</c:when>
                                                <c:when test="${taxPaid}">납부완료</c:when>
                                                <c:when test="${taxUnpaid}">납부 대기</c:when>
                                                <c:otherwise>세금정보 전달 전</c:otherwise>
                                            </c:choose>
                                        </span>
                                    </div>
                                </div>

                                <%-- 5. 승인/필증발급 단계 --%>
                                <div class="process-row ${not isReceiptBefore and (detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE') ? 'done' : 'wait'}">
                                    <div class="process-node">
                                        <c:choose>
                                            <c:when test="${not isReceiptBefore and (detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE')}">✓</c:when>
                                            <c:otherwise>5</c:otherwise>
                                        </c:choose>
                                    </div>
                                    <div class="process-text">
                                        <strong>승인/필증발급</strong>
                                        <span>
                                            <c:choose>
                                                <c:when test="${not isReceiptBefore and (detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE')}">승인 및 신고필증 발급 완료</c:when>
                                                <c:otherwise>승인 대기</c:otherwise>
                                            </c:choose>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="process-note">
                                현재상태 · <strong>
                                    <c:choose>
                                        <c:when test="${isReceiptBefore}">접수대기 · 접수 또는 반려 필요</c:when>
                                        <c:when test="${detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE'}">승인 및 필증발급 완료</c:when>
                                        <c:when test="${taxPaid}">세금납부완료 · 승인 대기</c:when>
                                        <c:when test="${allItemsAccepted and taxUnpaid}">품목심사완료 · 세금납부 대기</c:when>
                                        <c:when test="${allItemsAccepted}">품목심사완료 · 세금정보 전달 필요</c:when>
                                        <c:when test="${isReviewStarted}">기본심사 진행중</c:when>
                                        <c:otherwise>접수완료</c:otherwise>
                                    </c:choose>
                                </strong>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

                                    <section class="tab-pane" id="tab-items">
                <%-- 카운팅은 탭바 앞에서 이미 처리됨 --%>
                <div class="item-progress-panel">
                    <div class="progress-box">
                        <div class="progress-title">품목 심사 진행률</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${itemTotalCount gt 0 ? (itemAcceptedCount * 100 / itemTotalCount) : 0}%;"></div>
                        </div>
                        <div class="progress-text">
                            수리완료 <strong><c:out value="${itemAcceptedCount}" /></strong> / 전체 <strong><c:out value="${itemTotalCount}" /></strong>
                            <c:if test="${itemRejectedCount gt 0}"> · 반려 <strong><c:out value="${itemRejectedCount}" /></strong></c:if>
                        </div>
                    </div>

                    <div class="item-state-summary">
                        <div class="state-count"><span>수리완료</span><strong><c:out value="${itemAcceptedCount}" /></strong></div>
                        <div class="state-count"><span>심사대기/진행</span><strong><c:out value="${itemPendingCount}" /></strong></div>
                        <div class="state-count"><span>반려</span><strong><c:out value="${itemRejectedCount}" /></strong></div>
                    </div>
                </div>

                <c:choose>
                    <c:when test="${not empty itemList}">
                        <c:forEach var="item" items="${itemList}" varStatus="st">
                            <c:set var="itemStatus" value="${empty item.itemStatusCd ? 'ITEM_REVIEW' : item.itemStatusCd}" />

                            <div class="customs-item-card<c:if test="${itemStatus eq 'ITEM_REJ'}"> is-rejected</c:if>">
                                <%-- 1. 카드 헤더: HS코드 + 품명 + 상태 --%>
                                <div class="cic-head">
                                    <div class="cic-title-area">
                                        <span class="cic-no">${st.count lt 10 ? '0' : ''}${st.count}</span>
                                        <div>
                                            <div class="cic-hs">
                                                <span>HS <c:out value="${item.hsCode}" default="-" /></span>
                                                <button type="button"
												        class="btn-hs-check"
												        data-hs-code="<c:out value='${item.hsCode}' />">
												    HS 확인
												</button>
												<span class="hs-mini-result">-</span>												
                                            </div>
                                            <div class="cic-name"><c:out value="${item.itemName}" default="품목명 없음" /></div>
                                          
                                        </div>
                                    </div>

                                    <div class="cic-tags">
                                        <span class="cic-tag status ${itemStatus eq 'ITEM_ACPT' ? 'done' : (itemStatus eq 'ITEM_REJ' ? 'reject' : 'block')}">
                                            <c:choose>
                                                <c:when test="${itemStatus eq 'ITEM_REVIEW'}">심사중</c:when>
                                                <c:when test="${itemStatus eq 'ITEM_SUPP_REQ'}">보완요청</c:when>
                                                <c:when test="${itemStatus eq 'ITEM_SUPP_SUB'}">보완제출</c:when>
                                                <c:when test="${itemStatus eq 'ITEM_ACPT'}">수리완료</c:when>
                                                <c:when test="${itemStatus eq 'ITEM_REJ'}">반려</c:when>
                                                <c:otherwise>심사중</c:otherwise>
                                            </c:choose>
                                        </span>
                                            <c:choose>
                                                <c:when test="${not empty item.originCriteria and item.originCriteria ne '-'}">FTA/원산지 확인</c:when>
                                            </c:choose>
                                    </div>
                                </div>

                                <%-- 2. 실무 심사 핵심: 품목 기본정보 / 세율·원산지 판단 / 과세 기준 --%>
                                <div class="cic-core-grid">

                                    <%-- 품목 기본정보 --%>
                                    <div class="cic-box">
                                        <div class="cic-box-title">품목 기본정보</div>

                                        <div class="cic-row">
                                            <span>신고품명</span>
                                            <strong><c:out value="${item.itemName}" default="-" /></strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>거래품명</span>
                                            <strong><c:out value="${item.tradeItemName}" default="-" /></strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>HS코드</span>
                                            <strong><c:out value="${item.hsCode}" default="-" /></strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>수량</span>
                                            <strong><c:out value="${item.qty}" default="-" /></strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>중량(KG)</span>
                                            <strong><c:out value="${item.weight}" default="-" /></strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>원산지</span>
                                            <strong><c:out value="${item.origin}" default="-" /></strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>통화</span>
                                            <strong><c:out value="${detail.currencyCode}" default="-" /></strong>
                                        </div>
                                    </div>

                                    <%-- 세율 · 원산지 판단 --%>
                                    <div class="cic-box cic-focus-box">
                                        <div class="cic-box-title tariff-title-row">
											    <span>세율 · 원산지 판단</span>
											
											    <button type="button"
											            class="btn-tariff-check"
											            data-index="${st.index}"
											            data-item-no="${item.itemNo}"
											            data-hs-code="<c:out value='${item.hsCode}' />"
											            data-country-cd="<c:out value='${item.origin}' />">
											        세율 재조회
											    </button>
											</div>

                                        <div class="cic-row">
                                            <span>기본세율</span>
                                            <strong id="baseRateValue-${st.index}">-</strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>FTA 협정세율</span>
                                            <strong id="ftaRateValue-${st.index}">-</strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>최종적용세율</span>
                                            <strong id="tariffRateValue-${st.index}">-</strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>원산지 국가</span>
                                            <strong id="originCountryValue-${st.index}">
                                                <c:out value="${item.origin}" default="-" />
                                            </strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>FTA 적용상태</span>
                                            <strong id="ftaYnValue-${st.index}">-</strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>적용근거</span>
                                            <strong id="rateTypeValue-${st.index}">-</strong>
                                        </div>

                                        <div class="cic-row">
                                            <span>적용기간</span>
                                            <strong id="rateEtcValue-${st.index}">-</strong>
                                        </div>
                                    </div>

                                    <%-- 과세 기준: 품목 탭에서는 기준금액만 확인하고, 세액/납부상태는 세금납부 탭에서 처리 --%>
                                    <div class="cic-box cic-money-box">
                                        <div class="cic-box-title">과세 기준</div>

                                        <div class="cic-row price">
                                            <span>과세가격(CIF)</span>
                                            <strong>
                                                <c:choose>
                                                    <c:when test="${not empty item.amount and item.amount ne '-'}"><c:out value="${item.amount}" /> 원</c:when>
                                                    <c:otherwise>-</c:otherwise>
                                                </c:choose>
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                <%-- 3. 란사항 처리 이력: 최초에는 숨김, 처리 발생 시 표시 --%>
                                <div class="item-history-box<c:if test="${empty item.itemRemark and empty item.suppReqCn and empty item.suppSubmitCn}"> is-empty</c:if>">
                                    <div class="ihb-head">
                                        <div>
                                            <div class="ihb-title">란사항 처리 이력</div>
                                            <div class="ihb-sub">보완요청 · 보완제출 · 수리 · 반려 내역이 누적 표시됩니다.</div>
                                        </div>
                                    </div>

                                    <table class="item-history-table">
                                        <thead>
                                            <tr>
                                                <th>일시</th>
                                                <th>처리자</th>
                                                <th>처리유형</th>
                                                <th>처리내용</th>
                                                <th>처리후 상태</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <%-- 보완요청 이력: 공무원이 관세사에게 요청한 내용 --%>
                                            <c:if test="${not empty item.suppReqCn}">
                                                <tr>
                                                    <td><c:out value="${item.suppReqDate}" default="-" /></td>
                                                    <td>행정공무원</td>
                                                    <td><span class="line-status-badge ls-ITEM_SUPP_REQ">보완요청</span></td>
                                                    <td class="ihb-msg"><c:out value="${item.suppReqCn}" /></td>
                                                    <td>보완요청</td>
                                                </tr>
                                            </c:if>

                                            <%-- 보완제출 이력: 관세사가 제출한 답변/수정 내용 --%>
                                            <c:if test="${not empty item.suppSubmitCn}">
                                                <tr>
                                                    <td><c:out value="${item.suppSubmitDate}" default="-" /></td>
                                                    <td>관세사</td>
                                                    <td><span class="line-status-badge ls-ITEM_SUPP_SUB">보완제출</span></td>
                                                    <td class="ihb-msg"><c:out value="${item.suppSubmitCn}" /></td>
                                                    <td>보완제출</td>
                                                </tr>
                                            </c:if>

                                            <%-- 수리/반려 이력: 최종 처리 이력은 별도 한 줄 표시 --%>
                                            <c:if test="${not empty item.itemRemark and (itemStatus eq 'ITEM_ACPT' or itemStatus eq 'ITEM_REJ')}">
                                                <tr>
                                                    <td><c:out value="${item.itemHistoryDate}" default="-" /></td>
                                                    <td>행정공무원</td>
                                                    <td>
                                                        <span class="line-status-badge ls-${itemStatus}">
                                                            <c:choose>
                                                                <c:when test="${itemStatus eq 'ITEM_ACPT'}">수리</c:when>
                                                                <c:when test="${itemStatus eq 'ITEM_REJ'}">반려</c:when>
                                                                <c:otherwise>처리</c:otherwise>
                                                            </c:choose>
                                                        </span>
                                                    </td>
                                                    <td>
													    <c:choose>
													        <c:when test="${not empty item.suppSubmitCn}">
													            보완제출 내용 확인 후 수리 처리
													        </c:when>
													        <c:otherwise>
													            란사항 수리 처리
													        </c:otherwise>
													    </c:choose>
													</td>
                                                    <td>
                                                        <c:choose>
                                                            <c:when test="${itemStatus eq 'ITEM_ACPT'}">수리</c:when>
                                                            <c:when test="${itemStatus eq 'ITEM_REJ'}">반려</c:when>
                                                            <c:otherwise>처리</c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                </tr>
                                            </c:if>

                                            <%-- 기존 itemRemark만 있는 경우를 위한 방어 표시 --%>
                                            <c:if test="${empty item.suppReqCn and empty item.suppSubmitCn and not empty item.itemRemark and itemStatus ne 'ITEM_ACPT' and itemStatus ne 'ITEM_REJ'}">
                                                <tr>
                                                    <td><c:out value="${item.itemHistoryDate}" default="-" /></td>
                                                    <td>
                                                        <c:choose>
                                                            <c:when test="${itemStatus eq 'ITEM_SUPP_SUB'}">관세사</c:when>
                                                            <c:otherwise>행정공무원</c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                    <td>
                                                        <span class="line-status-badge ls-${itemStatus}">
                                                            <c:choose>
                                                                <c:when test="${itemStatus eq 'ITEM_SUPP_REQ'}">보완요청</c:when>
                                                                <c:when test="${itemStatus eq 'ITEM_SUPP_SUB'}">보완제출</c:when>
                                                                <c:otherwise>처리</c:otherwise>
                                                            </c:choose>
                                                        </span>
                                                    </td>
                                                    <td class="ihb-msg"><c:out value="${item.itemRemark}" /></td>
                                                    <td>
                                                        <c:choose>
                                                            <c:when test="${itemStatus eq 'ITEM_SUPP_REQ'}">보완요청</c:when>
                                                            <c:when test="${itemStatus eq 'ITEM_SUPP_SUB'}">보완제출</c:when>
                                                            <c:otherwise>처리</c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                </tr>
                                            </c:if>

                                            <c:if test="${empty item.suppReqCn and empty item.suppSubmitCn and empty item.itemRemark}">
                                                <tr>
                                                    <td colspan="5" class="empty-cell">아직 이 란사항에 등록된 처리 이력이 없습니다.</td>
                                                </tr>
                                            </c:if>
                                        </tbody>
                                    </table>
                                </div>

                                <%-- 4. 란사항 처리 버튼: 상태별로 버튼/대기문구 분기 --%>
                              <%-- 4. 란사항 처리 버튼: 접수 후에만 가능 --%>
								<div class="item-process-panel simple">
								    <c:choose>
								        <%-- 접수 전: 품목 심사 불가 --%>
								        <c:when test="${detail.statusCd eq 'CSTM_REQ'
								                    or detail.statusCd eq 'WAIT'
								                    or detail.statusCd eq 'DCLR_WAIT'
								                    or detail.statusCd eq 'RCP_REJECT'}">
								            <div class="item-wait-msg">신고 접수 후 란사항 심사가 가능합니다.</div>
								        </c:when>
								
								        <%-- 접수 후: 기존 상태별 버튼 분기 --%>
								        <c:otherwise>
								            <c:choose>
								                <c:when test="${itemStatus eq 'ITEM_REVIEW'}">
								                    <button type="button" class="btn-item-supp btn-item-action"
                                        data-item-no="${item.itemNo}"
                                        data-req-no="${detail.reqNo}"
                                        data-hs-code="${item.hsCode}"
                                        data-item-name="${item.itemName}"
                                        data-action-cd="ITEM_SUPP_REQ">보완요청</button>
								                    <button type="button" class="btn-item-acpt btn-item-action"
                                        data-item-no="${item.itemNo}"
                                        data-req-no="${detail.reqNo}"
                                        data-hs-code="${item.hsCode}"
                                        data-item-name="${item.itemName}"
                                        data-action-cd="ITEM_ACPT">수리</button>
								                    <button type="button" class="btn-item-rej btn-item-action"
                                        data-item-no="${item.itemNo}"
                                        data-req-no="${detail.reqNo}"
                                        data-hs-code="${item.hsCode}"
                                        data-item-name="${item.itemName}"
                                        data-action-cd="ITEM_REJ">반려</button>
								                </c:when>
								
								                <c:when test="${itemStatus eq 'ITEM_SUPP_REQ'}">
								                    <div class="item-wait-msg">관세사 보완제출 대기 중입니다.</div>
								                </c:when>
								
								                <c:when test="${itemStatus eq 'ITEM_SUPP_SUB'}">
								                    <button type="button" class="btn-item-supp btn-item-action"
                                        data-item-no="${item.itemNo}"
                                        data-req-no="${detail.reqNo}"
                                        data-hs-code="${item.hsCode}"
                                        data-item-name="${item.itemName}"
                                        data-action-cd="ITEM_SUPP_REQ">추가 보완요청</button>
								                    <button type="button" class="btn-item-acpt btn-item-action"
                                        data-item-no="${item.itemNo}"
                                        data-req-no="${detail.reqNo}"
                                        data-hs-code="${item.hsCode}"
                                        data-item-name="${item.itemName}"
                                        data-action-cd="ITEM_ACPT">수리</button>
								                    <button type="button" class="btn-item-rej btn-item-action"
                                        data-item-no="${item.itemNo}"
                                        data-req-no="${detail.reqNo}"
                                        data-hs-code="${item.hsCode}"
                                        data-item-name="${item.itemName}"
                                        data-action-cd="ITEM_REJ">반려</button>
								                </c:when>
								
								                <c:when test="${itemStatus eq 'ITEM_ACPT'}">
								                    <div class="item-complete-msg">수리 처리된 항목입니다.</div>
								                </c:when>
								
								                <c:when test="${itemStatus eq 'ITEM_REJ'}">
								                    <div class="item-rejected-lock">반려 처리된 항목입니다.</div>
								                </c:when>
								
								                <c:otherwise>
								                    <button type="button" class="btn-item-supp btn-item-action"
                                        data-item-no="${item.itemNo}"
                                        data-req-no="${detail.reqNo}"
                                        data-hs-code="${item.hsCode}"
                                        data-item-name="${item.itemName}"
                                        data-action-cd="ITEM_SUPP_REQ">보완요청</button>
								                    <button type="button" class="btn-item-acpt btn-item-action"
                                        data-item-no="${item.itemNo}"
                                        data-req-no="${detail.reqNo}"
                                        data-hs-code="${item.hsCode}"
                                        data-item-name="${item.itemName}"
                                        data-action-cd="ITEM_ACPT">수리</button>
								                    <button type="button" class="btn-item-rej btn-item-action"
                                        data-item-no="${item.itemNo}"
                                        data-req-no="${detail.reqNo}"
                                        data-hs-code="${item.hsCode}"
                                        data-item-name="${item.itemName}"
                                        data-action-cd="ITEM_REJ">반려</button>
								                </c:otherwise>
								            </c:choose>
								        </c:otherwise>
								    </c:choose>
								</div>
                            </div>
                        </c:forEach>
                    </c:when>
                    <c:otherwise>
                        <div class="empty-box">품목 내역이 없습니다.</div>
                    </c:otherwise>
                </c:choose>
            </section>

            <section class="tab-pane" id="tab-files">
                <div class="fs">
                    <div class="fs-t">제출서류 목록</div>
                    <div class="file-list">
                        <c:choose>
                            <c:when test="${not empty fileList}">
                                <c:forEach var="file" items="${fileList}">
								    <div class="file-item">
									    <div class="file-info">
									        <div class="file-name">${file.dfiOrgNm}</div>
									        <div class="file-meta">${file.dfiSize} byte</div>
									    </div>
									
									    <div class="file-actions">
									        <a class="btn-secondary btn-sm"
									           href="${pageContext.request.contextPath}/common/file/preview.do?fileNo=${file.dfiFileNo}"
									           target="_blank">미리보기</a>
									
									        <a class="btn-secondary btn-sm"
									           href="${pageContext.request.contextPath}/common/file/download.do?fileNo=${file.dfiFileNo}">
									           다운로드</a>
									    </div>
									</div>
								</c:forEach>
                            </c:when>
                            <c:otherwise>
                                <div class="empty-box">제출된 첨부파일이 없습니다.</div>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>            
            </section>

            <section class="tab-pane" id="tab-work">
                <c:choose>
                    <c:when test="${detail.statusCd eq 'DCLR_REJ'}">
                        <div class="reject-work-notice">
                            <div class="reject-work-title">반려 처리된 신고건입니다.</div>
                            <div class="reject-work-desc">추가 업무처리는 할 수 없으며, 아래 처리 요청 이력에서 반려사유를 확인할 수 있습니다.</div>
                        </div>
                    </c:when>
                    <c:otherwise>
                        <div class="work-type-bar">
                            <div class="work-type-label">업무처리 유형</div>
                            <select class="work-type-select" id="workType">
                                <option value="supplement">보완요청</option>
                                <option value="reject">반려</option>
                            </select>
                            <div class="work-type-desc" id="workDesc">보완이 필요한 서류나 내용을 요청합니다.</div>
                        </div>

                        <div class="work-form-card">
                            <div class="wfc-header">
                                <div class="wfc-title" id="workTitle">보완요청</div>
                                <span class="badge badge-suppl" id="workBadge">보완요청</span>
                            </div>
                            <div class="wfc-body">
                                <div class="fr-top">
                                    <span class="flabel">처리 사유</span>
                                    <textarea class="ftarea" id="workReason" placeholder="처리 사유를 입력하세요."></textarea>
                                </div>
                                <div class="fr work-due-row" id="workDueRow">
                                    <span class="flabel">답변기한</span>
                                    <input type="date" class="finput" id="workDueDate" name="workDueDate">
                                </div>

                                <!-- 반려 선택 시에는 첨부파일 미노출 -->
                                <div class="fr work-file-row hidden" id="workFileRow">
                                    <span class="flabel">첨부파일</span>
                                    <div class="work-file-field">
                                        <input type="file" class="finput work-file-input" id="workFile" name="workFile" accept=".pdf,.jpg,.jpeg,.png,.hwp,.hwpx,.doc,.docx,.xls,.xlsx">
                                        <p class="work-file-help" id="workFileHelp">반려 처리는 사유 입력만으로 처리합니다.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="wfc-footer">
                                <button type="button" class="btn-secondary work-action-btn" id="btnWorkReset">초기화</button>
                                <button type="button" class="btn-primary work-action-btn" id="btnWorkSubmit">보완요청 등록</button>
                                <button type="button" class="btn-danger work-action-btn hidden" id="btnWorkCancel">보완요청 해지</button>
                            </div>
                        </div>
                    </c:otherwise>
                </c:choose>
                <div class="fs">
                    <div class="fs-t">처리 요청 이력</div>
                    <table class="ptbl work-history-table">
                        <thead><tr><th>처리유형</th><th>요청일시</th><th>요청내용</th><th>기한</th><th>상태</th><th>첨부</th></tr></thead>
                        <tbody id="workHistoryBody">
                            <c:choose>
                                <c:when test="${not empty workHistoryList}">
                                    <c:forEach var="work" items="${workHistoryList}">
                                        <tr>
                                            <td>
                                                <c:choose>
                                                    <c:when test="${work.workType eq 'reject'}">
                                                        <span class="badge badge-ng">반려</span>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span class="badge badge-suppl">보완요청</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>
                                            <td><c:out value="${work.registDt}" /></td>
                                            <td><c:out value="${work.reason}" /></td>
                                            <td><c:out value="${work.dueDate}" default="-" /></td>
                                            <td><span class="badge badge-wait"><c:out value="${work.status}" default="처리중" /></span></td>
                                            <td>
                                                <c:choose>
                                                    <c:when test="${not empty work.fileNo}">
                                                        <button type="button" class="btn-secondary btn-sm btn-preview" data-file-no="${work.fileNo}" data-file-name="${work.fileName}">첨부</button>
                                                    </c:when>
                                                    <c:otherwise>-</c:otherwise>
                                                </c:choose>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </c:when>
                                <c:otherwise>
                                    <tr class="empty-work-row" id="emptyWorkRow">
                                        <td colspan="6" class="empty-cell">등록된 업무처리 내역이 없습니다.</td>
                                    </tr>
                                </c:otherwise>
                            </c:choose>
                        </tbody>
                    </table>
                </div>
            </section>

            <section class="tab-pane" id="tab-tax">
                <div id="taxLocked" class="tax-locked ${taxTabOpen ? 'hidden' : ''}">
                    모든 품목이 수리완료되면 세금납부 정보가 활성화됩니다.
                </div>

                <div id="taxContent" class="tax-content ${not taxTabOpen ? 'tax-disabled' : ''}">

                    <div class="fs tax-declare-section">
                        <div class="fs-t">세액 신고정보</div>
                        <div class="note">
                            관세사가 신고한 품목별 과세가격·세율 정보등 신고 세액을 검토·확인합니다.
                        </div>

                        <div class="tax-meta-row">
                            <div class="tax-meta-item">
                                <span class="tax-meta-label">신고 주체</span>
                                <span class="tax-meta-val">
                                    <c:out value="${detail.brokerName}" default="관세사" />
                                </span>
                            </div>
                            <div class="tax-meta-item total">
                                <span class="tax-meta-label">총 납부세액</span>
                                <span class="tax-meta-val due-date total-tax-meta" id="taxTotalAmountMeta">
                                    <c:out value="${tax.totalAmount}" default="-" />
                                </span>
                            </div>
                        </div>

                        <table class="ptbl tax-table" id="taxSummaryTable">
                            <thead>
                                <tr>
                                    <th>세목</th>
                                    <th>신고 과세표준</th>
                                    <th>적용세율</th>
                                    <th>신고세액</th>
                                    <th>납부상태</th>
                                    <th>납부일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>관세</td>
                                    <td><c:out value="${tax.customsBase}"   default="-" /></td>
                                    <td><c:out value="${tax.customsRate}"   default="-" /></td>
                                    <td><c:out value="${tax.customsAmount}" default="-" /></td>
                                    <td>
                                        <span class="badge ${tax.customsStatus eq '납부완료' ? 'badge-ok' : (tax.customsStatus eq '기한초과' ? 'badge-danger' : (tax.customsStatus eq '해당없음' ? 'badge-hold' : 'badge-wait'))}" id="taxStateCell">
                                            <c:out value="${tax.customsStatus}" default="해당없음" />
                                        </span>
                                    </td>
                                    <td id="taxCustomsPaidDate"><c:out value="${tax.customsPaidDate}" default="-" /></td>
                                </tr>
                                <tr>
                                    <td>부가가치세</td>
                                    <td><c:out value="${tax.vatBase}"   default="-" /></td>
                                    <td>10%</td>
                                    <td><c:out value="${tax.vatAmount}" default="-" /></td>
                                    <td>
                                        <span class="badge ${taxStatusNm eq '납부완료' ? 'badge-ok' : (taxStatusNm eq '기한초과' ? 'badge-danger' : (taxStatusNm eq '-' ? 'badge-hold' : 'badge-wait'))}" id="vatStateCell">
                                            <c:out value="${taxStatusNm}" default="-" />
                                        </span>
                                    </td>
                                    <td id="taxPaidDate"><c:out value="${tax.vatPaidDate}" default="-" /></td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3">총 납부세액</td>
                                    <td class="total-tax"><c:out value="${tax.totalAmount}" default="-" /></td>
                                    <td colspan="2"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div class="fs tax-item-reference">
                        <div class="fs-t">품목별 세액 참고</div>
                        <div class="note">
                            품목정보 탭에서 검토한 품목별 과세가격·관세율·관세액을 참고용으로 표시합니다.                         
                        </div>
                        <table class="ptbl tax-table" id="taxItemTable">
                            <thead>
                                <tr>
                                    <th>란번호</th>
                                    <th>품명</th>
                                    <th>HS 코드</th>
                                    <th>과세가격(CIF)</th>
                                    <th>관세율</th>
                                    <th>관세액</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:choose>
                                    <c:when test="${not empty itemList}">
                                        <c:forEach var="item" items="${itemList}">
                                            <tr data-item-no="${item.itemNo}">
                                                <td><c:out value="${item.itemNo}"   default="-" /></td>
                                                <td><c:out value="${item.itemName}" default="-" /></td>
                                                <td><c:out value="${item.hsCode}"   default="-" /></td>
                                                <td class="tax-cif-cell"><c:out value="${item.amount}"   default="-" /></td>
                                                <td class="tax-rate-cell"><c:out value="${item.taxRate}" default="-" /></td>
                                                <td class="tax-amt-cell"><c:out value="${item.taxAmt}"  default="-" /></td>
                                            </tr>
                                        </c:forEach>
                                    </c:when>
                                    <c:otherwise>
                                        <tr><td colspan="6" class="empty-cell">품목별 세액 참고 내역이 없습니다.</td></tr>
                                    </c:otherwise>
                                </c:choose>
                            </tbody>
                        </table>
                    </div>

                    <div class="fs tax-agent-section">
                        <div class="fs-t">납부정보 전달 및 상태관리</div>
                        <div class="fg fg2 tax-agent-info">
                            <div class="fr"><span class="flabel">관세사</span><span class="fval"><c:out value="${detail.brokerName}" default="-" /></span></div>
                            <div class="fr"><span class="flabel">납부상태</span><span class="fval ${taxPaid ? 'status-paid' : (taxOverdue ? 'status-overdue' : (taxUnpaid ? 'status-unpaid' : ''))}" id="taxStatus"><c:out value="${taxStatusNm}" default="-" /></span></div>
                            <div class="fr"><span class="flabel">납부기한</span><span class="fval due-date" id="taxPayDueDate"><c:out value="${tax.payDueDate}" default="-" /></span></div>
                            <div class="fr"><span class="flabel">전달일시</span><span class="fval" id="taxSendDate"><c:out value="${tax.sendDate}" default="-" /></span></div>
                        </div>
                        <div class="tax-btn-row">
                            <button type="button"
                                    class="btn-primary"
                                    id="btnSendTax"
                                    <c:if test="${taxSent}">disabled="disabled"</c:if>>
                                ${taxSent ? '세금정보 전달 완료' : '관세사에게 세금정보 전달'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="tab-pane" id="tab-history">
                <div class="fs history-panel-card">
                    <div class="fs-t">전체 처리이력</div>

                    <%--
                        처리이력 탭은 "예정 단계"가 아니라 실제로 발생한 처리만 누적 표시한다.
                        아직 발생하지 않은 세금납부/승인/필증발급 단계는 표시하지 않는다.
                    --%>
                    <div class="history-timeline" id="historyDetailList" data-render-mode="server">
                        <c:set var="historyHasAny" value="false" />

                        <%-- 1. 신고 접수 이후에만 접수완료 이력 표시 --%>
                        <c:if test="${isReceiptDone}">
                            <c:set var="historyHasAny" value="true" />
                            <div class="history-timeline-item done">
                                <div class="history-dot">✓</div>
                                <div class="history-body">
                                    <div class="history-title-row">
                                        <div class="history-title">신고접수 완료</div>
                                        <span class="history-status">완료</span>
                                    </div>
                                    <div class="history-meta">
                                        <span><c:out value="${detail.requestDate}" default="-" /></span>
                                        <span>·</span>
                                        <span>담당공무원: <c:out value="${detail.officerName}" default="-" /></span>
                                    </div>
                                    <div class="history-note">신고서 접수 완료. 기본심사 대상으로 등록되었습니다.</div>
                                </div>
                            </div>
                        </c:if>

                        <%-- 2. 기본심사 단계에 들어온 경우만 표시 --%>
                        <c:if test="${isReviewStarted}">
                            <c:set var="historyHasAny" value="true" />
                            <div class="history-timeline-item info">
                                <div class="history-dot">i</div>
                                <div class="history-body">
                                    <div class="history-title-row">
                                        <div class="history-title">기본심사 시작</div>
                                        <span class="history-status">진행</span>
                                    </div>
                                    <div class="history-meta">
                                        <span>신고번호: <c:out value="${detail.reqNo}" default="-" /></span>
                                        <span>·</span>
                                        <span>신고구분: <c:out value="${detail.declareType}" default="-" /></span>
                                    </div>
                                    <div class="history-note">업체, 신고금액, 제출서류, HS/원산지 등 기본 심사를 시작했습니다.</div>
                                </div>
                            </div>
                        </c:if>

                        <%-- 3. 보완요청 / 반려 업무처리 이력 --%>
                        <c:if test="${not empty workHistoryList}">
                            <c:forEach var="work" items="${workHistoryList}">
                                <c:set var="historyHasAny" value="true" />
                                <c:set var="historyClass" value="info" />
                                <c:set var="historyIcon" value="i" />
                                <c:set var="historyTitle" value="업무처리" />

                                <c:choose>
                                    <c:when test="${work.workType eq 'supplement'}">
                                        <c:set var="historyClass" value="warn" />
                                        <c:set var="historyIcon" value="↻" />
                                        <c:set var="historyTitle" value="보완요청 등록" />
                                    </c:when>
                                    <c:when test="${work.workType eq 'reject'}">
                                        <c:set var="historyClass" value="reject" />
                                        <c:set var="historyIcon" value="×" />
                                        <c:set var="historyTitle" value="반려 등록" />
                                    </c:when>
                                    <c:when test="${work.workType eq 'hold_release'}">
                                        <c:set var="historyClass" value="done" />
                                        <c:set var="historyIcon" value="✓" />
                                        <c:set var="historyTitle" value="보류해지" />
                                    </c:when>
                                    <c:otherwise>
                                        <c:set var="historyTitle" value="${work.workType}" />
                                    </c:otherwise>
                                </c:choose>

                                <c:if test="${work.status eq '해지' or work.status eq '처리완료' or work.status eq '승인'}">
                                    <c:set var="historyClass" value="done" />
                                    <c:set var="historyIcon" value="✓" />
                                </c:if>

                                <div class="history-timeline-item ${historyClass}">
                                    <div class="history-dot"><c:out value="${historyIcon}" /></div>
                                    <div class="history-body">
                                        <div class="history-title-row">
                                            <div class="history-title"><c:out value="${historyTitle}" default="업무처리" /></div>
                                            <c:if test="${not empty work.status}">
                                                <span class="history-status"><c:out value="${work.status}" /></span>
                                            </c:if>
                                        </div>
                                        <div class="history-meta">
                                            <span><c:out value="${work.registDt}" default="-" /></span>
                                            <span>·</span>
                                            <span>처리자: <c:out value="${work.officerId}" default="-" /></span>
                                            <c:if test="${not empty work.dueDate}">
                                                <span>·</span>
                                                <span>답변기한: <c:out value="${work.dueDate}" /></span>
                                            </c:if>
                                        </div>
                                        <div class="history-note"><c:out value="${work.reason}" default="처리 상세내용이 없습니다." /></div>
                                        <c:if test="${not empty work.submitContent or not empty work.submitDt}">
                                            <div class="history-detail-box">
                                                <div><strong>제출일시</strong> <c:out value="${work.submitDt}" default="-" /></div>
                                                <div><strong>제출내용</strong> <c:out value="${work.submitContent}" default="-" /></div>
                                            </div>
                                        </c:if>
                                        <c:if test="${not empty work.fileNo}">
                                            <div class="history-file-row">
                                                <button type="button"
                                                        class="btn-secondary btn-sm btn-preview"
                                                        data-file-no="${work.fileNo}"
                                                        data-file-name="${work.fileName}">
                                                    첨부파일 보기
                                                </button>
                                            </div>
                                        </c:if>
                                    </div>
                                </div>
                            </c:forEach>
                        </c:if>

                        <%-- 4. 품목별로 실제 처리된 이력만 누적 표시 --%>
                        <c:if test="${not empty itemList}">
                            <c:forEach var="item" items="${itemList}" varStatus="st">
                                <c:set var="itemStatus" value="${empty item.itemStatusCd ? 'ITEM_REVIEW' : item.itemStatusCd}" />

                                <c:if test="${not empty item.suppReqCn}">
                                    <c:set var="historyHasAny" value="true" />
                                    <div class="history-timeline-item warn">
                                        <div class="history-dot">↻</div>
                                        <div class="history-body">
                                            <div class="history-title-row">
                                                <div class="history-title">품목 ${st.count}번 보완요청</div>
                                                <span class="history-status">보완요청</span>
                                            </div>
                                            <div class="history-meta">
                                                <span><c:out value="${item.suppReqDate}" default="-" /></span>
                                                <span>·</span>
                                                <span>HS <c:out value="${item.hsCode}" default="-" /></span>
                                                <span>·</span>
                                                <span><c:out value="${item.itemName}" default="품목명 없음" /></span>
                                            </div>
                                            <div class="history-note"><c:out value="${item.suppReqCn}" /></div>
                                        </div>
                                    </div>
                                </c:if>

                                <c:if test="${not empty item.suppSubmitCn}">
                                    <c:set var="historyHasAny" value="true" />
                                    <div class="history-timeline-item info">
                                        <div class="history-dot">i</div>
                                        <div class="history-body">
                                            <div class="history-title-row">
                                                <div class="history-title">품목 ${st.count}번 보완서류 제출확인</div>
                                                <span class="history-status">보완제출</span>
                                            </div>
                                            <div class="history-meta">
                                                <span><c:out value="${item.suppSubmitDate}" default="-" /></span>
                                                <span>·</span>
                                                <span>HS <c:out value="${item.hsCode}" default="-" /></span>
                                                <span>·</span>
                                                <span><c:out value="${item.itemName}" default="품목명 없음" /></span>
                                            </div>
                                            <div class="history-note"><c:out value="${item.suppSubmitCn}" /></div>
                                        </div>
                                    </div>
                                </c:if>

                                <c:if test="${itemStatus eq 'ITEM_ACPT' or itemStatus eq 'ITEM_REJ'}">
                                    <c:set var="historyHasAny" value="true" />
                                    <div class="history-timeline-item ${itemStatus eq 'ITEM_ACPT' ? 'done' : 'hold'}">
                                        <div class="history-dot">
                                            <c:choose>
                                                <c:when test="${itemStatus eq 'ITEM_ACPT'}">✓</c:when>
                                                <c:otherwise>!</c:otherwise>
                                            </c:choose>
                                        </div>
                                        <div class="history-body">
                                            <div class="history-title-row">
                                                <div class="history-title">
                                                    <c:choose>
                                                        <c:when test="${itemStatus eq 'ITEM_ACPT'}">품목 ${st.count}번 수리</c:when>
                                                        <c:otherwise>품목 ${st.count}번 반려</c:otherwise>
                                                    </c:choose>
                                                </div>
                                                <span class="history-status">
                                                    <c:choose>
                                                        <c:when test="${itemStatus eq 'ITEM_ACPT'}">수리완료</c:when>
                                                        <c:otherwise>반려</c:otherwise>
                                                    </c:choose>
                                                </span>
                                            </div>
                                            <div class="history-meta">
                                                <span><c:out value="${item.itemHistoryDate}" default="-" /></span>
                                                <span>·</span>
                                                <span>HS <c:out value="${item.hsCode}" default="-" /></span>
                                                <span>·</span>
                                                <span><c:out value="${item.itemName}" default="품목명 없음" /></span>
                                            </div>
                                            <div class="history-note">
                                                <c:choose>
                                                    <c:when test="${not empty item.itemRemark}"><c:out value="${item.itemRemark}" /></c:when>
                                                    <c:when test="${itemStatus eq 'ITEM_ACPT'}">품목 HS코드, 과세가격, 세율 적용 검토 후 수리 처리되었습니다.</c:when>
                                                    <c:otherwise>품목 심사 결과 반려 처리되었습니다.</c:otherwise>
                                                </c:choose>
                                            </div>
                                        </div>
                                    </div>
                                </c:if>

                                <c:if test="${empty item.suppReqCn and empty item.suppSubmitCn and not empty item.itemRemark and itemStatus ne 'ITEM_ACPT' and itemStatus ne 'ITEM_REJ'}">
                                    <c:set var="historyHasAny" value="true" />
                                    <div class="history-timeline-item info">
                                        <div class="history-dot">i</div>
                                        <div class="history-body">
                                            <div class="history-title-row">
                                                <div class="history-title">품목 ${st.count}번 처리</div>
                                                <span class="history-status">
                                                    <c:choose>
                                                        <c:when test="${itemStatus eq 'ITEM_SUPP_REQ'}">보완요청</c:when>
                                                        <c:when test="${itemStatus eq 'ITEM_SUPP_SUB'}">보완제출</c:when>
                                                        <c:otherwise>처리</c:otherwise>
                                                    </c:choose>
                                                </span>
                                            </div>
                                            <div class="history-meta">
                                                <span><c:out value="${item.itemHistoryDate}" default="-" /></span>
                                                <span>·</span>
                                                <span>HS <c:out value="${item.hsCode}" default="-" /></span>
                                                <span>·</span>
                                                <span><c:out value="${item.itemName}" default="품목명 없음" /></span>
                                            </div>
                                            <div class="history-note"><c:out value="${item.itemRemark}" /></div>
                                        </div>
                                    </div>
                                </c:if>
                            </c:forEach>
                        </c:if>

                        <%-- 5. 세금 관련 실제 발생 이력만 표시 --%>
                        <c:if test="${not empty tax.sendDate and tax.sendDate ne '-' and (allItemsAccepted or taxPaid)}">
                            <c:set var="historyHasAny" value="true" />
                            <div class="history-timeline-item warn">
                                <div class="history-dot">i</div>
                                <div class="history-body">
                                    <div class="history-title-row">
                                        <div class="history-title">세금정보 전달</div>
                                        <span class="history-status">전달완료</span>
                                    </div>
                                    <div class="history-meta">
                                        <span><c:out value="${tax.sendDate}" default="-" /></span>
                                        <span>·</span>
                                        <span>납부기한: <c:out value="${tax.payDueDate}" default="-" /></span>
                                    </div>
                                    <div class="history-note">관세사에게 관세 및 부가세 납부 정보를 전달했습니다.</div>
                                </div>
                            </div>
                        </c:if>

                        <c:if test="${taxPaid}">
                            <c:set var="historyHasAny" value="true" />
                            <div class="history-timeline-item done">
                                <div class="history-dot">✓</div>
                                <div class="history-body">
                                    <div class="history-title-row">
                                        <div class="history-title">세금납부 완료</div>
                                        <span class="history-status">납부완료</span>
                                    </div>
                                    <div class="history-meta">
                                        <span><c:out value="${tax.vatPaidDate}" default="-" /></span>
                                        <span>·</span>
                                        <span>총납부세액: <c:out value="${tax.totalAmount}" default="-" /></span>
                                    </div>
                                    <div class="history-note">관세 및 부가세 납부완료가 확인되었습니다.</div>
                                </div>
                            </div>
                        </c:if>

                        <%-- 6. 실제 통관완료/필증발급 이후에만 마지막 이력 표시 --%>
                        <c:if test="${detail.statusCd eq 'DCLR_DONE' or detail.statusCd eq 'CSTM_DONE'}">
                            <c:set var="historyHasAny" value="true" />
                            <div class="history-timeline-item done">
                                <div class="history-dot">✓</div>
                                <div class="history-body">
                                    <div class="history-title-row">
                                        <div class="history-title">승인 및 필증발급</div>
                                        <span class="history-status">완료</span>
                                    </div>
                                    <div class="history-meta">
                                        <span>현재상태: <c:out value="${detail.statusCd}" default="-" /></span>
                                    </div>
                                    <div class="history-note">신고수리 완료 및 신고필증 발급 처리가 완료되었습니다.</div>
                                </div>
                            </div>
                        </c:if>

                        <c:if test="${not historyHasAny}">
                            <div class="history-empty-box">
                                <c:choose>
                                    <c:when test="${isReceiptBefore}">아직 접수 처리 전입니다. 접수 또는 반려 처리 후 이력이 표시됩니다.</c:when>
                                    <c:otherwise>아직 등록된 처리이력이 없습니다.</c:otherwise>
                                </c:choose>
                            </div>
                        </c:if>
                    </div>
                </div>
            </section>
        </div>

        <c:choose>

            <%-- ① 타인 건(readonly): 버튼 없음 --%>
            <c:when test="${mode eq 'readonly'
                        and detail.statusCd ne 'DCLR_REJ'
                        and detail.statusCd ne 'CSTM_CANCEL'
                        and not (detail.statusCd eq 'CSTM_REQ'
                              or detail.statusCd eq 'WAIT'
                              or detail.statusCd eq 'RCP_REJECT'
                              or detail.statusCd eq 'DCLR_WAIT'
                              or detail.statusCd eq '접수대기'
                              or detail.statusCd eq 'EXP_WAIT'
                              or detail.statusCd eq 'ER_WAIT')}">
                <div class="act-bar">
                    <div class="readonly-notice">
                          승인 완료된 건입니다.
                    </div>
                </div>
            </c:when>

            <%-- ② 반려/취소: 버튼 없음 --%>
            <c:when test="${detail.statusCd eq 'DCLR_REJ'}">
                <div class="act-bar">
                    <div class="readonly-notice">반려 처리된 건입니다. 업무처리 탭에서 반려사유 이력을 확인하세요.</div>
                </div>
            </c:when>

            <c:when test="${detail.statusCd eq 'CSTM_CANCEL'}">
                <div class="act-bar">
                    <div class="readonly-notice">취소된 건입니다.</div>
                </div>
            </c:when>

            <%-- ③ 접수 전 상세: [반려] [접수] 표시
                 CSTM_REQ / WAIT / RCP_REJECT 또는
                 DCLR_WAIT / 접수대기 상태는 담당공무원 값과 관계없이 접수 전 건으로 본다. --%>
            <c:when test="${isReceiptBefore}">
                <div class="act-bar receipt-action-bar">
                    <div class="receipt-action-guide">
                        <span class="material-symbols-outlined">info</span>
                        <span>접수 전 신고입니다. 접수 또는 반려 처리를 진행하세요.</span>
                    </div>
                    <div class="receipt-action-buttons">
                        <button type="button" class="btn-danger btn-receipt-reject" id="btnRejectBottom">반려</button>
                        <button type="button" class="btn-approve btn-receipt-approve" id="btnReceiptBottom">접수</button>
                    </div>
                </div>
            </c:when>

            <%-- ④-1 보완요청 중: 관세사 보완제출 대기 안내 --%>
            <c:when test="${detail.statusCd eq 'DCLR_SUPP_REQ'}">
                <div class="act-bar">
                    <div class="readonly-notice">관세사 보완제출 대기 중입니다.</div>
                </div>
            </c:when>

            <%-- ④-2 보완제출 완료: 공무원이 보완요청완료 버튼으로 심사중 복귀 --%>
            <c:when test="${detail.statusCd eq 'DCLR_SUPP_SUB'}">
                <div class="act-bar">
                    <div class="final-approve-guide ready">관세사가 보완서류를 제출했습니다. 검토 후 심사를 재개하세요.</div>
                    <button type="button" class="btn-approve" id="btnCompleteSupp">보완요청 완료</button>
                </div>
            </c:when>

            <%-- ④ 기본심사 진행중: 품목·납부 상태에 따라 최종 승인 가능 --%>
            <c:when test="${detail.statusCd eq 'DCLR_WAIT'
                         or detail.statusCd eq 'DCLR_REVIEW'
                         or detail.statusCd eq 'CSTM_ACPT'
                         or detail.statusCd eq 'CSTM_INPRG'
                         or detail.statusCd eq 'CSTM_SUPP_SUB'
                         or taxSent}">
                <div class="act-bar">
                    <c:choose>
                        <%-- 신고필증 발급 완료 → 중복 발급 방지 --%>
                        <c:when test="${certificateIssued}">
                            <div class="final-approve-guide ready">심사완료/통관완료 · 신고필증 발급 완료 상태입니다</div>
                            <button type="button" class="btn-approve" id="btnIssueCert" disabled="disabled">승인 및 필증발급</button>
                        </c:when>

                        <%-- 품목 수리 + 납부완료 → 승인 및 필증발급 버튼 --%>
                        <c:when test="${allItemsAccepted and taxPaid}">
                            <div class="final-approve-guide ready">세금납부 완료 · 승인 및 필증발급을 진행할 수 있습니다</div>
                            <button type="button" class="btn-approve" id="btnIssueCert">승인 및 필증발급</button>
                        </c:when>

                        <%-- 품목 수리 완료, 납부 대기/기한초과 --%>
                        <c:when test="${allItemsAccepted}">
                            <div class="final-approve-guide ready">전체 품목 수리완료 · 세금납부 탭에서 관세사 납부상태를 확인하세요</div>
                        </c:when>

                        <%-- 품목 수리 미완료 --%>
                        <c:otherwise>
                            <div class="final-approve-guide">품목 수리완료 ${itemAcceptedCount}/${itemTotalCount} · 모든 품목 수리 후 세금납부 탭이 활성화됩니다</div>
                        </c:otherwise>
                    </c:choose>
                </div>
            </c:when>

            <%-- ⑤ 심사완료/통관완료: 처리 완료 안내 --%>
            <c:when test="${detail.statusCd eq 'DCLR_DONE'
                         or detail.statusCd eq 'CSTM_DONE'}">
                <div class="act-bar">
                    <div class="final-approve-guide ready">심사완료/통관완료 · 신고필증 발급 완료 상태입니다</div>
                </div>
            </c:when>

            <%-- ⑦ 그 외 --%>
            <c:otherwise>
                <div class="act-bar">
                    <div class="readonly-notice">현재 상태에서는 처리할 수 없습니다.</div>
                </div>
            </c:otherwise>
     	</c:choose>
    </div>
</main>

<div class="mov" id="m-approve">
    <div class="mbox approve-modal-box">
        <div class="mhdr">
            <div class="mtitle"><span class="material-symbols-outlined">check_circle</span> 신고 승인 처리</div>
            <button type="button" class="mclose" data-close="m-approve">✕</button>
        </div>
        <div class="mbody">
            <div class="note"><strong><c:out value="${detail.reqNo}" default="신고번호" /></strong> 모든 품목이 수리완료된 신고건만 승인할 수 있습니다. 승인 시 처리상태가 승인완료로 변경되고 세금납부 탭이 활성화됩니다.</div>
            <div class="approve-flow">
                <div class="af-item"><div class="af-num g">1</div><div class="af-body"><div class="af-title">품목별 심사 완료 확인</div><div class="af-desc">모든 HS 품목이 수리완료 상태인지 확인합니다.</div></div></div>
                <div class="af-arrow">↓</div>
                <div class="af-item"><div class="af-num g">2</div><div class="af-body"><div class="af-title">신고필증 발급 준비</div><div class="af-desc">승인 후 신고필증 발급 단계로 이동할 수 있습니다.</div></div></div>
                <div class="af-arrow">↓</div>
                <div class="af-item"><div class="af-num b">3</div><div class="af-body"><div class="af-title">세금납부 탭 활성화</div><div class="af-desc">관세사에게 세금정보 전달이 가능합니다.</div></div></div>
            </div>
        </div>
        <div class="mfoot">
            <button type="button" class="btn-secondary" data-close="m-approve">취소</button>
            <button type="button" class="btn-approve" id="btnApproveConfirm" ${allItemsAccepted ? '' : 'disabled'}>승인 처리</button>
        </div>
    </div>
</div>

<div class="mov" id="m-sms">
    <div class="mbox sms-modal-box">
        <div class="mhdr">
            <div class="mtitle">문자알림 발송</div>
            <button type="button" class="mclose" data-close="m-sms">✕</button>
        </div>
        <div class="mbody">
            <label class="sms-opt"><input type="radio" name="smsType" checked><div><div class="sms-opt-t">처리상태 안내</div><div class="sms-opt-p">현재 심사 진행상태를 업체 담당자에게 안내합니다.</div></div></label>
            <label class="sms-opt"><input type="radio" name="smsType"><div><div class="sms-opt-t">보완요청 안내</div><div class="sms-opt-p">요청사항 등록 사실과 답변기한을 안내합니다.</div></div></label>
            <label class="sms-opt"><input type="radio" name="smsType"><div><div class="sms-opt-t">납부 안내</div><div class="sms-opt-p">세금납부 정보를 안내합니다.</div></div></label>
        </div>
        <div class="mfoot">
            <button type="button" class="btn-secondary" data-close="m-sms">취소</button>
            <button type="button" class="btn-primary" id="btnSmsSend">발송</button>
        </div>
    </div>
</div>

<div class="toast" id="toastEl"></div>

<%-- 반려 모달 --%>
<div id="m-reject"
     style="display:none; position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.45); z-index:9999; align-items:center; justify-content:center;">
    <div class="modal-box" style="width:460px; hight:340px;">
        <div class="modal-header">
            <strong>신고 반려</strong>
            <button type="button" class="modal-close js-close-reject">×</button>
        </div>
        <form id="detailRejectForm" action="${ctx}/officer/receiptReject.do" method="post">
            <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
            <input type="hidden" name="reqNo"       value="${detail.reqNo}">
            <input type="hidden" name="declareType" value="${detail.declareType}">
            <input type="hidden" name="source"      value="detail">
            <div class="modal-body">
                <label class="modal-label">반려사유</label>
                <textarea id="detailRejectReason"
                          name="rejectReason"
                          class="modal-textarea"
                          required
                          placeholder="반려사유를 입력하세요." style="width: 430px; height: 100px;"></textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary js-close-reject">취소</button>
                <button type="submit" class="btn-danger">반려처리</button>
            </div>
        </form>
    </div>
</div>

<%-- 접수 처리 form (POST) --%>
<form id="detailAcceptForm" action="${ctx}/officer/receiptAccept.do" method="post" style="display:none;">
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
    <input type="hidden" name="reqNo"       value="${detail.reqNo}">
    <input type="hidden" name="declareType" value="${detail.declareType}">
    <input type="hidden" name="source"      value="detail">
</form>


<%-- ====== 란사항 처리 모달 ====== --%>
<div id="m-item-action" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,.5); z-index:3000; align-items:center; justify-content:center;">
    <div style="background:#fff; border-radius:8px; width:480px; max-width:95vw; box-shadow:0 20px 60px rgba(0,0,0,.2);">
        <div style="padding:16px 20px; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between;">
            <div>
                <div id="mia-title" style="font-size:15px; font-weight:800; color:#1b2d44;"></div>
                <div id="mia-sub" style="font-size:11.5px; color:#64748b; margin-top:2px;"></div>
            </div>
            <button type="button" class="js-close-item" style="background:none;border:none;font-size:20px;cursor:pointer;color:#94a3b8;line-height:1;">✕</button>
        </div>
        <div style="padding:18px 20px;">
            <div id="mia-info" style="display:grid; grid-template-columns:1fr 1fr; gap:8px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:12px 14px; margin-bottom:16px; font-size:12px;">
                <div><span style="color:#94a3b8;">HS CODE</span><br><strong id="mia-hs" style="color:#0f2537;"></strong></div>
                <div><span style="color:#94a3b8;">신고품명</span><br><strong id="mia-name" style="color:#0f2537;"></strong></div>
            </div>
            <div id="mia-reason-wrap">
                <label style="display:block; font-size:12px; font-weight:700; color:#334155; margin-bottom:6px;">사유 <span style="color:#dc2626;">*</span></label>
                <textarea id="mia-reason" rows="4"
                    style="width:100%; border:1px solid #d1d9e6; border-radius:4px; font-size:12.5px; font-family:inherit; padding:8px 10px; resize:vertical; box-sizing:border-box; color:#0f172a;"
                    placeholder="사유를 입력하세요."></textarea>
            </div>
        </div>
        <div style="padding:12px 20px; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:8px;">
            <button type="button" class="btn-secondary js-close-item">취소</button>
            <button type="button" id="mia-confirm" class="btn-approve" style="min-width:70px; height:34px;">확인</button>
        </div>
    </div>
</div>

<%@ include file="/WEB-INF/views/officer/footer/footer.jsp" %>
<%@ include file="/WEB-INF/views/officer/footer/scripts.jsp" %>

<%-- workTab.js 가 읽는 페이지 메타 --%>
<meta id="pageReqNo"    content="${detail.reqNo}">
<meta id="pageCtx"      content="${ctx}">
<meta id="pageCsrf"     content="${_csrf.token}">
<meta id="pageAllItemsAccepted" content="${allItemsAccepted}">

<script defer src="${ctx}/resources/js/officer/pages/basicScreenDetail.js"></script>
</body>
</html>
