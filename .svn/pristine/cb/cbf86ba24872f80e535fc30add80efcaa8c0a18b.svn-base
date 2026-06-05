<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/broker/common/meta.jsp" %>

    <link rel="stylesheet" href="${ctx}/resources/css/broker/common.css">
    <link rel="stylesheet" href="${ctx}/resources/css/broker/pages/quarantine.css">

    <title>수출검역신청 | TACS</title>
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
                           href="${ctx}/broker/quarantine/result.do">
                            검역결과조회
                        </a>

                        <a class="sub-tab ${activeSub eq 'import' ? 'active' : ''}"
                           href="${ctx}/broker/quarantine/import.do">
                            수입검역신청
                        </a>

                        <a class="sub-tab ${activeSub eq 'export' ? 'active' : ''}"
                           href="${ctx}/broker/quarantine/export.do">
                            수출검역신청
                        </a>
                    </div>

                    <!-- ===== 수출검역신청 ===== -->
                    <div id="qu-export">

                        <div class="flex-between mb-4">
                            <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;">
                                <span class="material-symbols-outlined">outbound</span>
                                수출식물 검역신청서
                            </h3>

                            <div class="btn-group">
                                <button type="button"
                                        class="btn btn-outline"
                                        style="font-size:12px;"
                                        onclick="window.print()">
                                    <span class="material-symbols-outlined" style="font-size:16px;">print</span>
                                    신청서 인쇄
                                </button>
                            </div>
                        </div>

                        <div class="alert-bar info">
                            <span class="material-symbols-outlined" style="font-size:18px">fact_check</span>
                            본 신청서는 <strong>농림축산검역본부 표준 데이터 규격</strong>을 준수합니다.
                        </div>

                        <div class="alert-bar warn">
                            <span class="material-symbols-outlined" style="font-size:18px">construction</span>
                            수출검역신청 저장 기능은 추후 구현 예정입니다. 현재는 화면 분리 및 입력 UI 정리 상태입니다.
                        </div>

                        <form id="exportQuarantineForm"
                              method="post"
                              action="#"
                              onsubmit="alert('수출검역신청 저장 기능은 추후 구현 예정입니다.'); return false;">

                            <c:if test="${not empty _csrf}">
                                <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
                            </c:if>

                            <!-- [1] 수출자 정보 -->
                            <div class="qu-form-card mb-4">
                                <h4>[1] 수출자 정보</h4>

                                <div class="qu-form-grid">

                                    <div>
                                        <label>성명 <span class="req">*</span></label>
                                        <input type="text"
                                               name="exporterNm"
                                               placeholder="수출자 성명">
                                    </div>

                                    <div>
                                        <label>상호 <span class="req">*</span></label>
                                        <input type="text"
                                               name="exporterCompanyNm"
                                               placeholder="수출사 명칭">
                                    </div>

                                    <div>
                                        <label>생년월일</label>
                                        <input type="date"
                                               name="exporterBirthDt">
                                    </div>

                                    <div>
                                        <label>사업자등록번호</label>
                                        <input type="text"
                                               name="exporterBizNo"
                                               placeholder="000-00-00000">
                                    </div>

                                    <div>
                                        <label>전화번호 <span class="req">*</span></label>
                                        <input type="tel"
                                               name="exporterTelno"
                                               placeholder="000-0000-0000">
                                    </div>

                                    <div>
                                        <label>이메일</label>
                                        <input type="email"
                                               name="exporterEmail"
                                               placeholder="example@email.com">
                                    </div>

                                    <div class="full">
                                        <label>주소 <span class="req">*</span></label>
                                        <input type="text"
                                               name="exporterAdres"
                                               placeholder="수출자 주소 입력">
                                    </div>

                                </div>
                            </div>

                            <!-- [2] 수입자 정보 -->
                            <div class="qu-form-card mb-4">
                                <h4>[2] 수입자 정보</h4>

                                <div class="qu-form-grid">

                                    <div>
                                        <label>성명 <span class="req">*</span></label>
                                        <input type="text"
                                               name="consigneeNm"
                                               placeholder="수입자 성명">
                                    </div>

                                    <div>
                                        <label>상호 <span class="req">*</span></label>
                                        <input type="text"
                                               name="consigneeCompanyNm"
                                               placeholder="수입사 명칭">
                                    </div>

                                    <div>
                                        <label>국가 <span class="req">*</span></label>
                                        <input type="text"
                                               name="consigneeCountryCd"
                                               placeholder="예: US, CN, JP">
                                    </div>

                                    <div>
                                        <label>연락처</label>
                                        <input type="text"
                                               name="consigneeTelno"
                                               placeholder="수입자 연락처">
                                    </div>

                                    <div class="full">
                                        <label>주소 <span class="req">*</span></label>
                                        <input type="text"
                                               name="consigneeAdres"
                                               placeholder="수입자 주소 입력">
                                    </div>

                                </div>
                            </div>

                            <!-- [3] 운송수단 및 선적 정보 -->
                            <div class="qu-form-card mb-4">
                                <h4>[3] 운송수단 및 선적 정보</h4>

                                <div class="qu-form-grid">

                                    <div>
                                        <label>운송수단 <span class="req">*</span></label>
                                        <select name="transportTypeCd">
                                            <option value="">선택</option>
                                            <option value="SHIP">선박</option>
                                            <option value="AIR">항공</option>
                                            <option value="TRUCK">차량</option>
                                            <option value="RAIL">철도</option>
                                            <option value="ETC">기타</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label>운송수단명</label>
                                        <input type="text"
                                               name="transportNm"
                                               placeholder="선박명, 항공편명 등">
                                    </div>

                                    <div>
                                        <label>선적항 <span class="req">*</span></label>
                                        <input type="text"
                                               name="loadPortCd"
                                               placeholder="선적항 입력">
                                    </div>

                                    <div>
                                        <label>도착항 <span class="req">*</span></label>
                                        <input type="text"
                                               name="arrvPortCd"
                                               placeholder="도착항 입력">
                                    </div>

                                    <div>
                                        <label>출항일 <span class="req">*</span></label>
                                        <input type="date"
                                               name="shipDt">
                                    </div>

                                    <div>
                                        <label>도착예정일</label>
                                        <input type="date"
                                               name="arrvDt">
                                    </div>

                                </div>
                            </div>

                            <!-- [4] 선적 품목 정보 -->
                            <div class="qu-form-card mb-4">
                                <h4>[4] 선적 품목 정보</h4>

                                <div class="qu-form-grid">

                                    <div>
                                        <label>품목수 <span class="req">*</span></label>
                                        <input type="number"
                                               name="itemCount"
                                               placeholder="품목수">
                                    </div>

                                    <div>
                                        <label>품목명 <span class="req">*</span></label>
                                        <input type="text"
                                               name="goodsNm"
                                               placeholder="품목명">
                                    </div>

                                    <div>
                                        <label>HS코드</label>
                                        <input type="text"
                                               name="hsCd"
                                               placeholder="HS코드">
                                    </div>

                                    <div>
                                        <label>학명</label>
                                        <input type="text"
                                               name="scientificNm"
                                               placeholder="학명">
                                    </div>

                                    <div>
                                        <label>수량 <span class="req">*</span></label>
                                        <input type="number"
                                               step="0.001"
                                               name="qty"
                                               placeholder="수량">
                                    </div>

                                    <div>
                                        <label>단위 <span class="req">*</span></label>
                                        <input type="text"
                                               name="qtyUnitCd"
                                               placeholder="예: EA, KG, BOX">
                                    </div>

                                    <div>
                                        <label>원산지 <span class="req">*</span></label>
                                        <input type="text"
                                               name="originCountryCd"
                                               placeholder="예: KR">
                                    </div>

                                    <div>
                                        <label>수입국 <span class="req">*</span></label>
                                        <input type="text"
                                               name="importCountryCd"
                                               placeholder="예: US">
                                    </div>

                                    <div>
                                        <label>포장 수</label>
                                        <input type="number"
                                               name="pkgCnt"
                                               placeholder="포장 수">
                                    </div>

                                    <div>
                                        <label>포장 종류</label>
                                        <input type="text"
                                               name="pkgMaterial"
                                               placeholder="포장 종류">
                                    </div>

                                    <div class="full">
                                        <label>식별표시(Distinguishing Marks)</label>
                                        <input type="text"
                                               name="distinguishingMarks"
                                               placeholder="식별표시 입력">
                                    </div>

                                </div>
                            </div>

                            <!-- [5] 검역 정보 -->
                            <div class="qu-form-card mb-4">
                                <h4>[5] 검역 정보</h4>

                                <div class="qu-form-grid">

                                    <div>
                                        <label>검역 희망일시 <span class="req">*</span></label>
                                        <input type="datetime-local"
                                               name="inspectionPlanDt">
                                    </div>

                                    <div>
                                        <label>검역장소 <span class="req">*</span></label>
                                        <select name="inspectionPlaceCd">
                                            <option value="">선택</option>
                                            <option value="BUSAN_PORT">부산항</option>
                                            <option value="INCHEON_PORT">인천항</option>
                                            <option value="INCHEON_AIRPORT">인천공항</option>
                                            <option value="GIMPO_AIRPORT">김포공항</option>
                                            <option value="YEOSU_PORT">여수항</option>
                                            <option value="ULSAN_PORT">울산항</option>
                                            <option value="ETC">기타</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label>검역기관</label>
                                        <select name="quarantineInstCd">
                                            <option value="">선택</option>
                                            <option value="QRTN_INST_01">농림축산검역본부</option>
                                            <option value="QRTN_INST_02">식품의약품안전처</option>
                                            <option value="QRTN_INST_03">수산물품질관리원</option>
                                            <option value="QRTN_INST_99">기타</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label>검역장소명</label>
                                        <input type="text"
                                               name="inspectionPlaceNm"
                                               placeholder="검역 장소명">
                                    </div>

                                    <div class="full">
                                        <label>검역장소 주소</label>
                                        <input type="text"
                                               name="inspectionPlaceAdres"
                                               placeholder="검역장소 주소">
                                    </div>

                                </div>
                            </div>

                            <!-- [6] 신청인 요구사항 -->
                            <div class="qu-form-card mb-4">
                                <h4>[6] 신청인 요구사항</h4>

                                <div class="qu-form-grid">

                                    <div class="full">
                                        <label>특별한 요청사항</label>
                                        <textarea name="requestCn"
                                                  rows="4"
                                                  placeholder="특별한 요청사항을 입력하세요."
                                                  style="resize:vertical;"></textarea>
                                    </div>

                                </div>
                            </div>

                            <!-- [7] 첨부문서 -->
                            <div class="qu-form-card mb-4">
                                <h4>[7] 첨부문서</h4>

                                <div class="alert-bar">
                                    <span class="material-symbols-outlined" style="font-size:18px;">description</span>
                                    수출검역 신청서류, Invoice, Packing List, B/L 등 관련 문서를 첨부하세요.
                                </div>

                                <div class="qu-attach-box"
                                     style="border:2px dashed #cbd5e1; padding:24px; text-align:center; background:#f8fafc;">

                                    <span class="material-symbols-outlined"
                                          style="font-size:36px; color:#64748b;">upload_file</span>

                                    <div style="font-size:13px; font-weight:700; color:#334155; margin-top:8px;">
                                        첨부파일을 선택하세요.
                                    </div>

                                    <div style="font-size:12px; color:#64748b; margin-top:4px;">
                                        PDF, JPG, PNG, XLSX, DOCX 파일 첨부 가능
                                    </div>

                                    <input type="file"
                                           id="exportAttachFiles"
                                           name="attachFiles"
                                           multiple
                                           style="display:none;">

                                    <button type="button"
                                            class="btn btn-outline"
                                            style="margin-top:12px;"
                                            onclick="document.getElementById('exportAttachFiles').click();">
                                        파일 선택
                                    </button>
                                </div>
                            </div>

                            <!-- 버튼 -->
                            <div class="btn-row"
                                 style="margin-top:40px; justify-content:center; gap:12px; border-top:1px solid #e2e8f0; padding-top:30px;">

                                <button type="button"
                                        class="btn btn-secondary"
                                        style="width:160px;"
                                        onclick="alert('수출검역신청 임시저장 기능은 추후 구현 예정입니다.');">
                                    임시저장
                                </button>

                                <button type="submit"
                                        class="btn btn-primary"
                                        style="width:160px;">
                                    검역신청 전송
                                </button>

                            </div>

                        </form>

                    </div>
                    <!-- /#qu-export -->

                </div>
                <!-- /.sub-page -->

            </div>
            <!-- /.page -->

        </div>
        <!-- /.content -->

        <%@ include file="/WEB-INF/views/broker/common/footer.jsp" %>

    </div>
    <!-- /.main-wrap -->

</div>
<!-- /.app -->


<%@ include file="/WEB-INF/views/broker/common/modals.jsp" %>

<script>
    window.contextPath = '${ctx}';
</script>

<script src="${ctx}/resources/js/broker/common.js"></script>
<script src="${ctx}/resources/js/broker/pages/quarantine.js"></script>

</body>
</html>