<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/broker/common/meta.jsp" %>
    
    <link rel="stylesheet" href="${ctx}/resources/lib/tui-grid/tui-pagination.min.css">
	<link rel="stylesheet" href="${ctx}/resources/lib/tui-grid/tui-grid.min.css">
	
    <link rel="stylesheet" href="${ctx}/resources/css/broker/common.css">
    <link rel="stylesheet" href="${ctx}/resources/css/broker/pages/quarantine.css">
    <title>검역 결과 조회 | TACS</title>
</head>

<body>
<div class="app" id="app">

    <%@ include file="/WEB-INF/views/broker/common/sidebar.jsp" %>

    <div class="main-wrap">

        <%@ include file="/WEB-INF/views/broker/common/header.jsp" %>

        <div class="content">

            <div class="page active" id="pg-quarantine">

                <div class="sub-page">


                    <!-- 검역관리 탭 -->
                    <div class="sub-tabs" id="tabs-qu">
                        <a class="sub-tab ${activeSub eq 'result' ? 'active' : ''}"
                           href="${ctx}/broker/quarantine/result.do">검역결과조회</a>

                        <a class="sub-tab ${activeSub eq 'import' ? 'active' : ''}"
                           href="${ctx}/broker/quarantine/import.do">수입검역신청</a>

                        <a class="sub-tab ${activeSub eq 'export' ? 'active' : ''}"
                           href="${ctx}/broker/quarantine/export.do">수출검역신청</a>
                    </div>

                    <!-- ===== 검역결과조회 ===== -->
                    <div id="qu-result">

                        <div class="flex-between mb-4">
						    <h3 class="quarantine-page-title">
						        <span class="material-symbols-outlined">assignment_returned</span>
						        검역결과조회
						    </h3>
						</div>

                        <!-- 검색 영역 -->
                        <form id="quResultSearchForm"
                              action="${ctx}/broker/quarantine/result.do"
                              method="get"
                              style="background:#fff; padding:16px 20px; border:1px solid #e2e8f0; border-radius:4px; margin-bottom:16px;">

                            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px 16px; align-items:end;">

                                <!-- 1행 -->
                                <div>
                                    <label style="font-size:12px; font-weight:700; color:#4d6172; display:block; margin-bottom:4px;">
                                        검역신청번호
                                    </label>
                                    <input type="text"
                                           id="quSearchApplyNo"
                                           name="searchApplyNo"
                                           value="${searchVO.searchApplyNo}"
                                           style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; font-size:13px; background:#fff; color:#203444; outline:none; box-sizing:border-box;">
                                </div>

                                <div>
                                    <label style="font-size:12px; font-weight:700; color:#4d6172; display:block; margin-bottom:4px;">
                                        수입자명
                                    </label>
                                    <input type="text"
                                           id="quSearchImporter"
                                           name="searchImporter"
                                           value="${searchVO.searchImporter}"
                                           style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; font-size:13px; background:#fff; color:#203444; outline:none; box-sizing:border-box;">
                                </div>

                                <div>
                                    <label style="font-size:12px; font-weight:700; color:#4d6172; display:block; margin-bottom:4px;">
                                        상품명
                                    </label>
                                    <input type="text"
                                           id="quSearchProductName"
                                           name="searchProductName"
                                           value="${searchVO.searchProductName}"
                                           style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; font-size:13px; background:#fff; color:#203444; outline:none; box-sizing:border-box;">
                                </div>

                                <div>
                                    <label style="font-size:12px; font-weight:700; color:#4d6172; display:block; margin-bottom:4px;">
                                        HS코드
                                    </label>
                                    <input type="text"
                                           id="quSearchHsCode"
                                           name="searchHsCode"
                                           value="${searchVO.searchHsCode}"
                                           style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; font-size:13px; background:#fff; color:#203444; outline:none; box-sizing:border-box;">
                                </div>

                                <!-- 2행 -->
                                <div style="grid-column: span 2;">
                                    <label style="font-size:12px; font-weight:700; color:#4d6172; display:block; margin-bottom:4px;">
                                        조회기간
                                    </label>

                                    <div style="display:flex; gap:8px; align-items:center;">
                                        <input type="date"
                                               id="quSearchFromDate"
                                               name="searchFromDate"
                                               value="${searchVO.searchFromDate}"
                                               style="flex:1; padding:8px 10px; border:1px solid #cbd5e1; font-size:13px; background:#fff; color:#203444; outline:none; box-sizing:border-box;">

                                        <span style="color:#697d8f; font-weight:600;">~</span>

                                        <input type="date"
                                               id="quSearchToDate"
                                               name="searchToDate"
                                               value="${searchVO.searchToDate}"
                                               style="flex:1; padding:8px 10px; border:1px solid #cbd5e1; font-size:13px; background:#fff; color:#203444; outline:none; box-sizing:border-box;">
                                    </div>
                                </div>

                                <div>
                                    <label style="font-size:12px; font-weight:700; color:#4d6172; display:block; margin-bottom:4px;">
                                        검역결과
                                    </label>
                                    <select id="quSearchResult" name="searchResult" style="width:100%; padding:8px 10px; border:1px solid #cbd5e1; font-size:13px; background:#fff; color:#203444; outline:none; box-sizing:border-box;">
									    <option value="">전체</option>
									    <option value="합격" ${searchVO.searchResult eq '합격' ? 'selected' : ''}>합격</option>
									    <option value="불합격" ${searchVO.searchResult eq '불합격' ? 'selected' : ''}>불합격</option>
									    <option value="보완요청" ${searchVO.searchResult eq '보완요청' ? 'selected' : ''}>보완요청</option>
									</select>
	                                </div>

                                <div style="display:flex; gap:6px; justify-content:flex-end; align-items:flex-end;">
                                    <button type="submit"
                                            class="btn btn-primary"
                                            style="background:#565e74; padding:8px 16px; white-space:nowrap;">
                                        <span class="material-symbols-outlined" style="font-size:16px; vertical-align:middle;">search</span>
                                        조회
                                    </button>

                                    <button type="button" id="quResultResetBtn" class="btn btn-secondary" style="padding:8px 16px; white-space:nowrap;">
									    초기화
									</button>
                                </div>

                            </div>
                        </form>

                        <!-- 목록 테이블 -->
                        <div style="overflow-x:auto; border:1px solid #e2e8f0; border-top:2px solid #334155;">
                            <!-- TOAST UI Grid 목록 영역 -->
							<div class="qu-grid-card">
							    <div id="quarantineResultGrid"></div>
							</div>
                        </div>

                        <!-- 목록 하단 -->
						<div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
						    <div style="font-size:12px; color:#697d8f;">
						        <strong id="quTotalCount">0</strong>
						        건의 검역신청이 조회되었습니다.
						    </div>
						</div>

                    </div>
                    <!-- /#qu-result -->

                </div>
                <!-- /.sub-page -->

            </div>
            <!-- /.page -->

        </div>
        <!-- /.content -->

    </div>
    <!-- /.main-wrap -->

</div>
<!-- /.app -->


<!-- 검역결과 상세 모달 -->
<div class="modal-bg" id="quDetailModal">
    <div class="modal-box quarantine-result-modal">

        <h3>
            <span class="material-symbols-outlined">assignment_turned_in</span>
            검역결과 상세조회
        </h3>

        <button type="button"
                class="modal-close"
                onclick="document.getElementById('quDetailModal').classList.remove('show')">
            ×
        </button>
        
        <div style="margin-top:20px;">

		    <!-- 상단 요약 -->
		    <div class="quarantine-summary">
		        <div class="quarantine-summary-item">
		            <div class="quarantine-summary-label">검역신청번호</div>
		            <div id="quDetailApplyNo" class="quarantine-summary-value">-</div>
		        </div>
		
		        <div class="quarantine-summary-item">
		            <div class="quarantine-summary-label">검역진행상태</div>
		            <div id="quDetailStatus" class="quarantine-summary-value success">-</div>
		        </div>
		
		        <div class="quarantine-summary-item">
		            <div class="quarantine-summary-label">신청인</div>
		            <div id="quDetailApplicant" class="quarantine-summary-value">-</div>
		        </div>
		
		        <div class="quarantine-summary-item">
		            <div class="quarantine-summary-label">수입자</div>
		            <div id="quDetailImporter" class="quarantine-summary-value">-</div>
		        </div>
		    </div>
		
		    <!-- 검역신청 정보 -->
		    <div class="quarantine-section">
		        <div class="quarantine-section-title">검역신청 정보</div>
		
		        <div class="quarantine-info-grid">
		            <div class="quarantine-info-cell">
		                <div class="quarantine-info-label">수출국</div>
		                <div class="quarantine-info-value">
		                    ${empty detailVO.idShipoutCntryCd ? '-' : detailVO.idShipoutCntryCd}
		                </div>
		            </div>
		
		            <div class="quarantine-info-cell">
		                <div class="quarantine-info-label">B/L번호</div>
		                <div class="quarantine-info-value">
		                    ${empty detailVO.irBlAwbNo ? '-' : detailVO.irBlAwbNo}
		                </div>
		            </div>
		
		            <div class="quarantine-info-cell">
		                <div class="quarantine-info-label">도착항</div>
		                <div class="quarantine-info-value">
		                    ${empty detailVO.irArrvPortCd ? '-' : detailVO.irArrvPortCd}
		                </div>
		            </div>
		
		            <div class="quarantine-info-cell">
		                <div class="quarantine-info-label">접수검역소</div>
		                <div class="quarantine-info-value">
		                    ${empty detailVO.iirQrtnInstCd ? '-' : detailVO.iirQrtnInstCd}
		                </div>
		            </div>
		        </div>
		    </div>
		
		    <!-- 검역 대상 물품 -->
		    <div class="quarantine-section">
		        <div class="quarantine-section-title">검역 대상 물품</div>
		
		        <div style="overflow-x:auto; border:1px solid #e2e8f0;">
		            <table class="data-table" style="font-size:12px; margin:0;">
		                <thead style="background:#f8fafc;">
		                    <tr>
		                        <th>HS코드</th>
		                        <th>상품명</th>
		                        <th>신청수량</th>
		                        <th>검역장소</th>
		                        <th>검역결과</th>
		                    </tr>
		                </thead>
		
		                <tbody id="quDetailItems">
		                    <tr>
		                        <td colspan="5" style="text-align:center; color:#697d8f; padding:16px;">
		                            상세 정보를 선택하세요.
		                        </td>
		                    </tr>
		                </tbody>
		            </table>
		        </div>
		    </div>
		
		    <!-- 검역 결과 -->
		    <div class="quarantine-section">
		        <div class="quarantine-section-title">검역 결과</div>
		
		        <div class="quarantine-result-box">
		            <div class="quarantine-result-row">
		                <div class="quarantine-result-label">검역결과</div>
		                <div class="quarantine-result-value">
		                    ${empty detailVO.iirResultNm ? '-' : detailVO.iirResultNm}
		                </div>
		            </div>
		
		            <div class="quarantine-result-row">
		                <div class="quarantine-result-label">검역일시</div>
		                <div class="quarantine-result-value">
		                    ${empty detailVO.iirResultDt ? '-' : detailVO.iirResultDt}
		                </div>
		            </div>
		
		            <div class="quarantine-result-row">
		                <div class="quarantine-result-label">담당자</div>
		                <div class="quarantine-result-value">
		                    ${empty detailVO.iirRsltOfficerNm ? '-' : detailVO.iirRsltOfficerNm}
		                </div>
		            </div>
		        </div>
		    </div>
		
		    <!-- 첨부문서 -->
		    <div class="quarantine-section">
		        <div class="quarantine-section-title">첨부문서</div>
		
		        <c:choose>
				    <c:when test="${empty detailVO.attachFileList}">
				        <div class="quarantine-doc-empty">
				            등록된 첨부문서가 없습니다.
				        </div>
				    </c:when>
				
				    <c:otherwise>
				        <div class="quarantine-doc-list">
				            <c:forEach var="file" items="${detailVO.attachFileList}">
				                <div class="quarantine-doc-item">
				
				                    <div class="quarantine-doc-name">
				                        <span class="material-symbols-outlined">description</span>
				                        <span>${file.dfiOrgNm}</span>
				                    </div>
				
				                    <div class="quarantine-doc-actions">
				                        <a class="quarantine-doc-preview"
				                           href="${ctx}/common/file/preview.do?fileNo=${file.dfiFileNo}"
				                           target="_blank">
				                            미리보기
				                        </a>
				
				                        <a class="quarantine-doc-download"
				                           href="${ctx}/common/file/download.do?fileNo=${file.dfiFileNo}">
				                            다운로드
				                        </a>
				                    </div>
				
				                </div>
				            </c:forEach>
				        </div>
				    </c:otherwise>
				</c:choose>
		    </div>
		    
		    <!-- =========================================================
			     보완요청 확인 및 보완제출
			     - 검역기관이 SUPP_RQST로 보낸 보완요청을 관세사가 확인
			     - REQ 상태일 때만 보완내용 입력/서류 재첨부 가능
			     - SUB/APR 상태일 때는 제출내용 읽기 전용 표시
			     ========================================================= -->
			<c:if test="${not empty detailVO.srNo}">
			    <div class="qu-form-card mb-4 supplement-submit-card">
			
			        <h4>보완요청 확인 및 보완제출</h4>
			
			        <!-- 보완요청 기본 상태 정보 -->
			        <div class="supplement-status-box">
			            <div>
			                <strong>보완요청번호</strong>
			                <span>${detailVO.srNo}</span>
			            </div>
			
			            <div>
			                <strong>보완상태</strong>
			                <span>
			                    <c:choose>
			                        <c:when test="${detailVO.srStatusCd eq 'REQ'}">보완요청</c:when>
			                        <c:when test="${detailVO.srStatusCd eq 'SUB'}">보완제출완료</c:when>
			                        <c:when test="${detailVO.srStatusCd eq 'APR'}">보완확인완료</c:when>
			                        <c:otherwise>${detailVO.srStatusCd}</c:otherwise>
			                    </c:choose>
			                </span>
			            </div>
			
			            <div>
			                <strong>요청일시</strong>
			                <span>${detailVO.srReqDt}</span>
			            </div>
			        </div>
			
			        <!-- 검역기관이 작성한 보완요청 내용 -->
			        <div class="supplement-request-box">
			            <label>검역기관 보완요청 내용</label>
			            <div class="supplement-request-content">
			                ${detailVO.srReqCn}
			            </div>
			        </div>
			
			        <c:choose>
			
			            <%-- REQ: 관세사가 아직 보완 제출하지 않은 상태 --%>
			            <c:when test="${detailVO.srStatusCd eq 'REQ'}">
			
			                <form id="supplementSubmitForm"
			                      action="${ctx}/broker/quarantine/supplement/submit.do"
			                      method="post"
			                      enctype="multipart/form-data"
			                      onsubmit="return validateSupplementSubmitForm(this);">
			
			                    <c:if test="${not empty _csrf}">
			                        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
			                    </c:if>
			
			                    <!--
			                        보완제출 처리에 필요한 값
			
			                        srNo:
			                        - SUPP_RQST의 PK
			                        - 기존 보완요청을 UPDATE할 때 사용
			
			                        iirReqNo:
			                        - 검역요청번호
			                        - SUPP_RQST.SR_REF_NO와 IMP_INS_REQ.IIR_REQ_NO 기준
			
			                        iirTfgNo:
			                        - 기존 첨부파일 그룹번호
			                        - 보완서류를 같은 파일그룹에 추가할 때 사용
			                    -->
			                    <input type="hidden" name="srNo" value="${detailVO.srNo}">
			                    <input type="hidden" name="iirReqNo" value="${empty detailVO.iirReqNo ? detailVO.srRefNo : detailVO.iirReqNo}">
			                    <c:if test="${not empty detailVO.iirTfgNo}">
								    <input type="hidden" name="iirTfgNo" value="${detailVO.iirTfgNo}">
								</c:if>
			
			                    <div class="supplement-submit-box">
			                        <label class="required-label">보완내용</label>
			                        <textarea name="srSubmitCn"
			                                  rows="5"
			                                  placeholder="검역기관의 보완요청 내용을 확인한 뒤 보완한 내용을 입력하세요."></textarea>
			                    </div>
			
			                    <div class="supplement-file-box">
								    <label>보완서류 재제출</label>
								
								    <input type="file" id="supplementFiles" name="supplementFiles" multiple onchange="showSupplementFileNames(this);">
								
								    <div id="supplementFileList" class="supplement-file-list">
								        선택된 파일이 없습니다.
								    </div>
								
								    <div class="supplement-help-text">
								        수정된 식물검역증명서, Invoice, Packing List, B/L 등 보완서류가 있으면 첨부하세요.
								    </div>
								</div>
								
			                    <div class="btn-row" style="justify-content:flex-end; margin-top:14px;">
			                        <button type="submit" class="btn btn-primary btn-supplement-submit">
			                            <span class="material-symbols-outlined" style="font-size:14px;">send</span>
			                            보완완료 전송
			                        </button>
			                    </div>
			                </form>
			
			            </c:when>
			
			            <%-- SUB/APR: 이미 제출했거나 검역기관이 확인 완료한 상태 --%>
			            <c:otherwise>
			                <div class="supplement-submit-readonly">
			                    <label>제출한 보완내용</label>
			
			                    <div class="supplement-request-content">
			                        <c:choose>
			                            <c:when test="${not empty detailVO.srSubmitCn}">
			                                ${detailVO.srSubmitCn}
			                            </c:when>
			                            <c:otherwise>
			                                제출된 보완내용이 없습니다.
			                            </c:otherwise>
			                        </c:choose>
			                    </div>
			                </div>
			
			                <c:if test="${not empty detailVO.srSubmitDt}">
			                    <div class="supplement-submit-date">
			                        보완제출일시: ${detailVO.srSubmitDt}
			                    </div>
			                </c:if>
			            </c:otherwise>
			
			        </c:choose>
			    </div>
			</c:if>
		
		    <!-- 버튼 -->
		    <div class="quarantine-modal-footer">
		    <c:if test="${not empty detailVO and detailVO.iirResultNm eq '합격'}">
		        <a class="btn-cert-download"
		           href="${ctx}/broker/quarantine/cert/download.do?iirReqNo=${detailVO.iirReqNo}">
		            <span class="material-symbols-outlined">download</span>
		            합격증명서 다운로드
		        </a>
		    </c:if>
		
		    <button type="button" class="btn-modal-close" onclick="document.getElementById('quDetailModal').classList.remove('show')">
		        닫기
		    </button>
		</div>
		
		</div>

    </div>
</div>


<%@ include file="/WEB-INF/views/broker/common/modals.jsp" %>

<script>
    window.contextPath = '${ctx}';
</script>

<c:if test="${not empty detailVO}">
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            document.getElementById('quDetailApplyNo').textContent =
                '${detailVO.iirReqNo}';

            document.getElementById('quDetailStatus').textContent =
                '${empty detailVO.iirResultStatusNm ? (empty detailVO.iirStatusNm ? detailVO.iirStatusCd : detailVO.iirStatusNm) : detailVO.iirResultStatusNm}';

            document.getElementById('quDetailApplicant').textContent =
                '${detailVO.brokerOfficeNm}';

            document.getElementById('quDetailImporter').textContent =
                '${detailVO.idImprNm}';

                var tbody = document.getElementById('quDetailItems');

                if (tbody) {
                    var itemHtml = '';

                    <c:choose>
                        <c:when test="${not empty detailVO.itemList}">
                            <c:forEach var="item" items="${detailVO.itemList}">
                                itemHtml +=
                                    '<tr>' +
                                    '<td>${empty item.hsCd ? "-" : item.hsCd}</td>' +
                                    '<td>${empty item.goodsNm ? "-" : item.goodsNm}</td>' +
                                    '<td style="font-weight:700;">${empty item.qty ? "-" : item.qty} ${empty item.qtyUnitCd ? "" : item.qtyUnitCd}</td>' +
                                    '<td style="font-weight:700;">${empty detailVO.iilNm ? "-" : detailVO.iilNm}</td>' +
                                    '<td><span class="badge badge-ok" style="font-size:10px;">${empty detailVO.iirResultNm ? detailVO.iirStatusNm : detailVO.iirResultNm}</span></td>' +
                                    '</tr>';
                            </c:forEach>
                        </c:when>
                        <c:otherwise>
                            itemHtml =
                                '<tr>' +
                                '<td colspan="5" style="text-align:center; color:#697d8f; padding:16px;">' +
                                '등록된 품목 정보가 없습니다.' +
                                '</td>' +
                                '</tr>';
                        </c:otherwise>
                    </c:choose>

                    tbody.innerHTML = itemHtml;
                }

            document.getElementById('quDetailModal').classList.add('show');
        });
    </script>
</c:if>
<script src="${ctx}/resources/lib/jquery/jquery-3.7.1.min.js"></script>
<script src="${ctx}/resources/lib/tui-grid/tui-pagination.min.js"></script>
<script src="${ctx}/resources/lib/tui-grid/tui-grid.min.js"></script>
<script src="${ctx}/resources/js/common/toast-grid.js"></script>

<script src="${ctx}/resources/js/broker/common.js"></script>
<script src="${ctx}/resources/js/broker/pages/quarantine.js"></script>

</body>
</html>