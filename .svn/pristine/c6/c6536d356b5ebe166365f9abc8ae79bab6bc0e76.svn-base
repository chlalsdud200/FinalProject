(function () {
  if (window.__tacsCommonFaqLoaded) return;
  window.__tacsCommonFaqLoaded = true;

  var state = {
    attempts: 0,
    root: null,
    page: 1,
    size: 10
  };

  var CATEGORY_MAP = {
    all: 'all',
    system: 'SYSTEM',
    declare: 'IMPORT',
    import: 'IMPORT',
    export: 'EXPORT',
    report: 'DOC',
    doc: 'DOC',
    docs: 'DOC',
    tax: 'PAYMENT',
    payment: 'PAYMENT',
    quarantine: 'ETC',
    inspect: 'ETC',
    account: 'ACCOUNT',
    transport: 'TRANSPORT',
    warehouse: 'WAREHOUSE',
    etc: 'ETC'
  };

  function contextPath() {
    if (window.contextPath) return window.contextPath;
    var meta = document.querySelector('meta[name="ctx-path"]');
    return meta && meta.content ? meta.content : '';
  }

  function isVisible(el) {
    if (!el) return false;
    var cur = el;
    while (cur && cur !== document.body) {
      var style = window.getComputedStyle(cur);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      cur = cur.parentElement;
    }
    return true;
  }

  function findRoot() {
    // Priority 1: Elements explicitly marked as FAQ root
    var root = document.querySelector('[data-faq-root]');
    if (root) return root;

    // Priority 2: Context-specific IDs
    var isTransport = window.location.pathname.indexOf('/transport/') > -1;
    var isOfficer = window.location.pathname.indexOf('/officer/') > -1;
    
    if (isTransport) {
      root = document.querySelector('#cm-cs') || document.querySelector('#comm-support');
      if (root) return root;
    }
    if (isOfficer) {
      root = document.querySelector('#cm-cs-admin');
      if (root) return root;
    }

    // Priority 3: Any of the known FAQ containers
    var list = document.querySelectorAll('#comm-support, #cm-cs-admin, #cm-cs, [data-faq-root]');
    for (var i = 0; i < list.length; i++) {
      if (isVisible(list[i])) return list[i];
    }
    return root || list[0];
  }

  function ensureStyle() {
    if (document.getElementById('tacs-common-faq-style')) return;
    var style = document.createElement('style');
    style.id = 'tacs-common-faq-style';
    style.textContent =
      '.tacs-faq-container{background:#fff;margin-bottom:24px}' +
      '.tacs-faq-empty{padding:24px;text-align:center;color:#94a3b8;font-size:12px;border:1px solid #e2e8f0;background:#fff}' +
      '.tacs-faq-error{padding:24px;text-align:center;color:#b91c1c;font-size:12px;border:1px solid #fee2e2;background:#fff}' +
      '.tacs-faq-meta{display:inline-block;margin-right:8px;color:#565e74;font-size:10px;font-weight:800}' +
      '.tacs-faq-qtext{font-weight:700;color:#203444}' +
      '.tacs-faq-answer{white-space:pre-line}' +
      '.tacs-faq-search-bar{display:flex;align-items:center;gap:8px;margin:0 0 12px;border-left:3px solid #565e74;padding-left:12px}' +
      '.tacs-faq-search-bar select{height:34px;min-width:120px;border:1px solid #cbd5e1;background:#fff;color:#334155;font-size:12px;padding:0 8px}' +
      '.tacs-faq-search-bar .search-wrap{position:relative;flex:1}' +
      '.tacs-faq-search-bar .search-wrap .material-symbols-outlined{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:17px;color:#697d8f}' +
      '.tacs-faq-search-bar .search-wrap input{width:100%;height:34px;padding:0 10px 0 34px;border:1px solid #cbd5e1;background:#fff;font-size:12px;box-sizing:border-box}' +
      '.tacs-faq-search-bar .btn.btn-dark{height:34px;padding:0 18px;border:0;background:#373f54;color:#f7f7ff;font-size:12px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}' +
      '.tacs-faq-search-bar .btn.btn-dark:hover{background:#2a3142}' +
      '.tacs-faq-filter{margin-bottom:16px}' +
      '.tacs-faq-filter .cs-category,.tacs-faq-filter .faq-chip{display:inline-flex;align-items:center;height:30px;padding:0 14px;margin:0 4px 8px 0;border:1px solid #cbd5e1;background:#fff;color:#64748b;font-size:12px;font-weight:700;cursor:pointer}' +
      '.tacs-faq-filter .cs-category.active,.tacs-faq-filter .faq-chip.active{background:#565e74;color:#fff;border-color:#565e74}' +
      '.tacs-faq-pagination{display:flex;justify-content:center;align-items:center;gap:6px;margin:16px 0 24px}' +
      '.tacs-faq-pagination .page-btn{min-width:30px;height:30px;padding:0 8px;margin:0 2px;border:1px solid #cbd5e1;background:#fff;color:#475569;font-size:12px;font-weight:700;cursor:pointer}' +
      '.tacs-faq-pagination .page-btn:hover:not(:disabled):not(.active){background:#f8fafc;border-color:#94a3b8}' +
      '.tacs-faq-pagination .page-btn.active{background:#565e74;border-color:#565e74;color:#fff}' +
      '.tacs-faq-pagination .page-btn:disabled{opacity:.45;cursor:not-allowed}';
    document.head.appendChild(style);
  }

  function ensureSearchBar(root) {
    var input = root.querySelector('#faq-search, #faq-search-keyword, input[data-faq-search]');
    var bar = root.querySelector('.tacs-faq-search-bar');

    if (!bar && input) {
      bar = input.closest('.filter-bar') || input.parentElement;
      if (bar) bar.classList.add('tacs-faq-search-bar');
    }

    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'filter-bar tacs-faq-search-bar';
      bar.innerHTML =
        '<select id="faq-search-type" data-faq-search-type style="min-width:120px">' +
          '<option value="title">제목</option>' +
          '<option value="content">내용</option>' +
        '</select>' +
        '<div class="search-wrap" style="flex:1">' +
          '<span class="material-symbols-outlined">search</span>' +
          '<input id="faq-search" data-faq-search placeholder="FAQ 제목 검색">' +
        '</div>' +
        '<button type="button" class="btn btn-dark" onclick="renderFaqList(1)">조회</button>';

      var alert = root.querySelector('.tacs-faq-info-bar, .alert-bar, .notice-strip');
      var filter = root.querySelector('.faq-filter, .tacs-faq-filter, .faq-filter-container');
      if (alert && alert.nextSibling) {
        root.insertBefore(bar, alert.nextSibling);
      } else if (filter) {
        root.insertBefore(bar, filter);
      } else {
        root.insertBefore(bar, root.firstChild);
      }
    }

    var select = bar.querySelector('#faq-search-type, select[data-faq-search-type]');
    if (!select) {
      select = document.createElement('select');
      select.id = 'faq-search-type';
      select.setAttribute('data-faq-search-type', '');
      select.style.minWidth = '120px';
      select.innerHTML = '<option value="title">제목</option><option value="content">내용</option>';
      bar.insertBefore(select, bar.firstChild);
    }

    input = bar.querySelector('#faq-search, #faq-search-keyword, input[data-faq-search]');
    if (!input) {
      var wrap = document.createElement('div');
      wrap.className = 'search-wrap';
      wrap.style.flex = '1';
      wrap.innerHTML = '<span class="material-symbols-outlined">search</span><input id="faq-search" data-faq-search placeholder="FAQ 제목 검색">';
      var btn = bar.querySelector('button');
      if (btn) bar.insertBefore(wrap, btn); else bar.appendChild(wrap);
    } else {
      input.setAttribute('data-faq-search', '');
    }

    return bar;
  }

  function ensureFilter(root) {
    var filter = root.querySelector('.tacs-faq-filter, .faq-filter, .faq-filter-container');
    if (filter) {
      filter.classList.add('tacs-faq-filter');
      return filter;
    }

    filter = document.createElement('div');
    filter.className = 'tacs-faq-filter faq-filter';
    filter.innerHTML =
      '<button type="button" class="cs-category active" data-faq-ctgry="all" onclick="filterFaq(\'all\',this)">전체</button>' +
      '<button type="button" class="cs-category" data-faq-ctgry="SYSTEM" onclick="filterFaq(\'system\',this)">시스템 이용</button>' +
      '<button type="button" class="cs-category" data-faq-ctgry="IMPORT" onclick="filterFaq(\'import\',this)">수입통관</button>' +
      '<button type="button" class="cs-category" data-faq-ctgry="EXPORT" onclick="filterFaq(\'export\',this)">수출통관</button>' +
      '<button type="button" class="cs-category" data-faq-ctgry="DOC" onclick="filterFaq(\'doc\',this)">문서함</button>' +
      '<button type="button" class="cs-category" data-faq-ctgry="TRANSPORT" onclick="filterFaq(\'transport\',this)">운송</button>' +
      '<button type="button" class="cs-category" data-faq-ctgry="WAREHOUSE" onclick="filterFaq(\'warehouse\',this)">창고</button>' +
      '<button type="button" class="cs-category" data-faq-ctgry="ACCOUNT" onclick="filterFaq(\'account\',this)">계정/인증</button>';

    var searchBar = ensureSearchBar(root);
    if (searchBar && searchBar.nextSibling) {
      root.insertBefore(filter, searchBar.nextSibling);
    } else {
      root.appendChild(filter);
    }
    return filter;
  }

  function applyCategoryVisibility(root, availableCtgryCds) {
    if (!Array.isArray(availableCtgryCds)) return;

    var allowed = {};
    availableCtgryCds.forEach(function (code) {
      allowed[String(code || '').toUpperCase()] = true;
    });

    var filter = ensureFilter(root);
    var activeVisible = false;
    filter.querySelectorAll('.cs-category, .faq-chip').forEach(function (btn) {
      var raw = btn.dataset.faqCtgry || btn.getAttribute('data-cat') || btn.getAttribute('data-category') || 'all';
      var code = CATEGORY_MAP[String(raw).toLowerCase()] || String(raw).toUpperCase();
      var visible = code === 'all' || !!allowed[code];
      btn.style.display = visible ? '' : 'none';
      if (!visible) btn.classList.remove('active');
      if (visible && btn.classList.contains('active')) activeVisible = true;
    });

    if (!activeVisible) {
      var all = filter.querySelector('[data-faq-ctgry="all"], [data-cat="all"], [data-category="all"]');
      if (all) all.classList.add('active');
    }
  }

  function ensureContainer(root) {
    var container = root.querySelector('#faq-container, .tacs-faq-container');
    if (container) {
      container.classList.add('tacs-faq-container');
      return container;
    }

    container = document.createElement('div');
    container.id = 'faq-container';
    container.className = 'tacs-faq-container';

    var oldList = Array.prototype.find.call(root.children, function (child) {
      return child.querySelector && child.querySelector('.faq-item');
    });
    if (oldList) {
      oldList.replaceWith(container);
      return container;
    }

    var filter = ensureFilter(root);
    if (filter && filter.nextSibling) {
      root.insertBefore(container, filter.nextSibling);
    } else {
      root.appendChild(container);
    }
    return container;
  }

  function inferCategoryByButtonText(raw, active) {
    var text = active ? active.textContent.trim() : '';
    if (raw === 'declare' && /재고|창고|정산/.test(text)) return 'WAREHOUSE';
    if (/수출/.test(text)) return 'EXPORT';
    if (/수입|통관|의뢰|신고서/.test(text)) return 'IMPORT';
    if (/문서/.test(text)) return 'DOC';
    if (/운송/.test(text)) return 'TRANSPORT';
    if (/창고|재고/.test(text)) return 'WAREHOUSE';
    if (/계정|인증|비밀번호/.test(text)) return 'ACCOUNT';
    if (/시스템/.test(text)) return 'SYSTEM';
    return null;
  }

  function activeCategory(root) {
    var active = root.querySelector('.cs-category.active, .faq-chip.active');
    var raw = active ? (active.dataset.faqCtgry || active.getAttribute('data-cat') || active.getAttribute('data-category') || '') : '';
    if (!raw && active) {
      var onclick = active.getAttribute('onclick') || '';
      var match = onclick.match(/filter(?:Admin)?Faq\(['"]([^'"]+)['"]/);
      raw = match ? match[1] : '';
    }

    raw = (raw || 'all').toLowerCase();
    var inferred = inferCategoryByButtonText(raw, active);
    return inferred || CATEGORY_MAP[raw] || raw.toUpperCase();
  }

  function searchType(root) {
    var select = root.querySelector('#faq-search-type, select[data-faq-search-type]');
    var value = select ? select.value : 'title';
    value = (value || 'title').toLowerCase();
    return ['title', 'content', 'all'].indexOf(value) >= 0 ? value : 'title';
  }

  function searchWord(root) {
    var input = root.querySelector('#faq-search, #faq-search-keyword, input[data-faq-search]');
    return input ? input.value.trim() : '';
  }

  function updateSearchPlaceholder(root) {
    var input = root.querySelector('#faq-search, #faq-search-keyword, input[data-faq-search]');
    if (!input) return;
    input.placeholder = searchType(root) === 'content' ? 'FAQ 내용 검색' : 'FAQ 제목 검색';
  }

  function bindSearch(root) {
    ensureSearchBar(root);

    var input = root.querySelector('#faq-search, #faq-search-keyword, input[data-faq-search]');
    if (input && input.dataset.faqBound !== 'Y') {
      input.dataset.faqBound = 'Y';
      var timer;
      input.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          window.renderFaqList(1);
        }, 300);
      });
      input.addEventListener('keyup', function (event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
          window.renderFaqList(1);
        }
      });
    }

    var select = root.querySelector('#faq-search-type, select[data-faq-search-type]');
    if (select && select.dataset.faqBound !== 'Y') {
      select.dataset.faqBound = 'Y';
      select.addEventListener('change', function () {
        updateSearchPlaceholder(root);
        window.renderFaqList(1);
      });
    }
    updateSearchPlaceholder(root);
  }

  function ensurePagination(root) {
    var pagination = root.querySelector('[data-faq-pagination], #faq-pagination, .tacs-faq-pagination');
    if (pagination) {
      pagination.classList.add('tacs-faq-pagination');
      return pagination;
    }

    pagination = document.createElement('div');
    pagination.id = 'faq-pagination';
    pagination.className = 'pagination tacs-faq-pagination';
    pagination.setAttribute('data-faq-pagination', '');

    var container = ensureContainer(root);
    if (container.nextSibling) {
      root.insertBefore(pagination, container.nextSibling);
    } else {
      root.appendChild(pagination);
    }

    return pagination;
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderItems(root, list) {
    var container = ensureContainer(root);
    if (!list.length) {
      container.innerHTML = '<div class="tacs-faq-empty">조회된 FAQ가 없습니다.</div>';
      return;
    }

    container.innerHTML = list.map(function (faq) {
      return '<div class="faq-item" data-faq-no="' + escapeHtml(faq.faqNo) + '">' +
        '<div class="faq-q" onclick="toggleFaq(this)">' +
        '<span><span class="tacs-faq-meta">Q.</span><span class="tacs-faq-qtext">' + escapeHtml(faq.faqQstnCn) + '</span></span>' +
        '<span class="material-symbols-outlined" style="font-size:18px;color:#94a3b8">expand_more</span>' +
        '</div>' +
        '<div class="faq-a"><strong>A.</strong> <span class="tacs-faq-answer">' + escapeHtml(faq.faqAnsCn) + '</span></div>' +
        '</div>';
    }).join('');
  }

  function renderPagination(root, data) {
    var nav = ensurePagination(root);
    var totalPage = Number(data.totalPage || data.totalPageCount || 0);
    var totalRecord = Number(data.totalRecord || data.totalCount || 0);
    var screenSize = Number(data.screenSize || state.size || 10);
    if (!totalPage && totalRecord) {
      totalPage = Math.ceil(totalRecord / screenSize);
    }

    var currentPage = Number(data.currentPage || data.page || state.page || 1);
    var startPage = Number(data.startPage || 1);
    var endPage = Number(data.endPage || totalPage);

    nav.innerHTML = '';
    var isTransport = window.location.pathname.indexOf('/transport/') > -1;
    if (totalPage < 1 || (isTransport && totalPage <= 1)) return;

    startPage = Math.max(startPage, 1);
    endPage = Math.min(endPage, totalPage);

    function addButton(label, page, disabled, active) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'page-btn' + (active ? ' active' : '');
      btn.textContent = label;
      btn.disabled = !!disabled;
      btn.dataset.page = page;
      btn.addEventListener('click', function () {
        window.renderFaqList(Number(this.dataset.page));
      });
      nav.appendChild(btn);
    }

    addButton('«', 1, currentPage <= 1, false);
    addButton('‹', Math.max(currentPage - 1, 1), currentPage <= 1, false);
    for (var page = startPage; page <= endPage; page++) {
      addButton(String(page), page, false, page === currentPage);
    }
    addButton('›', Math.min(currentPage + 1, totalPage), currentPage >= totalPage, false);
    addButton('»', totalPage, currentPage >= totalPage, false);
  }


  window.renderFaqList = function (page) {
    var root = findRoot();
    if (!root) return;
    state.root = root;
    state.page = Math.max(Number(page || state.page || 1), 1);

    ensureStyle();
    ensureSearchBar(root);
    ensureFilter(root);
    ensureContainer(root);
    ensurePagination(root);
    bindSearch(root);

    var params = new URLSearchParams();
    params.set('ctgryCd', activeCategory(root));
    params.set('searchType', searchType(root));
    params.set('searchWord', searchWord(root));
    params.set('keyword', searchWord(root));
    params.set('currentPage', String(state.page));
    params.set('page', String(state.page));
    params.set('size', String(state.size));

    fetch(contextPath() + '/faq/api/list.do?' + params.toString(), {
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status === 401 ? '로그인이 필요합니다.' : 'FAQ 조회 중 오류가 발생했습니다.');
        return res.json();
      })
      .then(function (data) {
        state.page = Number(data.currentPage || data.page || state.page || 1);
        applyCategoryVisibility(root, data.availableCtgryCds);
        renderItems(root, data.dataList || data.list || []);
        renderPagination(root, data);
      })
      .catch(function (err) {
        ensureContainer(root).innerHTML = '<div class="tacs-faq-error">' + escapeHtml(err.message) + '</div>';
        ensurePagination(root).innerHTML = '';
      });
  };

  window.filterFaq = function (cat, btn) {
    var root = findRoot();
    if (!root) return;
    root.querySelectorAll('.cs-category, .faq-chip').forEach(function (el) {
      el.classList.remove('active');
    });
    if (btn) {
      btn.classList.add('active');
      btn.dataset.faqCtgry = CATEGORY_MAP[String(cat || 'all').toLowerCase()] || String(cat || 'all').toUpperCase();
    }
    window.renderFaqList(1);
  };

  window.filterAdminFaq = window.filterFaq;

  window.toggleFaq = function (el) {
    var root = (el && el.closest('[data-faq-root], #comm-support, #cm-cs-admin, #cm-cs')) || findRoot() || document;
    var answer = el ? el.nextElementSibling : null;
    var icon = el ? el.querySelector('.material-symbols-outlined') : null;
    if (!answer) return;

    var wasOpen = answer.classList.contains('open');
    root.querySelectorAll('.faq-a.open').forEach(function (item) {
      item.classList.remove('open');
      var itemIcon = item.previousElementSibling ? item.previousElementSibling.querySelector('.material-symbols-outlined') : null;
      if (itemIcon) itemIcon.textContent = 'expand_more';
    });

    if (!wasOpen) {
      answer.classList.add('open');
      if (icon) icon.textContent = 'expand_less';
    }
  };

  window.toggleAdminFaq = window.toggleFaq;

  window.initCommonFaq = function () {
    var root = findRoot();
    if (!root) return false;
    window.renderFaqList();
    return true;
  };

  function waitForRoot() {
    if (window.initCommonFaq()) return;
    if (state.attempts++ > 50) return;
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
