let addressMap = null;
let addressMarker = null;
let addressGeocoder = null;

function initAddressMap() {
    if (!window.kakao || !kakao.maps || !kakao.maps.services) {
        return;
    }

    const mapContainer = document.getElementById("kakaoAddressMap");
    if (!mapContainer || addressMap) {
        return;
    }

    const defaultCenter = new kakao.maps.LatLng(36.3504119, 127.3845475);
    addressMap = new kakao.maps.Map(mapContainer, {
        center: defaultCenter,
        level: 4
    });
    addressMarker = new kakao.maps.Marker({
        position: defaultCenter
    });
    addressGeocoder = new kakao.maps.services.Geocoder();
    setTimeout(function() {
        addressMap.relayout();
    }, 0);
}

function updateAddressMap(address) {
    initAddressMap();

    if (!addressMap || !addressGeocoder) {
        document.getElementById("addressMapText").textContent = address;
        return;
    }

    addressGeocoder.addressSearch(address, function(result, status) {
        if (status !== kakao.maps.services.Status.OK || !result.length) {
            document.getElementById("addressMapText").textContent = address + " 위치를 찾을 수 없습니다.";
            document.getElementById("addressMapPlaceholder").classList.remove("hidden");
            return;
        }

        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        addressMap.relayout();
        addressMap.setCenter(coords);
        addressMap.setLevel(3);
        addressMarker.setPosition(coords);
        addressMarker.setMap(addressMap);
        document.getElementById("addressMapPlaceholder").classList.add("hidden");
        setTimeout(function() {
            addressMap.relayout();
            addressMap.setCenter(coords);
        }, 120);
    });
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button ? button.querySelector(".material-symbols-outlined") : null;

    if (input.type === "password") {
        input.type = "text";
        if (icon) {
            icon.textContent = "visibility_off";
        } else if (button) {
            button.textContent = "숨김";
        }
        if (button) {
            button.setAttribute("aria-label", "비밀번호 숨기기");
        }
    } else {
        input.type = "password";
        if (icon) {
            icon.textContent = "visibility";
        } else if (button) {
            button.textContent = "보기";
        }
        if (button) {
            button.setAttribute("aria-label", "비밀번호 보기");
        }
    }
}

function normalizeNumberInput(id) {
    const input = document.getElementById(id);
    if (input && input.value) {
        input.value = input.value.replace(/[^0-9]/g, "");
    }
}

function syncIdentNoValue() {
    const identNo = document.getElementById("owrIdentNo");
    const front = document.getElementById("owrIdentNoFront");
    const backFirst = document.getElementById("owrIdentNoBackFirst");
    const backRest = document.getElementById("owrIdentNoBackRest");

    if (!identNo || !front || !backFirst || !backRest) {
        return "";
    }

    front.value = front.value.replace(/[^0-9]/g, "").slice(0, 6);
    backFirst.value = backFirst.value.replace(/[^0-9]/g, "").slice(0, 1);
    backRest.value = backRest.value.replace(/[^0-9]/g, "").slice(0, 6);
    identNo.value = front.value + backFirst.value + backRest.value;
    return identNo.value;
}

function toggleIdentBack(button) {
    const rest = document.getElementById("owrIdentNoBackRest");
    const icon = button ? button.querySelector(".material-symbols-outlined") : null;
    if (!rest) {
        return;
    }

    if (rest.type === "password") {
        rest.type = "text";
        if (icon) icon.textContent = "visibility_off";
        if (button) button.setAttribute("aria-label", "주민등록번호 뒷자리 숨기기");
    } else {
        rest.type = "password";
        if (icon) icon.textContent = "visibility";
        if (button) button.setAttribute("aria-label", "주민등록번호 뒷자리 보기");
    }
}

function syncEmailValue() {
    const email = document.getElementById("owrEmail");
    const local = document.getElementById("emailLocal");
    const domain = document.getElementById("emailDomain");
    if (!email || !local || !domain) {
        return "";
    }

    const localValue = local.value.trim();
    const domainValue = domain.value.trim();
    email.value = localValue && domainValue ? localValue + "@" + domainValue : "";
    return email.value;
}

function handleEmailDomainSelect() {
    const select = document.getElementById("emailDomainSelect");
    const domain = document.getElementById("emailDomain");
    if (!select || !domain) {
        return;
    }

    if (select.value) {
        domain.value = select.value;
        domain.readOnly = true;
        domain.classList.add("readonly");
    } else {
        domain.value = "";
        domain.readOnly = false;
        domain.classList.remove("readonly");
        domain.focus();
    }
    syncEmailValue();
}

function getCsrfParams() {
    const csrfInput = document.querySelector('input[name^="_csrf"], input[name="${_csrf.parameterName}"]');
    if (!csrfInput) {
        return {};
    }
    return {
        name: csrfInput.name,
        value: csrfInput.value
    };
}

function buildFormBody(params) {
    const body = new URLSearchParams(params);
    const csrf = getCsrfParams();
    if (csrf.name && csrf.value) {
        body.append(csrf.name, csrf.value);
    }
    return body;
}

function setFeedback(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message || "";
    element.className = "field-feedback";
    if (type) {
        element.classList.add(type);
    }
}

function setPhoneVerified(verified, message, type) {
    document.getElementById("phoneVerifiedYn").value = verified ? "Y" : "N";
    setFeedback("phoneVerifyMessage", message, type);
    updateJoinSubmitState();
}

function updateJoinSubmitState() {
    const submitButton = document.getElementById("joinSubmitBtn");
    const privacyAgree = document.getElementById("privacyAgreeYn");
    const phoneVerified = document.getElementById("phoneVerifiedYn");
    const idChecked = document.getElementById("idCheckedYn");
    const checkedLoginId = document.getElementById("checkedLoginId");
    const owrId = document.getElementById("owrId");

    if (!submitButton || !privacyAgree || !phoneVerified || !idChecked || !checkedLoginId || !owrId) {
        return;
    }

    submitButton.disabled = !isJoinFormReady();
}

function getSelectedOwnerType() {
    const checked = document.querySelector("input[name='owrTyCd']:checked");
    return checked ? checked.value : "INDV";
}

function isJoinFormReady() {
    syncIdentNoValue();
    syncEmailValue();

    const requiredIds = [
        "owrId",
        "owrPassword",
        "passwordConfirm",
        "owrNm",
        "owrTelno",
        "authCode",
        "emailLocal",
        "emailDomain",
        "owrZip",
        "owrAdres"
    ];

    const hasRequiredValues = requiredIds.every(function(id) {
        const input = document.getElementById(id);
        return input && input.value.trim();
    });

    const owrId = document.getElementById("owrId").value.trim();
    const password = document.getElementById("owrPassword").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const ownerType = getSelectedOwnerType();
    const identNo = document.getElementById("owrIdentNo").value.replace(/[^0-9]/g, "");
    const bizrno = document.getElementById("owrBizrno").value.replace(/[^0-9]/g, "");
    const corpRegNo = document.getElementById("owrCorpRegNo").value.replace(/[^0-9]/g, "");
    const hasBusinessNumbers = (ownerType === "INDV" && /^[0-9]{13}$/.test(identNo))
        || (ownerType === "OPERATOR" && /^[0-9]{10}$/.test(bizrno))
        || (ownerType === "CORP" && /^[0-9]{10}$/.test(bizrno) && /^[0-9]{13}$/.test(corpRegNo));

    return hasRequiredValues
        && document.getElementById("privacyAgreeYn").checked
        && document.getElementById("phoneVerifiedYn").value === "Y"
        && document.getElementById("idCheckedYn").value === "Y"
        && document.getElementById("checkedLoginId").value === owrId
        && password.length > 0
        && password === passwordConfirm
        && hasBusinessNumbers;
}

function applyOwnerTypeFields() {
    const ownerType = getSelectedOwnerType();
    const identNoBox = document.getElementById("identNoBox");
    const bizNoBox = document.getElementById("bizNoBox");
    const corpRegNoBox = document.getElementById("corpRegNoBox");
    const identNo = document.getElementById("owrIdentNo");
    const bizrno = document.getElementById("owrBizrno");
    const corpRegNo = document.getElementById("owrCorpRegNo");

    if (identNoBox) identNoBox.classList.toggle("hidden", ownerType !== "INDV");
    if (bizNoBox) bizNoBox.classList.toggle("hidden", ownerType === "INDV");
    if (corpRegNoBox) corpRegNoBox.classList.toggle("hidden", ownerType !== "CORP");

    if (ownerType !== "INDV" && identNo) identNo.value = "";
    if (ownerType !== "INDV") {
        ["owrIdentNoFront", "owrIdentNoBackFirst", "owrIdentNoBackRest"].forEach(function(id) {
            const input = document.getElementById(id);
            if (input) input.value = "";
        });
    }
    if (ownerType === "INDV" && bizrno) bizrno.value = "";
    if (ownerType !== "CORP" && corpRegNo) corpRegNo.value = "";

    ["owrIdentNoFront", "owrIdentNoBackFirst", "owrIdentNoBackRest"].forEach(function(id) {
        const input = document.getElementById(id);
        if (input) input.required = ownerType === "INDV";
    });
    if (bizrno) bizrno.required = ownerType === "OPERATOR" || ownerType === "CORP";
    if (corpRegNo) corpRegNo.required = ownerType === "CORP";

    updateJoinSubmitState();
}

function setIdChecked(checked, loginId, message, type) {
    document.getElementById("idCheckedYn").value = checked ? "Y" : "N";
    document.getElementById("checkedLoginId").value = checked ? loginId : "";
    setFeedback("idCheckMessage", message, type);
    updateJoinSubmitState();
}

async function postJoinVerification(url, params) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Accept": "application/json"
        },
        body: buildFormBody(params)
    });

    const result = await response.json().catch(() => ({
        success: false,
        message: "서버 응답을 확인할 수 없습니다."
    }));

    if (!response.ok || !result.success) {
        throw new Error(result.message || "요청 처리 중 오류가 발생했습니다.");
    }

    return result;
}

async function checkOwnerId() {
    const owrId = document.getElementById("owrId").value.trim();
    if (!owrId) {
        setIdChecked(false, "", "아이디를 입력하세요.", "error");
        return;
    }

    try {
        setIdChecked(false, "", "확인 중...", "");
        const result = await postJoinVerification(window.TACS_REGISTER_ENDPOINTS.checkId, { loginId: owrId });

        if (result.available) {
            setIdChecked(true, owrId, "사용 가능", "ok");
        } else {
            setIdChecked(false, "", "이미 사용 중", "error");
        }
    } catch (error) {
        setIdChecked(false, "", "확인 실패", "error");
        alert(error.message);
    }
}

async function sendJoinAuthCode() {
    normalizeNumberInput("owrTelno");

    const phoneNo = document.getElementById("owrTelno").value;
    if (!/^01[0-9]{8,9}$/.test(phoneNo)) {
        setPhoneVerified(false, "번호 형식 오류", "error");
        return;
    }

    try {
        setPhoneVerified(false, "발송 중...", "");
        const result = await postJoinVerification(window.TACS_REGISTER_ENDPOINTS.sendCode, { phoneNo });
        setPhoneVerified(false, "인증번호 발송", "ok");
        alert(result.message);
    } catch (error) {
        setPhoneVerified(false, "발송 실패", "error");
        alert(error.message);
    }
}

async function verifyJoinAuthCode() {
    normalizeNumberInput("owrTelno");

    const phoneNo = document.getElementById("owrTelno").value;
    const authCode = document.getElementById("authCode").value.trim();
    if (!/^01[0-9]{8,9}$/.test(phoneNo)) {
        setPhoneVerified(false, "번호 형식 오류", "error");
        return;
    }
    if (!/^[0-9]{6}$/.test(authCode)) {
        setPhoneVerified(false, "인증번호 확인", "error");
        return;
    }

    try {
        setPhoneVerified(false, "확인 중...", "");
        const result = await postJoinVerification(window.TACS_REGISTER_ENDPOINTS.verifyCode, { phoneNo, authCode });
        setPhoneVerified(true, "인증 완료", "ok");
        alert(result.message);
    } catch (error) {
        setPhoneVerified(false, "인증 실패", "error");
        alert(error.message);
    }
}

function searchAddress() {
    if (!window.daum || !window.daum.Postcode) {
        alert("주소 검색 스크립트를 불러오지 못했습니다. 잠시 후 다시 시도하세요.");
        return;
    }

    new daum.Postcode({
        oncomplete: function(data) {
            let address = data.roadAddress || data.jibunAddress;
            let extraAddress = "";

            if (data.userSelectedType === "R") {
                if (data.bname && /[동|로|가]$/g.test(data.bname)) {
                    extraAddress += data.bname;
                }
                if (data.buildingName && data.apartment === "Y") {
                    extraAddress += extraAddress ? ", " + data.buildingName : data.buildingName;
                }
                if (extraAddress) {
                    address += " (" + extraAddress + ")";
                }
            }

            document.getElementById("owrZip").value = data.zonecode;
            document.getElementById("owrAdres").value = address;
            document.getElementById("addressMapText").textContent = address;
            updateAddressMap(address);
            updateJoinSubmitState();
            document.getElementById("owrDetailAdres").focus();
        }
    }).open();
}

function showTerms() {
    document.getElementById("guidePanel").classList.add("hidden");
    document.getElementById("termsPanel").classList.remove("hidden");
    document.getElementById("termsToggleBtn").textContent = "안내 보기";
}

function hideTerms() {
    document.getElementById("termsPanel").classList.add("hidden");
    document.getElementById("guidePanel").classList.remove("hidden");
    document.getElementById("termsToggleBtn").textContent = "약관 보기";
}

function toggleTerms() {
    const termsPanel = document.getElementById("termsPanel");
    if (termsPanel.classList.contains("hidden")) {
        showTerms();
    } else {
        hideTerms();
    }
}

function validatePasswordMatch(showEmptyMessage) {
    const password = document.getElementById("owrPassword").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    if (!passwordConfirm) {
        setFeedback("passwordMatchMessage", showEmptyMessage ? "확인값 입력 필요" : "", showEmptyMessage ? "error" : "");
        return false;
    }

    if (password !== passwordConfirm) {
        setFeedback("passwordMatchMessage", "불일치", "error");
        return false;
    }

    setFeedback("passwordMatchMessage", "일치", "ok");
    return true;
}

function validateOwnerBusinessNumbers() {
    syncIdentNoValue();
    normalizeNumberInput("owrIdentNo");
    normalizeNumberInput("owrBizrno");
    normalizeNumberInput("owrCorpRegNo");

    const ownerType = getSelectedOwnerType();
    const identNo = document.getElementById("owrIdentNo").value;
    const bizrno = document.getElementById("owrBizrno").value;
    const corpRegNo = document.getElementById("owrCorpRegNo").value;

    if (ownerType === "INDV" && !identNo) {
        alert("개인회원은 주민등록번호를 입력해야 합니다.");
        document.getElementById("owrIdentNo").focus();
        return false;
    }

    if (identNo && !/^[0-9]{13}$/.test(identNo)) {
        alert("주민등록번호는 숫자 13자리로 입력해주세요.");
        document.getElementById("owrIdentNo").focus();
        return false;
    }

    if (ownerType === "OPERATOR" && !bizrno) {
        alert("개인사업자는 사업자등록번호를 입력해야 합니다.");
        document.getElementById("owrBizrno").focus();
        return false;
    }

    if (ownerType === "CORP" && (!bizrno || !corpRegNo)) {
        alert("법인은 사업자등록번호와 법인등록번호를 모두 입력해야 합니다.");
        document.getElementById(!bizrno ? "owrBizrno" : "owrCorpRegNo").focus();
        return false;
    }

    if (bizrno && !/^[0-9]{10}$/.test(bizrno)) {
        alert("사업자등록번호는 숫자 10자리로 입력해주세요.");
        document.getElementById("owrBizrno").focus();
        return false;
    }

    if (corpRegNo && !/^[0-9]{13}$/.test(corpRegNo)) {
        alert("법인등록번호는 숫자 13자리로 입력해주세요.");
        document.getElementById("owrCorpRegNo").focus();
        return false;
    }

    if (!bizrno && corpRegNo) {
        alert("법인등록번호를 입력하려면 사업자등록번호도 입력해야 합니다.");
        document.getElementById("owrBizrno").focus();
        return false;
    }

    return true;
}

document.getElementById("registerForm").addEventListener("submit", function(event) {
    if (!validatePasswordMatch(true)) {
        event.preventDefault();
        document.getElementById("passwordConfirm").focus();
        return;
    }

    const owrId = document.getElementById("owrId").value.trim();
    if (document.getElementById("idCheckedYn").value !== "Y"
            || document.getElementById("checkedLoginId").value !== owrId) {
        event.preventDefault();
        setIdChecked(false, "", "중복확인 필요", "error");
        document.getElementById("owrId").focus();
        return;
    }

    if (document.getElementById("phoneVerifiedYn").value !== "Y") {
        event.preventDefault();
        setPhoneVerified(false, "인증 필요", "error");
        document.getElementById("owrTelno").focus();
        return;
    }

    if (!validateOwnerBusinessNumbers()) {
        event.preventDefault();
        return;
    }

    normalizeNumberInput("owrTelno");
    normalizeNumberInput("owrZip");
    normalizeNumberInput("owrIdentNo");
    normalizeNumberInput("owrBizrno");
    normalizeNumberInput("owrCorpRegNo");
    syncEmailValue();
});

window.addEventListener("load", function() {
    initAddressMap();
    document.getElementById("owrPassword").addEventListener("input", function() {
        validatePasswordMatch(false);
        updateJoinSubmitState();
    });
    document.getElementById("passwordConfirm").addEventListener("input", function() {
        validatePasswordMatch(false);
        updateJoinSubmitState();
    });
    document.getElementById("owrTelno").addEventListener("input", function() {
        setPhoneVerified(false, "", "");
        normalizeNumberInput("owrTelno");
    });
    document.getElementById("authCode").addEventListener("input", function() {
        normalizeNumberInput("authCode");
        if (document.getElementById("phoneVerifiedYn").value === "Y") {
            setPhoneVerified(false, "", "");
        }
        updateJoinSubmitState();
    });
    document.getElementById("privacyAgreeYn").addEventListener("change", updateJoinSubmitState);
    document.getElementById("owrId").addEventListener("input", function() {
        setIdChecked(false, "", "", "");
        updateJoinSubmitState();
    });
    document.getElementById("owrNm").addEventListener("input", updateJoinSubmitState);
    document.getElementById("owrZip").addEventListener("input", updateJoinSubmitState);
    document.getElementById("owrAdres").addEventListener("input", updateJoinSubmitState);
    document.getElementById("owrBizrno").addEventListener("input", function() {
        normalizeNumberInput("owrBizrno");
        updateJoinSubmitState();
    });
    ["owrIdentNoFront", "owrIdentNoBackFirst", "owrIdentNoBackRest"].forEach(function(id) {
        const input = document.getElementById(id);
        if (!input) {
            return;
        }
        input.addEventListener("input", function() {
            syncIdentNoValue();
            if (id === "owrIdentNoFront" && input.value.length === 6) {
                document.getElementById("owrIdentNoBackFirst").focus();
            }
            if (id === "owrIdentNoBackFirst" && input.value.length === 1) {
                document.getElementById("owrIdentNoBackRest").focus();
            }
            updateJoinSubmitState();
        });
    });
    document.getElementById("owrCorpRegNo").addEventListener("input", function() {
        normalizeNumberInput("owrCorpRegNo");
        updateJoinSubmitState();
    });
    document.querySelectorAll("input[name='owrTyCd']").forEach(function(input) {
        input.addEventListener("change", applyOwnerTypeFields);
    });

    const emailLocal = document.getElementById("emailLocal");
    const emailDomain = document.getElementById("emailDomain");
    const emailDomainSelect = document.getElementById("emailDomainSelect");
    if (emailLocal) {
        emailLocal.addEventListener("input", function() {
            syncEmailValue();
            updateJoinSubmitState();
        });
    }
    if (emailDomain) {
        emailDomain.addEventListener("input", function() {
            syncEmailValue();
            updateJoinSubmitState();
        });
    }
    if (emailDomainSelect) {
        emailDomainSelect.addEventListener("change", function() {
            handleEmailDomainSelect();
            updateJoinSubmitState();
        });
    }
    applyOwnerTypeFields();
    updateJoinSubmitState();
});
