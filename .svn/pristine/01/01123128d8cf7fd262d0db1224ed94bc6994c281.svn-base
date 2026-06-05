<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<div class="card-section transport-process-card">
    <div class="transport-process-title">수출 운송 진행 처리</div>

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
        <tr>
            <td>운송의뢰 접수</td>
            <td>
                <span class="doc-status ok">
                    <c:out value="${detail.trcStatusNm}" default="접수완료"/>
                </span>
            </td>
            <td>
                <fmt:formatDate value="${detail.trcRceptDt}" pattern="yyyy-MM-dd"/>
            </td>
            <td>
                <button type="button" class="mini mini-view">보기</button>
            </td>
        </tr>

        <tr>
            <td>배차/선적 준비</td>
            <td>
                <c:choose>
                    <c:when test="${detail.dispatchStatusCd eq 'TRC_DISPATCH_DONE'}">
                        <span class="doc-status ok">배차완료</span>
                    </c:when>
                    <c:otherwise>
                        <span class="doc-status wait">배차대기</span>
                    </c:otherwise>
                </c:choose>
            </td>
            <td>
                <c:choose>
                    <c:when test="${not empty detail.dispatchDt}">
                        <fmt:formatDate value="${detail.dispatchDt}" pattern="yyyy-MM-dd"/>
                    </c:when>
                    <c:otherwise>-</c:otherwise>
                </c:choose>
            </td>
            <td>
                <button type="button" class="mini mini-view">상세</button>
            </td>
        </tr>

        <tr>
            <td>B/L 발급</td>
            <td>
                <c:choose>
                    <c:when test="${detail.blStatusCd eq 'TRC_DO_ISSUED' or detail.blStatusCd eq 'ISSUED'}">
                        <span class="doc-status ok">발급완료</span>
                    </c:when>
                    <c:otherwise>
                        <span class="doc-status wait">발급대기</span>
                    </c:otherwise>
                </c:choose>
            </td>
            <td>
                <c:choose>
                    <c:when test="${not empty detail.blIssuDt}">
                        <fmt:formatDate value="${detail.blIssuDt}" pattern="yyyy-MM-dd"/>
                    </c:when>
                    <c:otherwise>-</c:otherwise>
                </c:choose>
            </td>
            <td>
                <button type="button" class="mini mini-view">B/L 보기</button>
            </td>
        </tr>

        <tr>
            <td>수출 운임 정산</td>
            <td>
                <c:choose>
                    <c:when test="${detail.stlStatusCd eq 'TRC_STL_PAID'}">
                        <span class="doc-status ok">정산완료</span>
                    </c:when>
                    <c:when test="${detail.stlStatusCd eq 'TRC_STL_REQ'}">
                        <span class="doc-status wait">정산요청</span>
                    </c:when>
                    <c:otherwise>
                        <span class="doc-status wait">미정산</span>
                    </c:otherwise>
                </c:choose>
            </td>
            <td>
                <c:choose>
                    <c:when test="${not empty detail.stlDt}">
                        <fmt:formatDate value="${detail.stlDt}" pattern="yyyy-MM-dd"/>
                    </c:when>
                    <c:otherwise>-</c:otherwise>
                </c:choose>
            </td>
            <td>
                <button type="button" class="mini mini-primary">정산 확인</button>
            </td>
        </tr>
        </tbody>
    </table>
</div>