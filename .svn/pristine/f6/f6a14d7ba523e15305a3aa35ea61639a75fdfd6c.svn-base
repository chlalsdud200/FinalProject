/*
 * transport/pages/dash.js
 * 대시보드 전용 보정
 * - dashboard.do에서는 대시보드 화면 1개만 보이도록 강제한다.
 * - 수입운송/적하목록/내륙배차 값은 AJAX로 최신 DB 값을 다시 채운다.
 * - 상세/수입 라우터 화면이 새로고침 때 섞여 들어오지 않게 막는다.
 */
(function () {
  'use strict';

  if (window.__TACS_DASHBOARD_SINGLE_BOOTED) return;
  window.__TACS_DASHBOARD_SINGLE_BOOTED = true;

  var API = {
    importRequests: '/transport/import/request/list.do',
    importManifest: '/transport/import/manifest/list.do',
    importInland: '/transport/import/inland-dispatch/list.do'
  };
  var DASHBOARD_REQUEST_LIMIT = 5;

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function ctx() {
    if (window.contextPath != null) return window.contextPath;
    var meta = qs('meta[name="ctx-path"]');
    return meta ? (meta.getAttribute('content') || '') : '';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function pick(row, names) {
    row = row || {};
    for (var i = 0; i < names.length; i += 1) {
      var v = row[names[i]];
      if (v !== undefined && v !== null && String(v).trim() !== '') return v;
    }
    return '';
  }

  function text(value) {
    return String(value == null ? '' : value).trim();
  }

  function normalizeDate(raw) {
    var v = text(raw);
    if (!v) return '-';
    if (v.indexOf('T') > -1) return v.replace('T', ' ').slice(0, 16);
    return v.length > 16 ? v.slice(0, 16) : v;
  }

  function fetchJson(path) {
    return fetch(ctx() + path, {
      method: 'GET',
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' - ' + path);
      return res.json();
    }).then(function (data) {
      return Array.isArray(data) ? data : [];
    });
  }

  function uniqueBy(rows, keys) {
    var seen = Object.create(null);
    return (Array.isArray(rows) ? rows : []).filter(function (row, idx) {
      var key = pick(row, keys);
      if (!key) key = 'ROW-' + idx;
      key = String(key);
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function setCount(selector, count) {
    qsa(selector).forEach(function (el) {
      var suffix = el.getAttribute('data-dashboard-count-format') === 'suffix' ? '건' : '';
      el.textContent = String(count) + suffix;
    });
  }

  function emptyRow(colspan, message) {
    return '<tr><td colspan="' + colspan + '" class="tacs-dashboard-empty">' + escapeHtml(message) + '</td></tr>';
  }

  function dashboardRequestButton(group, trcNo) {
    var no = text(trcNo);
    if (!no) return '-';
    var href = group === 'import'
      ? ctx() + '/transport/import.do?tab=detail&trcNo=' + encodeURIComponent(no)
      : ctx() + '/transport/export.do?tab=request&trcNo=' + encodeURIComponent(no);
    return '<a href="' + escapeHtml(href) + '" class="tacs-dashboard-request-link" data-dashboard-request-link="true" data-dashboard-request-group="' + escapeHtml(group) + '" data-dashboard-request-no="' + escapeHtml(no) + '">' + escapeHtml(no) + '</a>';
  }

  function rememberExportRequestRoute(trcNo) {
    trcNo = text(trcNo);
    if (!trcNo) return;
    try {
      var route = {
        type: 'request-detail',
        requestNo: trcNo,
        activeKey: 'detail',
        request: { trcNo: trcNo, requestNo: trcNo, treId: trcNo },
        ts: Date.now()
      };
      if (window.sessionStorage) {
        window.sessionStorage.setItem('tacs.export.currentRoute.v1', JSON.stringify(route));
      }
    } catch (ignore) {}
  }

  function renderImportRequests(rows) {
    var tbody = qs('#dashboard-import-request-tbody');
    if (!tbody) return;

    rows = (Array.isArray(rows) ? rows : []).slice(0, DASHBOARD_REQUEST_LIMIT);

    if (!rows.length) {
      tbody.innerHTML = emptyRow(4, '표시할 수입 운송의뢰가 없습니다.');
      return;
    }

    tbody.innerHTML = rows.map(function (row) {
      var trcNo = pick(row, ['trcNo', 'requestNo', 'treNo']);
      var owner = pick(row, ['ownerNm', 'owrNm', 'shipperNm', 'ownerName']);
      var reqDt = normalizeDate(pick(row, ['requestDt', 'trcReqDt', 'registDt', 'trcRegDt', 'regDt']));
      var status = pick(row, ['requestDisplayStatusNm', 'statusNm', 'trcStatusNm', 'requestCn', 'trcStatusCd', 'statusCd']);
      return '' +
        '<tr>' +
        '<td>' + dashboardRequestButton('import', trcNo) + '</td>' +
        '<td>' + escapeHtml(owner || '-') + '</td>' +
        '<td>' + escapeHtml(reqDt) + '</td>' +
        '<td><span class="status-chip">' + escapeHtml(status || '-') + '</span></td>' +
        '</tr>';
    }).join('');

    if (typeof window.normalizeStatusChips === 'function') {
      window.normalizeStatusChips(tbody);
    }
  }

  function forceSingleDashboard() {
    window.TRANSPORT_INITIAL_VIEW = { group: 'dashboard', item: '' };
    window.TRANSPORT_DEFER_PAGE_BOOT = false;

    [
      { selector: '#sideNav', remove: function (el) { return el.closest('aside') || el; } },
      { selector: 'aside.fixed.left-0.top-0', remove: function (el) { return el; } },
      { selector: 'header.glass-header', remove: function (el) { return el; } },
      { selector: 'main.ml-72.pt-16', remove: function (el) { return el; } }
    ].forEach(function (target) {
      qsa(target.selector).forEach(function (el, idx) {
        var removable = idx === 0 ? null : target.remove(el);
        if (removable && removable.parentNode) removable.parentNode.removeChild(removable);
      });
    });

    var dashboards = qsa('#dashboard-view');
    dashboards.forEach(function (el, idx) {
      if (idx === 0) el.classList.remove('hidden');
      else el.parentNode && el.parentNode.removeChild(el);
    });

    var detail = qs('#detail-view');
    var body = qs('#detail-body');
    if (detail) detail.classList.add('hidden');
    if (body) {
      body.dataset.currentGroup = 'dashboard';
      body.dataset.currentItem = '';
      body.dataset.importViewMode = '';
    }

    if (typeof window.setActiveNav === 'function') {
      window.setActiveNav('dashboard', '');
    }
  }

  function loadImportDashboardValues() {
    Promise.allSettled([
      fetchJson(API.importRequests),
      fetchJson(API.importManifest),
      fetchJson(API.importInland)
    ]).then(function (results) {
      var importRequests = results[0].status === 'fulfilled'
        ? uniqueBy(results[0].value, ['trcNo', 'requestNo', 'treNo'])
        : [];
      var importManifest = results[1].status === 'fulfilled'
        ? uniqueBy(results[1].value, ['manifestNo', 'icmNo', 'trcNo', 'blNo', 'mblNo'])
        : [];
      var importInland = results[2].status === 'fulfilled'
        ? uniqueBy(results[2].value, ['dispatchNo', 'dispatchTreId', 'treId', 'trcNo', 'requestNo'])
        : [];

      if (results[0].status === 'fulfilled') {
        setCount('[data-dashboard-import-count]', importRequests.length);
        renderImportRequests(importRequests);
      }
      if (results[1].status === 'fulfilled') {
        setCount('[data-dashboard-import-manifest-count]', importManifest.length);
      }
      if (results[2].status === 'fulfilled') {
        setCount('[data-dashboard-import-inland-count]', importInland.length);
      }

      results.forEach(function (result) {
        if (result.status === 'rejected') console.warn('[대시보드 수입운송 조회 실패]', result.reason);
      });
    });
  }

  function bindDashboardKpiNavigation() {
    qsa('[data-dashboard-go-url]').forEach(function (button) {
      if (button.dataset.dashboardNavBound === 'true') return;
      button.dataset.dashboardNavBound = 'true';
      button.addEventListener('click', function (event) {
        event.preventDefault();
        var group = button.getAttribute('data-dashboard-go-group') || '';
        var item = button.getAttribute('data-dashboard-go-item') || '';
        var url = button.getAttribute('data-dashboard-go-url') || '';
        if (group === 'import' && item) {
          try {
            sessionStorage.setItem('TACS_IMPORT_TARGET_ITEM', item);
          } catch (e) {}
        }
        if (url) window.location.href = url;
      });
    });
  }

  function bindDashboardRequestLinks() {
    var root = qs('#dashboard-view') || document;
    if (root.dataset.dashboardRequestLinksBound === 'true') return;
    root.dataset.dashboardRequestLinksBound = 'true';
    root.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target.closest('[data-dashboard-request-link="true"]') : null;
      if (!target || !root.contains(target)) return;
      var group = target.getAttribute('data-dashboard-request-group') || '';
      var trcNo = target.getAttribute('data-dashboard-request-no') || '';
      if (group === 'export') rememberExportRequestRoute(trcNo);
    }, true);
  }

  function boot() {
    forceSingleDashboard();
    bindDashboardKpiNavigation();
    bindDashboardRequestLinks();
    loadImportDashboardValues();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
