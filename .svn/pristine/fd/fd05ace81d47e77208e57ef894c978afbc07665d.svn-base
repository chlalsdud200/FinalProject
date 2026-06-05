<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
    <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=0700f58516db42a305d088fbd91cf300&libraries=services"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        body: ["Inter", "Noto Sans KR", "sans-serif"]
                    }
                }
            }
        };
    </script>

    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/register.css">
</head>

<body>
<div class="page-bg">
    <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKBvKzKT0PUR1x_m_5h2iKWSna3tsFo2OJ7ONMZJTT-JzqjeH_BhyBGiJa7mejJhqMCwn3GBOVCfntODxI6N_fG4AMLUS_qlP0bO046fKgLa8wOunoGZM6PPdSn6D6C3Z7BhVREd99Y3WgFKQMHGodUv_AFykEOBmoWOXVs9U5LuQ0EZAFaS5lwM8zqhVmFcqxDrJ6tA6BkMa-5dsXfBLWV6lm9bj413gSqp3hDKfe9QBS1Gl4Hn34VhzTuxaQpJ9sdttPpTVsS4E"
            alt="TACS background" />
</div>

<div class="page-wrap">
    <div class="page-shell">
        <section class="left-pane">
            <div>
                <div class="logo-wrap">
                    <div class="logo-box">
                        <span class="material-symbols-outlined text-2xl text-[#0b2348]">shield</span>
                    </div>
                    <div>
                        <div class="text-2xl font-black tracking-tight">TACS</div>
                        <div class="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#c9dbff]">
                            Sentinel Systems
                        </div>
                    </div>
                </div>

                <div class="left-badge">
                    <span class="material-symbols-outlined text-sm">person_add</span>
                    <span>Owner Registration</span>
                </div>

                <h1 class="left-title">화주 회원가입</h1>
                <p class="left-desc">
                    통관 신고 진행, 보완 요청, 알림 수신을 위한 화주 계정을 생성합니다.
                </p>
            </div>

            <div id="guidePanel" class="left-panel">
                <h3>가입 안내</h3>
                <ul>
                    <li><strong>01</strong><span>아이디 중복확인과 휴대폰 인증을 완료해야 가입할 수 있습니다.</span></li>
                    <li><strong>02</strong><span>사업자등록번호 입력 여부에 따라 개인, 개인사업자, 법인 유형이 자동 산정됩니다.</span></li>
                    <li><strong>03</strong><span>주소 검색 후 상세주소를 입력하면 업무 연락과 문서 발송에 사용됩니다.</span></li>
                </ul>
            </div>

            <div id="termsPanel" class="left-panel terms-panel hidden">
                <h3>Privacy Terms</h3>

                <div class="terms-block">
                    <h4>개인정보 처리 목적</h4>
                    <p>회원가입 의사 확인, 본인 식별 및 인증, 회원자격 유지 및 관리, 서비스 부정이용 방지, 공지 및 민원 처리를 위해 개인정보를 이용합니다.</p>
                </div>

                <div class="terms-block">
                    <h4>수집 항목</h4>
                    <p>아이디, 비밀번호, 이름 또는 상호/법인명, 이메일, 휴대전화번호, 주소, 사업자등록번호 또는 법인등록번호 등 회원 관리와 통관 업무에 필요한 정보를 수집합니다.</p>
                </div>

                <div class="terms-block">
                    <h4>보유 및 이용기간</h4>
                    <p>회원 정보는 원칙적으로 회원 탈퇴 시까지 보유하며, 관련 법령상 보관이 필요한 경우 해당 기간 동안 보관합니다.</p>
                </div>

                <div class="terms-block">
                    <h4>파기 절차 및 방법</h4>
                    <p>처리 목적 달성 또는 보유기간 경과 시 지체 없이 파기하며, 전자 파일은 복구할 수 없는 방식으로 삭제합니다.</p>
                </div>

                <button type="button" class="terms-close-btn" onclick="hideTerms()">안내로 돌아가기</button>
            </div>
        </section>

        <section class="right-pane">
            <div class="right-head">
                <div>
                    <h2>회원가입</h2>
                    <p>화주 정보를 입력하고 계정을 생성하세요.</p>
                </div>

                <a href="${pageContext.request.contextPath}/login.do" class="back-link">
                    <span class="material-symbols-outlined text-base">login</span>
                    로그인으로 돌아가기
                </a>
            </div>

            <c:if test="${not empty errorMessage}">
                <p class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">${errorMessage}</p>
            </c:if>

            <form id="registerForm"
                  action="${pageContext.request.contextPath}/joinProc.do"
                  method="post"
                  class="compact-form">

                <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
                <input type="hidden" id="phoneVerifiedYn" value="N" />
                <input type="hidden" id="idCheckedYn" value="N" />
                <input type="hidden" id="checkedLoginId" value="" />

                <section class="form-section">
                    <div class="section-head">
                        <div class="section-head-icon">
                            <span class="material-symbols-outlined">manage_accounts</span>
                        </div>
                        <div>
                            <div class="section-head-title">계정 정보</div>
                        </div>
                    </div>

                    <div class="grid-12 account-grid">
                        <div class="span-4 account-id-field">
                            <label class="field-label">
                                아이디 <span class="required">*</span>
                                <span id="idCheckMessage" class="field-feedback"></span>
                            </label>
                            <div class="field-row">
                                <div class="icon-box"><span class="material-symbols-outlined">person</span></div>
                                <input id="owrId" name="owrId" class="input-box" placeholder="아이디 입력" maxlength="30" required />
                                <button type="button" class="side-btn btn-dark" onclick="checkOwnerId()">중복확인</button>
                            </div>
                        </div>

                        <div class="span-4 account-pw-field">
                            <label class="field-label">비밀번호 <span class="required">*</span></label>
                            <div class="field-row">
                                <div class="icon-box"><span class="material-symbols-outlined">lock</span></div>
                                <div class="input-box password-input-wrap">
                                    <input id="owrPassword" name="owrPassword" class="password-input" type="password" placeholder="8자 이상 입력" maxlength="255" required />
                                    <button type="button" class="password-toggle" onclick="togglePassword('owrPassword', this)" aria-label="비밀번호 보기">
                                        <span class="material-symbols-outlined">visibility</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="span-4 account-pw-confirm-field">
                            <label class="field-label">
                                비밀번호 확인 <span class="required">*</span>
                                <span id="passwordMatchMessage" class="field-feedback"></span>
                            </label>
                            <div class="field-row">
                                <div class="icon-box"><span class="material-symbols-outlined">lock_reset</span></div>
                                <div class="input-box password-input-wrap">
                                    <input id="passwordConfirm" class="password-input" type="password" placeholder="비밀번호 재입력" required />
                                    <button type="button" class="password-toggle" onclick="togglePassword('passwordConfirm', this)" aria-label="비밀번호 확인 보기">
                                        <span class="material-symbols-outlined">visibility</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="form-section">
                    <div class="section-head">
                        <div class="section-head-icon">
                            <span class="material-symbols-outlined">assignment_ind</span>
                        </div>
                        <div>
                            <div class="section-head-title">화주 기본 정보</div>
                        </div>
                        <div class="owner-type-field">
                            <label class="field-label">회원구분 <span class="required">*</span></label>
                            <div class="owner-type-row">
                                <label class="owner-type-option">
                                    <input type="radio" name="owrTyCd" value="INDV" checked>
                                    <span>개인</span>
                                </label>
                                <label class="owner-type-option">
                                    <input type="radio" name="owrTyCd" value="OPERATOR">
                                    <span>개인사업자</span>
                                </label>
                                <label class="owner-type-option">
                                    <input type="radio" name="owrTyCd" value="CORP">
                                    <span>법인</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="grid-12 owner-basic-grid">
                        <div class="span-3">
                            <label id="owrNmLabel" class="field-label">이름 또는 상호명 <span class="required">*</span></label>
                            <div class="field-row">
                                <div class="icon-box"><span id="owrNmIcon" class="material-symbols-outlined">person</span></div>
                                <input id="owrNm" name="owrNm" class="input-box" placeholder="이름 또는 상호명 입력" maxlength="300" required />
                            </div>
                        </div>

                        <div id="identNoBox" class="span-3">
                            <label class="field-label">주민등록번호</label>
                            <div class="field-row ident-no-row">
                                <div class="icon-box"><span class="material-symbols-outlined">badge</span></div>
                                <input id="owrIdentNo" name="owrIdentNo" type="hidden" />
                                <input id="owrIdentNoFront" class="input-box ident-front-input" placeholder="앞 6자리" maxlength="6" inputmode="numeric" />
                                <span class="ident-hyphen">-</span>
                                <div class="input-box ident-back-wrap">
                                    <input id="owrIdentNoBackFirst" class="ident-back-first" maxlength="1" inputmode="numeric" />
                                    <input id="owrIdentNoBackRest" class="ident-back-rest" type="password" maxlength="6" inputmode="numeric" />
                                    <button type="button" class="password-toggle ident-toggle" onclick="toggleIdentBack(this)" aria-label="주민등록번호 뒷자리 보기">
                                        <span class="material-symbols-outlined">visibility</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div id="bizNoBox" class="span-3">
                            <label class="field-label">사업자등록번호</label>
                            <div class="field-row">
                                <div class="icon-box"><span class="material-symbols-outlined">badge</span></div>
                                <input id="owrBizrno" name="owrBizrno" class="input-box" placeholder="10자리 숫자" maxlength="12" inputmode="numeric" />
                            </div>
                        </div>

                        <div id="corpRegNoBox" class="span-3">
                            <label class="field-label">법인등록번호</label>
                            <div class="field-row">
                                <div class="icon-box"><span class="material-symbols-outlined">corporate_fare</span></div>
                                <input id="owrCorpRegNo" name="owrCorpRegNo" class="input-box" placeholder="13자리 숫자" maxlength="14" inputmode="numeric" />
                            </div>
                        </div>
                    </div>
                </section>

                <section class="form-section">
                    <div class="section-head">
                        <div class="section-head-icon">
                            <span class="material-symbols-outlined">contact_phone</span>
                        </div>
                        <div>
                            <div class="section-head-title">연락처 및 주소</div>
                        </div>
                    </div>

                    <div class="grid-12 contact-grid">
                        <div class="span-3 contact-phone-field">
                            <label class="field-label">
                                휴대전화 <span class="required">*</span>
                                <span id="phoneVerifyMessage" class="field-feedback"></span>
                            </label>
                            <div class="field-row">
                                <div class="icon-box"><span class="material-symbols-outlined">smartphone</span></div>
                                <input id="owrTelno" name="owrTelno" class="input-box" placeholder="01012345678" maxlength="13" required />
                                <button type="button" class="side-btn btn-dark" onclick="sendJoinAuthCode()">인증전송</button>
                            </div>
                        </div>

                        <div class="span-4 contact-auth-field">
                            <label class="field-label">인증번호</label>
                            <div class="field-row">
                                <div class="icon-box"><span class="material-symbols-outlined">sms</span></div>
                                <input id="authCode" name="authCode" class="input-box" placeholder="6자리 입력" maxlength="6" required />
                                <button type="button" class="side-btn btn-light" onclick="verifyJoinAuthCode()">확인</button>
                            </div>
                        </div>

                        <div class="span-12 email-field">
                            <label class="field-label">이메일 <span class="required">*</span></label>
                            <input id="owrEmail" name="owrEmail" type="hidden" />
                            <div class="email-row">
                                <div class="icon-box"><span class="material-symbols-outlined">alternate_email</span></div>
                                <input id="emailLocal" class="input-box email-local" placeholder="이메일 아이디" maxlength="64" required />
                                <span class="email-at">@</span>
                                <input id="emailDomain" class="input-box email-domain" placeholder="도메인 입력" maxlength="100" required />
                                <select id="emailDomainSelect" class="input-box email-select">
                                    <option value="">직접입력</option>
                                    <option value="naver.com">네이버</option>
                                    <option value="kakao.com">카카오</option>
                                    <option value="gmail.com">구글</option>
                                    <option value="nate.com">네이트</option>
                                    <option value="daum.net">다음</option>
                                    <option value="hanmail.net">한메일</option>
                                    <option value="outlook.com">아웃룩</option>
                                </select>
                            </div>
                        </div>

                        <div class="span-5 address-fields">
                            <div>
                                <label class="field-label">우편번호 <span class="required">*</span></label>
                                <div class="field-row">
                                    <div class="icon-box"><span class="material-symbols-outlined">markunread_mailbox</span></div>
                                    <input id="owrZip" name="owrZip" class="input-box" placeholder="34366" maxlength="5" required />
                                    <button type="button" class="side-btn btn-dark" onclick="searchAddress()">검색</button>
                                </div>
                            </div>

                            <div>
                                <label class="field-label">기본주소 <span class="required">*</span></label>
                                <div class="field-row">
                                    <div class="icon-box"><span class="material-symbols-outlined">home_pin</span></div>
                                    <input id="owrAdres" name="owrAdres" class="input-box" placeholder="기본주소 입력" maxlength="200" required />
                                </div>
                            </div>

                            <div>
                                <label class="field-label">상세주소</label>
                                <div class="field-row">
                                    <div class="icon-box"><span class="material-symbols-outlined">edit_location</span></div>
                                    <input id="owrDetailAdres" name="owrDetailAdres" class="input-box" placeholder="상세주소 입력" maxlength="200" />
                                </div>
                            </div>
                        </div>

                        <div class="span-7 contact-map-field">
                            <div id="addressMapPreview" class="address-map">
                                <div id="kakaoAddressMap"></div>
                                <div id="addressMapPlaceholder" class="address-map-placeholder">
                                    <div class="address-map-title">
                                        <span class="material-symbols-outlined">map</span>
                                        지도 영역
                                    </div>
                                    <div id="addressMapText" class="address-map-text">
                                        주소 검색에서 선택한 위치가 지도에 표시됩니다.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="form-section agreement-section">
                    <div class="agreement-row">
                        <div class="agree-left">
                            <input id="privacyAgreeYn" name="owrPrivacyAgreeYn" value="Y" type="checkbox" required />
                            <label for="privacyAgreeYn">
                                개인정보 수집 및 이용, 통관 업무 처리를 위한 정보 사용에 동의합니다.
                                <span class="required">(필수)</span>
                            </label>
                        </div>
                    </div>
                    <button type="button" id="termsToggleBtn" class="terms-view-btn" onclick="toggleTerms()">약관 상세보기</button>
                </section>

                <div class="submit-row">
                    <a href="${pageContext.request.contextPath}/login.do" class="submit-btn submit-secondary">취소</a>
                    <button type="submit" id="joinSubmitBtn" class="submit-btn submit-primary" disabled>
                        <span class="material-symbols-outlined text-base">person_add</span>
                        회원가입 완료
                    </button>
                </div>
            </form>
        </section>
    </div>
</div>

<script>
    window.TACS_REGISTER_ENDPOINTS = {
        checkId: "${pageContext.request.contextPath}/checkId.do",
        sendCode: "${pageContext.request.contextPath}/join/send-code.do",
        verifyCode: "${pageContext.request.contextPath}/join/verify-code.do"
    };
</script>
<script charset="UTF-8" src="${pageContext.request.contextPath}/resources/js/common/register.js"></script>
</body>
</html>
