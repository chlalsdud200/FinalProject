/* ===== 운송담당자 커뮤니티 URL 정리 v2(page=TACS-CM-* -> tab=*) =====
 * 화면 내부 item ID는 기존 TACS-CM-*를 그대로 쓰고,
 * 주소창/관리자 URL만 tab=notice/data/cs 형태로 유지한다.
 */
function getTransportCommunityLegacyPageToTab(page) {
  if (page === 'TACS-CM-003') return 'data';
  if (page === 'TACS-CM-004' || page === 'TACS-CM-002') return 'cs';
  if (page === 'TACS-CM-001') return 'notice';
  return '';
}


function getTransportCommunityTabByItem(itemId) {
  if (itemId === 'TACS-CM-003') return 'data';
  if (itemId === 'TACS-CM-004' || itemId === 'TACS-CM-002') return 'cs';
  return 'notice';
}

function normalizeTransportCommunityLegacyUrl(rawUrl) {
  if (rawUrl === null || typeof rawUrl === 'undefined') return rawUrl;
  if (typeof rawUrl !== 'string') return rawUrl;

  try {
    const url = new URL(rawUrl, window.location.href);
    if (!/\/transport\/community\.do$/.test(url.pathname)) return rawUrl;

    const legacyTab = getTransportCommunityLegacyPageToTab(url.searchParams.get('page'));
    if (!legacyTab) return rawUrl;

    const orderedParams = new URLSearchParams();
    orderedParams.set('tab', legacyTab);
    url.searchParams.forEach(function(value, key) {
      if (key !== 'page' && key !== 'tab') orderedParams.append(key, value);
    });
    url.search = orderedParams.toString();
    return url.pathname + url.search + url.hash;
  } catch (e) {
    return rawUrl;
  }
}

function normalizeCurrentTransportCommunityUrl() {
  if (!window.history || !window.history.replaceState) return;
  const current = window.location.pathname + window.location.search + window.location.hash;
  const fixed = normalizeTransportCommunityLegacyUrl(current);
  if (typeof fixed === 'string' && fixed && fixed !== current) {
    window.history.replaceState(null, '', fixed);
  }
}

(function patchTransportCommunityUrlOnce() {
  normalizeCurrentTransportCommunityUrl();

  if (!window.__transportCommunityHistoryUrlPatched && window.history) {
    window.__transportCommunityHistoryUrlPatched = true;
    ['replaceState', 'pushState'].forEach(function(method) {
      const original = window.history[method];
      if (typeof original !== 'function') return;
      window.history[method] = function(state, title, url) {
        if (arguments.length >= 3) url = normalizeTransportCommunityLegacyUrl(url);
        const result = original.call(window.history, state, title, url);
        setTimeout(normalizeCurrentTransportCommunityUrl, 0);
        return result;
      };
    });
  }

  function fixForm(form) {
    if (!form) return;
    try {
      const actionUrl = new URL(form.getAttribute('action') || window.location.href, window.location.href);
      if (!/\/transport\/community\.do$/.test(actionUrl.pathname)) return;

      const pageField = form.querySelector('[name="page"]');
      let tabField = form.querySelector('[name="tab"]');
      const tabValue = (pageField && getTransportCommunityLegacyPageToTab(pageField.value))
        || getTransportCommunityLegacyPageToTab(actionUrl.searchParams.get('page'))
        || window.TRANSPORT_INITIAL_COMMUNITY_TAB
        || 'notice';

      if (!tabField) {
        tabField = document.createElement('input');
        tabField.type = 'hidden';
        tabField.name = 'tab';
        form.appendChild(tabField);
      }
      tabField.value = tabValue;
      if (pageField) pageField.disabled = true;

      actionUrl.searchParams.delete('page');
      actionUrl.searchParams.set('tab', tabValue);
      form.setAttribute('action', actionUrl.pathname + actionUrl.search);
    } catch (e) {}
  }

  document.addEventListener('submit', function(e) {
    fixForm(e.target);
  }, true);

  document.addEventListener('click', function(e) {
    const link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!link) return;
    const before = link.getAttribute('href');
    const fixed = normalizeTransportCommunityLegacyUrl(before);
    if (fixed && fixed !== before) link.setAttribute('href', fixed);
  }, true);

  document.addEventListener('DOMContentLoaded', function() {
    normalizeCurrentTransportCommunityUrl();
    document.querySelectorAll('form').forEach(fixForm);
  });

  [0, 50, 200, 700, 1500, 3000].forEach(function(ms) {
    setTimeout(normalizeCurrentTransportCommunityUrl, ms);
  });
})();







/* ===== transport community shared assets ===== */
var __transportCommunityAssetPromises = window.__transportCommunityAssetPromises || {};
window.__transportCommunityAssetPromises = __transportCommunityAssetPromises;

function clearTransportCommunitySavedState(){
  try {
    Object.keys(sessionStorage).forEach(function(key){
      if (key.indexOf('TACS_TRANSPORT_VIEW_STATE__community__') === 0) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (e) {}
}
clearTransportCommunitySavedState();

function transportContextPath(){
  if (window.contextPath) return window.contextPath;
  const meta = document.querySelector('meta[name="ctx-path"]');
  return meta && meta.content ? meta.content : '';
}

function loadTransportCommunityCss(href){
  const base = transportContextPath();
  const fullHref = base + href;
  const key = 'css:' + href.split('?')[0];
  if (document.querySelector('link[data-transport-community-asset="' + key + '"]')) return;
  if (Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(link => (link.getAttribute('href') || '').indexOf(href.split('?')[0]) > -1)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fullHref;
  link.dataset.transportCommunityAsset = key;
  document.head.appendChild(link);
}

function loadTransportCommunityScript(src, readyCheck){
  if (typeof readyCheck === 'function' && readyCheck()) return Promise.resolve();
  const key = src.split('?')[0];
  if (__transportCommunityAssetPromises[key]) return __transportCommunityAssetPromises[key];
  const existing = Array.from(document.querySelectorAll('script[src]')).find(script => (script.getAttribute('src') || '').indexOf(key) > -1);
  if (existing) {
    __transportCommunityAssetPromises[key] = new Promise(function(resolve){
      if (typeof readyCheck === 'function' && readyCheck()) {
        resolve();
        return;
      }

      let attempts = 0;
      const done = function(){
        resolve();
      };
      const waitUntilReady = function(){
        if (typeof readyCheck !== 'function' || readyCheck() || attempts++ > 50) {
          resolve();
          return;
        }
        setTimeout(waitUntilReady, 40);
      };

      existing.addEventListener('load', done, { once: true });
      existing.addEventListener('error', done, { once: true });
      waitUntilReady();
    });
    return __transportCommunityAssetPromises[key];
  }
  __transportCommunityAssetPromises[key] = new Promise(function(resolve){
    const script = document.createElement('script');
    script.src = transportContextPath() + src;
    script.async = false;
    script.onload = resolve;
    script.onerror = function(){
      console.error('운송담당자 커뮤니티 공통 스크립트 로드 실패:', src);
      resolve();
    };
    document.head.appendChild(script);
  });
  return __transportCommunityAssetPromises[key];
}

function ensureTransportCommunityAssets(){
loadTransportCommunityCss('/resources/css/transport/pages/community.css?v=20260602');
  loadTransportCommunityCss('/resources/css/common/resourceArchive.css?v=20260602');
  return Promise.all([
    loadTransportCommunityScript('/resources/js/common/notice.js?v=20260602', function(){ return typeof window.initCommonNotice === 'function'; }),
    loadTransportCommunityScript('/resources/js/common/faq.js?v=20260602', function(){ return typeof window.initCommonFaq === 'function'; }),
    loadTransportCommunityScript('/resources/js/common/resourceArchive.js?v=20260602', function(){ return !!window.TacsResourceArchive; })
  ]);
}

function getTransportCommunityTargetByItem(itemId){
  if (itemId === 'TACS-CM-003') return 'download';
  if (itemId === 'TACS-CM-004') return 'cs';
  return 'notice';
}


function mountTransportNoticePanel(){
  const panel = document.getElementById('cm-notice');
  if (!panel) return;
  ensureTransportCommunityAssets().then(function(){
    if (typeof window.initCommonNotice === 'function') window.initCommonNotice();
    else if (typeof window.renderNoticeList === 'function') window.renderNoticeList();
  });
}

function buildTransportFaqShell(){
  return ''
      + '<div class="section-card overflow-hidden bg-white">'
      + '  <div class="p-6" data-faq-root>'
      + '    <div class="tacs-faq-info-bar"><span class="material-symbols-outlined" style="font-size:18px">support_agent</span> 자주 묻는 질문(FAQ)을 확인하실 수 있습니다.</div>'
      + '    <div id="faq-container" class="tacs-faq-container"></div>'
      + '    <div id="faq-pagination" class="tacs-faq-pagination"></div>'
      + '  </div>'
      + '</div>';
}

function mountTransportFaqPanel(){
  const panel = document.getElementById('cm-cs');
  if (!panel) return;
  const template = document.getElementById('transport-faq-template');
  if (template && panel.dataset.templateLoaded !== 'Y') {
    panel.innerHTML = template.innerHTML;
    panel.dataset.templateLoaded = 'Y';
  } else if (!panel.querySelector('[data-faq-root], #faq-container, .tacs-faq-container')) {
    panel.innerHTML = buildTransportFaqShell();
    panel.dataset.templateLoaded = 'Y';
  }
  ensureTransportCommunityAssets().then(function(){
    if (typeof window.renderFaqList === 'function') {
      // root가 확실히 DOM에 붙은 뒤에 호출되도록 함
      setTimeout(function(){
        window.renderFaqList(1);
      }, 0);
    } else {
      bootTransportFaqPanel();
    }
  });
}

function bootTransportFaqPanel(attempt){
  const panel = document.getElementById('cm-cs');
  if (!panel) return;

  attempt = attempt || 0;
  if (typeof window.initCommonFaq === 'function') {
    window.initCommonFaq();
    return; // Stop retrying if initialized
  }

  if (attempt >= 20) return;

  setTimeout(function(){
    bootTransportFaqPanel(attempt + 1);
  }, 100);
}

function buildTransportResourceArchiveShell(){
  return ''
      + '<div class="section-card overflow-hidden bg-white">'
      + '  <div class="p-6">'
      + '    <div class="resource-archive-wrap" data-context-path="' + transportContextPath() + '">'
      + '      <div class="resource-archive-toolbar">'
      + '        <input id="res-archive-from" type="date" title="시작일">'
      + '        <span class="resource-archive-sep">~</span>'
      + '        <input id="res-archive-to" type="date" title="종료일">'
      + '        <input id="res-archive-keyword" type="text" placeholder="자료명 또는 파일명 검색">'
      + '        <button type="button" id="res-archive-search-btn">조회</button>'
      + '      </div>'
      + '      <table class="resource-archive-table">'
      + '        <thead>'
      + '          <tr>'
      + '            <th style="width:80px">번호</th>'
      + '            <th style="width:34%">자료명</th>'
      + '            <th style="width:300px">파일명</th>'
      + '            <th style="width:100px">용량</th>'
      + '            <th style="width:120px">등록일</th>'
      + '            <th style="width:100px">다운로드</th>'
      + '          </tr>'
      + '        </thead>'
      + '        <tbody id="res-archive-tbody">'
      + '          <tr><td colspan="6" class="resource-archive-empty">자료를 조회 중입니다.</td></tr>'
      + '        </tbody>'
      + '      </table>'
      + '    </div>'
      + '  </div>'
      + '</div>';
}

function mountTransportResourceArchivePanel(){
  const panel = document.getElementById('cm-download');
  if (!panel) return;
  const template = document.getElementById('transport-resource-archive-template');
  if (template && panel.dataset.templateLoaded !== 'Y') {
    panel.innerHTML = template.innerHTML;
    panel.dataset.templateLoaded = 'Y';
  } else if (!panel.querySelector('.resource-archive-wrap')) {
    panel.innerHTML = buildTransportResourceArchiveShell();
    panel.dataset.templateLoaded = 'Y';
  }
  ensureTransportCommunityAssets().then(function(){
    if (window.TacsResourceArchive) {
      window.TacsResourceArchive.bind();
      window.TacsResourceArchive.load();
    }
  });
}

function buildBrokerCommunityPanel(){
  clearTransportCommunitySavedState();
  ensureTransportCommunityAssets();
  return `
<div class="broker-scope transport-community-scope">
  <div class="page active" id="pg-community">
    <div class="breadcrumb"><span onclick="go('dash')">Home</span><span class="sep">›</span><span>커뮤니티</span></div>
    <div class="sub-page">
      <h2><span class="material-symbols-outlined">forum</span> 커뮤니티</h2>
      <div class="sub-tabs" id="tabs-cm">
        <button type="button" class="sub-tab active" onclick="cTab('cm','notice')">공지사항</button>
        <button type="button" class="sub-tab" onclick="cTab('cm','download')">자료실</button>
        <button type="button" class="sub-tab" onclick="cTab('cm','cs')">고객센터</button>
      </div>

      <div id="cm-notice">
        <div class="alert-bar info"><span class="material-symbols-outlined" style="font-size:18px">campaign</span> TACS 시스템 공지사항 및 운송 업무 안내를 확인하세요.</div>
      </div>

      <div id="cm-download" style="display:none"></div>

      <div id="cm-cs" style="display:none">
      </div>
    </div>
  </div>
</div>`;
}
function buildBrokerMyPagePanel(){
  return "<div class=\"broker-scope\">\n<div class=\"page active\" id=\"pg-mypage\">\n<div class=\"breadcrumb\"><span onclick=\"go('dash')\">Home</span><span class=\"sep\">›</span><span>마이페이지</span></div>\n<div class=\"sub-page\">\n<h2><span class=\"material-symbols-outlined\">person</span> 마이페이지</h2>\n<div class=\"sub-tabs\" id=\"tabs-my\">\n<button class=\"sub-tab active\" onclick=\"cTab('my','profile')\">개인정보 관리</button>\n</div>\n\n<!-- 개인정보 관리 -->\n<div id=\"my-profile\">\n<div class=\"profile-card\">\n  <div class=\"profile-avatar\">김</div>\n  <div class=\"profile-info\">\n    <h3>운송담당자 김운송</h3>\n    <div class=\"role-tag\">TACS 운송관리팀 · 담당자번호 TR-20241</div>\n    <div class=\"profile-meta\">\n      <div>아이디: <span>kimtr</span></div>\n      <div>이메일: <span>kimtr@transport.com</span></div>\n      <div>연락처: <span>032-123-4567</span></div>\n      <div>소속: <span>노태호 운송관리팀</span></div>\n      <div>가입일: <span>2024-01-15</span></div>\n      <div>최근 로그인: <span id=\"lastLogin\">2026-04-17 09:32</span></div>\n    </div>\n  </div>\n</div>\n\n<div class=\"edit-form\">\n  <h4><span class=\"material-symbols-outlined\" style=\"font-size:18px;color:#565e74\">edit</span> 기본정보 수정</h4>\n  <div class=\"form-grid\">\n    <div class=\"form-item\"><label>이름 <span class=\"req\">*</span></label><input type=\"text\" value=\"김운송\"></div>\n    <div class=\"form-item\"><label>연락처 <span class=\"req\">*</span></label><input type=\"tel\" value=\"032-123-4567\"></div>\n    <div class=\"form-item\"><label>이메일 <span class=\"req\">*</span></label><input type=\"email\" value=\"kimtr@transport.com\"></div>\n    <div class=\"form-item\"><label>휴대폰 <span class=\"req\">*</span></label><input type=\"tel\" value=\"010-1234-5678\"></div>\n    <div class=\"form-item full\"><label>주소</label>\n      <div style=\"display:flex;gap:8px\">\n        <input type=\"text\" value=\"21547\" style=\"width:100px\">\n        <button class=\"btn btn-secondary\" style=\"padding:8px 12px;font-size:11px\">우편번호</button>\n        <input type=\"text\" value=\"인천광역시 남동구 관세로 123\" style=\"flex:1\">\n      </div>\n    </div>\n  </div>\n\n  <h4 style=\"margin-top:24px\"><span class=\"material-symbols-outlined\" style=\"font-size:18px;color:#9f403d\">lock</span> 비밀번호 변경</h4>\n  <div class=\"form-grid\">\n    <div class=\"form-item\"><label>현재 비밀번호 <span class=\"req\">*</span></label><input type=\"password\" placeholder=\"현재 비밀번호\"></div>\n    <div class=\"form-item\"><label>새 비밀번호 <span class=\"req\">*</span></label><input type=\"password\" placeholder=\"8자 이상, 영문+숫자+특수문자\"></div>\n    <div class=\"form-item\"><label>새 비밀번호 확인 <span class=\"req\">*</span></label><input type=\"password\" placeholder=\"새 비밀번호 재입력\"></div>\n  </div>\n\n  <div class=\"btn-row\" style=\"margin-top:20px;justify-content:flex-end\">\n    <button class=\"btn btn-secondary\" onclick=\"alert('변경사항이 초기화되었습니다.')\">초기화</button>\n    <button class=\"btn btn-primary\" onclick=\"alert('✅ 개인정보가 저장되었습니다.')\"><span class=\"material-symbols-outlined\" style=\"font-size:14px\">save</span> 저장</button>\n  </div>\n</div>\n</div>\n\n<!-- 알림 수신 설정 -->\n<div id=\"my-noti\" style=\"display:none\">\n<div class=\"noti-setting\">\n  <h4 class=\"noti-section-title\"><span class=\"material-symbols-outlined\" style=\"font-size:18px;color:#565e74\">notifications_active</span> 업무 알림</h4>\n  <div class=\"noti-row\">\n    <div class=\"noti-left\"><div class=\"noti-title\">신규 의뢰 접수 알림</div><div class=\"noti-desc\">화주가 새로운 운송 의뢰를 등록했을 때 알림</div></div>\n    <label class=\"toggle-switch\"><input type=\"checkbox\" checked><span class=\"toggle-track\"></span></label>\n  </div>\n  <div class=\"noti-row\">\n    <div class=\"noti-left\"><div class=\"noti-title\">서류 보완 요청 알림</div><div class=\"noti-desc\">행정공무원 또는 창고관리자가 운송 관련 보완을 요청했을 때 알림</div></div>\n    <label class=\"toggle-switch\"><input type=\"checkbox\" checked><span class=\"toggle-track\"></span></label>\n  </div>\n  <div class=\"noti-row\">\n    <div class=\"noti-left\"><div class=\"noti-title\">신고 수리/반려 결과 알림</div><div class=\"noti-desc\">적하목록 제출 후 행정공무원의 승인·반려 결과 알림</div></div>\n    <label class=\"toggle-switch\"><input type=\"checkbox\" checked><span class=\"toggle-track\"></span></label>\n  </div>\n  <div class=\"noti-row\">\n    <div class=\"noti-left\"><div class=\"noti-title\">반입/반출 결과 알림</div><div class=\"noti-desc\">창고관리자의 보세구역 반입·반출 승인 및 완료 알림</div></div>\n    <label class=\"toggle-switch\"><input type=\"checkbox\" checked><span class=\"toggle-track\"></span></label>\n  </div>\n  <div class=\"noti-row\">\n    <div class=\"noti-left\"><div class=\"noti-title\">적하목록 제출/심사 결과 알림</div><div class=\"noti-desc\">행정공무원에게 제출한 적하목록 심사 진행상태 알림</div></div>\n    <label class=\"toggle-switch\"><input type=\"checkbox\" checked><span class=\"toggle-track\"></span></label>\n  </div>\n  <div class=\"noti-row\">\n    <div class=\"noti-left\"><div class=\"noti-title\">D/O 발급·전달 알림</div><div class=\"noti-desc\">D/O 발급 및 전달 처리 상태가 변경되었을 때 알림</div></div>\n    <label class=\"toggle-switch\"><input type=\"checkbox\" checked><span class=\"toggle-track\"></span></label>\n  </div>\n\n  <h4 class=\"noti-section-title\" style=\"margin-top:16px\"><span class=\"material-symbols-outlined\" style=\"font-size:18px;color:#565e74\">sms</span> 수신 채널</h4>\n  <div class=\"noti-row noti-row-wide\">\n    <div class=\"noti-left\"><div class=\"noti-title\">SMS 알림</div><div class=\"noti-desc\">등록된 휴대폰(010-1234-5678)으로 운송 업무 알림 수신</div></div>\n    <label class=\"toggle-switch\"><input type=\"checkbox\" checked><span class=\"toggle-track\"></span></label>\n  </div>\n\n  <div class=\"btn-row noti-row-wide\" style=\"margin-top:20px;justify-content:flex-end\">\n    <button class=\"btn btn-primary\" onclick=\"alert('✅ 알림 설정이 저장되었습니다.')\"><span class=\"material-symbols-outlined\" style=\"font-size:14px\">save</span> 알림 설정 저장</button>\n  </div>\n</div>\n</div>\n\n</div>\n</div>\n</div>";
}
function initBrokerCommunity(){
  // 자료실 파일 검색 초기화
  const fileSearch = document.getElementById('fileSearchInput');
  if(fileSearch && !fileSearch.dataset.bound){
    fileSearch.dataset.bound = '1';
    fileSearch.addEventListener('input', function(){ filterFile(this.value); });
  }
}
function openTransportResourceArchivePage(){
  mountTransportResourceArchivePanel();
}
function cTab(prefix, target){
  const root = document.querySelector('.broker-scope') || document;

  root.querySelectorAll('[id^="' + prefix + '-"]').forEach(function(panel){
    panel.style.display = panel.id === prefix + '-' + target ? 'block' : 'none';
  });

  const tabs = root.querySelectorAll('#tabs-' + prefix + ' .sub-tab');
  tabs.forEach(function(tab){ tab.classList.remove('active'); });

  const activeTab = Array.from(tabs).find(function(tab) {
    return (tab.getAttribute('onclick') || '').indexOf("'" + target + "'") > -1;
  });
  if (activeTab) activeTab.classList.add('active');

  if (prefix === 'cm') {
    syncTransportCommunityTab(target);
    if (target === 'notice') mountTransportNoticePanel();
    if (target === 'download') mountTransportResourceArchivePanel();
    if (target === 'cs') {
      mountTransportFaqPanel();
    }
  }
}

function syncTransportCommunityTab(target) {
  const itemMap = { notice: 'TACS-CM-001', download: 'TACS-CM-003', cs: 'TACS-CM-004' };
  const item = itemMap[target] || itemMap.notice;
  document.querySelectorAll('.menu-item').forEach(function(menu) {
    menu.classList.toggle('active', menu.dataset.group === 'community');
  });
  document.querySelectorAll('.sub-item').forEach(function(sub) {
    sub.classList.toggle('active-sub', sub.dataset.group === 'community' && sub.dataset.itemId === item);
  });
  document.querySelectorAll('.menu-group').forEach(function(wrap) {
    const open = wrap.dataset.groupWrap === 'community';
    const children = wrap.querySelector('.menu-children');
    const arrow = wrap.querySelector('.menu-arrow');
    if (children) children.classList.toggle('open', open);
    if (arrow) arrow.classList.toggle('rotated', open);
  });
  window.TRANSPORT_INITIAL_VIEW = { group: 'community', item: item };
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', (window.contextPath || '') + '/transport/community.do?tab=' + encodeURIComponent(getTransportCommunityTabByItem(item)));
  }
}

function openFileDetail(title, type, desc){
  const box = document.getElementById('fileDetail');
  if(!box) return;
  box.querySelector('[data-title]').textContent = title || '자료 상세';
  box.querySelector('[data-type]').textContent = type || '-';
  box.querySelector('[data-body]').textContent = desc || '업무 참고용 자료입니다.';
  box.style.display = 'block';
  box.scrollIntoView({behavior:'smooth', block:'start'});
}
function closeFileDetail(){
  const box = document.getElementById('fileDetail');
  if(box) box.style.display = 'none';
}
function filterFile(keyword){
  const q = (keyword || '').trim().toLowerCase();
  document.querySelectorAll('.broker-scope .file-item').forEach(function(item){
    item.style.display = item.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
  });
}
function go(target){
  if(target === 'dash' || target === 'dashboard'){
    if(typeof setActiveGroup === 'function') setActiveGroup('dashboard');
  }
}
var __transportCommunityBaseBuildDetailHtml = typeof buildDetailHtml === 'function' ? buildDetailHtml : null;
buildDetailHtml = function(group, item){
  if(item && ['TACS-CM-001','TACS-CM-003','TACS-CM-004'].includes(item.id)) return buildBrokerCommunityPanel();
  if(item && item.id === 'TACS-MY-001') return buildBrokerMyPagePanel();
  return __transportCommunityBaseBuildDetailHtml ? __transportCommunityBaseBuildDetailHtml(group, item) : '';
};

var __transportCommunityBaseOpenDetail = typeof openDetail === 'function' ? openDetail : null;
openDetail = function(group, item){
  const isCommunity = group === 'community' || ['TACS-CM-001','TACS-CM-003','TACS-CM-004'].includes(item);
  const target = getTransportCommunityTargetByItem(item);
  const body = document.getElementById('detail-body');

  if (isCommunity && body && body.dataset.currentGroup === 'community' && (body.dataset.currentItem || '') === (item || '') && document.getElementById('pg-community')) {
    cTab('cm', target);
    return undefined;
  }

  if (isCommunity) clearTransportCommunitySavedState();
  const result = __transportCommunityBaseOpenDetail ? __transportCommunityBaseOpenDetail(group, item) : undefined;
  if(isCommunity) {
    setTimeout(function(){
      cTab('cm', target);
      if (typeof initBrokerCommunity === 'function') initBrokerCommunity();
    }, 0);
  }
  return result;
};

/* ===== 커뮤니티 공통 모듈 연동 보강 ===== */
function filterFile(cat, btn){
  openTransportResourceArchivePage();
}


function closeFileDetail(){ }

var transportFileData = [];
var brokerCommunityFiles = [];

function openFileDetail(idx){ openTransportResourceArchivePage(); }

function initTransportCommunityCurrentTab(){
  const current = window.TRANSPORT_INITIAL_VIEW || {};
  if (current.group !== 'community') return;
  const target = getTransportCommunityTargetByItem(current.item || 'TACS-CM-001');
  if (document.getElementById('pg-community')) cTab('cm', target);
}

(function(){
  const prevInitBrokerCommunity = typeof initBrokerCommunity === 'function' ? initBrokerCommunity : null;
  initBrokerCommunity = function(){
    if(prevInitBrokerCommunity) prevInitBrokerCommunity();
    initTransportCommunityCurrentTab();
  };

  document.addEventListener('DOMContentLoaded', function(){
    ensureTransportCommunityAssets().then(initTransportCommunityCurrentTab);
  });

  setTimeout(function(){
    ensureTransportCommunityAssets().then(initTransportCommunityCurrentTab);
  }, 0);
})();

(function bootTransportPage(){
  window.TRANSPORT_PAGE_READY = window.TRANSPORT_PAGE_READY || {};
  window.TRANSPORT_PAGE_READY.community = true;
  if (window.TRANSPORT_DEFER_PAGE_BOOT) return;
  clearTransportCommunitySavedState();
  const initialBackBtn = document.getElementById('backBtn');
  if (initialBackBtn && typeof window.goTransportBack === 'function') initialBackBtn.onclick = window.goTransportBack;
  if (typeof autoBuildNav === 'function') autoBuildNav();
  if (typeof openInitialTransportView === 'function') openInitialTransportView();
})();
