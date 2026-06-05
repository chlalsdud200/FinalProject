<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<input type="hidden" id="exportBrokerId" name="erBrokerId">

<div class="form-group">
    <div class="form-group-title">
        ① 담당 관세사 선택 <span style="color:#9f403d;font-weight:700">*</span>
    </div>

    <div class="broker-selector-row">
        <label>담당 관세사 <span style="color:#9f403d">*</span></label>

        <div class="broker-display" id="exportBrokerDisplay">
            선택된 관세사가 없습니다. 오른쪽 버튼을 클릭하여 선택하세요.
        </div>

        <button type="button"
                class="btn btn-primary"
                onclick="openBrokerModal('export')">
            관세사 목록 보기
        </button>
    </div>
</div>

<div class="form-doc-divider"></div>

<div class="form-group">
    <div class="form-group-title">② 수출자 기본 정보</div>

    <div class="form-grid-2">
        <div class="fi">
            <label>수출자명 <span class="req">*</span></label>
            <input type="text"
                   name="erOnerNm"
                   id="erOnerNm"
                   value="${ownerVO.owrNm}"
                   readonly>
        </div>

        <c:choose>
            <%-- 개인회원 --%>
            <c:when test="${ownerVO.owrTyCd eq 'INDV'}">
                <div class="fi">
                    <label>주민등록번호</label>
                    <!-- 화면 표시용 -->
                    <input type="text"
                           value="${ownerVO.maskedOwrIdentNo}"
                           readonly>

                    <!-- 실제 submit용 -->
                    <input type="hidden"
                           name="erCorpRegNo"
                           id="erCorpRegNo"
                           value="${ownerVO.owrIdentNo}">
                </div>
            </c:when>

            <%-- 개인사업자 --%>
            <c:when test="${ownerVO.owrTyCd eq 'OPERATOR'}">
                <div class="fi">
                    <label>사업자등록번호</label>
                    <input type="text"
                           name="erCorpRegNo"
                           id="erBizrno"
                           value="${ownerVO.owrBizrno}"
                           readonly>
                </div>
            </c:when>

            <%-- 법인 --%>
            <c:when test="${ownerVO.owrTyCd eq 'CORP'}">
                <div class="fi">
                    <label>법인등록번호</label>
                    <input type="text"
                           name="erCorpRegNo"
                           id="erCorpRegNo"
                           value="${ownerVO.owrCorpRegNo}"
                           readonly>
                </div>
            </c:when>
        </c:choose>

        <div class="fi">
            <label>통관고유부호</label>
            <input type="text"
                   name="erCstmIdfNo"
                   id="erCstmIdfNo"
                   value="${ownerVO.owrCstmIdfNo}"
                   readonly>
        </div>
    </div>
</div>

<div class="form-doc-divider"></div>

<div class="form-group">
    <div class="form-group-title">③ 선적 · 거래 조건</div>

    <div class="form-grid-3">
        <div class="fi">
            <label>선적예정일 <span class="req">*</span></label>
            <input type="date"
                   name="erLoadSchdYmd"
                   id="erLoadSchdYmd"
                   value="">
        </div>

        <div class="fi">
            <label>Incoterms <span class="req">*</span></label>
            <select name="erIncoTermsCd" id="erIncoTermsCd">
                <option value="" selected>-- 선택 --</option>
                <option value="FOB">FOB — 본선인도</option>
                <option value="CIF">CIF — 운임보험료포함</option>
                <option value="CFR">CFR — 운임포함</option>
                <option value="EXW">EXW — 공장인도</option>
                <option value="DAP">DAP — 목적지인도</option>
            </select>
        </div>

        <div class="fi">
            <label>선적항</label>
            <input type="text"
                   name="erLoadPortCd"
                   id="erLoadPortCd"
                   placeholder="예: KRPTK"
                   value="">
        </div>

        <div class="fi">
            <label>도착항</label>
            <input type="text"
                   name="erArrvPortCd"
                   id="erArrvPortCd"
                   placeholder="예: USLAX"
                   value="">
        </div>
    </div>
</div>

<div class="form-doc-divider"></div>

<div class="form-group">
    <div class="form-group-title">④ 부가 신청 사항</div>

    <div class="form-grid-2">
        <div class="fi">
            <label>원산지증명서 발급대행</label>
            <select name="erCoIssueTyCd" id="erCoIssueTyCd">
                <option value="" selected>-- 원산지증명서 발급대행 --</option>
                <option value="FTA">신청 (FTA 원산지증명)</option>
                <option value="N">미신청</option>
            </select>
        </div>

        <div class="fi">
            <label>관세 환급 신청 여부</label>
            <select name="erRefundReqYn" id="erRefundReqYn">
                <option value="" selected style="color: #6b7280">-- 환급 신청 여부 --</option>
                <option value="Y">신청</option>
                <option value="N">미신청</option>
            </select>
        </div>

        <div class="fi full">
            <label>특이사항 / 비고</label>
            <textarea name="erComment"
                      id="erComment"
                      placeholder="수출 관련 특이사항, 세관 신고 시 주의사항 등을 입력하세요"></textarea>
        </div>
    </div>
</div>