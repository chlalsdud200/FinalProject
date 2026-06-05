(function () {
  if (window.__tacsCommonNoticeLoaded) {
    if (typeof window.initCommonNotice === 'function') {
      window.initCommonNotice();
    }
    return;
  }
  window.__tacsCommonNoticeLoaded = true;

  var state = {
    list: [],
    page: 1,
    size: 10,
    totalCount: 0,
    initialized: false,
    initAttempts: 0,
    root: null,
    detailOpen: false,
    suppressHistory: false,
    urlInitialized: false,
    lastQueryString: ''
  };

  function contextPath() {
    if (window.contextPath) return window.contextPath;
    var meta = document.querySelector('meta[name="ctx-path"]');
    if (meta && meta.content) return meta.content;
    return '';
  }

  function noticeRoot() {
    return document.getElementById('comm-notice') || document.getElementById('cm-notice') || document.getElementById('cm-notice-admin');
  }

  function t(key) {
    var map = {
      listTitle: '\uacf5\uc9c0\uc0ac\ud56d \ubaa9\ub85d',
      allType: '\uc804\uccb4 \ubd84\ub958',
      notice: '\uacf5\uc9c0',
      urgent: '\uae34\uae09',
      update: '\uc5c5\ub370\uc774\ud2b8',
      searchPlaceholder: '\uacf5\uc9c0 \uc81c\ubaa9 \uac80\uc0c9',
      search: '\uc870\ud68c',
      noResult: '\uac80\uc0c9 \uacb0\uacfc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.',
      errorList: '\uacf5\uc9c0\uc0ac\ud56d \uc870\ud68c \uc911 \uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4.',
      errorDetail: '\uacf5\uc9c0\uc0ac\ud56d \uc0c1\uc138 \uc870\ud68c \uc2e4\ud328',
      previous: '\uc774\uc804',
      next: '\ub2e4\uc74c',
      backToList: '\ubaa9\ub85d\uc73c\ub85c',
      writer: '\uc791\uc131\uc790',
      regDate: '\ub4f1\ub85d\uc77c\uc2dc',
      views: '\uc870\ud68c\uc218',
      admin: '\uad00\ub9ac\uc790',
      title: '\uc81c\ubaa9',
      type: '\ubd84\ub958',
      manage: '\uad00\ub9ac'
    };
    return map[key] || key;
  }

  function injectNoticeStyle() {
    if (document.getElementById('tacs-common-notice-style')) return;
    var style = document.createElement('style');
    style.id = 'tacs-common-notice-style';
    style.textContent =
      '.tacs-notice-unified{background:#fff;border:1px solid #d8e0ea;border-radius:0;overflow:hidden;font-family:"Inter",sans-serif}' +
      '.tacs-notice-board-title{font-size:12px;font-weight:700;color:#475569;padding:0 0 10px}' +
      '.tacs-notice-unified .filter-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:14px 18px;margin:0;border-top:1px solid #d8e0ea;border-bottom:1px solid #e2e8f0;border-left:3px solid #565e74;background:#fff}' +
      '.tacs-notice-unified select,.tacs-notice-unified input[type="date"]{height:34px;border:1px solid #d8e0ea;background:#fff;color:#0f172a;font-size:12px;padding:0 12px;min-width:146px}' +
      '.tacs-notice-unified .search-wrap,.tacs-notice-unified .search-box{height:34px;display:flex;align-items:center;border:1px solid #d8e0ea;background:#f8fafc;padding:0 10px;gap:8px}' +
      '.tacs-notice-unified .search-wrap .material-symbols-outlined,.tacs-notice-unified .search-box .material-symbols-outlined{position:static!important;transform:none!important;font-size:18px!important;color:#64748b!important}' +
      '.tacs-notice-unified .search-wrap input,.tacs-notice-unified .search-box input{border:0!important;background:transparent!important;outline:0;width:100%;height:32px;padding:0!important;font-size:12px;color:#0f172a}' +
      '.tacs-notice-unified .btn-dark,.tacs-notice-unified .notice-search-btn{height:38px;border:0;background:#373f54;color:#fff;font-size:12px;font-weight:800;padding:0 18px;cursor:pointer}' +
      '.tacs-notice-unified table{width:100%;border-collapse:collapse;background:#fff;table-layout:fixed}' +
      '.tacs-notice-unified th{height:38px;background:#f8fafc;border-bottom:2px solid #e2e8f0;color:#64748b;font-size:10px;font-weight:700;text-align:left;padding:0 18px;text-transform:uppercase;letter-spacing:0.5px}' +
      '.tacs-notice-unified td{height:44px;border-bottom:1px solid #f1f5f9;color:#334155;font-size:12px;padding:0 18px;vertical-align:middle;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.tacs-notice-unified th:first-child,.tacs-notice-unified td:first-child{text-align:center}' +
      '.tacs-notice-unified .notice-title-link{font-weight:700;cursor:pointer;color:#203444;font-size:12px}' +
      '.tacs-notice-unified .notice-title-link:hover{text-decoration:underline}' +
      '.tacs-notice-unified .badge,.tacs-notice-unified .notice-badge{display:inline-block;padding:2px 8px;margin-right:8px;font-size:9px;font-weight:800;vertical-align:middle;border-radius:0;line-height:1.2}' +
      '.tacs-notice-unified .notice-badge-urgent{background:#fecaca;color:#991b1b}' +
      '.tacs-notice-unified .notice-badge-update{background:#dae2fd;color:#373f54}' +
      '.tacs-notice-unified .notice-badge-notice{background:#dae2fd;color:#373f54}' +
      '.tacs-notice-unified .mini{min-width:34px;height:28px;border:1px solid #e2e8f0;background:#fff;color:#64748b;font-size:11px;font-weight:800;cursor:pointer;padding:0 10px}' +
      '.tacs-notice-unified .mini.active{background:#f1f5f9;color:#0f172a;border-color:#cbd5e1}' +
      '.tacs-notice-unified .mini:disabled{opacity:.45;cursor:default}' +
      '.tacs-notice-unified .notice-detail{background:#fff;padding:24px 28px;border:1px solid #d8e0ea}' +
      '.tacs-notice-unified .notice-detail .btn-outline{border:1px solid #cbd5e1;background:#fff;color:#334155;font-size:12px;font-weight:800;padding:8px 12px;cursor:pointer}' +
      '.tacs-notice-unified .nd-header{border-bottom:2px solid #0f172a;padding-bottom:16px;margin-bottom:24px}' +
      '.tacs-notice-unified .nd-title{font-size:18px;font-weight:800;color:#0f172a;margin-bottom:10px;display:flex;align-items:center;gap:4px}' +
      '.tacs-notice-unified .nd-meta{display:flex;flex-wrap:wrap;gap:18px;font-size:12px;color:#64748b}' +
      '.tacs-notice-unified .nd-meta span{font-weight:800;color:#334155;margin-left:4px}' +
      '.tacs-notice-unified .nd-body{font-size:14px;line-height:1.9;color:#334155;min-height:180px;padding:4px 0 20px}' +
      '.tacs-notice-unified .nd-body p,.tacs-notice-unified .nd-body div,.tacs-notice-unified .nd-body blockquote{margin:0 0 10px}' +
      '.tacs-notice-unified .nd-body ul,.tacs-notice-unified .nd-body ol{margin:10px 0;padding-left:24px}' +
      '.tacs-notice-unified .nd-body blockquote{padding:8px 12px;border-left:3px solid #94a3b8;background:#f8fafc;color:#475569}' +
      '.tacs-notice-unified .nd-body a{color:#1d4ed8;text-decoration:underline}' +
      '.prog-tab-bar{display:flex;border-bottom:1px solid #e2e8f0;margin-bottom:0}' +
      '.prog-tab{background:none;border:none;border-bottom:2px solid transparent;padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;cursor:pointer;margin-bottom:-1px;transition:all .12s}' +
      '.prog-tab.active{color:#565e74;border-bottom-color:#565e74}' +
      '@media (max-width: 768px){.tacs-notice-unified .filter-bar{align-items:stretch}.tacs-notice-unified select,.tacs-notice-unified input[type="date"],.tacs-notice-unified .search-wrap,.tacs-notice-unified .search-box,.tacs-notice-unified .btn-dark{width:100%;max-width:none!important;flex:1 1 100%!important}.tacs-notice-unified th,.tacs-notice-unified td{padding:0 10px}}';
    document.head.appendChild(style);
  }

  function ensureNoticeScaffold(root) {
    if (!root || root.dataset.noticeUnified === 'Y') return;
    injectNoticeStyle();
    root.classList.add('tacs-notice-unified');
    root.innerHTML =
      '<div class="card-section tacs-notice-board">' +
      '<div class="filter-bar tacs-notice-filter">' +
      '<select id="notice-type-filter"></select>' +
      '<div class="search-wrap">' +
      '<span class="material-symbols-outlined">search</span>' +
      '<input id="notice-search" type="text" placeholder="' + t('searchPlaceholder') + '">' +
      '</div>' +
      '<input id="notice-date-from" type="date">' +
      '<span style="font-size:11px;color:#94a3b8">~</span>' +
      '<input id="notice-date-to" type="date">' +
      '<button type="button" class="btn btn-dark notice-search-btn" onclick="renderNoticeList()">' + t('search') + '</button>' +
      '</div>' +
      '<table class="data-table tacs-notice-table">' +
      '<thead><tr>' +
      '<th style="width:70px">NO</th>' +
      '<th>' + t('title') + '</th>' +
      '<th style="width:150px">' + t('regDate') + '</th>' +
      '<th style="width:90px">' + t('views') + '</th>' +
      '</tr></thead>' +
      '<tbody id="notice-table-body"></tbody>' +
      '</table>' +
      '</div>' +
      '<div id="notice-detail-view" style="display:none"></div>';
    root.dataset.noticeUnified = 'Y';
  }

  function noticeTbody() {
    var tbody = document.getElementById('notice-table-body');
    if (tbody) return tbody;
    var root = noticeRoot();
    tbody = root ? root.querySelector('table.data-table tbody, table tbody') : null;
    if (tbody) tbody.id = 'notice-table-body';
    return tbody;
  }

  function findInput(ids, root, selector) {
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) return el;
    }
    return root && selector ? root.querySelector(selector) : null;
  }


  function readUrlFilterParams() {
    var params = new URLSearchParams(window.location.search || '');
    return {
      type: params.get('type') || params.get('noticeType') || params.get('notice_type') || '',
      keyword: params.get('keyword') || params.get('searchWord') || params.get('searchKeyword') || '',
      fromDate: params.get('fromDate') || params.get('noticeDateFrom') || '',
      toDate: params.get('toDate') || params.get('noticeDateTo') || '',
      page: params.get('noticePage') || params.get('page') || params.get('currentPage') || '',
      size: params.get('noticeSize') || params.get('size') || params.get('screenSize') || ''
    };
  }

  function normalizeNoticeType(value) {
    value = String(value == null ? '' : value).trim().toUpperCase();
    if (!value || value === 'ALL') return 'all';
    return ['NOTICE', 'URGENT', 'UPDATE'].indexOf(value) >= 0 ? value : 'all';
  }

  function setControlValue(id, value) {
    var el = document.getElementById(id);
    if (!el || value == null || value === '') return;
    el.value = value;
  }

  function applyUrlFiltersOnce() {
    if (state.urlInitialized) return;
    state.urlInitialized = true;
    var filters = readUrlFilterParams();
    setControlValue('notice-type-filter', normalizeNoticeType(filters.type));
    setControlValue('notice-search', filters.keyword);
    setControlValue('notice-keyword', filters.keyword);
    setControlValue('notice-date-from', filters.fromDate);
    setControlValue('notice-date-to', filters.toDate);

    var page = parseInt(filters.page, 10);
    var size = parseInt(filters.size, 10);
    if (!isNaN(page) && page > 0) state.page = page;
    if (!isNaN(size) && size > 0) state.size = Math.min(Math.max(size, 1), 100);
  }

  function updateNoticeUrl(params) {
    if (!window.history || !history.replaceState || state.detailOpen) return;
    var next = new URL(window.location.href);
    ['type', 'keyword', 'fromDate', 'toDate', 'noticeType', 'notice_type', 'searchWord', 'searchKeyword', 'noticeDateFrom', 'noticeDateTo', 'noticePage', 'noticeSize'].forEach(function (key) {
      next.searchParams.delete(key);
    });
    next.searchParams.set('type', params.get('type') || 'all');
    next.searchParams.set('keyword', params.get('keyword') || '');
    next.searchParams.set('fromDate', params.get('fromDate') || '');
    next.searchParams.set('toDate', params.get('toDate') || '');
    next.searchParams.set('noticePage', params.get('page') || String(state.page || 1));
    next.searchParams.set('noticeSize', params.get('size') || String(state.size || 10));

    var nextUrl = next.pathname + next.search + next.hash;
    if (nextUrl !== location.pathname + location.search + location.hash) {
      history.replaceState(history.state, '', nextUrl);
    }
  }

  function onNoticeFilterChanged() {
    state.page = 1;
    window.renderNoticeList();
  }

  function ensureFilters() {
    var root = noticeRoot();
    if (!root) return;
    ensureNoticeScaffold(root);

    var type = findInput(['notice-type-filter'], root, 'select');
    var selectedType = type ? normalizeNoticeType(type.value) : 'all';
    if (type) {
      type.innerHTML = '<option value="all">' + t('allType') + '</option>' +
        '<option value="URGENT">' + t('urgent') + '</option>' +
        '<option value="UPDATE">' + t('update') + '</option>' +
        '<option value="NOTICE">' + t('notice') + '</option>';
      type.value = selectedType;
    }

    var keyword = findInput(['notice-search', 'notice-keyword'], root, 'input[type="text"], input:not([type])');
    if (keyword && !keyword.id) keyword.id = 'notice-search';
    var from = findInput(['notice-date-from'], root, 'input[type="date"]');
    var dates = root.querySelectorAll('input[type="date"]');
    if (from && !from.id) from.id = 'notice-date-from';
    if (!document.getElementById('notice-date-to') && dates.length > 1) dates[1].id = 'notice-date-to';

    [type, keyword, document.getElementById('notice-date-from'), document.getElementById('notice-date-to')].forEach(function (el) {
      if (!el || el.dataset.noticeBound === 'Y') return;
      el.dataset.noticeBound = 'Y';
      if (el.tagName === 'INPUT' && el.type !== 'date') {
        el.addEventListener('input', debounce(onNoticeFilterChanged, 250));
        el.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            onNoticeFilterChanged();
          }
        });
      } else {
        el.addEventListener('change', onNoticeFilterChanged);
      }
    });
    arrangeFilterBar(root);
  }

  function arrangeFilterBar(root) {
    var bar = root.querySelector('.filter-bar, .search-row');
    if (!bar || bar.dataset.noticeArranged === 'Y') return;

    var type = document.getElementById('notice-type-filter') || bar.querySelector('select');
    var search = document.getElementById('notice-search') || document.getElementById('notice-keyword') || bar.querySelector('input[type="text"], input:not([type])');
    var searchWrap = search ? (search.closest('.search-wrap, .search-box') || search) : null;
    var from = document.getElementById('notice-date-from');
    var to = document.getElementById('notice-date-to');
    var button = Array.prototype.find.call(bar.querySelectorAll('button'), function (btn) {
      return /조회|search/i.test(btn.textContent || '') || btn.getAttribute('onclick') === 'renderNoticeList()';
    });

    bar.style.justifyContent = 'flex-start';
    bar.style.alignItems = 'center';
    bar.style.gap = '8px';

    Array.prototype.forEach.call(bar.children, function (child) {
      if (child.tagName === 'SPAN' && child.textContent.trim() === '~') {
        child.remove();
      }
    });

    if (searchWrap && searchWrap.style) {
      searchWrap.style.flex = '0 0 260px';
      searchWrap.style.maxWidth = '320px';
    }
    if (button && button.style) {
      button.style.marginLeft = '0';
      button.onclick = onNoticeFilterChanged;
    }

    [type, searchWrap, from].forEach(function (el) {
      if (el && el.parentElement === bar) bar.appendChild(el);
    });

    if (from && to && from.parentElement === bar && to.parentElement === bar) {
      var tilde = document.createElement('span');
      tilde.textContent = '~';
      tilde.style.cssText = 'font-size:11px;color:#94a3b8';
      bar.appendChild(tilde);
      bar.appendChild(to);
    } else if (to && to.parentElement === bar) {
      bar.appendChild(to);
    }

    if (button && button.parentElement === bar) {
      bar.appendChild(button);
    }
    bar.dataset.noticeArranged = 'Y';
  }

  function debounce(fn, delay) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }

  function value(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function query() {
    var p = new URLSearchParams();
    p.set('type', normalizeNoticeType(value('notice-type-filter')) || 'all');
    p.set('keyword', value('notice-search') || value('notice-keyword'));
    p.set('fromDate', value('notice-date-from'));
    p.set('toDate', value('notice-date-to'));
    p.set('page', state.page);
    p.set('size', state.size);
    return p;
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function nl2br(text) {
    return escapeHtml(text).replace(/\r?\n/g, '<br>');
  }

  function isSafeHref(href) {
    return /^(https?:\/\/|mailto:|\/|#)/i.test(href);
  }

  function sanitizeNoticeContent(html) {
    var allowedTags = ['A', 'B', 'BLOCKQUOTE', 'BR', 'DIV', 'EM', 'I', 'LI', 'OL', 'P', 'S', 'STRONG', 'U', 'UL'];
    var dropContentTags = ['BUTTON', 'EMBED', 'FORM', 'IFRAME', 'IMG', 'INPUT', 'MATH', 'OBJECT', 'SCRIPT', 'STYLE', 'SVG'];
    var allowedTextAlign = ['left', 'center', 'right'];
    var template = document.createElement('template');
    template.innerHTML = String(html || '');

    Array.prototype.slice.call(template.content.querySelectorAll('*')).reverse().forEach(function (element) {
      if (dropContentTags.indexOf(element.tagName) >= 0) {
        element.remove();
        return;
      }
      if (allowedTags.indexOf(element.tagName) < 0) {
        element.replaceWith.apply(element, Array.prototype.slice.call(element.childNodes));
        return;
      }

      var href = element.tagName === 'A' ? (element.getAttribute('href') || '').trim() : '';
      var textAlign = element.style.textAlign;
      Array.prototype.slice.call(element.attributes).forEach(function (attribute) {
        element.removeAttribute(attribute.name);
      });

      if (href && isSafeHref(href)) {
        element.setAttribute('href', href);
        element.setAttribute('target', '_blank');
        element.setAttribute('rel', 'noopener noreferrer');
      }
      if (allowedTextAlign.indexOf(textAlign) >= 0) {
        element.style.textAlign = textAlign;
      }
    });

    return template.innerHTML;
  }

  function renderNoticeContent(content) {
    if (/<(?:a|b|blockquote|br|div|em|i|li|ol|p|s|strong|u|ul)\b/i.test(content || '')) {
      return sanitizeNoticeContent(content);
    }
    return nl2br(content);
  }

  function typeLabel(type) {
    if (type === 'URGENT') return t('urgent');
    if (type === 'UPDATE') return t('update');
    return t('notice');
  }

  function badgeClass(type) {
    if (type === 'URGENT') return 'badge badge-urgent notice-badge notice-badge-urgent';
    if (type === 'UPDATE') return 'badge badge-new notice-badge notice-badge-update';
    return 'badge badge-new notice-badge notice-badge-notice';
  }

  function tableHeaderText(table) {
    if (!table) return '';
    return Array.prototype.map.call(table.querySelectorAll('thead th'), function (th) {
      return (th.textContent || '').trim();
    }).join(' ');
  }

  function noticeTitleHtml(notice) {
    return '<span class="' + badgeClass(notice.noticeType) + '">' + typeLabel(notice.noticeType) + '</span>' +
      '<span class="notice-title-link" onclick="openNoticeDetail(' + notice.noticeNo + ')">' + escapeHtml(notice.noticeTitle) + '</span>';
  }

  function renderRows() {
    var tbody = noticeTbody();
    if (!tbody) return;
    var table = tbody.closest('table');
    var colCount = table ? table.querySelectorAll('thead th').length : 6;
    var hasWriter = /작성자/.test(tableHeaderText(table));
    if (!state.list.length) {
      tbody.innerHTML = '<tr><td colspan="' + Math.max(colCount, 1) + '" style="padding:32px;text-align:center;color:#94a3b8">' + t('noResult') + '</td></tr>';
      return;
    }
    if (!state.list.length) {
      tbody.innerHTML = '<tr><td colspan="' + Math.max(colCount, 1) + '" style="padding:32px;text-align:center;color:#94a3b8">검색 결과가 없습니다.</td></tr>';
      return;
    }
    if (noticeRoot() && noticeRoot().dataset.noticeUnified === 'Y') {
      tbody.innerHTML = state.list.map(function (notice, i) {
        var no = state.totalCount - ((state.page - 1) * state.size) - i;
        return '<tr data-notice-no="' + notice.noticeNo + '">' +
          '<td>' + no + '</td>' +
          '<td>' + noticeTitleHtml(notice) + '</td>' +
          '<td class="td-muted">' + escapeHtml(notice.noticeAdddate || '') + '</td>' +
          '<td>' + escapeHtml(notice.noticeCnt || 0) + '</td>' +
          '</tr>';
      }).join('');
      return;
    }
    tbody.innerHTML = state.list.map(function (notice, i) {
      var no = state.totalCount - ((state.page - 1) * state.size) - i;
      if (!hasWriter) {
        return '<tr data-notice-no="' + notice.noticeNo + '">' +
          '<td>' + no + '</td>' +
          '<td>' + noticeTitleHtml(notice) + '</td>' +
          '<td class="td-muted">' + escapeHtml(notice.noticeAdddate || '') + '</td>' +
          '<td>' + escapeHtml(notice.noticeCnt || 0) + '</td>' +
          '</tr>';
      }
      return '<tr data-notice-no="' + notice.noticeNo + '">' +
        '<td>' + no + '</td>' +
        '<td>' + noticeTitleHtml(notice) + '</td>' +
        '<td>' + escapeHtml(notice.noticeAdminId || '관리자') + '</td>' +
        '<td class="td-muted">' + escapeHtml(notice.noticeAdddate || '') + '</td>' +
        '<td>' + escapeHtml(notice.noticeCnt || 0) + '</td>' +
        '</tr>';
    }).join('');
  }

  function renderPager() {
    var root = noticeRoot();
    if (!root) return;
    var old = document.getElementById('notice-common-pager');
    if (old) old.remove();
    Array.prototype.forEach.call(root.querySelectorAll('.pager, .pagination'), function (pager) {
      if (pager.id !== 'notice-common-pager') pager.remove();
    });
    var totalPage = Math.max(Math.ceil(state.totalCount / state.size), 1);
    var pager = document.createElement('div');
    pager.id = 'notice-common-pager';
    pager.style.cssText = 'text-align:center;margin-top:16px;font-size:12px;color:#697d8f';
    var html = '<button type="button" class="mini" ' + (state.page <= 1 ? 'disabled' : '') + ' onclick="moveNoticePage(' + (state.page - 1) + ')">이전</button>';
    for (var p = 1; p <= totalPage; p++) {
      if (p > 5) break;
      html += '<button type="button" class="mini ' + (p === state.page ? 'active' : '') + '" onclick="moveNoticePage(' + p + ')" style="margin-left:4px">' + p + '</button>';
    }
    html += '<button type="button" class="mini" style="margin-left:4px" ' + (state.page >= totalPage ? 'disabled' : '') + ' onclick="moveNoticePage(' + (state.page + 1) + ')">다음</button>';
    pager.innerHTML = html;
    var table = root.querySelector('table');
    if (table && table.parentElement) table.parentElement.appendChild(pager);
  }

  function setListVisible(visible) {
    var root = noticeRoot();
    if (!root) return;
    Array.prototype.forEach.call(root.children, function (child) {
      if (child.id !== 'notice-detail-view') {
        child.style.display = visible ? '' : 'none';
      }
    });
  }

  function isNoticeDetailHistory() {
    return !!(history.state && history.state.tacsNoticeView === 'detail');
  }

  function pushNoticeDetailHistory(noticeNo) {
    if (!window.history || !history.pushState || state.suppressHistory) return;
    var current = history.state || {};
    if (current.tacsNoticeView === 'detail' && String(current.noticeNo) === String(noticeNo)) return;
    history.pushState({
      tacsNoticeView: 'detail',
      noticeNo: noticeNo
    }, '', location.href);
  }

  function hideNoticeDetail(renderList) {
    var detail = document.getElementById('notice-detail-view');
    if (detail) detail.style.display = 'none';
    state.detailOpen = false;
    setListVisible(true);
    if (renderList !== false) window.renderNoticeList();
  }

  window.renderNoticeList = function (page) {
    if (page != null) {
      var requestedPage = parseInt(page, 10);
      if (!isNaN(requestedPage) && requestedPage > 0) state.page = requestedPage;
    }
    var root = noticeRoot();
    if (!root) return;
    ensureNoticeScaffold(root);
    ensureFilters();
    applyUrlFiltersOnce();
    var params = query();
    updateNoticeUrl(params);
    fetch(contextPath() + '/notice/api/list.do?' + params.toString(), {
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error(t('errorList'));
        return res.json();
      })
      .then(function (data) {
        state.list = data.dataList || data.list || [];
        state.totalCount = data.totalRecord || data.totalCount || 0;
        state.page = data.currentPage || data.page || 1;
        state.size = data.screenSize || data.size || 10;
        renderRows();
        renderPager();
      })
      .catch(function () {
        var tbody = noticeTbody();
        var table = tbody ? tbody.closest('table') : null;
        var colCount = table ? table.querySelectorAll('thead th').length : 6;
        if (tbody) tbody.innerHTML = '<tr><td colspan="' + Math.max(colCount, 1) + '" style="padding:32px;text-align:center;color:#b91c1c">' + t('errorList') + '</td></tr>';
      });
  };

  window.moveNoticePage = function (page) {
    state.page = Math.max(page, 1);
    window.renderNoticeList(state.page);
  };

  window.openNoticeByIdx = function (idx) {
    idx = parseInt(idx, 10);
    if (isNaN(idx) || !state.list[idx]) return;
    window.openNoticeDetail(state.list[idx].noticeNo);
  };

  window.openNoticeDetail = function (noticeNo) {
    fetch(contextPath() + '/notice/api/' + noticeNo + '.do', {
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('공지사항 상세 조회 실패');
        return res.json();
      })
      .then(function (notice) {
        var root = noticeRoot();
        if (!root) return;
        var detail = document.getElementById('notice-detail-view');
        if (!detail) {
          detail = document.createElement('div');
          detail.id = 'notice-detail-view';
          root.appendChild(detail);
        }
        setListVisible(false);
        detail.style.display = 'block';
        state.detailOpen = true;
        pushNoticeDetailHistory(noticeNo);
        detail.innerHTML = '<div class="notice-detail">' +
          '<button type="button" class="btn btn-outline" style="margin-bottom:16px" onclick="closeNoticeDetail()">목록으로</button>' +
          '<div class="nd-header">' +
          '<div class="nd-title"><span class="' + badgeClass(notice.noticeType) + '">' + typeLabel(notice.noticeType) + '</span> ' + escapeHtml(notice.noticeTitle) + '</div>' +
          '<div class="nd-meta">' +
          '<div>작성자 <span>' + escapeHtml(notice.noticeAdminId || '관리자') + '</span></div>' +
          '<div>등록일시 <span>' + escapeHtml(notice.noticeAdddate || '') + '</span></div>' +
          '<div>조회수 <span>' + escapeHtml(notice.noticeCnt || 0) + '</span></div>' +
          '</div></div>' +
          '<div class="nd-body">' + renderNoticeContent(notice.noticeContent || '') + '</div>' +
          '</div>';
      })
      .catch(function (err) {
        alert(err.message);
      });
  };

  window.closeNoticeDetail = function () {
    if (!state.suppressHistory && isNoticeDetailHistory()) {
      history.back();
      return;
    }
    hideNoticeDetail(true);
  };

  window.addEventListener('popstate', function () {
    if (!state.detailOpen) return;
    state.suppressHistory = true;
    hideNoticeDetail(true);
    state.suppressHistory = false;
  });

  function init() {
    if (state.initialized || !noticeRoot()) return;
    state.initialized = true;
    ensureNoticeScaffold(noticeRoot());
    ensureFilters();
    window.renderNoticeList();
  }

  window.initCommonNotice = function () {
    if (state.initialized) {
      window.renderNoticeList();
      return;
    }
    init();
  };

  function waitForRoot() {
    init();
    if (state.initialized) return;
    if (state.initAttempts++ > 40) return;
    setTimeout(waitForRoot, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(waitForRoot, 30);
    });
  } else {
    setTimeout(waitForRoot, 30);
  }
})();
