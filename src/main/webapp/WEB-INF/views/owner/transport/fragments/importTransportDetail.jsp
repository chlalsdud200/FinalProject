<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<div class="card-section transport-process-card">
    <div class="transport-process-title">수입 운송 진행 처리</div>

    <table class="data-table">
        <thead>
        <tr>
            <th>구분</th>
            <th>상태</th>
            <th>처리일시</th>
            <th>관리</th>
        </tr>
        </thead>

        <tbody>

        <%-- 도착통지 --%>
        <tr>
            <td>도착통지</td>
            <td>
                <c:choose>
                    <c:when test="${detail.ianSendSttsCd eq 'TRC_NTC_SENT'}">
                        <span class="doc-status ok">
                            <c:out value="${detail.ianSendSttsNm}" default="발송완료"/>
                        </span>
                    </c:when>
                    <c:when test="${not empty detail.ianSendSttsCd}">
                        <span class="doc-status wait">
                            <c:out value="${detail.ianSendSttsNm}" default="발송대기"/>
                        </span>
                    </c:when>
                    <c:otherwise>
                        <span class="doc-status wait">발송대기</span>
                    </c:otherwise>
                </c:choose>
            </td>
            <td>
                <c:choose>
                    <c:when test="${not empty detail.ianSendDt}">
                        <fmt:formatDate value="${detail.ianSendDt}" pattern="yyyy-MM-dd"/>
                    </c:when>
                    <c:otherwise>-</c:otherwise>
                </c:choose>
            </td>
            <td>
                <a class="mini mini-view"
                   href="${pageContext.request.contextPath}/owner/arrival-notice/detail-by-trc.do/${detail.trcNo}">
                    통지서 보기
                </a>
            </td>
        </tr>

        <%-- D/O 발급/전달 --%>
        <tr>
            <td>D/O 발급/전달</td>
            <td>
                <c:choose>
                    <c:when test="${detail.doStatusCd eq 'TRC_DO_REQ'}">
                        <span class="doc-status ok">전달완료</span>
                    </c:when>
                    <c:when test="${detail.doStatusCd eq 'TRC_DO_ISSUED'}">
                        <span class="doc-status wait">발급완료</span>
                    </c:when>
                    <c:when test="${detail.doStatusCd eq 'TRC_DO_READY'}">
                        <span class="doc-status wait">발급대기</span>
                    </c:when>
                    <c:otherwise>
                        <span class="doc-status wait">발급대기</span>
                    </c:otherwise>
                </c:choose>
            </td>
            <td>
                <c:choose>
                    <c:when test="${detail.doStatusCd eq 'TRC_DO_REQ' or detail.doStatusCd eq 'TRC_DO_ISSUED'}">
                        <fmt:formatDate value="${detail.lastUpdateDt}" pattern="yyyy-MM-dd"/>
                    </c:when>
                    <c:otherwise>-</c:otherwise>
                </c:choose>
            </td>
            <td>
                <a class="mini mini-primary"
                   href="${pageContext.request.contextPath}/owner/import/do/detail.do/${detail.trcNo}">
                    D/O 확인
                </a>
            </td>
        </tr>

        <%-- 반출/배송 상태 --%>
        <tr>
            <td>반출/배송 상태</td>
            <td>
                <c:choose>
                    <c:when test="${detail.ianArrvStatusCd eq 'TRC_ARR_ARRIVED'}">
                        <span class="doc-status ok">
                            <c:out value="${detail.ianArrvStatusNm}" default="도착완료"/>
                        </span>
                    </c:when>
                    <c:when test="${not empty detail.ianArrvStatusCd}">
                        <span class="doc-status wait">
                            <c:out value="${detail.ianArrvStatusNm}" default="진행중"/>
                        </span>
                    </c:when>
                    <c:otherwise>
                        <span class="doc-status wait">진행중</span>
                    </c:otherwise>
                </c:choose>
            </td>
            <td>
                <c:choose>
                    <c:when test="${not empty detail.ianArrvDt}">
                        <fmt:formatDate value="${detail.ianArrvDt}" pattern="yyyy-MM-dd"/>
                    </c:when>
                    <c:otherwise>-</c:otherwise>
                </c:choose>
            </td>
            <td>
                <a class="mini mini-view"
                   href="${pageContext.request.contextPath}/owner/import/release-delivery/detail.do/${detail.trcNo}">
                    상세
                </a>
            </td>
        </tr>

        <%-- 수입 운임 정산 --%>
        <tr>
            <td>수입 운임 정산</td>
            <td>
                <c:choose>
                    <c:when test="${detail.trcStatusCd eq 'TRC_STL_PAID'}">
                        <span class="doc-status ok">정산완료</span>
                    </c:when>
                    <c:when test="${detail.trcStatusCd eq 'TRC_STL_REQ'}">
                        <span class="doc-status wait">정산요청</span>
                    </c:when>
                    <c:otherwise>
                        <span class="doc-status wait">미정산</span>
                    </c:otherwise>
                </c:choose>
            </td>
            <td>
                <c:choose>
                    <c:when test="${detail.trcStatusCd eq 'TRC_STL_PAID' or detail.trcStatusCd eq 'TRC_STL_REQ'}">
                        <fmt:formatDate value="${detail.lastUpdateDt}" pattern="yyyy-MM-dd"/>
                    </c:when>
                    <c:otherwise>-</c:otherwise>
                </c:choose>
            </td>
            <td>
                <c:choose>
                    <c:when test="${not empty detail.tcsNo}">
                        <a class="mini mini-primary"
                           href="${pageContext.request.contextPath}/owner/transport/freight/detail.do/${detail.tcsNo}">
                            정산 확인
                        </a>
                    </c:when>
                    <c:otherwise>
                        <span class="mini mini-view">정산 없음</span>
                    </c:otherwise>
                </c:choose>
            </td>
        </tr>

        </tbody>
    </table>
</div>