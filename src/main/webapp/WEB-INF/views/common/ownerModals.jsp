<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="modal-overlay" id="forwarderModal" onclick="closeForwarderModal(event)">
    <div class="modal-box" id="forwarderModalBox">
        <div class="modal-head">
            <div>
                <div class="modal-title">운송업체 선택</div>
                <div class="modal-subtitle">목적지·운송 유형에 맞는 운송업체를 선택하세요</div>
            </div>
            <button class="modal-close-btn" onclick="closeForwarderModal()"><span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="modal-search-wrap">
            <span class="material-symbols-outlined">search</span>
            <input id="fwdSearch" oninput="filterForwarders()" placeholder="운송업체·담당자 검색"/>
        </div>
        <div class="modal-tabs">
            <button class="modal-tab active" onclick="setFwdTab('')">전체</button>
            <button class="modal-tab" onclick="setFwdTab('해상')">해상</button>
        </div>
        <div class="broker-list" id="forwarderList"></div>
        <div class="modal-foot">
            <button class="btn btn-outline" onclick="closeForwarderModal()">취소</button>
            <button class="btn btn-primary" onclick="confirmForwarder()">선택 완료</button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="brokerModal" onclick="if(event.target === this) closeBrokerModal()">
    <div class="modal-box" style="max-width:620px;">
        <div class="modal-head">
            <div>
                <div class="modal-title">담당 관세사 선택</div>
                <div class="modal-subtitle">수출신고의뢰를 담당할 관세사를 선택하세요</div>
            </div>
            <button type="button" class="modal-close-btn" onclick="closeBrokerModal()">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <div class="modal-search-wrap">
            <span class="material-symbols-outlined">search</span>
            <input type="text"
                   id="brokerSearchInput"
                   placeholder="관세사명 · 사무소명 · 전문분야 검색"
                   oninput="filterBrokerModalList()">
        </div>

        <div class="broker-list" id="brokerList" style="max-height:360px;overflow-y:auto;">
            <c:choose>
                <c:when test="${empty brokerList}">
                    <div style="padding:32px;text-align:center;color:#94a3b8;font-size:13px;">
                        선택 가능한 관세사가 없습니다.
                    </div>
                </c:when>

                <c:otherwise>
                    <c:forEach var="broker" items="${brokerList}">
                        <label class="broker-card broker-pick-row"
                               data-search="${broker.brokerNm} ${broker.brokerOfficeNm} ${broker.brokerSpcltyCd}">
                            <input type="radio"
                                   name="brokerPick"
                                   value="${broker.brokerId}"
                                   data-name="${broker.brokerNm}"
                                   data-office="${broker.brokerOfficeNm}">

                            <div class="broker-card-body">
                                <div class="broker-card-top">
                                    <div>
                                        <div class="broker-name">
                                                ${broker.brokerNm}
                                            <span class="broker-id">(${broker.brokerId})</span>
                                        </div>
                                        <div class="broker-office">${broker.brokerOfficeNm}</div>
                                    </div>

                                    <span class="broker-badge">
                                            ${broker.brokerSpcltyCd}
                                    </span>
                                </div>

                                <div class="broker-meta">
                                    <span>등록번호: ${broker.brokerRegNo}</span>
                                    <span>연락처: ${broker.brokerTelno}</span>
                                    <span>이메일: ${broker.brokerEmail}</span>
                                </div>
                            </div>
                        </label>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
        </div>

        <div class="modal-foot">
            <button type="button" class="btn btn-outline" onclick="closeBrokerModal()">취소</button>
            <button type="button" class="btn btn-primary" onclick="confirmBroker()">선택 완료</button>
        </div>
    </div>
</div>

<div id="docs-ctx-menu">
    <div class="docs-ctx-item" onclick="docsCtxPreview()"><span class="material-symbols-outlined"
                                                                style="font-size:16px">visibility</span>미리보기
    </div>
    <div class="docs-ctx-item" onclick="docsCtxDownload()"><span class="material-symbols-outlined"
                                                                 style="font-size:16px">download</span>다운로드
    </div>
    <div class="docs-ctx-item" onclick="docsCtxRename()"><span class="material-symbols-outlined" style="font-size:16px">edit</span>이름
        변경
    </div>
    <div class="docs-ctx-item" onclick="docsCtxMove()"><span class="material-symbols-outlined" style="font-size:16px">drive_file_move</span>이동
    </div>
    <div class="docs-ctx-sep"></div>
    <div class="docs-ctx-item danger" onclick="docsCtxDelete()"><span class="material-symbols-outlined"
                                                                      style="font-size:16px">delete</span>삭제
    </div>
</div>

<div class="modal-overlay" id="noticeModal" onclick="closeNoticeModal(event)">
    <div class="modal-box" style="max-width:540px">
        <div class="modal-head">
            <div>
                <div class="modal-title" id="noticeModalTitle"></div>
                <div class="modal-subtitle" id="noticeModalDate"></div>
            </div>
            <button class="modal-close-btn" onclick="document.getElementById('noticeModal').classList.remove('open')">
                <span class="material-symbols-outlined">close</span></button>
        </div>
        <div id="noticeModalBody" style="padding:24px;font-size:13px;color:#334155;line-height:1.8"></div>
        <div style="padding:14px 24px;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end">
            <button class="btn btn-outline" onclick="document.getElementById('noticeModal').classList.remove('open')">
                닫기
            </button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="supportModal" onclick="closeSupportModal(event)">
    <div class="modal-box" style="max-width:520px">
        <div class="modal-head">
            <div>
                <div class="modal-title" id="supportModalTitle"></div>
                <div class="modal-subtitle" id="supportModalMeta"></div>
            </div>
            <button class="modal-close-btn" onclick="document.getElementById('supportModal').classList.remove('open')">
                <span class="material-symbols-outlined">close</span></button>
        </div>
        <div style="padding:20px 24px">
            <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">
                답변 내용
            </div>
            <div id="supportModalAnswer"
                 style="background:#f8fafc;border:1px solid #e2e8f0;padding:14px 16px;font-size:13px;color:#334155;line-height:1.8"></div>
        </div>
        <div style="padding:14px 24px;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end">
            <button class="btn btn-outline" onclick="document.getElementById('supportModal').classList.remove('open')">
                닫기
            </button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="fwdSelectModal" onclick="if(event.target===this) this.classList.remove('open')">
    <div class="modal-box">
        <div class="modal-head">
            <div>
                <div class="modal-title">계약 운송사 선택</div>
                <div class="modal-subtitle">현재 계약이 체결된 운송업체 목록입니다.</div>
            </div>
            <button class="modal-close-btn"
                    onclick="document.getElementById('fwdSelectModal').classList.remove('open')">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="modal-search-wrap">
            <span class="material-symbols-outlined">search</span>
            <input id="fwdSelectSearchInput" oninput="renderContractedFwdList()" placeholder="업체명 또는 담당자 검색"
                   type="text"/>
        </div>
        <div class="broker-list" id="fwdSelectList" style="min-height:300px"></div>
        <div class="modal-footer">
            <button class="btn btn-outline"
                    onclick="document.getElementById('fwdSelectModal').classList.remove('open')">취소
            </button>
            <button class="btn btn-primary" disabled="" id="fwdSelectConfirmBtn" onclick="confirmFwdForDoc()">선택 완료
            </button>
        </div>
    </div>
</div>
