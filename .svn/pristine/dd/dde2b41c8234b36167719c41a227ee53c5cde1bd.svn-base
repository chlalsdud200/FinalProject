<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
    request.setAttribute("activeMenu", "import");
    request.setAttribute("activeGroup", "");
    request.setAttribute("activeSub", "");
%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<c:set var="editable"
       value="${impDTO.irStatusCd eq 'CSTM_REQ'
            or impDTO.irStatusCd eq 'CSTM_SUPP'}" />

<fmt:formatDate value="${impDTO.irRegistDt}" pattern="yyyy-MM-dd" var="irRegistDtFmt" />
<fmt:formatDate value="${impDTO.irArrvSchdYmdAsDate}" pattern="yyyy-MM-dd" var="irArrvSchdYmdFmt" />

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ctx-path" content="${pageContext.request.contextPath}">
    <title>TACS 수입통관 의뢰 상세</title>

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
            <div class="page active" id="pg-import-detail">

                <div class="page-title-row">
                    <div>
                        <div style="font-size:11px;color:#94a3b8;font-weight:600;letter-spacing:.5px;margin-bottom:4px;text-transform:uppercase">
                            통관관리
                        </div>
                        <h2>수입통관 의뢰 상세</h2>
                    </div>

                    <div class="btn-row">
                        <a class="btn btn-outline"
                           href="${pageContext.request.contextPath}/owner/import/list.do">
                            <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span>
                            목록으로
                        </a>
                    </div>
                </div>

                <c:choose>
                    <c:when test="${impDTO.irStatusCd eq 'CSTM_SUPP'}">
                        <div class="alert-bar error">
                            <span class="material-symbols-outlined">priority_high</span>
                            <strong>보완요청 상태입니다.</strong>
                            요청 내용을 확인하고 수정사항 또는 보완자료를 제출하세요.
                        </div>
                    </c:when>

                    <c:when test="${editable}">
                        <div class="alert-bar info">
                            <span class="material-symbols-outlined">edit_note</span>
                            <strong>수정 가능한 상태입니다.</strong>
                            회원정보와 담당 관세사는 변경할 수 없으며, 수입 의뢰 정보만 수정할 수 있습니다.
                        </div>
                    </c:when>

                    <c:otherwise>
                        <div class="alert-bar info">
                            <span class="material-symbols-outlined">lock</span>
                            <strong>조회 전용 상태입니다.</strong>
                            접수 이후 진행 중이거나 완료된 의뢰는 수정할 수 없습니다.
                        </div>
                    </c:otherwise>
                </c:choose>

                <form id="importDetailForm"
                      class="form-doc"
                      method="post"
                      enctype="multipart/form-data"
                      action="${pageContext.request.contextPath}/owner/import/update.do">

                    <input type="hidden" name="irTfgNo" value="${impDTO.irTfgNo}">
                    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
                    <input type="hidden" name="irNo" value="${impDTO.irNo}">
                    <input type="hidden" name="irBrokerId" value="${impDTO.irBrokerId}">
                    <input type="hidden" name="irStatusCd" value="${impDTO.irStatusCd}">

                    <div class="form-doc-head">
                        <div class="form-doc-head-left">
                            <div class="form-doc-type">TACS · Import Customs</div>
                            <div class="form-doc-title">수입신고의뢰서</div>
                        </div>

                        <div class="form-doc-head-right">
                            <div class="form-doc-meta">
                                <strong>의뢰번호</strong> ${impDTO.irNo}
                            </div>
                            <div class="form-doc-meta">
                                <strong>진행상태</strong>
                                <c:choose>
                                    <c:when test="${impDTO.irStatusCd eq 'CSTM_REQ'}">접수대기</c:when>
                                    <c:when test="${impDTO.irStatusCd eq 'CSTM_ACPT'}">접수완료</c:when>
                                    <c:when test="${impDTO.irStatusCd eq 'CSTM_INPRG'}">진행중</c:when>
                                    <c:when test="${impDTO.irStatusCd eq 'CSTM_SUPP'}">보완요청</c:when>
                                    <c:when test="${impDTO.irStatusCd eq 'CSTM_SUPP_SUB'}">보완제출</c:when>
                                    <c:when test="${impDTO.irStatusCd eq 'CSTM_REJ'}">반려</c:when>
                                    <c:when test="${impDTO.irStatusCd eq 'CSTM_DONE'}">수리완료</c:when>
                                    <c:when test="${impDTO.irStatusCd eq 'CSTM_CANCEL'}">취소</c:when>
                                    <c:otherwise>${impDTO.irStatusCd}</c:otherwise>
                                </c:choose>
                            </div>
                            <div class="form-doc-meta">
                                <strong>등록일자</strong> ${irRegistDtFmt}
                            </div>
                        </div>
                    </div>

                    <div class="form-doc-body">

                        <!-- ① 담당 관세사 -->
                        <div class="form-group">
                            <div class="form-group-title">① 담당 관세사</div>

                            <div class="broker-selector-row">
                                <label>담당 관세사</label>

                                <div class="broker-display" id="importBrokerDisplay">
                                    <c:choose>
                                        <c:when test="${not empty impDTO.brokerNm}">
                                            ${impDTO.brokerNm}
                                        </c:when>
                                        <c:otherwise>
                                            담당 관세사 정보가 없습니다.
                                        </c:otherwise>
                                    </c:choose>
                                </div>

                                <button type="button"
                                        class="btn btn-secondary"
                                        disabled>
                                    변경 불가
                                </button>
                            </div>
                        </div>

                        <div class="form-doc-divider"></div>

                        <!-- ② 수입자 기본 정보 -->
                        <div class="form-group">
                            <div class="form-group-title">② 수입자 기본 정보</div>

                            <div class="form-grid-2">
                                <div class="fi">
                                    <label>수입자명</label>
                                    <input type="text"
                                           name="irOnerNm"
                                           id="irOnerNm"
                                           value="${ownerVO.owrNm}"
                                           readonly>
                                </div>

                                <c:choose>
                                    <c:when test="${ownerVO.owrTyCd eq 'INDV'}">
                                        <div class="fi">
                                            <label>주민등록번호</label>
                                            <input type="text"
                                                   value="${ownerVO.maskedOwrIdentNo}"
                                                   readonly>
                                            <input type="hidden"
                                                   name="irCorpRegNo"
                                                   id="irCorpRegNo"
                                                   value="${ownerVO.owrIdentNo}">
                                        </div>
                                    </c:when>

                                    <c:when test="${ownerVO.owrTyCd eq 'OPERATOR'}">
                                        <div class="fi">
                                            <label>사업자등록번호</label>
                                            <input type="text"
                                                   name="irCorpRegNo"
                                                   id="irBizrno"
                                                   value="${ownerVO.owrBizrno}"
                                                   readonly>
                                        </div>
                                    </c:when>

                                    <c:when test="${ownerVO.owrTyCd eq 'CORP'}">
                                        <div class="fi">
                                            <label>법인등록번호</label>
                                            <input type="text"
                                                   name="irCorpRegNo"
                                                   id="irCorpRegNo"
                                                   value="${ownerVO.owrCorpRegNo}"
                                                   readonly>
                                        </div>
                                    </c:when>

                                    <c:otherwise>
                                        <div class="fi">
                                            <label>등록번호</label>
                                            <input type="text"
                                                   name="irCorpRegNo"
                                                   id="irCorpRegNo"
                                                   value="${impDTO.irCorpRegNo}"
                                                   readonly>
                                        </div>
                                    </c:otherwise>
                                </c:choose>

                                <div class="fi">
                                    <label>통관고유부호</label>
                                    <input type="text"
                                           name="irCstmIdfNo"
                                           id="irCstmIdfNo"
                                           value="${ownerVO.owrCstmIdfNo}"
                                           readonly>
                                </div>
                            </div>
                        </div>

                        <div class="form-doc-divider"></div>

                        <!-- ③ 수입 · 운송 정보 -->
                        <div class="form-group">
                            <div class="form-group-title">③ 수입 · 운송 정보</div>

                            <div class="form-grid-3">

                                <div class="fi">
                                    <label>도착항 <span class="req">*</span></label>

                                    <c:choose>
                                        <c:when test="${editable}">
                                            <div class="port-picker-row">
                                                <input type="text"
                                                       id="irArrvPortNm"
                                                       class="port-picker-input"
                                                       placeholder="도착항을 검색하세요"
                                                       value="${impDTO.irArrvPortCd}"
                                                       readonly
                                                       onclick="openPortModal('arrival')">

                                                <input type="hidden"
                                                       name="irArrvPortCd"
                                                       id="irArrvPortCd"
                                                       value="${impDTO.irArrvPortCd}">

                                                <button type="button"
                                                        class="port-search-btn"
                                                        onclick="openPortModal('arrival')">
                                                    검색
                                                </button>
                                            </div>
                                        </c:when>

                                        <c:otherwise>
                                            <input type="text"
                                                   id="irArrvPortNm"
                                                   class="port-picker-input"
                                                   value="${impDTO.irArrvPortCd}"
                                                   readonly>

                                            <input type="hidden"
                                                   name="irArrvPortCd"
                                                   id="irArrvPortCd"
                                                   value="${impDTO.irArrvPortCd}">
                                        </c:otherwise>
                                    </c:choose>
                                </div>

                                <div class="fi">
                                    <label>도착예정일 <span class="req">*</span></label>
                                    <input type="date"
                                           name="irArrvSchdYmd"
                                           id="irArrvSchdYmd"
                                           value="${irArrvSchdYmdFmt}"
                                    ${editable ? '' : 'readonly'}>
                                </div>

                                <div class="fi">
                                    <label>B/L 또는 AWB 번호 <span class="req">*</span></label>
                                    <input type="text"
                                           name="irBlAwbNo"
                                           id="irBlAwbNo"
                                           placeholder="예: MSKU1234567"
                                           value="${impDTO.irBlAwbNo}"
                                    ${editable ? '' : 'readonly'}>
                                </div>
                            </div>
                        </div>

                        <div class="form-doc-divider"></div>

                        <!-- ④ 송장 · 결제 정보 -->
                        <div class="form-group">
                            <div class="form-group-title">④ 송장 · 결제 정보</div>

                            <div class="form-grid-3">
                                <div class="fi">
                                    <label>신고통화 <span class="req">*</span></label>
                                    <select name="irDclrCurrCd"
                                            id="irDclrCurrCd"
                                    ${editable ? '' : 'disabled'}>
                                        <option value="">-- 선택 --</option>
                                        <option value="USD" ${impDTO.irDclrCurrCd eq 'USD' ? 'selected' : ''}>USD</option>
                                        <option value="KRW" ${impDTO.irDclrCurrCd eq 'KRW' ? 'selected' : ''}>KRW</option>
                                        <option value="EUR" ${impDTO.irDclrCurrCd eq 'EUR' ? 'selected' : ''}>EUR</option>
                                        <option value="JPY" ${impDTO.irDclrCurrCd eq 'JPY' ? 'selected' : ''}>JPY</option>
                                        <option value="CNY" ${impDTO.irDclrCurrCd eq 'CNY' ? 'selected' : ''}>CNY</option>
                                    </select>

                                    <c:if test="${not editable}">
                                        <input type="hidden" name="irDclrCurrCd" value="${impDTO.irDclrCurrCd}">
                                    </c:if>
                                </div>

                                <div class="fi">
                                    <label>송장금액</label>
                                    <input type="number"
                                           name="irInvcAmt"
                                           id="irInvcAmt"
                                           value="${impDTO.irInvcAmt}"
                                    ${editable ? '' : 'readonly'}>
                                </div>

                                <div class="fi">
                                    <label>결제방식</label>
                                    <select name="irPayMthdCd"
                                            id="irPayMthdCd"
                                    ${editable ? '' : 'disabled'}>
                                        <option value="">-- 결제방식 선택 --</option>
                                        <option value="APIPAY" ${impDTO.irPayMthdCd eq 'APIPAY' ? 'selected' : ''}>간편결제</option>
                                        <option value="ACCOUNT" ${impDTO.irPayMthdCd eq 'ACCOUNT' ? 'selected' : ''}>계좌이체</option>
                                        <option value="CARD" ${impDTO.irPayMthdCd eq 'CARD' ? 'selected' : ''}>카드납부</option>
                                        <option value="VIRTUAL" ${impDTO.irPayMthdCd eq 'VIRTUAL' ? 'selected' : ''}>가상계좌</option>
                                    </select>

                                    <c:if test="${not editable}">
                                        <input type="hidden" name="irPayMthdCd" value="${impDTO.irPayMthdCd}">
                                    </c:if>
                                </div>

                                <div class="fi">
                                    <label>결제유형</label>
                                    <select name="irPayTypeCd"
                                            id="irPayTypeCd"
                                    ${editable ? '' : 'disabled'}>
                                        <option value="">-- 결제유형 선택 --</option>
                                        <option value="FULL" ${impDTO.irPayTypeCd eq 'FULL' ? 'selected' : ''}>일시납부</option>
                                        <option value="INSTL" ${impDTO.irPayTypeCd eq 'INSTL' ? 'selected' : ''}>분할납부</option>
                                        <option value="DEFER" ${impDTO.irPayTypeCd eq 'DEFER' ? 'selected' : ''}>납부유예</option>
                                    </select>

                                    <c:if test="${not editable}">
                                        <input type="hidden" name="irPayTypeCd" value="${impDTO.irPayTypeCd}">
                                    </c:if>
                                </div>

                                <div class="fi"
                                     id="instlPayCntBox"
                                     style="${impDTO.irPayTypeCd eq 'INSTL' ? '' : 'display:none;'}">
                                    <label>분할납부횟수 <span class="req">*</span></label>
                                    <input type="number"
                                           name="irInstlPayCnt"
                                           id="irInstlPayCnt"
                                           min="1"
                                           value="${impDTO.irInstlPayCnt}"
                                           placeholder="분할납부횟수 입력"
                                    ${editable and impDTO.irPayTypeCd eq 'INSTL' ? '' : 'disabled'}>
                                </div>
                            </div>
                        </div>

                        <div class="form-doc-divider"></div>

                        <!-- ⑤ 특이사항 -->
                        <div class="form-group">
                            <div class="form-group-title">⑤ 특이사항 / 비고</div>

                            <div class="form-grid-2">
                                <div class="fi full">
                                    <label>특이사항 / 비고</label>
                                    <textarea name="irComment"
                                              id="irComment"
                                              placeholder="내부 확인용 메모 또는 보완 관련 메모를 입력하세요"
                                    ${editable ? '' : 'readonly'}>${impDTO.irComment}</textarea>
                                </div>
                            </div>
                        </div>

                        <div class="form-doc-divider"></div>

                        <!-- ⑥ 첨부서류 -->
                        <div class="form-group">
                            <div class="form-group-title">⑥ 첨부서류</div>

                            <div class="alert-bar info">
                                <span class="material-symbols-outlined">description</span>
                                송장, 패킹리스트, B/L, 원산지증명서, 보험증권, 계약서 등 수입통관에 필요한 문서를 확인하거나 추가 첨부하세요.
                            </div>

                            <c:if test="${editable}">
                                <input id="importDocFile"
                                       name="docFiles"
                                       type="file"
                                       multiple
                                       style="display:none"
                                       onchange="handleImportDocFiles(this)">
                            </c:if>

                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                                <label style="font-size:11px;font-weight:700;color:#475569">
                                    첨부 문서 <span class="req">*</span>
                                </label>

                                <c:if test="${editable}">
                                    <div style="display:flex;gap:8px">
                                        <button type="button"
                                                class="btn btn-secondary"
                                                style="padding:9px 16px;font-size:12px;white-space:nowrap"
                                                onclick="document.getElementById('importDocFile').click()">
                                            파일 선택
                                        </button>
                                    </div>
                                </c:if>
                            </div>

                            <c:if test="${editable}">
                                <div class="upload-drop"
                                     style="margin-bottom:16px"
                                     onclick="document.getElementById('importDocFile').click()">
                                    <span class="material-symbols-outlined">upload_file</span>
                                    <p>파일을 이곳에 드래그하거나 <strong>클릭하여 선택</strong>하세요</p>
                                    <p id="importDocFileName" style="margin-top:4px;font-size:11px;color:#94a3b8">
                                        PDF · JPG · PNG · XLSX — 최대 20MB
                                    </p>
                                </div>
                            </c:if>

                            <c:if test="${not editable}">
                                <div class="upload-drop"
                                     style="margin-bottom:16px;cursor:default">
                                    <span class="material-symbols-outlined">folder</span>
                                    <p>제출된 첨부 문서를 확인할 수 있습니다.</p>
                                    <p style="margin-top:4px;font-size:11px;color:#94a3b8">
                                        현재 상태에서는 첨부문서를 추가할 수 없습니다.
                                    </p>
                                </div>
                            </c:if>

                            <table class="doc-table" id="importDocUploadTable">
                                <thead>
                                    <tr>
                                        <th style="width:18%;">문서종류</th>
                                        <th>파일명</th>
                                        <th style="width:16%;">상태</th>
                                        <th style="width:18%;text-align:right;">관리</th>
                                    </tr>
                                </thead>

                                <tbody id="importDocUploadTbody">
                                <c:choose>
                                    <c:when test="${not empty fileList}">
                                        <c:forEach var="file" items="${fileList}">
                                            <tr class="saved-file-row" data-file-no="${file.dfiFileNo}">
                                                <td>
                                                    <span class="doc-type-pill">첨부문서</span>
                                                </td>

                                                <td class="td-id">
                                                    <a href="${pageContext.request.contextPath}/file/download.do?fileNo=${file.dfiFileNo}"
                                                       class="doc-file-link">
                                                            ${file.dfiOrgNm}
                                                    </a>
                                                </td>

                                                <td>
                                                    <span class="doc-status done">기존첨부</span>
                                                </td>

                                                <td class="doc-actions">
                                                    <c:choose>
                                                        <c:when test="${file.dfiUploadSttsCd eq 'DONE'}">
                                                            <a href="/common/file/download.do?fileNo=${file.dfiFileNo}"
                                                               class="mini mini-view">
                                                                다운로드
                                                            </a>
                                                        </c:when>

                                                        <c:when test="${file.dfiUploadSttsCd eq 'UPLOADING'}">
                                                            <span class="badge badge-wait">업로드중</span>
                                                        </c:when>

                                                        <c:when test="${file.dfiUploadSttsCd eq 'FAIL'}">
                                                            <span class="badge badge-urgent">업로드실패</span>
                                                        </c:when>

                                                        <c:otherwise>
                                                            <span class="badge badge-wait">확인중</span>
                                                        </c:otherwise>
                                                    </c:choose>

                                                    <c:if test="${editable}">
                                                        <button type="button"
                                                                class="mini mini-reject"
                                                                onclick="markDeleteImportFile(this, '${file.dfiFileNo}')">
                                                            삭제
                                                        </button>
                                                    </c:if>
                                                </td>
                                            </tr>
                                        </c:forEach>
                                    </c:when>

                                    <c:otherwise>
                                        <tr class="empty-row">
                                            <td colspan="4" style="text-align:center;color:#94a3b8;padding:18px;">
                                                첨부된 문서가 없습니다.
                                            </td>
                                        </tr>
                                    </c:otherwise>
                                </c:choose>
                                </tbody>
                            </table>
                            <div id="deleteImportFileArea"></div>
                        </div>

                        <!-- ⑦ 보완요청 대응 -->
                        <c:choose>
                            <c:when test="${impDTO.irStatusCd eq 'CSTM_SUPP'}">
                                <div class="form-doc-divider"></div>

                                <div class="form-group">
                                    <div class="form-group-title">⑦ 보완요청 대응</div>

                                    <div class="alert-bar error">
                                        <span class="material-symbols-outlined">priority_high</span>
                                        관세사가 요청한 보완사항을 확인하고 대응 및 답변하세요.
                                    </div>

                                    <div class="form-grid-2">
                                        <div class="fi">
                                            <label>보완요청자</label>
                                            <input type="text"
                                                   value="${impDTO.brokerNm}"
                                                   readonly>
                                        </div>

                                        <div class="fi">
                                            <label>보완요청 상태</label>
                                            <input type="text"
                                                   value="보완요청"
                                                   readonly>
                                        </div>

                                        <div class="fi full">
                                            <label>보완요청 내용</label>
                                            <textarea readonly>${supp.srReqCn}</textarea>
                                        </div>

                                        <div class="fi full">
                                            <label>보완 답변 내용</label>
                                            <textarea name="srSubmitCn"
                                                      id="suppAnswerCn"
                                                      placeholder="보완 요청에 대한 답변 내용을 입력하세요"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </c:when>

                            <c:when test="${impDTO.irStatusCd eq 'CSTM_SUPP_SUB'}">
                                <div class="form-doc-divider"></div>
                                <div class="form-group">
                                    <div class="form-group-title">⑦ 보완요청 대응 내역</div>

                                    <div class="alert-bar success">
                                        <span class="material-symbols-outlined">priority_high</span>
                                        관세사가 요청한 보완사항을 확인하고 답변한 내역입니다.
                                    </div>

                                    <div class="form-grid-2">
                                        <div class="fi">
                                            <label>보완요청자</label>
                                            <input type="text"
                                                   value="${impDTO.brokerNm}"
                                                   readonly>
                                        </div>

                                        <div class="fi">
                                            <label>보완요청 상태</label>
                                            <input type="text"
                                                   value="보완요청"
                                                   readonly>
                                        </div>

                                        <div class="fi full">
                                            <label>보완요청 내용</label>
                                            <textarea readonly>${supp.srReqCn}</textarea>
                                        </div>

                                        <div class="fi full">
                                            <label>보완 답변 내용</label>
                                            <textarea name="srSubmitCn"
                                                      id="suppAnswerCn"
                                                      placeholder="보완 요청에 대한 답변 내용을 입력하세요" readonly>${supp.srSubmitCn}
                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                            </c:when>
                        </c:choose>

                        <!-- 도착항 검색 모달 -->
                        <c:if test="${editable}">
                            <div id="portModal" class="port-modal">
                                <div class="port-modal-box">
                                    <div class="port-modal-header">
                                        <h3>도착항 검색</h3>
                                        <button type="button"
                                                class="port-modal-close"
                                                onclick="closePortModal()">×</button>
                                    </div>

                                    <div class="port-modal-body">
                                        <div class="port-search-area">
                                            <input type="text"
                                                   id="portSearchInput"
                                                   placeholder="항구명 또는 항구코드 검색"
                                                   onkeyup="filterPortList()">
                                        </div>

                                        <table class="port-table">
                                            <thead>
                                            <tr>
                                                <th>항구코드</th>
                                                <th>국가코드</th>
                                                <th>항구명</th>
                                                <th>선택</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <c:forEach var="port" items="${portVO}">
                                                <tr class="port-row"
                                                    data-search="${port.portCd} ${port.portCountryCd} ${port.portNm}">
                                                    <td>${port.portCd}</td>
                                                    <td>${port.portCountryCd}</td>
                                                    <td>${port.portNm}</td>
                                                    <td>
                                                        <button type="button"
                                                                class="port-select-btn"
                                                                onclick="selectPort('${port.portCd}', '${port.portNm}')">
                                                            선택
                                                        </button>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </c:if>
                    </div>

                    <div class="btn-row" style="padding:20px 28px;border-top:1px solid #f1f5f9;">
                        <input type="hidden" name="submitType" id="submitType" value="">
                        <c:choose>
                            <c:when test="${impDTO.irStatusCd eq 'CSTM_SUPP'}">
                                <button type="button"
                                        id="importSuppSubmitBtn"
                                        class="btn btn-primary">
                                    보완 제출
                                </button>
                            </c:when>

                            <c:when test="${editable}">
                                <button type="button"
                                        id="importUpdateBtn"
                                        class="btn btn-primary">
                                    수정 저장
                                </button>
                            </c:when>
                        </c:choose>

                        <a class="btn btn-outline"
                           href="${pageContext.request.contextPath}/owner/import/list.do">
                            취소
                        </a>
                    </div>
                </form>
            </div>
        </main>

        <%@ include file="/WEB-INF/views/common/ownerModals.jsp" %>
        <%@ include file="/WEB-INF/views/common/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/common/ownerScripts.jsp" %>
<script src="${pageContext.request.contextPath}/resources/js/owner/import-request.js"></script>

</body>
</html>