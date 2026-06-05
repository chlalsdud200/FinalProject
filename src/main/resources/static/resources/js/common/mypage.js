(function () {
  'use strict';

  function normalizeTab(tab) {
    if (tab === 'alarm' || tab === 'notify') {
      return 'alarm';
    }
    return 'profile';
  }

  function getContextPath() {
    var meta = document.querySelector('meta[name="ctx-path"]');
    if (meta) {
      return meta.getAttribute('content') || '';
    }
    return window.contextPath || '';
  }

  function setMessage(messageEl, text, type) {
    if (!messageEl) {
      return;
    }

    messageEl.textContent = text || '';
    messageEl.classList.remove('is-warning', 'is-error', 'is-success');

    if (type) {
      messageEl.classList.add('is-' + type);
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function maskPhoneNo(value) {
    var digits = String(value == null ? '' : value).replace(/[^0-9]/g, '');
    if (digits.length === 11) {
      return digits.substring(0, 3) + '****' + digits.substring(7);
    }
    if (digits.length === 10) {
      return digits.substring(0, 3) + '***' + digits.substring(6);
    }
    return digits ? digits.substring(0, 3) + '****' : '-';
  }

  function formatPhoneNo(value) {
    var digits = normalizeDigits(value);
    if (digits.length === 11) {
      return digits.substring(0, 3) + '-' + digits.substring(3, 7) + '-' + digits.substring(7);
    }
    if (digits.length === 10) {
      return digits.substring(0, 3) + '-' + digits.substring(3, 6) + '-' + digits.substring(6);
    }
    return value == null ? '' : String(value);
  }

  var ownerAddressMap = null;
  var ownerAddressMarker = null;
  var ownerAddressGeocoder = null;
  var actorAddressMap = null;
  var actorAddressMarker = null;
  var actorAddressGeocoder = null;

  function normalizeDigits(value) {
    return String(value == null ? '' : value).replace(/[^0-9]/g, '');
  }

  function getPasswordLengthUnits(value) {
    return Array.from(String(value == null ? '' : value)).reduce(function (sum, char) {
      return sum + (char.charCodeAt(0) > 127 ? 2 : 1);
    }, 0);
  }

  function trimPasswordLength(value) {
    var result = '';
    var length = 0;
    Array.from(String(value == null ? '' : value)).some(function (char) {
      var nextLength = length + (char.charCodeAt(0) > 127 ? 2 : 1);
      if (nextLength > 16) {
        return true;
      }
      result += char;
      length = nextLength;
      return false;
    });
    return result;
  }

  function setOwnerPasswordFeedback(form, text, type) {
    var feedback = form ? form.querySelector('[data-owner-password-feedback]') : null;
    if (!feedback) {
      return;
    }
    feedback.textContent = text || '';
    feedback.classList.remove('ok', 'error');
    if (type) {
      feedback.classList.add(type);
    }
  }

  function getOwnerPasswordInput(form, selector) {
    return form ? form.querySelector(selector) : null;
  }

  function isOwnerProfileForm(form) {
    return !!(form && form.classList && form.classList.contains('tacs-owner-profile-form'));
  }

  function isOwnerProfilePasswordFilled(form) {
    var newPassword = getOwnerPasswordInput(form, '[data-owner-new-password]');
    var newPasswordConfirm = getOwnerPasswordInput(form, '[data-owner-new-password-confirm]');
    return !!((newPassword && newPassword.value) || (newPasswordConfirm && newPasswordConfirm.value));
  }

  function validateOwnerPasswordInputs(form, showFeedback) {
    var newPassword = getOwnerPasswordInput(form, '[data-owner-new-password]');
    var newPasswordConfirm = getOwnerPasswordInput(form, '[data-owner-new-password-confirm]');
    var passwordValue = newPassword ? newPassword.value : '';
    var confirmValue = newPasswordConfirm ? newPasswordConfirm.value : '';

    if (!passwordValue && !confirmValue) {
      setOwnerPasswordFeedback(form, '', '');
      return null;
    }
    if (!passwordValue || !confirmValue) {
      if (showFeedback) setOwnerPasswordFeedback(form, '확인 필요', 'error');
      return '비밀번호를 변경하려면 비밀번호와 비밀번호 확인을 모두 입력해 주세요.';
    }
    if (passwordValue !== confirmValue) {
      if (showFeedback) setOwnerPasswordFeedback(form, '불일치', 'error');
      return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    }
    if (passwordValue.indexOf(' ') >= 0) {
      if (showFeedback) setOwnerPasswordFeedback(form, '공백 불가', 'error');
      return '비밀번호에는 공백을 사용할 수 없습니다.';
    }
    if (passwordValue.length < 8) {
      if (showFeedback) setOwnerPasswordFeedback(form, '8자 이상', 'error');
      return '비밀번호는 8자 이상이어야 합니다.';
    }

    if (getPasswordLengthUnits(passwordValue) > 16) {
      if (showFeedback) setOwnerPasswordFeedback(form, '16자 이내', 'error');
      return '비밀번호는 영문 기준 16자, 한글 기준 8자 이내로 입력해 주세요.';
    }

    var typeCount = 0;
    if (/[A-Za-z]/.test(passwordValue)) typeCount++;
    if (/[0-9]/.test(passwordValue)) typeCount++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) typeCount++;
    if (typeCount < 2) {
      if (showFeedback) setOwnerPasswordFeedback(form, '조합 확인', 'error');
      return '비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 조합해야 합니다.';
    }

    setOwnerPasswordFeedback(form, '일치', 'ok');
    return null;
  }

  function splitOwnerEmail(root, email) {
    var form = root ? root.querySelector('.tacs-owner-profile-form') : null;
    var localInput = form ? form.querySelector('[data-owner-email-local]') : null;
    var domainInput = form ? form.querySelector('[data-owner-email-domain]') : null;
    var select = form ? form.querySelector('[data-owner-email-domain-select]') : null;
    var value = String(email == null ? '' : email).trim();
    var atIndex = value.indexOf('@');
    var localValue = atIndex >= 0 ? value.substring(0, atIndex) : '';
    var domainValue = atIndex >= 0 ? value.substring(atIndex + 1) : '';

    if (localInput) {
      localInput.value = localValue;
    }
    if (domainInput) {
      domainInput.value = domainValue;
      domainInput.readOnly = false;
      domainInput.classList.remove('readonly');
    }
    if (select) {
      var matched = Array.prototype.some.call(select.options, function (option) {
        return option.value && option.value === domainValue;
      });
      select.value = matched ? domainValue : '';
      if (matched && domainInput) {
        domainInput.readOnly = true;
        domainInput.classList.add('readonly');
      }
    }
  }

  function syncOwnerEmail(form) {
    var emailInput = form ? form.querySelector('[data-owner-profile-input="email"]') : null;
    var localInput = form ? form.querySelector('[data-owner-email-local]') : null;
    var domainInput = form ? form.querySelector('[data-owner-email-domain]') : null;
    var localValue = localInput ? localInput.value.trim() : '';
    var domainValue = domainInput ? domainInput.value.trim() : '';
    var email = localValue && domainValue ? localValue + '@' + domainValue : '';
    if (emailInput) {
      emailInput.value = email;
    }
    return email;
  }

  function handleOwnerEmailDomainSelect(form) {
    var select = form ? form.querySelector('[data-owner-email-domain-select]') : null;
    var domainInput = form ? form.querySelector('[data-owner-email-domain]') : null;
    if (!select || !domainInput) {
      return;
    }
    if (select.value) {
      domainInput.value = select.value;
      domainInput.readOnly = true;
      domainInput.classList.add('readonly');
    } else {
      domainInput.value = '';
      domainInput.readOnly = false;
      domainInput.classList.remove('readonly');
      domainInput.focus();
    }
    syncOwnerEmail(form);
  }

  function initOwnerAddressMap(root) {
    var mapContainer = root ? root.querySelector('[data-owner-address-map]') : null;
    if (!mapContainer || ownerAddressMap || !window.kakao || !kakao.maps || !kakao.maps.services) {
      return;
    }

    var defaultCenter = new kakao.maps.LatLng(36.3504119, 127.3845475);
    ownerAddressMap = new kakao.maps.Map(mapContainer, {
      center: defaultCenter,
      level: 4
    });
    ownerAddressMarker = new kakao.maps.Marker({
      position: defaultCenter
    });
    ownerAddressGeocoder = new kakao.maps.services.Geocoder();
    setTimeout(function () {
      ownerAddressMap.relayout();
    }, 0);
  }

  function updateOwnerAddressMap(root, address) {
    var placeholder = root ? root.querySelector('[data-owner-address-map-placeholder]') : null;
    var text = root ? root.querySelector('[data-owner-address-map-text]') : null;
    var displayAddress = String(address == null ? '' : address).trim();

    if (!displayAddress) {
      if (text) text.textContent = '주소 검색 후 위치가 지도에 표시됩니다.';
      if (placeholder) placeholder.classList.remove('hidden');
      return;
    }

    if (text) {
      text.textContent = displayAddress;
    }

    initOwnerAddressMap(root);
    if (!ownerAddressMap || !ownerAddressGeocoder) {
      if (placeholder) placeholder.classList.remove('hidden');
      return;
    }

    ownerAddressGeocoder.addressSearch(displayAddress, function (result, status) {
      if (status !== kakao.maps.services.Status.OK || !result.length) {
        if (text) text.textContent = displayAddress + ' 위치를 찾을 수 없습니다.';
        if (placeholder) placeholder.classList.remove('hidden');
        return;
      }

      var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      ownerAddressMap.relayout();
      ownerAddressMap.setCenter(coords);
      ownerAddressMap.setLevel(3);
      ownerAddressMarker.setPosition(coords);
      ownerAddressMarker.setMap(ownerAddressMap);
      if (placeholder) placeholder.classList.add('hidden');
      setTimeout(function () {
        ownerAddressMap.relayout();
        ownerAddressMap.setCenter(coords);
      }, 120);
    });
  }

  function getOwnerProfileForm(root) {
    return root ? root.querySelector('.tacs-owner-profile-form') : null;
  }

  function getOwnerSmsMessage(root) {
    return root ? root.querySelector('[data-owner-sms-message]') : null;
  }

  function setOwnerSmsMessage(root, text, type) {
    setMessage(getOwnerSmsMessage(root), text, type);
  }

  function createOwnerProfileSnapshot(form) {
    if (!form) {
      return '';
    }

    syncOwnerEmail(form);
    return [
      'name',
      'bizrno',
      'corpRegNo',
      'cstmIdfNo',
      'email',
      'telno',
      'zip',
      'adres',
      'detailAdres',
      'newPassword',
      'newPasswordConfirm'
    ].map(function (name) {
      var input = form.querySelector('[name="' + name + '"]');
      return name + '=' + encodeURIComponent(input ? input.value || '' : '');
    }).join('&');
  }

  function hasOwnerProfileChanges(root) {
    var form = getOwnerProfileForm(root);
    if (!form) {
      return false;
    }
    return (form.dataset.ownerInitialSnapshot || '') !== createOwnerProfileSnapshot(form);
  }

  function setOwnerSaveDisabledReason(saveButton, reason) {
    if (!saveButton) {
      return;
    }

    var wrap = saveButton.closest('[data-mypage-profile-save-wrap]');
    if (wrap) {
      wrap.setAttribute('data-disabled-reason', reason || '');
      wrap.setAttribute('title', reason || '');
    }
    saveButton.setAttribute('title', reason || '');
  }

  function refreshOwnerSmsControls(root) {
    var form = getOwnerProfileForm(root);
    if (!form) {
      return;
    }

    var changed = hasOwnerProfileChanges(root);
    var passwordFilled = isOwnerProfilePasswordFilled(form);
    var passwordValid = !passwordFilled || validateOwnerPasswordInputs(form, false) === null;
    var canSend = changed && passwordValid;
    var verified = root.getAttribute('data-owner-sms-verified') === 'Y';
    var sent = root.getAttribute('data-owner-sms-sent') === 'Y';
    var sendButton = form.querySelector('[data-owner-sms-send]');
    var codeInput = form.querySelector('[data-owner-sms-code]');
    var verifyButton = form.querySelector('[data-owner-sms-verify]');
    var saveButton = form.querySelector('[data-mypage-profile-save]');

    if (sendButton) sendButton.disabled = !canSend;
    if (codeInput) {
      codeInput.disabled = !(canSend && sent);
      if (!canSend || !sent) {
        codeInput.value = '';
      }
    }
    if (verifyButton) verifyButton.disabled = !(canSend && sent && !verified);
    if (saveButton) {
      saveButton.disabled = !(changed && verified);
      if (!changed) {
        setOwnerSaveDisabledReason(saveButton, '\uc218\uc815\ud560 \ud56d\ubaa9\uc744 \ubcc0\uacbd\ud558\uba74 \ud65c\uc131\ud654\ub429\ub2c8\ub2e4.');
      } else if (!passwordValid) {
        setOwnerSaveDisabledReason(saveButton, '\ube44\ubc00\ubc88\ud638 \uc720\ud6a8\uc131\uc744 \ud1b5\uacfc\ud558\uace0 \ube44\ubc00\ubc88\ud638 \uc7ac\uc785\ub825\uc744 \uc77c\uce58\uc2dc\ud0a8 \ub4a4 \uc778\uc99d\ubc88\ud638\ub97c \ubc1c\uc1a1\ud574 \uc8fc\uc138\uc694.');
      } else if (!sent) {
        setOwnerSaveDisabledReason(saveButton, '\uc778\uc99d\ubc88\ud638 \ubc1c\uc1a1 \ud6c4 SMS \uc778\uc99d\uc744 \uc644\ub8cc\ud574 \uc8fc\uc138\uc694.');
      } else if (!verified) {
        setOwnerSaveDisabledReason(saveButton, '6\uc790\ub9ac \uc778\uc99d\ubc88\ud638 \ud655\uc778\uc744 \uc644\ub8cc\ud574 \uc8fc\uc138\uc694.');
      } else {
        setOwnerSaveDisabledReason(saveButton, '');
      }
    }
  }

  function updateOwnerSmsState(root, message, type) {
    var changed = hasOwnerProfileChanges(root);
    var verified = root.getAttribute('data-owner-sms-verified') === 'Y';

    refreshOwnerSmsControls(root);

    if (!changed) {
      root.setAttribute('data-owner-sms-verified', 'N');
      root.setAttribute('data-owner-sms-sent', 'N');
      setOwnerSmsMessage(root, '수정할 항목을 변경하면 SMS 인증이 필요합니다.', '');
      refreshOwnerSmsControls(root);
      return;
    }

    if (message) {
      setOwnerSmsMessage(root, message, type || '');
      return;
    }

    if (verified) {
      setOwnerSmsMessage(root, 'SMS 인증이 완료되었습니다. 수정완료를 누르세요.', 'success');
      return;
    }

    setOwnerSmsMessage(root, '회원정보 수정 전 SMS 인증이 필요합니다.', 'warning');
  }

  function resetOwnerSmsVerification(root, message) {
    root.setAttribute('data-owner-sms-verified', 'N');
    root.setAttribute('data-owner-sms-sent', 'N');
    updateOwnerSmsState(root, message || '회원정보 수정 전 SMS 인증이 필요합니다.', 'warning');
  }

  function captureOwnerProfileSnapshot(root) {
    var form = getOwnerProfileForm(root);
    if (!form) {
      return;
    }
    form.dataset.ownerInitialSnapshot = createOwnerProfileSnapshot(form);
    root.setAttribute('data-owner-sms-verified', 'N');
    root.setAttribute('data-owner-sms-sent', 'N');
    updateOwnerSmsState(root);
  }

  function setPasswordChangeEnabled(root, enabled) {
    root.querySelectorAll('[data-mypage-password-change-form] input[name="newPassword"], [data-mypage-password-change-form] input[name="newPasswordConfirm"]').forEach(function (input) {
      input.disabled = !enabled;
      if (!enabled) {
        input.value = '';
      }
    });

    var changeButton = root.querySelector('[data-mypage-password-change]');
    if (changeButton) {
      changeButton.disabled = !enabled;
    }
  }

  function resetPasswordChangeArea(root, profile) {
    var area = root.querySelector('[data-mypage-password-change-area]');
    var phone = root.querySelector('[data-mypage-password-phone]');
    var codeInput = root.querySelector('#mypage-sms-auth-code');
    var message = root.querySelector('[data-mypage-password-change-message]');

    if (area) {
      area.hidden = true;
      area.style.display = 'none';
    }
    if (phone) {
      phone.textContent = maskPhoneNo(profile && profile.telno);
    }
    if (codeInput) {
      codeInput.value = '';
    }
    setPasswordChangeEnabled(root, false);
    setMessage(message, 'SMS 인증 후 새 비밀번호를 변경할 수 있습니다.', 'warning');
  }

  function getVisibleMyPageView(root) {
    var activeTab = normalizeTab(root.getAttribute('data-initial-tab'));
    if (activeTab === 'alarm') {
      return 'alarm';
    }

    var profileArea = root.querySelector('[data-mypage-profile-area]');
    return profileArea && !profileArea.hidden && profileArea.style.display !== 'none' ? 'profile' : 'password';
  }

  function getMyPageUrl(root, tab) {
    var actorPath = root.getAttribute('data-actor-path') || '';
    return getContextPath() + '/' + actorPath + '/mypage.do?tab=' + normalizeTab(tab);
  }

  function createMyPageHistoryState(root, tab, view) {
    return {
      tacsMypage: true,
      actorPath: root.getAttribute('data-actor-path') || '',
      tab: normalizeTab(tab || root.getAttribute('data-initial-tab')),
      view: view || getVisibleMyPageView(root)
    };
  }

  function replaceCurrentMyPageHistory(root, tab, view) {
    if (!window.history || !window.history.replaceState) {
      return;
    }

    window.history.replaceState(
      createMyPageHistoryState(root, tab, view),
      '',
      getMyPageUrl(root, tab || root.getAttribute('data-initial-tab'))
    );
  }

  function pushProfileMyPageHistory(root) {
    if (!window.history || !window.history.pushState) {
      return;
    }

    var state = window.history.state;
    if (state && state.tacsMypage && state.view === 'profile') {
      return;
    }

    window.history.pushState(
      createMyPageHistoryState(root, 'profile', 'profile'),
      '',
      getMyPageUrl(root, 'profile')
    );
  }

  function syncTab(root, tab, replaceUrl) {
    var normalized = normalizeTab(tab);

    root.querySelectorAll('[data-mypage-tab]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-mypage-tab') === normalized);
    });

    root.querySelectorAll('[data-mypage-panel]').forEach(function (panel) {
      panel.classList.toggle('is-active', panel.getAttribute('data-mypage-panel') === normalized);
    });

    root.setAttribute('data-initial-tab', normalized);

    if (normalized === 'alarm') {
      loadAlarmPrefs(root);
    }

    if (replaceUrl && window.history && window.history.replaceState) {
      var actorPath = root.getAttribute('data-actor-path') || '';
      if (actorPath) {
        window.history.replaceState(
          createMyPageHistoryState(root, normalized, normalized === 'alarm' ? 'alarm' : getVisibleMyPageView(root)),
          '',
          getMyPageUrl(root, normalized)
        );
      }
    }
  }

  // ===== 알림 수신 설정 (on/off 토글) =====
  function getAlarmApiBase() {
    return getContextPath() + '/api/notifications/pref';
  }

  // 알림 종류별 한 줄 설명 (이름만으로 모호한 부분 보완)
  var ALARM_PREF_DESC = {
    CSTM_REQUESTED:        '화주가 신규 통관 의뢰를 등록했을 때',
    CSTM_ACCEPTED:         '관세사가 회원님의 통관 의뢰를 접수했을 때',
    CSTM_REJECTED:         '관세사가 통관 의뢰를 반려했을 때 (재의뢰 필요)',
    CSTM_SUPP_REQUESTED:   '관세사가 통관 처리를 위해 보완 자료를 요청했을 때',
    DCLR_SUBMITTED:        '관세사가 세관에 수입신고를 전송했을 때',
    ITEM_SUPP_REQUESTED:   '공무원이 신고 품목 보완을 요청했을 때',
    ITEM_SUPP_SUBMITTED:   '관세사가 품목 보완 자료를 제출했을 때',
    CSTM_SUPP_SUBMITTED:   '화주가 (관세사 요청) 통관 보완 자료를 제출했을 때',
    ITEM_ACCEPTED:         '공무원이 신고 품목을 수리(승인)했을 때',
    ITEM_REJECTED:         '공무원이 신고 품목을 반려했을 때',
    CSTM_DONE:             '세관 통관(수리)이 완료되었을 때',
    TAX_CHARGED:           '관세사가 관부가세·통관 비용을 청구했을 때 (납부 필요)',
    TAX_PAID:              '화주가 관부가세 납부를 완료했을 때',
    TR_REQUESTED:          '화주가 신규 운송 의뢰를 등록했을 때',
    WH_INBOUND_REQUESTED:  '운송담당자가 입고의뢰를 접수했을 때 (입고 처리 필요)',
    WH_OUTBOUND_REQUESTED: '운송담당자가 반출요청을 접수했을 때 (반출 처리 필요)',
    WH_INBOUND_DONE:       '창고에서 입고가 완료되었을 때',
    WH_INBOUND_SUPP_REQ:   '창고에서 입고 보완을 요청했을 때',
    WH_OUTBOUND_DONE:      '창고에서 반출이 완료되었을 때',
    WH_OUTBOUND_SUPP_REQ:  '창고에서 반출 보완을 요청했을 때',
    DO_READY:              '화주가 운임 정산·신고필증 전달을 완료해 D/O 발급이 가능할 때',
    FREIGHT_STL_REQUESTED: '운송담당자가 운임 정산(결제)을 요청했을 때',
    QUARANTINE_REQUESTED:  '관세사가 검역신청을 접수했을 때 (검역 처리 필요)'
  };

  function renderAlarmPrefs(listEl, items) {
    if (!items || items.length === 0) {
      listEl.innerHTML = '<li class="tacs-alarm-pref-empty">설정할 알림이 없습니다.</li>';
      return;
    }
    listEl.innerHTML = items.map(function (item) {
      var on = item.useYn !== 'N';
      var ev = escapeHtml(item.eventCd);
      var desc = ALARM_PREF_DESC[item.eventCd] || '';
      return ''
        + '<li class="tacs-alarm-pref-item">'
        + '  <div class="tacs-alarm-pref-text">'
        + '    <span class="tacs-alarm-pref-name">' + escapeHtml(item.bizNm || item.eventCd) + '</span>'
        + (desc ? '    <span class="tacs-alarm-pref-desc-sm">' + escapeHtml(desc) + '</span>' : '')
        + '  </div>'
        + '  <label class="tacs-switch">'
        + '    <input type="checkbox" data-alarm-pref-toggle data-event-cd="' + ev + '"' + (on ? ' checked' : '') + '>'
        + '    <span class="tacs-switch-track"><span class="tacs-switch-thumb"></span></span>'
        + '  </label>'
        + '</li>';
    }).join('');
  }

  function bindAlarmToggles(root, listEl) {
    listEl.querySelectorAll('[data-alarm-pref-toggle]').forEach(function (input) {
      if (input.dataset.alarmBound === 'Y') return;
      input.dataset.alarmBound = 'Y';
      input.addEventListener('change', function () {
        var eventCd = input.getAttribute('data-event-cd');
        var on = input.checked;
        input.disabled = true;
        fetch(getAlarmApiBase(), {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventCd: eventCd, on: on })
        }).then(function (res) {
          if (!res.ok) throw new Error('save failed');
        }).catch(function () {
          input.checked = !on; // 실패 시 원복
          alert('알림 설정 저장에 실패했습니다. 다시 시도해 주세요.');
        }).finally(function () {
          input.disabled = false;
        });
      });
    });
  }

  function bindBulkButtons(root, listEl) {
    root.querySelectorAll('[data-alarm-bulk]').forEach(function (btn) {
      if (btn.dataset.alarmBound === 'Y') return;
      btn.dataset.alarmBound = 'Y';
      btn.addEventListener('click', function () {
        var on = btn.getAttribute('data-alarm-bulk') === 'on';
        var buttons = root.querySelectorAll('[data-alarm-bulk]');
        buttons.forEach(function (b) { b.disabled = true; });
        fetch(getAlarmApiBase() + '/all', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ on: on })
        }).then(function (res) {
          if (!res.ok) throw new Error('bulk failed');
          // 성공 시 화면의 모든 토글을 일괄 반영
          listEl.querySelectorAll('[data-alarm-pref-toggle]').forEach(function (input) {
            input.checked = on;
          });
        }).catch(function () {
          alert('전체 ' + (on ? '켜기' : '끄기') + ' 처리에 실패했습니다. 다시 시도해 주세요.');
        }).finally(function () {
          buttons.forEach(function (b) { b.disabled = false; });
        });
      });
    });
  }

  function loadAlarmPrefs(root) {
    var listEl = root.querySelector('[data-alarm-pref-list]');
    if (!listEl || listEl.dataset.alarmLoaded === 'Y') return;
    listEl.dataset.alarmLoaded = 'Y';

    fetch(getAlarmApiBase(), { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('load failed');
        return res.json();
      })
      .then(function (items) {
        renderAlarmPrefs(listEl, items);
        bindAlarmToggles(root, listEl);
        bindBulkButtons(root, listEl);
      })
      .catch(function () {
        listEl.dataset.alarmLoaded = '';
        listEl.innerHTML = '<li class="tacs-alarm-pref-empty">알림 설정을 불러오지 못했습니다.</li>';
      });
  }

  function bindTabs(root) {
    root.querySelectorAll('[data-mypage-tab]').forEach(function (btn) {
      if (btn.dataset.mypageBound === 'Y') return;
      btn.dataset.mypageBound = 'Y';
      btn.addEventListener('click', function () {
        syncTab(root, btn.getAttribute('data-mypage-tab'), true);
      });
    });
  }

  function actorField(options) {
    options = options || {};
    if (options.name === 'telno' && options.readonly === true && options.icon === 'smartphone') {
      options.label = '연락처';
    }
    var readonly = options.readonly === true;
    var span = options.span || 4;
    var className = 'tacs-actor-field tacs-actor-span-' + span
      + (readonly ? ' is-readonly' : '')
      + (options.extraClass ? ' ' + options.extraClass : '');
    var nameAttr = options.name ? ' name="' + escapeHtml(options.name) + '"' : '';
    var placeholderAttr = options.placeholder ? ' placeholder="' + escapeHtml(options.placeholder) + '"' : '';
    var maxlengthAttr = options.maxlength ? ' maxlength="' + escapeHtml(options.maxlength) + '"' : '';
    var inputmodeAttr = options.inputmode ? ' inputmode="' + escapeHtml(options.inputmode) + '"' : '';

    return ''
      + '<div class="' + className + '">'
      + '  <label class="tacs-actor-field-label">' + escapeHtml(options.label || '') + '</label>'
      + '  <div class="tacs-actor-field-row">'
      + '    <div class="tacs-actor-icon-box"><span class="material-symbols-outlined">' + escapeHtml(options.icon || 'edit') + '</span></div>'
      + '    <input class="tacs-actor-input-box" type="text"' + nameAttr + ' value="' + escapeHtml(options.value) + '"' + placeholderAttr + maxlengthAttr + inputmodeAttr + (readonly ? ' readonly' : '') + ' />'
      + '  </div>'
      + '</div>';
  }

  function actorEmailField(profile, span, extraClass) {
    return ''
      + '<div class="tacs-actor-field tacs-actor-email-field tacs-actor-span-' + (span || 8) + (extraClass ? ' ' + extraClass : '') + '">'
      + '  <label class="tacs-actor-field-label">이메일</label>'
      + '  <input type="hidden" name="email" value="' + escapeHtml(profile.email) + '" data-actor-profile-input="email" />'
      + '  <div class="tacs-actor-email-row">'
      + '    <div class="tacs-actor-icon-box"><span class="material-symbols-outlined">alternate_email</span></div>'
      + '    <input class="tacs-actor-input-box tacs-actor-email-local" type="text" placeholder="이메일 아이디" maxlength="64" data-actor-email-local />'
      + '    <span class="tacs-actor-email-at">@</span>'
      + '    <input class="tacs-actor-input-box tacs-actor-email-domain" type="text" placeholder="도메인 입력" maxlength="100" data-actor-email-domain />'
      + '    <select class="tacs-actor-input-box tacs-actor-email-select" data-actor-email-domain-select>'
      + '      <option value="">직접입력</option>'
      + '      <option value="naver.com">네이버</option>'
      + '      <option value="kakao.com">카카오</option>'
      + '      <option value="gmail.com">구글</option>'
      + '      <option value="nate.com">네이트</option>'
      + '      <option value="daum.net">다음</option>'
      + '      <option value="hanmail.net">한메일</option>'
      + '      <option value="outlook.com">아웃룩</option>'
      + '    </select>'
      + '  </div>'
      + '</div>';
  }

  function actorAddressStack(profile, span, extraClass) {
    return ''
      + '<div class="tacs-actor-address-stack tacs-actor-span-' + (span || 4) + (extraClass ? ' ' + extraClass : '') + '">'
      + '  <div class="tacs-actor-field tacs-actor-span-12 tacs-actor-zip-field">'
      + '    <label class="tacs-actor-field-label">우편번호</label>'
      + '    <div class="tacs-actor-field-row">'
      + '      <div class="tacs-actor-icon-box"><span class="material-symbols-outlined">markunread_mailbox</span></div>'
      + '      <input class="tacs-actor-input-box" type="text" name="zip" value="' + escapeHtml(profile.zip) + '" maxlength="5" inputmode="numeric" />'
      + '      <button type="button" class="tacs-actor-side-btn is-dark" data-actor-address-search>검색</button>'
      + '    </div>'
      + '  </div>'
      + actorField({ label: '주소', value: profile.adres, name: 'adres', icon: 'home_pin', span: 12 })
      + actorField({ label: '상세주소', value: profile.detailAdres, name: 'detailAdres', icon: 'edit_location', span: 12 })
      + '</div>';
  }

  function actorAddressMapBox(span) {
    return ''
      + '<div class="tacs-actor-address-map-field tacs-actor-span-' + (span || 8) + '">'
      + '  <div class="tacs-actor-address-map">'
      + '    <div data-actor-address-map></div>'
      + '    <div class="tacs-actor-address-map-placeholder" data-actor-address-map-placeholder>'
      + '      <div class="tacs-actor-address-map-title"><span class="material-symbols-outlined">map</span>지도 영역</div>'
      + '      <div class="tacs-actor-address-map-text" data-actor-address-map-text>주소 검색 후 위치가 지도에 표시됩니다.</div>'
      + '    </div>'
      + '  </div>'
      + '</div>';
  }

  function actorPasswordField(options) {
    options = options || {};
    var span = options.span || 4;
    var autocomplete = options.confirm ? 'new-password' : 'new-password';

    return ''
      + '<div class="tacs-actor-field tacs-actor-password-field tacs-actor-span-' + span + '">'
      + '  <label class="tacs-actor-field-label">'
      +      escapeHtml(options.label || '')
      +      (options.help ? '<span class="tacs-actor-field-help">' + escapeHtml(options.help) + '</span>' : '')
      +      (options.feedback ? '<span class="tacs-actor-password-feedback" data-actor-password-feedback></span>' : '')
      + '  </label>'
      + '  <div class="tacs-actor-field-row">'
      + '    <div class="tacs-actor-icon-box"><span class="material-symbols-outlined">' + escapeHtml(options.icon || 'lock') + '</span></div>'
      + '    <div class="tacs-actor-password-wrap">'
      + '      <input class="tacs-actor-password-input" type="password" name="' + escapeHtml(options.name || '') + '" autocomplete="' + autocomplete + '" placeholder="' + escapeHtml(options.placeholder || '') + '" maxlength="16" ' + (options.confirm ? 'data-actor-new-password-confirm' : 'data-actor-new-password') + ' />'
      + '      <button type="button" class="tacs-actor-password-toggle" data-actor-password-toggle aria-label="' + escapeHtml(options.label || '비밀번호') + ' 보기">'
      + '        <span class="material-symbols-outlined">visibility</span>'
      + '      </button>'
      + '    </div>'
      + '  </div>'
      + '</div>';
  }

  function actorPasswordAuthBox(span) {
    return ''
      + '<div class="tacs-actor-password-auth tacs-actor-span-' + (span || 4) + '">'
      + '  <div class="tacs-actor-password-auth-row">'
      + '    <span class="tacs-actor-password-auth-label">SMS 인증</span>'
      + '    <button type="button" class="tacs-actor-side-btn is-light" data-actor-password-sms-send disabled>인증번호 발송</button>'
      + '    <input class="tacs-actor-input-box tacs-actor-sms-code" type="text" name="authCode" maxlength="6" inputmode="numeric" placeholder="6자리" data-actor-password-sms-code disabled />'
      + '    <button type="button" class="tacs-actor-side-btn is-dark" data-actor-password-sms-verify disabled>확인</button>'
      + '    <p class="tacs-actor-password-message" data-actor-password-message></p>'
      + '  </div>'
      + '</div>';
  }

  function actorAccountPhoneField(profile, options) {
    options = options || {};
    var nameInput = options.includeName === false
      ? ''
      : '<input type="hidden" name="telno" value="' + escapeHtml(profile.telno) + '" />';
    return ''
      + '<div class="tacs-actor-field tacs-actor-span-4 is-readonly tacs-actor-account-phone-field' + (options.extraClass ? ' ' + escapeHtml(options.extraClass) : '') + '">'
      + '  <label class="tacs-actor-field-label">' + escapeHtml(options.label || '전화번호') + '</label>'
      +    nameInput
      + '  <div class="tacs-actor-field-row">'
      + '    <div class="tacs-actor-icon-box"><span class="material-symbols-outlined">smartphone</span></div>'
      + '    <input class="tacs-actor-input-box" type="text" value="' + escapeHtml(formatPhoneNo(profile.telno)) + '" readonly />'
      + '  </div>'
      + '</div>';
  }

  function actorInfoBox(title, text, icon, span, tone) {
    return ''
      + '<div class="tacs-actor-info-box tacs-actor-span-' + (span || 4) + (tone ? ' is-' + tone : '') + '">'
      + '  <div class="tacs-actor-info-title">'
      + '    <span class="material-symbols-outlined">' + escapeHtml(icon || 'info') + '</span>'
      + '    <strong>' + escapeHtml(title || '') + '</strong>'
      + '  </div>'
      + '  <p>' + escapeHtml(text || '') + '</p>'
      + '</div>';
  }

  function actorInlineActionButtons() {
    return ''
      + '<div class="tacs-actor-inline-actions">'
      + '  <button type="button" class="tacs-btn tacs-btn-secondary" data-mypage-profile-reset>취소</button>'
      + '  <button type="submit" class="tacs-btn tacs-btn-primary" data-mypage-profile-save>저장</button>'
      + '</div>';
  }

  function actorSection(title, icon, fields, extraClass) {
    return ''
      + '<section class="tacs-actor-form-section ' + (extraClass || '') + '">'
      + '  <div class="tacs-actor-section-head">'
      + '    <div class="tacs-actor-section-head-icon"><span class="material-symbols-outlined">' + escapeHtml(icon || 'assignment') + '</span></div>'
      + '    <div class="tacs-actor-section-head-title">' + escapeHtml(title || '') + '</div>'
      + '  </div>'
      + '  <div class="tacs-actor-grid">'
      +      fields.join('')
      + '  </div>'
      + '</section>';
  }

  function buildAccountSection(profile) {
    var roleCd = profile.roleCd || '';

    var fields = [
      actorField({
        label: '아이디',
        value: profile.loginId,
        name: 'loginId',
        readonly: true,
        icon: 'person',
        span: 4
      }),
      actorPasswordField({
        label: '비밀번호',
        help: '(변경 시에만 입력)',
        name: 'newPassword',
        icon: 'lock',
        placeholder: '8자 이상 입력',
        span: 4
      }),
      actorPasswordField({
        label: '비밀번호 확인',
        name: 'newPasswordConfirm',
        icon: 'lock_reset',
        placeholder: '비밀번호 재입력',
        confirm: true,
        feedback: true,
        span: 4
      })
    ];

    fields.push(actorAccountPhoneField(profile, {
      label: roleCd === 'BROKER' ? '관세사 전화번호' : (roleCd === 'TRANSPORT_MANAGER' ? '운송담당자 전화번호' : '전화번호'),
      includeName: roleCd === 'BROKER' || profile.typeCd === 'FIELD_OFFICER' || roleCd === 'TRANSPORT_MANAGER' || roleCd === 'WAREHOUSE_MANAGER',
      extraClass: roleCd === 'TRANSPORT_MANAGER' ? 'tacs-transport-phone-field' : ''
    }));
    fields.push(actorPasswordAuthBox(4));

    return actorSection('계정 정보', 'manage_accounts', fields, 'is-account-section is-actor-sms-account-section' + (profile.roleCd === 'BROKER' ? ' is-broker-account-section' : ''));
  }

  function buildCommonSections(profile) {
    return [buildAccountSection(profile)];
  }

  function buildBrokerFields(profile) {
    var sections = buildCommonSections(profile);
    sections.push(actorSection('관세사 기본 정보', 'assignment_ind', [
      actorField({ label: '관세사 유형', value: profile.typeNm || profile.typeCd, name: 'typeNm', readonly: true, icon: 'verified_user', span: 4 }),
      actorField({ label: '관세사명', value: profile.name, name: 'name', icon: 'person', span: 4 }),
      actorField({ label: '관세사무소명', value: profile.orgName, name: 'orgName', icon: 'business', span: 4 }),
      actorField({ label: '관세사 등록번호', value: profile.brokerRegNo, name: 'brokerRegNo', readonly: true, icon: 'badge', span: 4 }),
      actorField({ label: '사업자등록번호', value: profile.bizrno, name: 'bizrno', icon: 'fact_check', span: 4, inputmode: 'numeric', maxlength: 12 }),
      actorField({ label: '전문분야', value: profile.brokerSpcltyCd, name: 'brokerSpcltyCd', icon: 'workspace_premium', span: 4 })
    ], 'is-basic-section'));
    if ((profile.roleCd || '') === 'BROKER') {
      sections.push(actorSection('부가 정보', 'contact_phone', [
        actorEmailField(profile, 4),
        actorAddressStack(profile),
        actorAddressMapBox(4),
        actorInlineActionButtons()
      ], 'is-contact-section is-broker-contact-section'));
      return sections;
    }
    sections.push(actorSection('부가 정보', 'contact_phone', [
      actorField({ label: '이메일', value: profile.email, name: 'email', icon: 'alternate_email', span: 4 }),
      actorField({ label: '연락처', value: profile.telno, name: 'telno', icon: 'smartphone', span: 4 }),
      actorField({ label: '우편번호', value: profile.zip, name: 'zip', icon: 'markunread_mailbox', span: 4, inputmode: 'numeric', maxlength: 5 }),
      actorField({ label: '주소', value: profile.adres, name: 'adres', icon: 'home_pin', span: 4 }),
      actorField({ label: '상세주소', value: profile.detailAdres, name: 'detailAdres', icon: 'edit_location', span: 4 })
    ], 'is-contact-section'));
    return sections;
  }

  function buildOfficerFields(profile) {
    var roleTitle = profile.typeCd === 'FIELD_OFFICER' ? '현장공무원 기본 정보' : '행정공무원 기본 정보';
    var sections = buildCommonSections(profile);
    var isFieldOfficer = profile.typeCd === 'FIELD_OFFICER';
    sections.push(actorSection(roleTitle, 'assignment_ind', [
      actorField({ label: '공무원 유형', value: profile.typeNm || profile.typeCd, name: 'typeNm', readonly: true, icon: 'verified_user', span: 4 }),
      actorField({ label: '기관명', value: profile.orgName, name: 'orgName', readonly: true, icon: 'account_balance', span: 4 }),
      actorField({ label: '공무원명', value: profile.name, name: 'name', readonly: true, icon: 'person', span: 4 }),
      actorField({ label: '기관코드', value: profile.officerInstCd, name: 'officerInstCd', readonly: true, icon: 'tag', span: 4 }),
      actorField({ label: '부서코드', value: profile.officerDeptCd, name: 'officerDeptCd', readonly: true, icon: 'lan', span: 4 }),
      actorField({ label: '직급코드', value: profile.officerClsfCd, name: 'officerClsfCd', readonly: true, icon: 'military_tech', span: 4 })
    ], 'is-basic-section'));
    
    var contactFields = [];
    if (!isFieldOfficer) {
        contactFields.push(actorField({ label: '연락처', value: profile.telno, name: 'telno', readonly: false, icon: 'smartphone', span: 4, extraClass: 'tacs-actor-telno-field' }));
    }
    
    if (isFieldOfficer) {
        contactFields.push(actorEmailField(profile, 4));
        contactFields.push(actorAddressStack(profile, 4));
        contactFields.push(actorAddressMapBox(4));
    } else {
        contactFields.push(actorEmailField(profile, 4, 'tacs-actor-email-field'));
        contactFields.push(actorAddressStack(profile, 4, 'tacs-actor-address-stack'));
        contactFields.push(actorAddressMapBox(4));
    }
    contactFields.push(actorInlineActionButtons());

    sections.push(actorSection('부가 정보', 'contact_phone', contactFields, 'is-contact-section is-officer-contact-section ' + (isFieldOfficer ? 'is-field-officer-contact-section' : 'is-admin-officer-contact-section')));
    return sections;
  }

  function buildTransportFields(profile) {
    var sections = buildCommonSections(profile);
    sections.push(actorSection('운송담당자 기본 정보', 'local_shipping', [
      actorField({ label: '운송담당자번호', value: profile.tmNo, name: 'tmNo', readonly: true, icon: 'confirmation_number', span: 4 }),
      actorField({ label: '운송담당자명', value: profile.name, name: 'name', icon: 'person', span: 4 }),
      actorField({ label: '운송업체명', value: profile.orgName, name: 'orgName', readonly: true, icon: 'business', span: 4 }),
      actorField({ label: '운송수단코드', value: profile.tmMnCd || profile.typeCd, name: 'tmMnCd', readonly: true, icon: 'route', span: 4 })
    ], 'is-basic-section'));
    return sections;
  }

  function buildWarehouseFields(profile) {
    var sections = buildCommonSections(profile);
    sections.push(actorSection('창고관리자 기본 정보', 'warehouse', [
      actorField({ label: '창고관리자명', value: profile.name, name: 'name', icon: 'person', span: 4 })
    ], 'is-basic-section'));
    sections.push(actorSection('부가 정보', 'contact_phone', [
      actorEmailField(profile, 4),
      actorAddressStack(profile),
      actorAddressMapBox(4)
    ], 'is-contact-section is-warehouse-contact-section'));
    return sections;
  }

  function buildSystemAdminFields(profile) {
    var sections = buildCommonSections(profile);
    sections.push(actorSection('시스템관리자 기본 정보', 'admin_panel_settings', [
      actorField({ label: '관리자명', value: profile.name, name: 'name', icon: 'person', span: 4 }),
      actorField({ label: '소속', value: profile.orgName, name: 'orgName', readonly: true, icon: 'business', span: 4 })
    ], 'is-basic-section'));
    sections.push(actorSection('부가 정보', 'contact_phone', [
      actorField({ label: '이메일', value: profile.email, name: 'email', icon: 'alternate_email', span: 4 }),
      actorField({ label: '연락처', value: profile.telno, name: 'telno', icon: 'smartphone', span: 4 })
    ], 'is-contact-section'));
    return sections;
  }

  function buildProfileFields(profile) {
    var roleCd = profile.roleCd || '';

    if (roleCd === 'BROKER') {
      return buildBrokerFields(profile);
    }
    if (roleCd === 'OFFICER' || profile.typeCd === 'FIELD_OFFICER') {
      return buildOfficerFields(profile);
    }
    if (roleCd === 'TRANSPORT_MANAGER') {
      return buildTransportFields(profile);
    }
    if (roleCd === 'WAREHOUSE_MANAGER') {
      return buildWarehouseFields(profile);
    }
    if (roleCd === 'SYSTEM_ADMIN') {
      return buildSystemAdminFields(profile);
    }
    return buildCommonSections(profile);
  }

  function isActorProfileForm(form) {
    return !!(form && form.classList && form.classList.contains('tacs-actor-profile-form'));
  }

  function getActorProfileForm(root) {
    return root ? root.querySelector('.tacs-actor-profile-form') : null;
  }

  function getActorPasswordInput(form, selector) {
    return form ? form.querySelector(selector) : null;
  }

  function isActorProfilePasswordFilled(form) {
    var newPassword = getActorPasswordInput(form, '[data-actor-new-password]');
    var newPasswordConfirm = getActorPasswordInput(form, '[data-actor-new-password-confirm]');
    return !!((newPassword && newPassword.value) || (newPasswordConfirm && newPasswordConfirm.value));
  }

  function setActorPasswordFeedback(form, text, type) {
    var feedback = form ? form.querySelector('[data-actor-password-feedback]') : null;
    if (!feedback) {
      return;
    }
    feedback.textContent = text || '';
    feedback.classList.remove('ok', 'error');
    if (type) {
      feedback.classList.add(type);
    }
  }

  function validateActorPasswordInputs(form, showFeedback) {
    var newPassword = getActorPasswordInput(form, '[data-actor-new-password]');
    var newPasswordConfirm = getActorPasswordInput(form, '[data-actor-new-password-confirm]');
    var passwordValue = newPassword ? newPassword.value : '';
    var confirmValue = newPasswordConfirm ? newPasswordConfirm.value : '';

    if (!passwordValue && !confirmValue) {
      setActorPasswordFeedback(form, '', '');
      return null;
    }
    if (!passwordValue || !confirmValue) {
      if (showFeedback) setActorPasswordFeedback(form, '확인 필요', 'error');
      return '비밀번호를 변경하려면 비밀번호와 비밀번호 확인을 모두 입력해 주세요.';
    }
    if (passwordValue !== confirmValue) {
      if (showFeedback) setActorPasswordFeedback(form, '불일치', 'error');
      return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    }
    if (passwordValue.indexOf(' ') >= 0) {
      if (showFeedback) setActorPasswordFeedback(form, '공백 불가', 'error');
      return '비밀번호에는 공백을 사용할 수 없습니다.';
    }
    if (passwordValue.length < 8) {
      if (showFeedback) setActorPasswordFeedback(form, '8자 이상', 'error');
      return '비밀번호는 8자 이상이어야 합니다.';
    }

    if (getPasswordLengthUnits(passwordValue) > 16) {
      if (showFeedback) setActorPasswordFeedback(form, '16자 이내', 'error');
      return '비밀번호는 영문 기준 16자, 한글 기준 8자 이내로 입력해 주세요.';
    }

    var typeCount = 0;
    if (/[A-Za-z]/.test(passwordValue)) typeCount++;
    if (/[0-9]/.test(passwordValue)) typeCount++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) typeCount++;
    if (typeCount < 2) {
      if (showFeedback) setActorPasswordFeedback(form, '조합 확인', 'error');
      return '비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 조합해야 합니다.';
    }

    setActorPasswordFeedback(form, '일치', 'ok');
    return null;
  }

  function getActorPasswordMessage(root) {
    var form = getActorProfileForm(root);
    return form ? form.querySelector('[data-actor-password-message]') : null;
  }

  function setActorPasswordMessage(root, text, type) {
    setMessage(getActorPasswordMessage(root), text, type);
  }

  function refreshActorPasswordControls(root) {
    var form = getActorProfileForm(root);
    if (!form) {
      return;
    }

    var filled = isActorProfilePasswordFilled(form);
    var brokerProfile = isBrokerProfileForm(form);
    var profileChanged = brokerProfile && hasBrokerProfileChanges(root);
    var passwordValidation = validateActorPasswordInputs(form, false);
    var validPassword = filled && passwordValidation === null;
    var validForSms = brokerProfile ? (profileChanged || validPassword) && (!filled || passwordValidation === null) : validPassword;
    var sent = root.getAttribute('data-actor-password-sms-sent') === 'Y';
    var verified = root.getAttribute('data-actor-password-sms-verified') === 'Y';
    var sendButton = form.querySelector('[data-actor-password-sms-send]');
    var codeInput = form.querySelector('[data-actor-password-sms-code]');
    var verifyButton = form.querySelector('[data-actor-password-sms-verify]');
    var saveButtons = form.querySelectorAll('[data-mypage-profile-save]');

    if (!filled && !profileChanged) {
      root.setAttribute('data-actor-password-sms-sent', 'N');
      root.setAttribute('data-actor-password-sms-verified', 'N');
      sent = false;
      verified = false;
      if (codeInput) codeInput.value = '';
    }

    if (sendButton) sendButton.disabled = !validForSms;
    if (codeInput) {
      codeInput.disabled = !(validForSms && sent && !verified);
      if (!validForSms || !sent || verified) {
        codeInput.value = verified ? codeInput.value : '';
      }
    }
    if (verifyButton) verifyButton.disabled = !(validForSms && sent && !verified);
    if (brokerProfile) {
      saveButtons.forEach(function (button) {
        button.disabled = !(validForSms && verified);
      });
    }

    if (brokerProfile && !profileChanged && !filled) {
      return;
    }
    if (!filled && !brokerProfile) {
      setActorPasswordMessage(root, '비밀번호 변경 시에만 입력하고 SMS 인증을 진행해 주세요.', '');
      return;
    }
    if (verified) {
      setActorPasswordMessage(root, brokerProfile ? 'SMS 인증이 완료되었습니다. 저장을 눌러 주세요.' : 'SMS 인증이 완료되었습니다. 저장을 누르면 비밀번호가 함께 변경됩니다.', 'success');
      return;
    }
    if (!validForSms) {
      return;
    }
    if (sent) {
      setActorPasswordMessage(root, '인증번호를 입력한 뒤 확인을 눌러 주세요.', 'warning');
      return;
    }
    setActorPasswordMessage(root, brokerProfile ? '저장 전 SMS 인증이 필요합니다.' : '비밀번호 변경 전 SMS 인증이 필요합니다.', 'warning');
  }

  function resetActorPasswordVerification(root, message, type) {
    root.setAttribute('data-actor-password-sms-sent', 'N');
    root.setAttribute('data-actor-password-sms-verified', 'N');
    refreshActorPasswordControls(root);
    if (message) {
      setActorPasswordMessage(root, message, type || 'warning');
    }
  }

  function getActorProfileInput(form, name) {
    return form ? form.querySelector('[name="' + name + '"]') : null;
  }

  function isBrokerProfileForm(form) {
    return !!(form && form.classList && form.classList.contains('is-sms-required-profile'));
  }

  function createBrokerProfileSnapshot(form) {
    if (!form) {
      return '';
    }
    syncActorEmail(form);
    var body = new URLSearchParams(new FormData(form));
    body.delete('authCode');
    body.delete('newPassword');
    body.delete('newPasswordConfirm');
    return Array.from(body.entries()).map(function (entry) {
      return entry[0] + '=' + encodeURIComponent(entry[1] || '');
    }).join('&');
  }

  function hasBrokerProfileChanges(root) {
    var form = getActorProfileForm(root);
    if (!isBrokerProfileForm(form)) {
      return false;
    }
    return (form.dataset.brokerInitialSnapshot || '') !== createBrokerProfileSnapshot(form);
  }

  function captureBrokerProfileSnapshot(root) {
    var form = getActorProfileForm(root);
    if (!isBrokerProfileForm(form)) {
      return;
    }
    form.dataset.brokerInitialSnapshot = createBrokerProfileSnapshot(form);
    root.setAttribute('data-actor-password-sms-sent', 'N');
    root.setAttribute('data-actor-password-sms-verified', 'N');
  }

  function splitActorEmail(form) {
    var emailInput = form ? form.querySelector('[data-actor-profile-input="email"]') : null;
    var localInput = form ? form.querySelector('[data-actor-email-local]') : null;
    var domainInput = form ? form.querySelector('[data-actor-email-domain]') : null;
    var select = form ? form.querySelector('[data-actor-email-domain-select]') : null;
    var value = emailInput ? String(emailInput.value || '').trim() : '';
    var atIndex = value.indexOf('@');
    var localValue = atIndex >= 0 ? value.substring(0, atIndex) : '';
    var domainValue = atIndex >= 0 ? value.substring(atIndex + 1) : '';

    if (localInput) localInput.value = localValue;
    if (domainInput) {
      domainInput.value = domainValue;
      domainInput.readOnly = false;
      domainInput.classList.remove('readonly');
    }
    if (select) {
      var matched = Array.prototype.some.call(select.options, function (option) {
        return option.value && option.value === domainValue;
      });
      select.value = matched ? domainValue : '';
      if (matched && domainInput) {
        domainInput.readOnly = true;
        domainInput.classList.add('readonly');
      }
    }
  }

  function syncActorEmail(form) {
    var emailInput = form ? form.querySelector('[data-actor-profile-input="email"]') : null;
    var localInput = form ? form.querySelector('[data-actor-email-local]') : null;
    var domainInput = form ? form.querySelector('[data-actor-email-domain]') : null;
    var localValue = localInput ? localInput.value.trim() : '';
    var domainValue = domainInput ? domainInput.value.trim() : '';
    if (emailInput) {
      emailInput.value = localValue && domainValue ? localValue + '@' + domainValue : '';
    }
  }

  function handleActorEmailDomainSelect(form) {
    var select = form ? form.querySelector('[data-actor-email-domain-select]') : null;
    var domainInput = form ? form.querySelector('[data-actor-email-domain]') : null;
    if (!select || !domainInput) return;

    if (select.value) {
      domainInput.value = select.value;
      domainInput.readOnly = true;
      domainInput.classList.add('readonly');
    } else {
      domainInput.value = '';
      domainInput.readOnly = false;
      domainInput.classList.remove('readonly');
      domainInput.focus();
    }
    syncActorEmail(form);
  }

  function initActorAddressMap(root) {
    var mapContainer = root ? root.querySelector('[data-actor-address-map]') : null;
    if (!mapContainer || actorAddressMap || !window.kakao || !kakao.maps || !kakao.maps.services) {
      return;
    }

    var defaultCenter = new kakao.maps.LatLng(36.3504119, 127.3845475);
    actorAddressMap = new kakao.maps.Map(mapContainer, {
      center: defaultCenter,
      level: 4
    });
    actorAddressMarker = new kakao.maps.Marker({
      position: defaultCenter
    });
    actorAddressGeocoder = new kakao.maps.services.Geocoder();
    setTimeout(function () {
      actorAddressMap.relayout();
    }, 0);
  }

  function updateActorAddressMap(root, address) {
    var placeholder = root ? root.querySelector('[data-actor-address-map-placeholder]') : null;
    var text = root ? root.querySelector('[data-actor-address-map-text]') : null;
    var displayAddress = String(address == null ? '' : address).trim();

    if (!displayAddress) {
      if (text) text.textContent = '주소 검색 후 위치가 지도에 표시됩니다.';
      if (placeholder) placeholder.classList.remove('hidden');
      return;
    }

    if (text) text.textContent = displayAddress;
    initActorAddressMap(root);
    if (!actorAddressMap || !actorAddressGeocoder) {
      if (placeholder) placeholder.classList.remove('hidden');
      return;
    }

    actorAddressGeocoder.addressSearch(displayAddress, function (result, status) {
      if (status !== kakao.maps.services.Status.OK || !result.length) {
        if (text) text.textContent = displayAddress + ' 위치를 찾을 수 없습니다.';
        if (placeholder) placeholder.classList.remove('hidden');
        return;
      }

      var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      actorAddressMap.relayout();
      actorAddressMap.setCenter(coords);
      actorAddressMap.setLevel(3);
      actorAddressMarker.setPosition(coords);
      actorAddressMarker.setMap(actorAddressMap);
      if (placeholder) placeholder.classList.add('hidden');
      setTimeout(function () {
        actorAddressMap.relayout();
        actorAddressMap.setCenter(coords);
      }, 120);
    });
  }

  function validateActorPasswordBeforeSubmit(root, form, messageEl) {
    var validationMessage = validateActorPasswordInputs(form, true);
    if (validationMessage) {
      setMessage(messageEl, validationMessage, 'error');
      focusInput(form.querySelector('[data-actor-new-password]'));
      return false;
    }

    if (root.getAttribute('data-actor-password-sms-verified') !== 'Y') {
      setMessage(messageEl, '비밀번호 변경 전 SMS 인증을 완료해 주세요.', 'error');
      setActorPasswordMessage(root, '비밀번호 변경 전 SMS 인증을 완료해 주세요.', 'error');
      var smsCodeInput = form.querySelector('[data-actor-password-sms-code]');
      if (smsCodeInput && !smsCodeInput.disabled) {
        smsCodeInput.focus();
      }
      return false;
    }

    return true;
  }

  function createProfileModifyBody(form, excludePasswordFields) {
    syncActorEmail(form);
    var body = new URLSearchParams(new FormData(form));
    if (excludePasswordFields) {
      body.delete('newPassword');
      body.delete('newPasswordConfirm');
      body.delete('authCode');
    }
    return body;
  }


  function setOwnerInput(root, key, value) {
    root.querySelectorAll('[data-owner-profile-input="' + key + '"]').forEach(function (input) {
      input.value = value == null ? '' : value;
    });
  }

  function setOwnerValue(root, key, value) {
    root.querySelectorAll('[data-owner-profile-value="' + key + '"]').forEach(function (input) {
      input.value = value == null ? '' : value;
    });
  }

  function setOwnerBoxVisible(root, selector, visible) {
    var box = root.querySelector(selector);
    if (!box) return;
    box.hidden = !visible;
    box.style.display = visible ? '' : 'none';
    box.querySelectorAll('input, select, textarea, button').forEach(function (control) {
      if (control.hasAttribute('readonly')) return;
      control.disabled = !visible;
      if (!visible && control.hasAttribute('name')) {
        control.value = '';
      }
    });
  }

  function populateOwnerProfile(root, profile) {
    var typeCd = profile.typeCd || '';
    var roleName = profile.roleNm || profile.roleCd || '화주';

    root.setAttribute('data-owner-type-cd', typeCd);
    setOwnerValue(root, 'loginId', profile.loginId);
    setOwnerValue(root, 'roleNm', roleName);
    setOwnerValue(root, 'identNoMasked', profile.identNoMasked);

    setOwnerInput(root, 'name', profile.name);
    setOwnerInput(root, 'bizrno', profile.bizrno);
    setOwnerInput(root, 'corpRegNo', profile.corpRegNo);
    setOwnerInput(root, 'cstmIdfNo', profile.cstmIdfNo);
    setOwnerInput(root, 'email', profile.email);
    setOwnerInput(root, 'telno', profile.telno);
    setOwnerInput(root, 'zip', profile.zip);
    setOwnerInput(root, 'adres', profile.adres);
    setOwnerInput(root, 'detailAdres', profile.detailAdres);
    splitOwnerEmail(root, profile.email);

    root.querySelectorAll('[data-owner-type-name]').forEach(function (typeName) {
      typeName.textContent = profile.typeNm || (
        typeCd === 'CORP' ? '법인' : (typeCd === 'OPERATOR' ? '개인사업자' : '개인')
      );
    });
    root.querySelectorAll('[data-owner-type-pill]').forEach(function (pill) {
      pill.classList.toggle('is-active', pill.getAttribute('data-owner-type-pill') === typeCd);
    });
    root.querySelectorAll('[data-owner-type-radio]').forEach(function (radio) {
      radio.checked = radio.value === typeCd;
    });

    var nameLabel = root.querySelector('[data-owner-name-label]');
    var nameIcon = root.querySelector('[data-owner-name-icon]');
    if (nameLabel) {
      nameLabel.textContent = typeCd === 'CORP' ? '법인명' : (typeCd === 'OPERATOR' ? '상호/이름' : '이름');
    }
    if (nameIcon) {
      nameIcon.textContent = typeCd === 'CORP' ? 'corporate_fare' : (typeCd === 'OPERATOR' ? 'storefront' : 'person');
    }

    setOwnerBoxVisible(root, '[data-owner-ident-box]', typeCd === 'INDV');
    setOwnerBoxVisible(root, '[data-owner-bizrno-box]', typeCd === 'OPERATOR' || typeCd === 'CORP');
    setOwnerBoxVisible(root, '[data-owner-corp-box]', typeCd === 'CORP');
    root.querySelectorAll('[data-owner-new-password], [data-owner-new-password-confirm]').forEach(function (input) {
      input.value = '';
    });
    var form = root.querySelector('.tacs-owner-profile-form');
    setOwnerPasswordFeedback(form, '', '');
    updateOwnerAddressMap(root, profile.adres);
    captureOwnerProfileSnapshot(root);
  }

  function bindOwnerAddressSearch(root) {
    var button = root.querySelector('[data-owner-address-search]');
    if (!button || button.dataset.mypageBound === 'Y') return;
    button.dataset.mypageBound = 'Y';
    button.addEventListener('click', function () {
      if (window.daum && window.daum.Postcode) {
        new window.daum.Postcode({
          oncomplete: function (data) {
            var zip = root.querySelector('[data-owner-profile-input="zip"]');
            var adres = root.querySelector('[data-owner-profile-input="adres"]');
            var detail = root.querySelector('[data-owner-profile-input="detailAdres"]');
            var address = data.roadAddress || data.jibunAddress || '';
            var extraAddress = '';

            if (data.userSelectedType === 'R') {
              if (data.bname && /[동로가]$/g.test(data.bname)) {
                extraAddress += data.bname;
              }
              if (data.buildingName && data.apartment === 'Y') {
                extraAddress += extraAddress ? ', ' + data.buildingName : data.buildingName;
              }
              if (extraAddress) {
                address += ' (' + extraAddress + ')';
              }
            }

            if (zip) zip.value = data.zonecode || '';
            if (adres) adres.value = address;
            updateOwnerAddressMap(root, address);
            resetOwnerSmsVerification(root);
            if (detail) detail.focus();
          }
        }).open();
        return;
      }
      alert('주소 검색 스크립트를 불러오지 못했습니다. 우편번호와 주소를 직접 입력해 주세요.');
    });
  }

  function bindOwnerProfileFormControls(root) {
    var form = root.querySelector('.tacs-owner-profile-form');
    if (!form || form.dataset.ownerControlsBound === 'Y') {
      return;
    }

    form.dataset.ownerControlsBound = 'Y';
    function markChanged() {
      resetOwnerSmsVerification(root);
    }

    form.querySelectorAll('[data-owner-password-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        var wrap = button.closest('.password-input-wrap');
        var input = wrap ? wrap.querySelector('input') : null;
        var icon = button.querySelector('.material-symbols-outlined');
        if (!input) {
          return;
        }
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.textContent = 'visibility_off';
          button.setAttribute('aria-label', '비밀번호 숨기기');
        } else {
          input.type = 'password';
          if (icon) icon.textContent = 'visibility';
          button.setAttribute('aria-label', '비밀번호 보기');
        }
      });
    });

    form.querySelectorAll('[data-owner-new-password], [data-owner-new-password-confirm]').forEach(function (input) {
      input.addEventListener('input', function () {
        input.value = trimPasswordLength(input.value);
        validateOwnerPasswordInputs(form, true);
        markChanged();
      });
    });

    form.querySelectorAll('[data-owner-profile-input="telno"], [data-owner-profile-input="zip"], [data-owner-profile-input="bizrno"], [data-owner-profile-input="corpRegNo"]').forEach(function (input) {
      input.addEventListener('input', function () {
        input.value = normalizeDigits(input.value);
        markChanged();
      });
    });

    form.querySelectorAll('[data-owner-profile-input="name"], [data-owner-profile-input="adres"], [data-owner-profile-input="detailAdres"]').forEach(function (input) {
      input.addEventListener('input', markChanged);
    });

    var localInput = form.querySelector('[data-owner-email-local]');
    var domainInput = form.querySelector('[data-owner-email-domain]');
    var domainSelect = form.querySelector('[data-owner-email-domain-select]');

    if (localInput) {
      localInput.addEventListener('input', function () {
        syncOwnerEmail(form);
        markChanged();
      });
    }
    if (domainInput) {
      domainInput.addEventListener('input', function () {
        syncOwnerEmail(form);
        markChanged();
      });
    }
    if (domainSelect) {
      domainSelect.addEventListener('change', function () {
        handleOwnerEmailDomainSelect(form);
        markChanged();
      });
    }

    var adresInput = form.querySelector('[data-owner-profile-input="adres"]');
    if (adresInput) {
      adresInput.addEventListener('change', function () {
        updateOwnerAddressMap(root, adresInput.value);
        markChanged();
      });
    }

    var smsCodeInput = form.querySelector('[data-owner-sms-code]');
    if (smsCodeInput) {
      smsCodeInput.addEventListener('input', function () {
        smsCodeInput.value = normalizeDigits(smsCodeInput.value).slice(0, 6);
      });
    }

    var smsSendButton = form.querySelector('[data-owner-sms-send]');
    if (smsSendButton) {
      smsSendButton.addEventListener('click', function () {
        if (!hasOwnerProfileChanges(root)) {
          updateOwnerSmsState(root);
          return;
        }
        if (isOwnerProfilePasswordFilled(form)) {
          var passwordValidation = validateOwnerPasswordInputs(form, true);
          if (passwordValidation) {
            setOwnerSmsMessage(root, passwordValidation, 'error');
            var passwordInput = form.querySelector('[data-owner-new-password]');
            if (passwordInput) passwordInput.focus();
            refreshOwnerSmsControls(root);
            return;
          }
        }

        smsSendButton.disabled = true;
        postForm(root, form, '/mypage/profile/password/sms-send.do', getOwnerSmsMessage(root), '인증번호를 발송하고 있습니다.')
          .then(function (data) {
            if (data && data.success) {
              root.setAttribute('data-owner-sms-verified', 'N');
              root.setAttribute('data-owner-sms-sent', 'Y');
              setOwnerSmsMessage(root, data.message || '인증번호를 발송했습니다.', 'success');
              if (smsCodeInput) {
                smsCodeInput.disabled = false;
                smsCodeInput.value = '';
                smsCodeInput.focus();
              }
              return;
            }
            root.setAttribute('data-owner-sms-verified', 'N');
            root.setAttribute('data-owner-sms-sent', 'N');
            setOwnerSmsMessage(root, (data && data.message) || '인증번호 발송에 실패했습니다.', 'error');
          })
          .catch(function () {
            root.setAttribute('data-owner-sms-verified', 'N');
            root.setAttribute('data-owner-sms-sent', 'N');
            setOwnerSmsMessage(root, '인증번호 발송 요청 중 오류가 발생했습니다.', 'error');
          })
          .finally(function () {
            refreshOwnerSmsControls(root);
          });
      });
    }

    var smsVerifyButton = form.querySelector('[data-owner-sms-verify]');
    if (smsVerifyButton) {
      smsVerifyButton.addEventListener('click', function () {
        if (!hasOwnerProfileChanges(root)) {
          updateOwnerSmsState(root);
          return;
        }
        if (!smsCodeInput || !/^[0-9]{6}$/.test(smsCodeInput.value)) {
          setOwnerSmsMessage(root, '인증번호는 숫자 6자리로 입력해 주세요.', 'error');
          if (smsCodeInput) smsCodeInput.focus();
          return;
        }

        smsVerifyButton.disabled = true;
        postForm(root, form, '/mypage/profile/password/sms-verify.do', getOwnerSmsMessage(root), '인증번호를 확인하고 있습니다.')
          .then(function (data) {
            if (data && data.success) {
              root.setAttribute('data-owner-sms-verified', 'Y');
              updateOwnerSmsState(root, data.message || 'SMS 인증이 완료되었습니다. 수정완료를 누르세요.', 'success');
              return;
            }
            root.setAttribute('data-owner-sms-verified', 'N');
            updateOwnerSmsState(root, (data && data.message) || 'SMS 인증에 실패했습니다.', 'error');
          })
          .catch(function () {
            root.setAttribute('data-owner-sms-verified', 'N');
            updateOwnerSmsState(root, 'SMS 인증 요청 중 오류가 발생했습니다.', 'error');
          })
          .finally(function () {
            refreshOwnerSmsControls(root);
          });
      });
    }
  }

  function getOwnerFormInput(form, key) {
    return form ? form.querySelector('[data-owner-profile-input="' + key + '"]') : null;
  }

  function focusInput(input) {
    if (input && typeof input.focus === 'function') {
      input.focus();
    }
  }

  function requireOwnerValue(form, messageEl, key, label) {
    var input = getOwnerFormInput(form, key);
    if (!input || !String(input.value || '').trim()) {
      setMessage(messageEl, label + '을(를) 입력해 주세요.', 'error');
      focusInput(input);
      return false;
    }
    return true;
  }

  function validateOwnerProfileForm(root, form, messageEl) {
    var passwordValidation = validateOwnerPasswordInputs(form, true);
    if (passwordValidation) {
      setMessage(messageEl, passwordValidation, 'error');
      focusInput(form.querySelector('[data-owner-new-password]'));
      return false;
    }

    if (!hasOwnerProfileChanges(root)) {
      updateOwnerSmsState(root);
      setMessage(messageEl, '수정할 항목이 없습니다.', 'warning');
      return false;
    }

    if (root.getAttribute('data-owner-sms-verified') !== 'Y') {
      updateOwnerSmsState(root, '수정완료 전 SMS 인증을 완료해 주세요.', 'error');
      var smsCodeInput = form.querySelector('[data-owner-sms-code]');
      if (smsCodeInput && !smsCodeInput.disabled) {
        smsCodeInput.focus();
      }
      return false;
    }

    ['telno', 'zip', 'bizrno', 'corpRegNo'].forEach(function (key) {
      var input = getOwnerFormInput(form, key);
      if (input) {
        input.value = normalizeDigits(input.value);
      }
    });

    if (!requireOwnerValue(form, messageEl, 'name', '이름 또는 상호명')) return false;
    if (!requireOwnerValue(form, messageEl, 'telno', '휴대전화')) return false;
    if (!requireOwnerValue(form, messageEl, 'zip', '우편번호')) return false;
    if (!requireOwnerValue(form, messageEl, 'adres', '기본주소')) return false;

    var phoneInput = getOwnerFormInput(form, 'telno');
    var phoneNo = phoneInput ? phoneInput.value : '';
    if (!/^01[0-9]{8,9}$/.test(phoneNo)) {
      setMessage(messageEl, '휴대전화는 01012345678 형식으로 입력해 주세요.', 'error');
      focusInput(phoneInput);
      return false;
    }

    var email = syncOwnerEmail(form);
    var localInput = form.querySelector('[data-owner-email-local]');
    var domainInput = form.querySelector('[data-owner-email-domain]');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage(messageEl, '이메일 형식을 확인해 주세요.', 'error');
      focusInput(!localInput || !localInput.value ? localInput : domainInput);
      return false;
    }

    var typeCd = root.getAttribute('data-owner-type-cd') || '';
    var bizrnoInput = getOwnerFormInput(form, 'bizrno');
    var corpRegNoInput = getOwnerFormInput(form, 'corpRegNo');
    var bizrno = bizrnoInput ? bizrnoInput.value : '';
    var corpRegNo = corpRegNoInput ? corpRegNoInput.value : '';

    if ((typeCd === 'OPERATOR' || typeCd === 'CORP') && !/^[0-9]{10}$/.test(bizrno)) {
      setMessage(messageEl, '사업자등록번호는 숫자 10자리로 입력해 주세요.', 'error');
      focusInput(bizrnoInput);
      return false;
    }
    if (typeCd === 'CORP' && !/^[0-9]{13}$/.test(corpRegNo)) {
      setMessage(messageEl, '법인등록번호는 숫자 13자리로 입력해 주세요.', 'error');
      focusInput(corpRegNoInput);
      return false;
    }

    return true;
  }

  function bindActorProfileFormControls(root) {
    if (!root || root.dataset.actorProfileControlsBound === 'Y') {
      return;
    }

    root.dataset.actorProfileControlsBound = 'Y';

    root.addEventListener('input', function (event) {
      var target = event.target;
      if (!target || !target.matches) {
        return;
      }

      if (target.matches('[data-actor-new-password], [data-actor-new-password-confirm]')) {
        target.value = trimPasswordLength(target.value);
        var form = getActorProfileForm(root);
        validateActorPasswordInputs(form, true);
        root.setAttribute('data-actor-password-sms-sent', 'N');
        root.setAttribute('data-actor-password-sms-verified', 'N');
        refreshActorPasswordControls(root);
        if (form && isActorProfilePasswordFilled(form)) {
          setActorPasswordMessage(root, '비밀번호 변경 전 SMS 인증이 필요합니다.', 'warning');
        }
        return;
      }

      if (target.matches('[data-actor-password-sms-code]')) {
        target.value = normalizeDigits(target.value).slice(0, 6);
      }

      if (target.matches('[data-actor-email-local], [data-actor-email-domain]')) {
        syncActorEmail(getActorProfileForm(root));
        var emailForm = getActorProfileForm(root);
        if (isBrokerProfileForm(emailForm)) {
          resetActorPasswordVerification(root);
        }
        return;
      }

      if (target.matches('input[name="zip"]')) {
        target.value = normalizeDigits(target.value).slice(0, 5);
        if (isBrokerProfileForm(getActorProfileForm(root))) {
          resetActorPasswordVerification(root);
        }
        return;
      }

      if (target.matches('input[name="adres"]')) {
        updateActorAddressMap(root, target.value);
        if (isBrokerProfileForm(getActorProfileForm(root))) {
          resetActorPasswordVerification(root);
        }
        return;
      }

      if (target.matches('input[name="name"], input[name="orgName"], input[name="bizrno"], input[name="brokerSpcltyCd"], input[name="detailAdres"]')) {
        if (isBrokerProfileForm(getActorProfileForm(root))) {
          resetActorPasswordVerification(root);
        }
      }
    });

    root.addEventListener('change', function (event) {
      var target = event.target;
      if (!target || !target.matches) {
        return;
      }

      if (target.matches('[data-actor-email-domain-select]')) {
        handleActorEmailDomainSelect(getActorProfileForm(root));
        if (isBrokerProfileForm(getActorProfileForm(root))) {
          resetActorPasswordVerification(root);
        }
      }
    });

    root.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) {
        return;
      }

      var toggleButton = target.closest('[data-actor-password-toggle]');
      if (toggleButton && root.contains(toggleButton)) {
        var wrap = toggleButton.closest('.tacs-actor-password-wrap');
        var input = wrap ? wrap.querySelector('input') : null;
        var icon = toggleButton.querySelector('.material-symbols-outlined');
        if (!input) {
          return;
        }
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.textContent = 'visibility_off';
          toggleButton.setAttribute('aria-label', '비밀번호 숨기기');
        } else {
          input.type = 'password';
          if (icon) icon.textContent = 'visibility';
          toggleButton.setAttribute('aria-label', '비밀번호 보기');
        }
        return;
      }

      var sendButton = target.closest('[data-actor-password-sms-send]');
      if (sendButton && root.contains(sendButton)) {
        var sendForm = getActorProfileForm(root);
        var sendMessage = getActorPasswordMessage(root);
        var brokerSms = isBrokerProfileForm(sendForm);
        if (brokerSms && !hasBrokerProfileChanges(root) && !isActorProfilePasswordFilled(sendForm)) {
          setActorPasswordMessage(root, '수정할 항목을 먼저 변경해 주세요.', 'warning');
          refreshActorPasswordControls(root);
          return;
        }
        var sendValidation = validateActorPasswordInputs(sendForm, true);
        if (sendValidation) {
          setActorPasswordMessage(root, sendValidation, 'error');
          focusInput(sendForm ? sendForm.querySelector('[data-actor-new-password]') : null);
          return;
        }

        sendButton.disabled = true;
        postForm(root, sendForm, '/mypage/profile/password/sms-send.do', sendMessage, '인증번호를 발송하고 있습니다.')
          .then(function (data) {
            if (data && data.success) {
              root.setAttribute('data-actor-password-sms-sent', 'Y');
              root.setAttribute('data-actor-password-sms-verified', 'N');
              refreshActorPasswordControls(root);
              setActorPasswordMessage(root, data.message || '인증번호를 발송했습니다.', 'success');
              var codeInput = sendForm ? sendForm.querySelector('[data-actor-password-sms-code]') : null;
              if (codeInput) {
                codeInput.disabled = false;
                codeInput.value = '';
                codeInput.focus();
              }
              return;
            }
            resetActorPasswordVerification(root);
            setActorPasswordMessage(root, (data && data.message) || '인증번호 발송에 실패했습니다.', 'error');
          })
          .catch(function () {
            resetActorPasswordVerification(root);
            setActorPasswordMessage(root, '인증번호 발송 요청 중 오류가 발생했습니다.', 'error');
          });
        return;
      }

      var addressButton = target.closest('[data-actor-address-search]');
      if (addressButton && root.contains(addressButton)) {
        var addressForm = getActorProfileForm(root);
        if (window.daum && window.daum.Postcode) {
          new window.daum.Postcode({
            oncomplete: function (data) {
              var zip = addressForm ? addressForm.querySelector('input[name="zip"]') : null;
              var adres = addressForm ? addressForm.querySelector('input[name="adres"]') : null;
              var detail = addressForm ? addressForm.querySelector('input[name="detailAdres"]') : null;
              var address = data.roadAddress || data.jibunAddress || '';
              var extraAddress = '';

              if (data.userSelectedType === 'R') {
                if (data.bname && /[동로가]$/g.test(data.bname)) {
                  extraAddress += data.bname;
                }
                if (data.buildingName && data.apartment === 'Y') {
                  extraAddress += extraAddress ? ', ' + data.buildingName : data.buildingName;
                }
                if (extraAddress) {
                  address += ' (' + extraAddress + ')';
                }
              }

              if (zip) zip.value = data.zonecode || '';
              if (adres) adres.value = address;
              updateActorAddressMap(root, address);
              if (isBrokerProfileForm(addressForm)) {
                resetActorPasswordVerification(root);
              }
              if (detail) detail.focus();
            }
          }).open();
          return;
        }
        alert('주소 검색 스크립트를 불러오지 못했습니다. 우편번호와 주소를 직접 입력해 주세요.');
        return;
      }

      var verifyButton = target.closest('[data-actor-password-sms-verify]');
      if (verifyButton && root.contains(verifyButton)) {
        var verifyForm = getActorProfileForm(root);
        var verifyMessage = getActorPasswordMessage(root);
        var authCodeInput = verifyForm ? verifyForm.querySelector('[data-actor-password-sms-code]') : null;

        if (!authCodeInput || !/^[0-9]{6}$/.test(authCodeInput.value)) {
          setActorPasswordMessage(root, '인증번호는 숫자 6자리로 입력해 주세요.', 'error');
          focusInput(authCodeInput);
          return;
        }

        verifyButton.disabled = true;
        postForm(root, verifyForm, '/mypage/profile/password/sms-verify.do', verifyMessage, '인증번호를 확인하고 있습니다.')
          .then(function (data) {
            if (data && data.success) {
              root.setAttribute('data-actor-password-sms-verified', 'Y');
              refreshActorPasswordControls(root);
              setActorPasswordMessage(root, data.message || 'SMS 인증이 완료되었습니다. 저장을 눌러 주세요.', 'success');
              return;
            }
            root.setAttribute('data-actor-password-sms-verified', 'N');
            refreshActorPasswordControls(root);
            setActorPasswordMessage(root, (data && data.message) || 'SMS 인증에 실패했습니다.', 'error');
          })
          .catch(function () {
            root.setAttribute('data-actor-password-sms-verified', 'N');
            refreshActorPasswordControls(root);
            setActorPasswordMessage(root, 'SMS 인증 요청 중 오류가 발생했습니다.', 'error');
          });
      }
    });
  }

  function showPasswordCheck(root, messageText, messageType) {
    var passwordArea = root.querySelector('[data-mypage-password-area]');
    var profileArea = root.querySelector('[data-mypage-profile-area]');
    var ownerForm = root.querySelector('[data-mypage-owner-form]');
    var genericForm = root.querySelector('[data-mypage-generic-form]');
    var passwordInput = root.querySelector('#mypage-current-password');
    var message = root.querySelector('[data-mypage-password-message]');

    if (profileArea) {
      profileArea.hidden = true;
      profileArea.style.display = 'none';
    }
    if (ownerForm) {
      ownerForm.hidden = true;
      ownerForm.style.display = 'none';
    }
    if (genericForm) {
      genericForm.hidden = true;
      genericForm.style.display = 'none';
    }
    if (passwordArea) {
      passwordArea.hidden = false;
      passwordArea.style.display = '';
    }
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.focus();
    }
    root.setAttribute('data-actor-password-sms-sent', 'N');
    root.setAttribute('data-actor-password-sms-verified', 'N');
    setPasswordChangeEnabled(root, false);
    setMessage(message, messageText || '현재 비밀번호를 다시 입력해 주세요.', messageType || 'warning');
    replaceCurrentMyPageHistory(root, 'profile', 'password');
  }

  function renderProfile(root, profile, customMessage, messageType) {
    profile = profile || {};

    var passwordArea = root.querySelector('[data-mypage-password-area]');
    var profileArea = root.querySelector('[data-mypage-profile-area]');
    var ownerForm = root.querySelector('[data-mypage-owner-form]');
    var genericForm = root.querySelector('[data-mypage-generic-form]');
    var fieldsArea = root.querySelector('[data-mypage-profile-fields]');

    if (!profileArea) {
      return;
    }

    if (passwordArea) {
      passwordArea.hidden = true;
      passwordArea.style.display = 'none';
    }

    profileArea.hidden = false;
    profileArea.style.display = 'block';

    if (profile.roleCd === 'OWNER' && ownerForm) {
      ownerForm.hidden = false;
      ownerForm.style.display = 'block';
      if (genericForm) {
        genericForm.hidden = true;
        genericForm.style.display = 'none';
      }
      populateOwnerProfile(root, profile);
      var ownerMessage = ownerForm.querySelector('[data-mypage-profile-message]');
      setMessage(ownerMessage, customMessage || '', customMessage ? (messageType || 'success') : '');
      resetPasswordChangeArea(root, profile);
      return;
    }

    if (ownerForm) {
      ownerForm.hidden = true;
      ownerForm.style.display = 'none';
    }
    if (genericForm) {
      genericForm.hidden = false;
      genericForm.style.display = 'block';
    }
    var actorForm = genericForm ? genericForm.querySelector('.tacs-actor-profile-form') : null;
    if (actorForm) {
      actorForm.classList.toggle('is-officer-profile', profile.roleCd === 'OFFICER' || profile.typeCd === 'FIELD_OFFICER');
      actorForm.classList.toggle('is-broker-profile', profile.roleCd === 'BROKER');
      actorForm.classList.add('is-sms-required-profile');
    }
    if (fieldsArea) {
      fieldsArea.innerHTML = buildProfileFields(profile).join('');
    }
    if (genericForm) {
      actorAddressMap = null;
      actorAddressMarker = null;
      actorAddressGeocoder = null;
      splitActorEmail(genericForm);
      captureBrokerProfileSnapshot(root);
      updateActorAddressMap(root, profile.adres);
    }
    bindProfileReset(root);
    root.setAttribute('data-actor-password-sms-sent', 'N');
    root.setAttribute('data-actor-password-sms-verified', 'N');
    refreshActorPasswordControls(root);

    var message = genericForm ? genericForm.querySelector('[data-mypage-profile-message]') : root.querySelector('[data-mypage-profile-message]');
    resetPasswordChangeArea(root, profile);
  }

  function loadProfile(root, messageEl, options) {
    options = options || {};
    var actorPath = root.getAttribute('data-actor-path') || '';
    if (!actorPath) {
      setMessage(messageEl, '마이페이지 경로 정보를 찾을 수 없습니다.', 'error');
      return;
    }

    setMessage(messageEl, '회원정보를 불러오고 있습니다.', 'warning');

    fetch(getContextPath() + '/' + actorPath + '/mypage/profile/edit.do', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        if (data && data.success) {
          renderProfile(root, data.data || {});
          if (options.pushProfileState) {
            pushProfileMyPageHistory(root);
          }
          return;
        }
        setMessage(messageEl, (data && data.message) || '회원정보 조회에 실패했습니다.', 'error');
      })
      .catch(function () {
        setMessage(messageEl, '회원정보 조회 요청 중 오류가 발생했습니다.', 'error');
      });
  }

  function handlePasswordFormSubmit(event, explicitForm) {
    event.preventDefault();
    var form = explicitForm || event.currentTarget;
    var root = document.getElementById('tacsMypage');
    if (!root || !form) return;

    var message = root.querySelector('[data-mypage-password-message]');
    var passwordInput = root.querySelector('#mypage-current-password');
    var submitButton = form.querySelector('button[type="submit"]');

    var actorPath = root.getAttribute('data-actor-path') || '';
    if (!actorPath) {
      setMessage(message, '마이페이지 경로 정보를 찾을 수 없습니다.', 'error');
      return;
    }

    if (!passwordInput || !passwordInput.value) {
      setMessage(message, '현재 비밀번호를 입력해 주세요.', 'error');
      if (passwordInput) {
        passwordInput.focus();
      }
      return;
    }

    var url = getContextPath() + '/' + actorPath + '/mypage/profile/password-check.do';
    var body = new URLSearchParams(new FormData(form));

    if (submitButton) {
      submitButton.disabled = true;
    }
    setMessage(message, '비밀번호를 확인하고 있습니다.', 'warning');

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: body.toString()
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        if (data && data.success) {
          setMessage(message, data.message || '비밀번호 확인이 완료되었습니다.', 'success');
          form.classList.add('is-verified');
          loadProfile(root, message, { pushProfileState: true });
          return;
        }

        setMessage(message, (data && data.message) || '비밀번호 확인에 실패했습니다.', 'error');
      })
      .catch(function () {
        setMessage(message, '비밀번호 확인 요청 중 오류가 발생했습니다.', 'error');
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
  }

  function bindPasswordForm(root) {
    var form = root.querySelector('[data-mypage-password-form]');
    if (!form || form.dataset.mypageBound === 'Y') {
      return;
    }

    form.dataset.mypageBound = 'Y';
    form.addEventListener('submit', function (event) {
      handlePasswordFormSubmit(event, form);
    });
  }

  function bindProfileForm(root) {
    root.querySelectorAll('[data-mypage-profile-form]').forEach(function (form) {
      if (!form || form.dataset.mypageBound === 'Y') {
        return;
      }

      var message = form.querySelector('[data-mypage-profile-message]') || root.querySelector('[data-mypage-profile-message]');

      form.dataset.mypageBound = 'Y';
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var submitButton = event.submitter && event.submitter.matches('[data-mypage-profile-save]')
          ? event.submitter
          : form.querySelector('[data-mypage-profile-save]');

        var actorPath = root.getAttribute('data-actor-path') || '';
        if (!actorPath) {
          setMessage(message, '마이페이지 경로 정보를 찾을 수 없습니다.', 'error');
          return;
        }

        var ownerPasswordFilled = false;
        var actorPasswordFilled = false;
        if (isOwnerProfileForm(form)) {
          if (!validateOwnerProfileForm(root, form, message)) {
            return;
          }
          ownerPasswordFilled = isOwnerProfilePasswordFilled(form);
        } else if (isActorProfileForm(form)) {
          actorPasswordFilled = isActorProfilePasswordFilled(form);
          if (isBrokerProfileForm(form) && (hasBrokerProfileChanges(root) || actorPasswordFilled) && root.getAttribute('data-actor-password-sms-verified') !== 'Y') {
            setMessage(message, '저장 전 SMS 인증을 완료해 주세요.', 'error');
            setActorPasswordMessage(root, '저장 전 SMS 인증을 완료해 주세요.', 'error');
            var brokerSmsCodeInput = form.querySelector('[data-actor-password-sms-code]');
            if (brokerSmsCodeInput && !brokerSmsCodeInput.disabled) {
              brokerSmsCodeInput.focus();
            }
            return;
          }
          if (actorPasswordFilled && !validateActorPasswordBeforeSubmit(root, form, message)) {
            return;
          }
        }

        var url = getContextPath() + '/' + actorPath + '/mypage/profile/modify.do';
        var body = createProfileModifyBody(form, actorPasswordFilled);

        if (submitButton) {
          submitButton.disabled = true;
        }
        setMessage(message, '회원정보를 저장하고 있습니다.', 'warning');

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: body.toString()
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error('HTTP ' + response.status);
            }
            return response.json();
          })
          .then(function (data) {
            if (data && data.success) {
              if (ownerPasswordFilled) {
                var ownerPwMessage = data.message || '회원정보와 비밀번호가 수정되었습니다. 다시 비밀번호 확인 후 회원정보 수정이 가능합니다.';
                window.alert(ownerPwMessage);
                showPasswordCheck(root, ownerPwMessage, 'success');
                return;
              }
              if (actorPasswordFilled) {
                return postForm(root, form, '/mypage/profile/password/modify.do', message, '비밀번호를 변경하고 있습니다.')
                  .then(function (passwordData) {
                    if (passwordData && passwordData.success) {
                      var actorPwMessage = passwordData.message || '회원정보와 비밀번호가 수정되었습니다. 다시 비밀번호 확인 후 회원정보 수정이 가능합니다.';
                      window.alert(actorPwMessage);
                      showPasswordCheck(root, actorPwMessage, 'success');
                      return;
                    }
                    setMessage(message, (passwordData && passwordData.message) || '비밀번호 변경에 실패했습니다.', 'error');
                  });
              }
              var profileMessage = data.message || '회원정보가 수정되었습니다.';
              // 수정 성공 alert → 확인 누르면(=alert는 동기 호출) 비밀번호 확인창으로 복귀
              window.alert(profileMessage);
              showPasswordCheck(root, profileMessage, 'success');
              return;
            }
            setMessage(message, (data && data.message) || '회원정보 저장에 실패했습니다.', 'error');
          })
          .catch(function () {
            setMessage(message, isOwnerProfileForm(form) ? '회원정보 저장 요청 중 오류가 발생했습니다.' : '회원정보 저장 또는 비밀번호 변경 요청 중 오류가 발생했습니다.', 'error');
          })
          .finally(function () {
            if (submitButton) {
              submitButton.disabled = false;
            }
          });
      });
    });
  }

  function postForm(root, form, pathSuffix, messageEl, loadingMessage) {
    var actorPath = root.getAttribute('data-actor-path') || '';
    if (!actorPath) {
      setMessage(messageEl, '마이페이지 경로 정보를 찾을 수 없습니다.', 'error');
      return Promise.reject(new Error('actorPath missing'));
    }

    setMessage(messageEl, loadingMessage || '요청을 처리하고 있습니다.', 'warning');

    return fetch(getContextPath() + '/' + actorPath + pathSuffix, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.json();
      });
  }

  function bindPasswordSmsSend(root) {
    var form = root.querySelector('[data-mypage-sms-send-form]');
    var message = root.querySelector('[data-mypage-password-change-message]');
    var button = root.querySelector('[data-mypage-sms-send]');

    if (!form || form.dataset.mypageBound === 'Y') {
      return;
    }

    form.dataset.mypageBound = 'Y';
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (button) button.disabled = true;

      postForm(root, form, '/mypage/profile/password/sms-send.do', message, '인증번호를 발송하고 있습니다.')
        .then(function (data) {
          if (data && data.success) {
            var phoneEl = root.querySelector('[data-mypage-password-phone]');
            if (phoneEl && data.data && data.data.maskedPhoneNo) {
              phoneEl.textContent = data.data.maskedPhoneNo;
            }
            setMessage(message, data.message || '인증번호를 발송했습니다.', 'success');
            return;
          }
          setMessage(message, (data && data.message) || '인증번호 발송에 실패했습니다.', 'error');
        })
        .catch(function () {
          setMessage(message, '인증번호 발송 요청 중 오류가 발생했습니다.', 'error');
        })
        .finally(function () {
          if (button) button.disabled = false;
        });
    });
  }

  function bindPasswordSmsVerify(root) {
    var form = root.querySelector('[data-mypage-sms-verify-form]');
    var message = root.querySelector('[data-mypage-password-change-message]');
    var button = root.querySelector('[data-mypage-sms-verify]');
    var authCodeInput = root.querySelector('#mypage-sms-auth-code');

    if (!form || form.dataset.mypageBound === 'Y') {
      return;
    }

    form.dataset.mypageBound = 'Y';
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!authCodeInput || !authCodeInput.value || !/^[0-9]{6}$/.test(authCodeInput.value)) {
        setMessage(message, '인증번호는 숫자 6자리로 입력해 주세요.', 'error');
        if (authCodeInput) authCodeInput.focus();
        return;
      }

      if (button) button.disabled = true;
      postForm(root, form, '/mypage/profile/password/sms-verify.do', message, '인증번호를 확인하고 있습니다.')
        .then(function (data) {
          if (data && data.success) {
            setPasswordChangeEnabled(root, true);
            setMessage(message, data.message || 'SMS 인증이 완료되었습니다. 새 비밀번호를 입력해 주세요.', 'success');
            var newPasswordInput = root.querySelector('[data-mypage-password-change-form] input[name="newPassword"]');
            if (newPasswordInput) newPasswordInput.focus();
            return;
          }
          setPasswordChangeEnabled(root, false);
          setMessage(message, (data && data.message) || 'SMS 인증에 실패했습니다.', 'error');
        })
        .catch(function () {
          setPasswordChangeEnabled(root, false);
          setMessage(message, 'SMS 인증 요청 중 오류가 발생했습니다.', 'error');
        })
        .finally(function () {
          if (button) button.disabled = false;
        });
    });
  }

  function validateNewPassword(root) {
    var form = root.querySelector('[data-mypage-password-change-form]');
    var newPassword = form ? form.querySelector('input[name="newPassword"]') : null;
    var newPasswordConfirm = form ? form.querySelector('input[name="newPasswordConfirm"]') : null;

    if (!newPassword || !newPasswordConfirm || !newPassword.value || !newPasswordConfirm.value) {
      return '새 비밀번호와 새 비밀번호 확인을 모두 입력해 주세요.';
    }
    if (newPassword.value !== newPasswordConfirm.value) {
      return '새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.';
    }
    if (newPassword.value.indexOf(' ') >= 0) {
      return '비밀번호에는 공백을 사용할 수 없습니다.';
    }
    if (newPassword.value.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }

    if (getPasswordLengthUnits(newPassword.value) > 16) {
      return '비밀번호는 영문 기준 16자, 한글 기준 8자 이내로 입력해 주세요.';
    }

    var typeCount = 0;
    if (/[A-Za-z]/.test(newPassword.value)) typeCount++;
    if (/[0-9]/.test(newPassword.value)) typeCount++;
    if (/[^A-Za-z0-9]/.test(newPassword.value)) typeCount++;
    if (typeCount < 2) {
      return '비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 조합해야 합니다.';
    }
    return null;
  }

  function bindPasswordChange(root) {
    var form = root.querySelector('[data-mypage-password-change-form]');
    var message = root.querySelector('[data-mypage-password-change-message]');
    var button = root.querySelector('[data-mypage-password-change]');

    if (!form || form.dataset.mypageBound === 'Y') {
      return;
    }

    form.dataset.mypageBound = 'Y';
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      form.querySelectorAll('input[name="newPassword"], input[name="newPasswordConfirm"]').forEach(function (input) {
        input.value = trimPasswordLength(input.value);
      });

      var validationMessage = validateNewPassword(root);
      if (validationMessage) {
        setMessage(message, validationMessage, 'error');
        return;
      }

      if (button) button.disabled = true;
      postForm(root, form, '/mypage/profile/password/modify.do', message, '비밀번호를 변경하고 있습니다.')
        .then(function (data) {
          if (data && data.success) {
            setMessage(message, data.message || '비밀번호가 변경되었습니다.', 'success');
            var profileArea = root.querySelector('[data-mypage-profile-area]');
            var passwordArea = root.querySelector('[data-mypage-password-area]');
            var currentPassword = root.querySelector('#mypage-current-password');
            if (profileArea) profileArea.hidden = true;
            if (passwordArea) passwordArea.hidden = false;
            if (currentPassword) currentPassword.value = '';
            setPasswordChangeEnabled(root, false);
            var passwordMessage = root.querySelector('[data-mypage-password-message]');
            setMessage(passwordMessage, data.message || '비밀번호가 변경되었습니다. 다시 확인해 주세요.', 'success');
            return;
          }
          setMessage(message, (data && data.message) || '비밀번호 변경에 실패했습니다.', 'error');
          if (button) button.disabled = false;
        })
        .catch(function () {
          setMessage(message, '비밀번호 변경 요청 중 오류가 발생했습니다.', 'error');
          if (button) button.disabled = false;
        });
    });
  }

  function bindBackButton(root) {
    var backButton = root.querySelector('[data-mypage-back]');
    if (!backButton || backButton.dataset.mypageBound === 'Y') {
      return;
    }

    backButton.dataset.mypageBound = 'Y';
    backButton.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      }
    });
  }

  function bindProfileReset(root) {
    root.querySelectorAll('[data-mypage-profile-reset]').forEach(function (resetButton) {
      if (!resetButton || resetButton.dataset.mypageBound === 'Y') {
        return;
      }

      resetButton.dataset.mypageBound = 'Y';
      resetButton.addEventListener('click', function () {
        showPasswordCheck(root, '현재 비밀번호를 다시 입력해 주세요.', 'warning');
      });
    });
  }

  function bindMyPageHistory(root) {
    if (!window.history || root.dataset.mypageHistoryBound === 'Y') {
      return;
    }

    root.dataset.mypageHistoryBound = 'Y';
    window.addEventListener('popstate', function (event) {
      var state = event.state;
      if (!state || !state.tacsMypage) {
        return;
      }
      if (state.actorPath && state.actorPath !== (root.getAttribute('data-actor-path') || '')) {
        return;
      }

      syncTab(root, state.tab || 'profile', false);

      if (normalizeTab(state.tab) !== 'profile') {
        return;
      }

      if (state.view === 'password') {
        showPasswordCheck(root, '현재 비밀번호를 다시 입력해 주세요.', 'warning');
        return;
      }

      if (state.view === 'profile') {
        showPasswordCheck(root, '현재 비밀번호를 다시 입력해 주세요.', 'warning');
      }
    });
  }

  function init(rootArg) {
    var root = rootArg || document.getElementById('tacsMypage');
    if (!root) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialTab = normalizeTab(params.get('tab') || root.getAttribute('data-initial-tab'));

    bindTabs(root);
    bindPasswordForm(root);
    bindProfileForm(root);
    bindPasswordSmsSend(root);
    bindPasswordSmsVerify(root);
    bindPasswordChange(root);
    bindBackButton(root);
    bindProfileReset(root);
    bindOwnerProfileFormControls(root);
    bindOwnerAddressSearch(root);
    bindActorProfileFormControls(root);
    bindMyPageHistory(root);
    syncTab(root, initialTab, false);
    replaceCurrentMyPageHistory(root, initialTab, initialTab === 'alarm' ? 'alarm' : getVisibleMyPageView(root));
  }

  window.TacsMyPage = {
    init: init,
    syncTab: function (tab) {
      var root = document.getElementById('tacsMypage');
      if (root) {
        syncTab(root, tab, true);
      }
    }
  };

  document.addEventListener('submit', function (event) {
    var targetForm = event.target;
    if (!targetForm || !targetForm.hasAttribute('data-mypage-password-form')) {
      return;
    }

    if (targetForm.dataset.mypageBound !== 'Y') {
      event.preventDefault();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
      targetForm.dataset.mypageBound = 'Y';
      handlePasswordFormSubmit(event, targetForm);
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    window.addEventListener('load', function () { init(); });
  } else {
    init();
    setTimeout(function () { init(); }, 100);
  }
})();
