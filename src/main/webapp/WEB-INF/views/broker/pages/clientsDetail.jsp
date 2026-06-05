<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <jsp:include page="/WEB-INF/views/broker/common/meta.jsp" />
  <link rel="stylesheet" href="${ctx}/resources/css/broker/common.css">
  <link rel="stylesheet" href="${ctx}/resources/css/broker/pages/clients.css">
</head>

<body>
<div class="app">

  <jsp:include page="/WEB-INF/views/broker/common/sidebar.jsp" />

  <div class="main-wrap">

    <jsp:include page="/WEB-INF/views/broker/common/header.jsp" />

    <main class="content">
      <section class="page active">

        <div class="breadcrumb">
          <span>Home</span>
          <span class="sep">/</span>
          <span>화주 관리</span>
          <span class="sep">/</span>
          <span>의뢰 상세</span>
        </div>

        <div class="banner">
          <div class="banner-left">
            <h2>의뢰 상세 <span>CLIENT DETAIL</span></h2>
            <div class="meta">화주 통관 의뢰 상세정보 및 요청 처리</div>
          </div>
        </div>

        <c:if test="${empty client}">
          <div class="sub-page">
            <h2>
              <span class="material-symbols-outlined">error</span>
              조회 결과 없음
            </h2>
            <div style="padding:40px;text-align:center;color:#697d8f;">
              조회된 의뢰 정보가 없습니다.
            </div>

            <div class="detail-action-row">
              <button type="button"
                      class="btn btn-secondary"
                      onclick="location.href='${ctx}/broker/clients.do'">
                목록
              </button>
            </div>
          </div>
        </c:if>

        <c:if test="${not empty client}">
          <div class="sub-page">

            <h2>
              <span class="material-symbols-outlined">assignment</span>
              통관 의뢰 정보
            </h2>

            <table class="data-table">
              <tbody>
                <tr>
                  <th>통관의뢰번호</th>
                  <td>${client.reqNo}</td>
                  <th>업무구분</th>
                  <td>${client.reqType}</td>
                </tr>
                <tr>
                  <th>상태</th>
                  <td>
                    <c:choose>
					  <c:when test="${client.statusCd eq 'CSTM_REQ'}">
					    <span class="status-pill status-new">
					      <i class="dot"></i>${client.statusName}
					    </span>
					  </c:when>
					
					  <c:when test="${client.statusCd eq 'CSTM_INPRG'}">
					    <span class="status-pill status-progress">
					      <i class="dot"></i>${client.statusName}
					    </span>
					  </c:when>
					
					  <c:when test="${client.statusCd eq 'CSTM_SUPP'}">
					    <span class="status-pill status-sup">
					      <i class="dot"></i>${client.statusName}
					    </span>
					  </c:when>
					
					  <c:when test="${client.statusCd eq 'CSTM_SUPP_SUB'}">
					    <span class="status-pill status-submitted">
					      <i class="dot"></i>${client.statusName}
					    </span>
					  </c:when>
					
					  <c:when test="${client.statusCd eq 'CSTM_REJ'}">
					    <span class="status-pill status-rej">
					      <i class="dot"></i>${client.statusName}
					    </span>
					  </c:when>
					
					  <c:when test="${client.statusCd eq 'CSTM_CANCEL'}">
					    <span class="status-pill status-cancel">
					      <i class="dot"></i>${client.statusName}
					    </span>
					  </c:when>
					
					  <c:when test="${client.statusCd eq 'CSTM_ACPT' or client.statusCd eq 'CSTM_DONE'}">
					    <span class="status-pill status-done">
					      <i class="dot"></i>${client.statusName}
					    </span>
					  </c:when>
					
					  <c:otherwise>
					    <span class="status-pill status-new">
					      <i class="dot"></i>${client.statusName}
					    </span>
					  </c:otherwise>
					</c:choose>
                  </td>
                  <th>요청일시</th>
                  <td>${client.requestDateTime}</td>
                </tr>
                <tr>
                  <th>화주ID</th>
                  <td>${client.clientId}</td>
                  <th>화주명</th>
                  <td>${client.clientName}</td>
                </tr>
                <tr>
                  <th>통관고유부호</th>
                  <td>${client.cstmIdfNo}</td>
                  <th>법인등록번호</th>
                  <td>${client.corpRegNo}</td>
                </tr>
                <tr>
                  <th>도착예정일자</th>
                  <td>${client.scheduleDate}</td>
                  <th>B/L 또는 AWB 번호</th>
                  <td>${client.blAwbNo}</td>
                </tr>
                <tr>
                  <th>송장금액</th>
                  <td>
                    <c:choose>
                      <c:when test="${not empty client.invoiceAmount}">
                        ${client.invoiceAmount} ${client.currencyCd}
                      </c:when>
                      <c:otherwise>-</c:otherwise>
                    </c:choose>
                  </td>
                  <th>납부유형코드</th>
                  <td>
					    <c:choose>
					        <c:when test="${client.payTypeCd eq 'FULL'}">완납</c:when>
					        <c:when test="${client.payTypeCd eq 'INSTL'}">분납</c:when>
					        <c:when test="${client.payTypeCd eq 'DEFER'}">분납유예</c:when>
					        <c:otherwise>${client.payTypeCd}-</c:otherwise>
					    </c:choose>
					</td>
                </tr>
                <tr>
                  <th>분할납부횟수</th>
                  <td colspan="3">${client.instlPayCnt}</td>
                </tr>
                <tr>
                  <th>의뢰내용</th>
                  <td colspan="3">${client.comment}</td>
                </tr>
              </tbody>
            </table>

            <h2 style="margin-top:24px;">
              <span class="material-symbols-outlined">attach_file</span>
              첨부파일
            </h2>

            <table class="data-table">
              <thead>
                <tr>
                  <th>파일명</th>
                  <th>크기</th>
                  <th>등록일시</th>
                  <th>다운로드</th>
                </tr>
              </thead>
              <tbody>
                <c:forEach var="file" items="${client.fileList}">
                  <tr>
                    <td>${file.orgName}</td>
                    <td>${file.fancySize}</td>
                    <td>${file.registDate}</td>
                    <td>
                      <button type="button"
                              class="mini mini-view"
                              onclick="location.href='${ctx}/broker/clients/file/download.do?fileNo=${file.fileNo}'">
                        다운로드
                      </button>
                    </td>
                  </tr>
                </c:forEach>

                <c:if test="${empty client.fileList}">
                  <tr>
                    <td colspan="4" style="text-align:center;padding:24px;color:#697d8f;">
                      첨부파일이 없습니다.
                    </td>
                  </tr>
                </c:if>
              </tbody>
            </table>

			 <!-- ===============================
                 보완 제출 내용 영역
                 - 화주가 보완 제출 시 입력한 답변 멘트를 관세사가 확인하는 영역
                 - SUPP_RQST.SR_SUBMIT_CN -> ClientVO.suppSubmitCn
                 =============================== -->
            <c:if test="${not empty client.suppSubmitCn}">
              <h2 style="margin-top:24px;">
                <span class="material-symbols-outlined">assignment_turned_in</span>
                보완 제출 내용
              </h2>

              <table class="data-table">
                <tbody>
                  <tr>
                    <th>보완요청 내용</th>
                    <td colspan="3">
                      <c:choose>
                        <c:when test="${not empty client.suppReqCn}">
                          ${client.suppReqCn}
                        </c:when>
                        <c:otherwise>-</c:otherwise>
                      </c:choose>
                    </td>
                  </tr>
                  <tr>
                    <th>화주 답변 내용</th>
                    <td colspan="3">${client.suppSubmitCn}</td>
                  </tr>
                  <tr>
                    <th>보완요청일시</th>
                    <td>${client.suppReqDt}</td>
                    <th>보완제출일시</th>
                    <td>${client.suppSubmitDt}</td>
                  </tr>
                </tbody>
              </table>
            </c:if>
            <div class="detail-action-row">
			  <button type="button"
			          class="btn btn-secondary"
			          onclick="location.href='${ctx}/broker/clients.do'">
			    목록
			  </button>
			
			  <c:choose>
			    <c:when test="${client.statusCd eq 'CSTM_REQ'}">
			      <button type="button"
			              class="btn btn-outline"
			              onclick="showModal('supplement')">
			        보완요청
			      </button>
			
			      <button type="button"
			              class="btn btn-danger"
			              onclick="showModal('reject')">
			        반려
			      </button>
			
			      <form method="post" action="${ctx}/broker/clients/accept.do">
			        <input type="hidden" name="reqNo" value="${client.reqNo}">
			        <input type="hidden" name="reqType" value="${client.reqTypeCd}">
			        <input type="hidden" name="clientId" value="${client.clientId}">
			        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
			        <button type="submit"
			                class="btn btn-success"
			                onclick="return confirm('해당 의뢰를 수락하시겠습니까?');">
			          수락
			        </button>
			      </form>
			    </c:when>
			
			    <c:when test="${client.statusCd eq 'CSTM_SUPP_SUB'}">
			      <button type="button"
			              class="btn btn-outline"
			              onclick="showModal('supplement')">
			        재요청
			      </button>
			
			      <button type="button"
			              class="btn btn-danger"
			              onclick="showModal('reject')">
			        반려
			      </button>
			
			      <form method="post" action="${ctx}/broker/clients/accept.do">
			        <input type="hidden" name="reqNo" value="${client.reqNo}">
			        <input type="hidden" name="reqType" value="${client.reqTypeCd}">
			        <input type="hidden" name="clientId" value="${client.clientId}">
			        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
			        <button type="submit"
			                class="btn btn-success"
			                onclick="return confirm('보완 제출된 의뢰를 수락하시겠습니까?');">
			          수락
			        </button>
			      </form>
			    </c:when>
			
			    <c:when test="${client.statusCd eq 'CSTM_INPRG'}">
			      <button type="button"
			              class="btn btn-outline"
			              onclick="showModal('supplement')">
			        보완요청
			      </button>
			    </c:when>
			  </c:choose>
			</div>

          </div>
        </c:if>

      </section>
    </main>

    <jsp:include page="/WEB-INF/views/broker/common/footer.jsp" />

  </div>
</div>

<c:if test="${not empty client}">
  <div class="modal-bg" id="modal-supplement">
    <div class="modal-box">
      <button type="button" class="modal-close" onclick="hideModal('supplement')">×</button>

      <h3>
        <span class="material-symbols-outlined">assignment_late</span>
        보완 요청
      </h3>

      <form method="post" action="${ctx}/broker/clients/supplement.do">
        <input type="hidden" name="reqNo" value="${client.reqNo}">
        <input type="hidden" name="reqType" value="${client.reqTypeCd}">
        <input type="hidden" name="clientId" value="${client.clientId}">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">

        <div class="form-item mb-4">
          <label>보완항목 유형 <span class="req">*</span></label>
          <select name="suppTypeCd" required>
            <option value="">선택</option>
            <option value="FILE">파일 재제출</option>
            <option value="DATA">데이터 수정</option>
            <option value="INFO">정보 확인</option>
            <option value="ETC">기타</option>
          </select>
        </div>

        <div class="form-item mb-4">
          <label>보완요청 상세내용 <span class="req">*</span></label>
          <textarea name="suppReqCn"
                    rows="6"
                    required
                    placeholder="화주에게 요청할 보완 내용을 입력하세요."></textarea>
        </div>

        <div class="btn-row" style="justify-content:flex-end;">
          <button type="button"
                  class="btn btn-secondary"
                  onclick="hideModal('supplement')">
            취소
          </button>
          <button type="submit"
                  class="btn btn-primary"
                  onclick="return confirm('보완 요청을 등록하시겠습니까?');">
            보완요청
          </button>
        </div>
      </form>
    </div>
  </div>

  <div class="modal-bg" id="modal-reject">
    <div class="modal-box">
      <button type="button" class="modal-close" onclick="hideModal('reject')">×</button>

      <h3>
        <span class="material-symbols-outlined">block</span>
        반려 처리
      </h3>

      <form method="post" action="${ctx}/broker/clients/reject.do">
     	<input type="hidden" name="statusCd" value="${client.statusCd}">
        <input type="hidden" name="reqNo" value="${client.reqNo}">
        <input type="hidden" name="reqType" value="${client.reqTypeCd}">
        <input type="hidden" name="clientId" value="${client.clientId}">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">

        <div class="form-item mb-4">
          <label>반려사유 <span class="req">*</span></label>
          <textarea name="rejectCn"
                    rows="6"
                    required
                    placeholder="화주에게 전달할 반려사유를 입력하세요."></textarea>
        </div>

        <div class="btn-row" style="justify-content:flex-end;">
          <button type="button"
                  class="btn btn-secondary"
                  onclick="hideModal('reject')">
            취소
          </button>
          <button type="submit"
                  class="btn btn-danger"
                  onclick="return confirm('해당 의뢰를 반려 처리하시겠습니까?');">
            반려
          </button>
        </div>
      </form>
    </div>
  </div>
</c:if>

<script>
  window.contextPath = '${ctx}';
</script>
<script src="${ctx}/resources/js/broker/common.js"></script>
<script src="${ctx}/resources/js/broker/pages/clients.js"></script>

</body>
</html>