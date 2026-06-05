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


        <div class="banner">
          <div class="banner-left">
            <h2>화주 관리 <span>CLIENTS</span></h2>
            <div class="meta">관세사에게 배정된 수입·수출 의뢰 화주 목록</div>
          </div>
          <div class="banner-right">
            <div class="banner-stat">
              <div class="label">TOTAL</div>
              <div class="val">${clientCount}<span class="unit"> 건</span></div>
            </div>
          </div>
        </div>

        <div class="sub-page">
          <h2>
            <span class="material-symbols-outlined">groups</span>
            화주 의뢰 목록
          </h2>

          <form method="get" action="${ctx}/broker/clients.do">
            <div class="search-card">
              <div class="search-grid">

                <div class="search-field">
                  <label>의뢰번호</label>
                  <input type="text" id="f-no" name="reqNo" value="${searchVO.reqNo}" placeholder="의뢰번호 입력">
                </div>

                <div class="search-field">
                  <label>상태</label>
                  <select id="f-cat" name="status">
                    <option value="">전체</option>
                    <option value="CSTM_REQ" ${searchVO.status eq 'CSTM_REQ' ? 'selected' : ''}>접수대기</option>
                    <option value="CSTM_ACPT" ${searchVO.status eq 'CSTM_ACPT' ? 'selected' : ''}>접수완료</option>
                    <option value="CSTM_INPRG" ${searchVO.status eq 'CSTM_INPRG' ? 'selected' : ''}>처리중</option>
                    <option value="CSTM_SUPP" ${searchVO.status eq 'CSTM_SUPP' ? 'selected' : ''}>보완요청</option>
                    <option value="CSTM_SUPP_SUB" ${searchVO.status eq 'CSTM_SUPP_SUB' ? 'selected' : ''}>보완제출</option>
                    <option value="CSTM_REJ" ${searchVO.status eq 'CSTM_REJ' ? 'selected' : ''}>반려</option>
                    <option value="CSTM_DONE" ${searchVO.status eq 'CSTM_DONE' ? 'selected' : ''}>완료</option>
                    <option value="CSTM_CANCEL" ${searchVO.status eq 'CSTM_CANCEL' ? 'selected' : ''}>취소</option>
                  </select>
                </div>

                <div class="search-field">
                  <label>화주명</label>
                  <input type="text" id="f-client" name="clientName" value="${searchVO.clientName}" placeholder="화주명 입력">
                </div>

                <div class="search-field">
                  <label>품목/내용</label>
                  <input type="text" id="f-item" name="itemName" value="${searchVO.itemName}" placeholder="품목명 입력">
                </div>

                <div class="search-field">
                  <label>요청일</label>
                  <input type="date" id="f-date" name="requestDate" value="${searchVO.requestDate}">
                </div>

                <div class="search-field">
                  <label>업무구분</label>
                  <select id="f-type" name="reqType">
                    <option value="">전체</option>
                    <option value="IMPORT" ${searchVO.reqType eq 'IMPORT' ? 'selected' : ''}>수입</option>
                    <option value="EXPORT" ${searchVO.reqType eq 'EXPORT' ? 'selected' : ''}>수출</option>
                  </select>
                </div>

                <div class="search-field btn-cell">
                  <label>&nbsp;</label>
                  <button type="submit" class="btn-search">조회</button>
                </div>

                <div class="search-field btn-cell">
                  <label>&nbsp;</label>
                  <button type="button" class="btn-reset"
                          onclick="location.href='${ctx}/broker/clients.do'">
                    초기화
                  </button>
                </div>

              </div>
            </div>
          </form>

          <div class="cl-info-bar">
            <span id="cl-count">
              총 ${pagingVO.totalRecord}건 / ${pagingVO.currentPage}페이지
            </span>
          </div>

          <table class="data-table cl-table" id="cl-table">
            <colgroup>
              <col style="width: 24%">
              <col style="width: 15%">
              <col style="width: 18%">
              <col style="width: 11%">
              <col style="width: 10%">
              <col style="width: 10%">
              <col style="width: 12%">
            </colgroup>

            <thead>
              <tr class="cl-title-row">
                <th>품목/내용</th>
                <th>화주명</th>
                <th>의뢰번호</th>
                <th>업무구분</th>
                <th>상태</th>
                <th>요청일</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              <c:forEach var="client" items="${clientList}">
                <tr>
                  <td>${client.itemName}</td>
                  <td class="td-id">${client.clientName}</td>
                  <td class="td-id">${client.reqNo}</td>
                  <td>${client.reqType}</td>

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

                  <td class="td-muted">${client.requestDate}</td>

                  <td class="td-actions">
                    <div class="action-buttons">
                      <button type="button"
                              class="mini mini-view"
                              onclick="location.href='${ctx}/broker/clients/detail.do?reqNo=${client.reqNo}&reqType=${client.reqTypeCd}'">
                        상세
                      </button>
                    </div>
                  </td>
                </tr>
              </c:forEach>

              <c:if test="${empty clientList}">
                <tr>
                  <td colspan="7" style="text-align:center; padding:28px;">
                    조회된 화주 의뢰가 없습니다.
                  </td>
                </tr>
              </c:if>
            </tbody>
          </table>

          <div class="pagination">

            <c:url var="firstUrl" value="/broker/clients.do">
              <c:param name="page" value="1"/>
              <c:param name="reqNo" value="${searchVO.reqNo}"/>
              <c:param name="status" value="${searchVO.status}"/>
              <c:param name="clientName" value="${searchVO.clientName}"/>
              <c:param name="itemName" value="${searchVO.itemName}"/>
              <c:param name="requestDate" value="${searchVO.requestDate}"/>
              <c:param name="reqType" value="${searchVO.reqType}"/>
            </c:url>

            <c:url var="prevUrl" value="/broker/clients.do">
              <c:param name="page" value="${pagingVO.startPage - 1}"/>
              <c:param name="reqNo" value="${searchVO.reqNo}"/>
              <c:param name="status" value="${searchVO.status}"/>
              <c:param name="clientName" value="${searchVO.clientName}"/>
              <c:param name="itemName" value="${searchVO.itemName}"/>
              <c:param name="requestDate" value="${searchVO.requestDate}"/>
              <c:param name="reqType" value="${searchVO.reqType}"/>
            </c:url>

            <c:choose>
              <c:when test="${pagingVO.startPage > 1}">
                <a class="page-btn" href="${firstUrl}">«</a>
                <a class="page-btn" href="${prevUrl}">‹</a>
              </c:when>
              <c:otherwise>
                <button type="button" class="page-btn" disabled>«</button>
                <button type="button" class="page-btn" disabled>‹</button>
              </c:otherwise>
            </c:choose>

            <c:forEach var="p" begin="${pagingVO.startPage}" end="${pagingVO.endPage}">
              <c:if test="${p <= pagingVO.totalPage}">
                <c:url var="pageUrl" value="/broker/clients.do">
                  <c:param name="page" value="${p}"/>
                  <c:param name="reqNo" value="${searchVO.reqNo}"/>
                  <c:param name="status" value="${searchVO.status}"/>
                  <c:param name="clientName" value="${searchVO.clientName}"/>
                  <c:param name="itemName" value="${searchVO.itemName}"/>
                  <c:param name="requestDate" value="${searchVO.requestDate}"/>
                  <c:param name="reqType" value="${searchVO.reqType}"/>
                </c:url>

                <c:choose>
                  <c:when test="${p eq pagingVO.currentPage}">
                    <button type="button" class="page-btn active">${p}</button>
                  </c:when>
                  <c:otherwise>
                    <a class="page-btn" href="${pageUrl}">${p}</a>
                  </c:otherwise>
                </c:choose>
              </c:if>
            </c:forEach>

            <c:url var="nextUrl" value="/broker/clients.do">
              <c:param name="page" value="${pagingVO.endPage + 1}"/>
              <c:param name="reqNo" value="${searchVO.reqNo}"/>
              <c:param name="status" value="${searchVO.status}"/>
              <c:param name="clientName" value="${searchVO.clientName}"/>
              <c:param name="itemName" value="${searchVO.itemName}"/>
              <c:param name="requestDate" value="${searchVO.requestDate}"/>
              <c:param name="reqType" value="${searchVO.reqType}"/>
            </c:url>

            <c:url var="lastUrl" value="/broker/clients.do">
              <c:param name="page" value="${pagingVO.totalPage}"/>
              <c:param name="reqNo" value="${searchVO.reqNo}"/>
              <c:param name="status" value="${searchVO.status}"/>
              <c:param name="clientName" value="${searchVO.clientName}"/>
              <c:param name="itemName" value="${searchVO.itemName}"/>
              <c:param name="requestDate" value="${searchVO.requestDate}"/>
              <c:param name="reqType" value="${searchVO.reqType}"/>
            </c:url>

            <c:choose>
              <c:when test="${pagingVO.endPage < pagingVO.totalPage}">
                <a class="page-btn" href="${nextUrl}">›</a>
                <a class="page-btn" href="${lastUrl}">»</a>
              </c:when>
              <c:otherwise>
                <button type="button" class="page-btn" disabled>›</button>
                <button type="button" class="page-btn" disabled>»</button>
              </c:otherwise>
            </c:choose>

          </div>

        </div>
      </section>
    </main>

    <jsp:include page="/WEB-INF/views/broker/common/footer.jsp" />

  </div>
</div>

<jsp:include page="/WEB-INF/views/broker/common/modals.jsp" />

<script>
  window.contextPath = '${ctx}';
</script>
<script src="${ctx}/resources/js/broker/common.js"></script>
<script src="${ctx}/resources/js/broker/pages/clients.js"></script>

</body>
</html>