/**
 * TACS 공통 문서함 JS
 * 적용 대상: OWNER / BROKER / OFFICER / TRANSPORT_MANAGER / WAREHOUSE_MANAGER / SYSTEM_ADMIN
 * 백엔드 API: /api/docs/**
 *
 * 주요 반영사항
 * 1. 서버 응답의 숫자 ID를 file-번호 / folder-번호로 정규화
 * 2. 폴더/파일 휴지통 이동 정상 처리
 * 3. 그리드 보기 / 목록 보기 모두 지원
 * 4. 목록 보기에서 행별 다운로드 / 이름변경 / 휴지통 버튼 제공
 * 5. 현재 폴더가 루트가 아니면 "..." 상위폴더 항목 표시
 * 6. "..."은 한 번 클릭으로 상위폴더 이동, 일반 폴더는 더블클릭으로 이동
 * 7. 각 액터 화면에 문서함 DOM이 부족하면 JS가 공통 문서함 화면을 주입
 */
(function () {
  'use strict';

  function getContextPath() {
    if (typeof window.contextPath !== 'undefined') return window.contextPath || '';
    var meta = document.querySelector('meta[name="ctx-path"]');
    if (meta) return meta.getAttribute('content') || '';
    var path = window.location.pathname || '';
    var first = path.split('/').filter(Boolean)[0];
    return first && first !== 'owner' && first !== 'warehouse' && first !== 'broker' && first !== 'fieldofficer' && first !== 'transport' && first !== 'officer' ? '/' + first : '';
  }

  function docsIsUsableCsrfValue(value) {
    return !!value && value !== 'undefined' && value !== 'null' && value.indexOf('${') < 0;
  }

  function docsCsrfHeaders() {
    var tokenEl = document.querySelector('meta[name="_csrf"]');
    var headerEl = document.querySelector('meta[name="_csrf_header"]');
    var token = tokenEl ? tokenEl.getAttribute('content') : '';
    var header = headerEl ? headerEl.getAttribute('content') : '';
    var headers = { 'X-Requested-With': 'XMLHttpRequest' };

    if (docsIsUsableCsrfValue(token) && docsIsUsableCsrfValue(header)) {
      headers[header] = token;
    }

    return headers;
  }

  var DOCS_BASE = getContextPath() + '/api/docs';
  var DOCS_MAX_BYTES = 5 * 1024 * 1024 * 1024;

  var DocsState = {
    currentFolderId: null,
    parentFolderId: null,
    breadcrumb: [],
    view: localStorage.getItem('tacs.docs.view') || 'grid',
    filter: localStorage.getItem('tacs.docs.filter') || 'all',
    dateFilter: 'all',
    dateStart: null,
    dateEnd: null,
    items: [],
    selected: new Set(),
    selectionAnchorId: null,
    ctxTargetId: null,
    renamingId: null,
    storage: null
  };

  var docsPreviewingId = null;
  var docsUploadStatusTimer = null;
  var DocsDatePicker = {
    start: null,
    end: null,
    month: null
  };

  function docsClearStoredDateFilter() {
    localStorage.removeItem('tacs.docs.dateFilter');
    localStorage.removeItem('tacs.docs.dateStart');
    localStorage.removeItem('tacs.docs.dateEnd');
  }

  function docsResetDateFilter() {
    DocsState.dateFilter = 'all';
    DocsState.dateStart = null;
    DocsState.dateEnd = null;
    DocsDatePicker.start = null;
    DocsDatePicker.end = null;
    docsClearStoredDateFilter();
  }

  function docsEsc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function docsAttr(v) {
    return docsEsc(v).replace(/`/g, '&#96;');
  }

  function docsNormalizeId(type, id) {
    if (id == null) return '';
    var s = String(id);
    if (s.indexOf('file-') === 0 || s.indexOf('folder-') === 0 || s === 'up') return s;
    return String(type || '').toLowerCase() + '-' + s;
  }

  function docsRawId(id) {
    if (id == null) return null;
    var s = String(id);
    if (s.indexOf('-') >= 0) return s.substring(s.indexOf('-') + 1);
    return s;
  }

  function docsNormalizeItem(item) {
    var type = item.type || item.itemType || 'file';
    return {
      id: docsNormalizeId(type, item.id),
      rawId: item.rawId || docsRawId(item.id),
      type: type,
      name: item.name || '',
      size: Number(item.size || 0),
      createdAt: item.createdAt || '',
      updatedAt: item.updatedAt || '',
      uploadStatus: item.uploadStatus || item.dfiUploadSttsCd || '',
      createdBy: item.createdBy || ''
    };
  }

  function docsNormalizeFolder(folder) {
    return {
      id: docsNormalizeId('folder', folder.id),
      rawId: folder.rawId || docsRawId(folder.id),
      name: folder.name || ''
    };
  }

  function docsApi(url, options) {
    var opt = Object.assign({ credentials: 'same-origin' }, options || {});
    opt.headers = Object.assign(docsCsrfHeaders(), opt.headers || {});

    return fetch(DOCS_BASE + url, opt)
      .then(function (res) {
        if (!res.ok) {
          return res.text().then(function (txt) {
            throw new Error(txt || ('HTTP ' + res.status));
          });
        }
        var ct = res.headers.get('content-type') || '';
        if (ct.indexOf('application/json') >= 0) return res.json();
        return res.text();
      });
  }

  function docsCommonScaffold() {
    return '' +
      '<div class="tacs-docs-cloud" id="pg-docs" style="padding:0;">' +
      '  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;gap:16px;flex-wrap:wrap;">' +
      '    <div>' +
      '      <h1 style="font-size:28px;font-weight:900;color:#0f172a;letter-spacing:-0.5px;margin:0 0 8px;">문서함</h1>' +
      '      <div id="docs-breadcrumb" style="display:flex;align-items:center;gap:4px;font-size:12px;color:#94a3b8;flex-wrap:wrap;"></div>' +
      '    </div>' +
      '    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">' +
      '      <button class="btn btn-outline" onclick="docsNewFolder()" style="display:flex;align-items:center;gap:6px;padding:7px 12px;border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">' +
      '        <span class="material-symbols-outlined" style="font-size:18px;">create_new_folder</span>새 폴더' +
      '      </button>' +
      '      <label class="btn btn-primary" style="display:flex;align-items:center;gap:6px;cursor:pointer;margin:0;padding:7px 12px;border:1px solid #0f172a;background:#0f172a;color:#fff;border-radius:8px;font-size:12px;font-weight:700;">' +
      '        <span class="material-symbols-outlined" style="font-size:18px;">upload_file</span>업로드' +
      '        <input multiple onchange="docsUploadFiles(this.files)" style="display:none" type="file" />' +
      '      </label>' +
      '    </div>' +
      '  </div>' +
      '  <div id="docs-storage-wrap" style="margin-bottom:18px;padding:14px 16px;border:1px solid #e2e8f0;background:#fff;border-radius:14px;">' +
      '    <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:8px;">' +
      '      <div style="font-size:13px;font-weight:900;color:#0f172a;display:flex;align-items:center;gap:6px;"><span class="material-symbols-outlined" style="font-size:18px;">database</span>저장공간</div>' +
      '      <div style="font-size:12px;color:#64748b;"><span id="docs-storage-used">0 B</span> 사용 · <span id="docs-storage-remain">5 GB</span> 남음 <span id="docs-storage-pct-badge" style="display:inline-block;margin-left:6px;padding:2px 8px;border-radius:999px;background:#e2e8f0;font-weight:800;">0%</span></div>' +
      '    </div>' +
      '    <div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden;"><div id="docs-storage-fill" style="width:0%;height:100%;background:linear-gradient(90deg,#565e74,#818cf8);"></div></div>' +
      '    <div id="docs-storage-warn" style="display:none;margin-top:8px;font-size:12px;font-weight:800;color:#dc2626;">저장공간 사용량이 높습니다.</div>' +
      '  </div>' +
      '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;gap:12px;flex-wrap:wrap;">' +
      '    <div style="position:relative;flex:1;min-width:220px;max-width:360px;">' +
      '      <span class="material-symbols-outlined" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:16px;color:#94a3b8;pointer-events:none;">search</span>' +
      '      <input id="docs-search" oninput="docsRender()" placeholder="문서 검색..." style="width:100%;box-sizing:border-box;padding:9px 12px 9px 38px;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;outline:none;background:#f8fafc;" />' +
      '    </div>' +
      '    <div style="display:flex;border:1px solid #e2e8f0;overflow:hidden;background:#fff;border-radius:10px;">' +
      '      <button id="docs-view-grid" onclick="docsSetView(\'grid\')" style="padding:8px 12px;border:none;cursor:pointer;background:#fff;color:#64748b;" title="바둑판 보기"><span class="material-symbols-outlined" style="font-size:19px;display:block;">grid_view</span></button>' +
      '      <button id="docs-view-list" onclick="docsSetView(\'list\')" style="padding:8px 12px;border:none;cursor:pointer;background:#fff;color:#64748b;" title="목록 보기"><span class="material-symbols-outlined" style="font-size:19px;display:block;">view_list</span></button>' +
      '    </div>' +
      '  </div>' +
      '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;gap:16px;flex-wrap:wrap;padding-bottom:12px;border-bottom:1px solid #e2e8f0;">' +
      '    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">' +
      '      <span style="font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;padding:6px 0;">필터:</span>' +
      '      <button class="docs-filter-chip active" onclick="docsSetFilter(\'all\',this)">전체</button>' +
      '      <button class="docs-filter-chip" onclick="docsSetFilter(\'folder\',this)">폴더</button>' +
      '      <button class="docs-filter-chip" onclick="docsSetFilter(\'file\',this)">파일</button>' +
      '    </div>' +
      '    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">' +
      '      <span style="font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;padding:6px 0;">기간:</span>' +
      '      <button class="docs-filter-chip active" id="docs-date-chip-all" onclick="docsSetDateFilter(\'all\',this)">전체 기간</button>' +
      '      <button class="docs-filter-chip" id="docs-date-chip-today" onclick="docsSetDateFilter(\'today\',this)">오늘</button>' +
      '      <button class="docs-filter-chip" id="docs-date-chip-week" onclick="docsSetDateFilter(\'week\',this)">1주일</button>' +
      '      <button class="docs-filter-chip" id="docs-date-chip-month" onclick="docsSetDateFilter(\'month\',this)">1개월</button>' +
      '      <button class="docs-filter-chip" id="docs-date-chip-custom" data-docs-date-range-btn onclick="docsOpenDatePicker(this)" style="display:flex;align-items:center;gap:4px"><span class="material-symbols-outlined" style="font-size:14px">calendar_today</span><span class="btn-text">기간선택</span></button>' +
      '    </div>' +
      '  </div>' +
      '  <div id="docs-date-picker-modal" onclick="docsCloseDatePicker(event)" style="display:none"></div>' +
      '  <div id="docs-action-bar" style="display:none;background:#eff6ff;border:1px solid #bfdbfe;padding:10px 16px;margin-bottom:12px;align-items:center;justify-content:flex-end;border-radius:10px;">' +
      '    <div class="docs-selection-summary" style="display:none;"><span id="docs-sel-count">0</span></div>' +
      '    <div style="display:flex;gap:8px;"><button class="mini mini-view" onclick="docsDownloadSelected()">다운로드</button><button class="mini mini-reject" onclick="docsDeleteSelected()">휴지통</button><button class="mini mini-view" onclick="docsClearSelection()">선택 해제</button></div>' +
      '  </div>' +
      '  <div id="docs-list-table-wrapper" style="display:none;border:1px solid #e2e8f0;background:#fff;border-radius:14px;overflow:hidden;"><table class="data-table docs-list-table" style="width:100%;border-collapse:collapse;"><thead id="docs-list-thead"></thead><tbody id="docs-list-tbody"></tbody></table></div>' +
      '  <div id="docs-container" style="border:1px solid #e2e8f0;background:#fff;min-height:400px;border-radius:14px;overflow:hidden;"></div>' +
      '  <div id="docs-empty" style="display:none;padding:64px;text-align:center;background:#fff;border:1px solid #e2e8f0;border-radius:14px;">' +
      '    <span class="material-symbols-outlined" style="font-size:48px;color:#cbd5e1;display:block;margin-bottom:16px;">folder_open</span><div style="font-size:15px;font-weight:800;color:#64748b;">문서가 없습니다</div><div style="font-size:12px;color:#94a3b8;margin-top:6px;">새 문서를 업로드하거나 폴더를 만들어보세요.</div>' +
      '  </div>' +
      '</div>';
  }

  function buildDocumentArchivePanel() {
    return docsCommonScaffold();
  }

  function docsInjectStyles() {
    if (document.getElementById('tacs-docs-common-style')) return;
    var style = document.createElement('style');
    style.id = 'tacs-docs-common-style';
    style.textContent = '' +
      '.docs-filter-chip{border:1px solid #e2e8f0;background:#fff;color:#64748b;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:800;cursor:pointer}.docs-filter-chip.active{background:#0f172a;color:#fff;border-color:#0f172a}.docs-card{position:relative;border:1px solid #e2e8f0;background:#fff;border-radius:14px;padding:14px 10px;cursor:pointer;transition:.12s;min-height:122px}.docs-card:hover{border-color:#94a3b8;box-shadow:0 8px 24px rgba(15,23,42,.08);transform:translateY(-1px)}.docs-card-selected{border-color:#2563eb!important;background:#eff6ff}.docs-card-check{position:absolute;top:8px;left:8px;z-index:2}.docs-card-actions{position:absolute;top:7px;right:7px;display:flex;gap:2px}.docs-icon-btn{border:none;background:#f8fafc;color:#64748b;border-radius:8px;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}.docs-icon-btn:hover{background:#e2e8f0;color:#0f172a}.docs-icon-btn.danger:hover{background:#fee2e2;color:#dc2626}.docs-card-name{font-size:13px;font-weight:800;color:#0f172a;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px}.docs-card-meta{font-size:11px;color:#94a3b8;text-align:center;margin-top:5px}.docs-list-row{border-bottom:1px solid #f1f5f9;cursor:pointer}.docs-list-row:hover{background:#f8fafc}.docs-list-row-sel{background:#eff6ff!important}.docs-row-action{border:1px solid #e2e8f0;background:#fff;color:#64748b;border-radius:8px;padding:5px 7px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}.docs-row-action:hover{background:#f8fafc;color:#0f172a}.docs-row-action.danger:hover{background:#fee2e2;color:#dc2626;border-color:#fecaca}.docs-up-row,.docs-up-card{background:#f8fafc}.mini{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:800;cursor:pointer}.mini-reject{color:#dc2626;border-color:#fecaca}.mini-view{color:#334155}.docs-modal-open{display:flex!important}.docs-ctx-menu{position:absolute;z-index:9999;display:none;min-width:170px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 18px 40px rgba(15,23,42,.15);padding:6px}.docs-ctx-item{display:flex;align-items:center;gap:8px;width:100%;border:none;background:#fff;padding:9px 10px;border-radius:8px;font-size:13px;font-weight:800;color:#334155;cursor:pointer;text-align:left}.docs-ctx-item:hover{background:#f8fafc}.docs-ctx-item.danger{color:#dc2626}.docs-ctx-sep{height:1px;background:#e2e8f0;margin:5px 0}.docs-drop-overlay{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(15,23,42,.45);z-index:9998;color:#fff;font-size:22px;font-weight:900}.docs-preview-modal{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(15,23,42,.45);z-index:9997}.docs-preview-box{width:min(520px,92vw);background:#fff;border-radius:18px;box-shadow:0 24px 80px rgba(15,23,42,.25);overflow:hidden}.docs-preview-head{display:flex;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid #e2e8f0}.docs-preview-title{font-size:16px;font-weight:900;color:#0f172a}.docs-preview-body{padding:24px;text-align:center}.docs-preview-info{display:grid;grid-template-columns:110px 1fr;text-align:left;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-top:18px;font-size:13px}.docs-close-btn{border:none;background:#f8fafc;border-radius:10px;width:34px;height:34px;cursor:pointer}.material-symbols-outlined{font-family:"Material Symbols Outlined";display:inline-block;width:1em;min-width:1em;overflow:hidden;white-space:nowrap;line-height:1;font-feature-settings:"liga";-webkit-font-feature-settings:"liga"}';
    document.head.appendChild(style);
  }

  function docsEnsureScaffold() {
    docsInjectStyles();

    if (!document.getElementById('docs-container')) {
      var mount = document.getElementById('docArchiveRoot') || document.getElementById('pg-docs') || document.getElementById('docs-content') || document.querySelector('main.content') || document.querySelector('#detailBody') || document.querySelector('.detail-body') || document.body;
      if (mount.id === 'docArchiveRoot') mount.innerHTML = docsCommonScaffold();
      else mount.innerHTML = docsCommonScaffold();
    }

    docsEnsureSupplementDom();
    docsBindStaticEvents();
  }

  function docsEnsureSupplementDom() {
    var menu = document.getElementById('docs-ctx-menu');
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'docs-ctx-menu';
      document.body.appendChild(menu);
    }

    menu.className = 'docs-ctx-menu';
    menu.style.display = 'none';
    menu.innerHTML = '' +
      '<button type="button" class="docs-ctx-item" data-action="preview"><span class="material-symbols-outlined" style="font-size:18px;">visibility</span>미리보기</button>' +
      '<button type="button" class="docs-ctx-item" data-action="download"><span class="material-symbols-outlined" style="font-size:18px;">download</span>다운로드</button>' +
      '<button type="button" class="docs-ctx-item" data-action="rename"><span class="material-symbols-outlined" style="font-size:18px;">drive_file_rename_outline</span>이름 바꾸기</button>' +
      '<div class="docs-ctx-sep"></div>' +
      '<button type="button" class="docs-ctx-item danger" data-action="delete"><span class="material-symbols-outlined" style="font-size:18px;">delete</span>휴지통</button>';

    if (!menu.dataset.docsBound) {
      menu.dataset.docsBound = 'Y';
      menu.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;

        var action = btn.getAttribute('data-action');
        if (action === 'preview') docsCtxPreview();
        if (action === 'download') docsCtxDownload();
        if (action === 'rename') docsCtxRename();
        if (action === 'delete') docsCtxDelete();

        docsHideCtxMenu();
      });
    }

    var overlay = document.getElementById('docs-drop-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'docs-drop-overlay';
      document.body.appendChild(overlay);
    }

    overlay.className = 'docs-drop-overlay';
    overlay.innerHTML = '<div style="text-align:center;"><span class="material-symbols-outlined" style="font-size:64px;display:block;margin-bottom:10px;">upload_file</span>여기에 파일을 놓으면 업로드됩니다.</div>';

    if (!document.getElementById('docsPreviewModal')) {
      var modal = document.createElement('div');
      modal.id = 'docsPreviewModal';
      modal.className = 'docs-preview-modal';
      modal.onclick = function (event) { docsClosePreview(event); };
      modal.innerHTML = '' +
        '<div class="docs-preview-box" onclick="event.stopPropagation();">' +
        '  <div class="docs-preview-head"><div><div class="docs-preview-title" id="docsPreviewName">파일명</div><div style="font-size:12px;color:#64748b;margin-top:4px;" id="docsPreviewMeta"></div></div><button class="docs-close-btn" onclick="docsClosePreview()"><span class="material-symbols-outlined">close</span></button></div>' +
        '  <div class="docs-preview-body"><div id="docsPreviewIcon"></div><div id="docsPreviewInfo" class="docs-preview-info"></div><div style="display:flex;justify-content:center;gap:8px;margin-top:18px;"><button class="mini mini-view" onclick="docsDownloadOne(docsPreviewingId)">다운로드</button><button class="mini mini-view" onclick="docsRename(docsPreviewingId)">이름 바꾸기</button></div></div>' +
        '</div>';
      document.body.appendChild(modal);
    }
  }


  function docsBindStaticEvents() {
    var search = document.getElementById('docs-search');
    if (search && !search.dataset.docsBound) {
      search.dataset.docsBound = 'Y';
      search.addEventListener('input', docsRender);
    }
    docsArrangeToolbar();
    docsUpdateActionBar();
  }

  function docsArrangeToolbar() {
    var gridBtn = document.getElementById('docs-view-grid');
    var listBtn = document.getElementById('docs-view-list');
    if (!gridBtn || !listBtn) return;

    var viewGroup = gridBtn.parentElement;
    var toolbarRow = viewGroup ? viewGroup.parentElement : null;
    if (!viewGroup || !toolbarRow) return;

    toolbarRow.classList.add('docs-top-toolbar-row');
    viewGroup.classList.add('docs-view-toggle-group');

    var actionGroup = document.getElementById('docs-toolbar-selected-actions');
    if (!actionGroup) {
      actionGroup = document.createElement('div');
      actionGroup.id = 'docs-toolbar-selected-actions';
      actionGroup.className = 'docs-toolbar-selected-actions';
      actionGroup.innerHTML = '' +
        '<button type="button" class="mini mini-view" data-docs-selected-download onclick="docsDownloadSelected()">다운로드</button>' +
        '<button type="button" class="mini mini-reject" data-docs-selected-delete onclick="docsDeleteSelected()">삭제</button>' +
        '<button type="button" class="mini mini-view" data-docs-selected-clear onclick="docsClearSelection()">선택 해제</button>';
    }

    var commandGroup = document.getElementById('docs-toolbar-commands');
    if (!commandGroup) {
      commandGroup = document.createElement('div');
      commandGroup.id = 'docs-toolbar-commands';
      commandGroup.className = 'docs-toolbar-commands';
    }

    if (actionGroup.parentElement !== toolbarRow) toolbarRow.insertBefore(actionGroup, viewGroup);
    if (commandGroup.parentElement !== toolbarRow) toolbarRow.insertBefore(commandGroup, viewGroup);

    var folderBtn = docsFindPrimaryToolbarButton();
    if (folderBtn && folderBtn.parentElement !== commandGroup) {
      folderBtn.classList.add('docs-toolbar-command');
      commandGroup.appendChild(folderBtn);
    }

    var uploadLabel = docsFindPrimaryUploadLabel();
    if (uploadLabel && uploadLabel.parentElement !== commandGroup) {
      uploadLabel.classList.add('docs-toolbar-command');
      commandGroup.appendChild(uploadLabel);
    }
  }

  function docsFindPrimaryToolbarButton() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('button[onclick="docsNewFolder()"]'));
    return buttons.find(function (btn) {
      return !btn.closest('#docs-toolbar-commands') && !btn.closest('#docs-empty');
    }) || null;
  }

  function docsFindPrimaryUploadLabel() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('input[type="file"]'));
    var input = inputs.find(function (el) {
      return String(el.getAttribute('onchange') || '').indexOf('docsUploadFiles') >= 0 &&
        !el.closest('#docs-toolbar-commands') &&
        !el.closest('#docs-empty');
    });
    return input ? input.closest('label') : null;
  }

  function docsLoadFolder(folderId, skipHistory) {
    var requestFolderId = folderId || null;
    var isSameFolder = (DocsState.currentFolderId === requestFolderId);
    
    DocsState.currentFolderId = requestFolderId;
    DocsState.selected.clear();
    DocsState.selectionAnchorId = null;
    docsUpdateActionBar();

    var query = requestFolderId ? ('?folderId=' + encodeURIComponent(requestFolderId)) : '';
    docsApi('/list.do' + query)
      .then(function (res) {
        var items = (res.items || []).map(docsNormalizeItem);
        var breadcrumb = (res.breadcrumb || []).map(docsNormalizeFolder).filter(function (b) { return b.name !== 'ROOT'; });
        DocsState.items = items;
        DocsState.breadcrumb = breadcrumb;
        DocsState.storage = res.storage || null;
        DocsState.parentFolderId = breadcrumb.length > 1 ? breadcrumb[breadcrumb.length - 2].id : null;
        
        if (!skipHistory && !isSameFolder) {
            var newUrl = new URL(window.location.href);
            if (requestFolderId) {
                newUrl.searchParams.set('docsFolderId', requestFolderId);
            } else {
                newUrl.searchParams.delete('docsFolderId');
            }
            history.pushState({ docsFolderId: requestFolderId }, '', newUrl.toString());
        }

        // Ensure UI state matches local storage or DocsState
        var viewMode = localStorage.getItem('tacs.docs.view') || 'grid';
        DocsState.view = viewMode;
        
        // Before re-rendering, recalculate the dynamic date based on the stored filter
        if (DocsState.dateFilter === 'today') {
            var now = new Date();
            DocsState.dateStart = docsIsoDate(now);
            DocsState.dateEnd = docsIsoDate(now);
        } else if (DocsState.dateFilter === 'week') {
            var now = new Date();
            var weekAgo = new Date(now.getTime() - 7 * 86400000);
            DocsState.dateStart = docsIsoDate(weekAgo);
            DocsState.dateEnd = docsIsoDate(now);
        } else if (DocsState.dateFilter === 'month') {
            var now = new Date();
            var monthAgo = new Date(now.getTime() - 30 * 86400000);
            DocsState.dateStart = docsIsoDate(monthAgo);
            DocsState.dateEnd = docsIsoDate(now);
        }
        
        // Ensure filter chips stay styled correctly after a DOM wipe/rebuild (if it happens)
        document.querySelectorAll('.docs-filter-chip').forEach(function(el) {
            if(el.getAttribute('onclick') && el.getAttribute('onclick').indexOf('docsSetFilter') >= 0) {
                el.classList.toggle('active', el.getAttribute('onclick').indexOf("'" + DocsState.filter + "'") >= 0);
            }
        });
        
        // Ensure date filter chips
        document.querySelectorAll('[id^="docs-date-chip"]').forEach(function(el) {
           el.classList.remove('active'); 
        });
        var activeDateBtn = document.getElementById('docs-date-chip-' + DocsState.dateFilter);
        if (activeDateBtn) activeDateBtn.classList.add('active');
        
        // Re-apply button text if a filter was loaded from somewhere, or just initialize correctly
        var customBtn = document.getElementById('docs-date-chip-custom');
        if (customBtn) {
            var textSpan = customBtn.querySelector('.btn-text');
            if (textSpan) {
                if (DocsState.dateFilter !== 'all' && DocsState.dateStart && DocsState.dateEnd) {
                    textSpan.textContent = DocsState.dateStart + ' ~ ' + DocsState.dateEnd;
                } else {
                    textSpan.textContent = '기간선택';
                }
            }
        }
        
        docsRender();
        docsUpdateBreadcrumb(breadcrumb);
        docsUpdateStorageBar(DocsState.storage);
        docsRefreshSelectionUI();
        docsScheduleUploadStatusRefresh(items);
      })
      .catch(function (err) {
        console.error(err);
        alert('문서 목록을 불러오는 데 실패했습니다.');
      });
  }

  function docsScheduleUploadStatusRefresh(items) {
    if (docsUploadStatusTimer) {
      window.clearTimeout(docsUploadStatusTimer);
      docsUploadStatusTimer = null;
    }

    var hasUploading = (items || []).some(function (item) {
      return item && item.type === 'file' && item.uploadStatus === 'UPLOADING';
    });
    if (!hasUploading) return;

    docsUploadStatusTimer = window.setTimeout(function () {
      docsUploadStatusTimer = null;
      docsLoadFolder(DocsState.currentFolderId, true);
    }, 2000);
  }

  function docsUpdateStorageBar(storage) {
    if (!storage) return;
    var max = Number(storage.maxCapa || DOCS_MAX_BYTES);
    var used = Number(storage.usedCapa || 0);
    var pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;

    var fill = document.getElementById('docs-storage-fill');
    if (fill) {
      fill.style.width = pct.toFixed(1) + '%';
      fill.style.background = pct >= 90 ? 'linear-gradient(90deg,#ef4444,#dc2626)' : pct >= 80 ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#565e74,#818cf8)';
    }
    var usedEl = document.getElementById('docs-storage-used');
    if (usedEl) usedEl.textContent = docsFormatSize(used);
    var remain = document.getElementById('docs-storage-remain');
    if (remain) remain.textContent = docsFormatSize(Math.max(max - used, 0));
    var badge = document.getElementById('docs-storage-pct-badge');
    if (badge) {
      badge.textContent = pct.toFixed(1) + '%';
      badge.style.background = pct >= 90 ? '#fee2e2' : pct >= 80 ? '#fef3c7' : '#e2e8f0';
      badge.style.color = pct >= 90 ? '#ef4444' : pct >= 80 ? '#d97706' : '#475569';
    }
    var warn = document.getElementById('docs-storage-warn');
    if (warn) warn.style.display = pct >= 80 ? 'block' : 'none';
  }

  function docsGetDisplayItems() {
    var keyword = (document.getElementById('docs-search') && document.getElementById('docs-search').value || '').trim().toLowerCase();
    var items = DocsState.items.slice();

    if (DocsState.filter === 'folder') items = items.filter(function (i) { return i.type === 'folder'; });
    if (DocsState.filter === 'file') items = items.filter(function (i) { return i.type === 'file'; });

    var now = new Date();
    if (DocsState.dateFilter === 'today') {
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      items = items.filter(function (i) { return new Date(i.createdAt) >= today; });
    } else if (DocsState.dateFilter === 'week') {
      items = items.filter(function (i) { return new Date(i.createdAt) >= new Date(now.getTime() - 7 * 86400000); });
    } else if (DocsState.dateFilter === 'month') {
      items = items.filter(function (i) { return new Date(i.createdAt) >= new Date(now.getTime() - 30 * 86400000); });
    } else if (DocsState.dateFilter === 'custom') {
      var start = DocsState.dateStart ? new Date(DocsState.dateStart + 'T00:00:00') : null;
      var end = DocsState.dateEnd ? new Date(DocsState.dateEnd + 'T23:59:59') : null;
      items = items.filter(function (i) {
        var created = new Date(i.createdAt);
        if (isNaN(created.getTime())) return false;
        if (start && created < start) return false;
        if (end && created > end) return false;
        return true;
      });
    }

    if (keyword) items = items.filter(function (i) { return (i.name || '').toLowerCase().indexOf(keyword) >= 0; });

    items.sort(function (a, b) {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return (a.name || '').localeCompare(b.name || '', 'ko');
    });

    if (DocsState.currentFolderId) {
      items.unshift({ id: 'up', type: 'up', name: '', size: 0, createdAt: '', updatedAt: '' });
    }
    return items;
  }

  function docsRender() {
    docsEnsureScaffold();
    var items = docsGetDisplayItems();
    var empty = document.getElementById('docs-empty');
    var grid = document.getElementById('docs-container');
    var listW = document.getElementById('docs-list-table-wrapper');

    if (items.length === 0) {
      if (empty) empty.style.display = 'block';
      if (grid) grid.style.display = 'none';
      if (listW) listW.style.display = 'none';
    } else {
      if (empty) empty.style.display = 'none';
      if (DocsState.view === 'list') {
        if (grid) grid.style.display = 'none';
        if (listW) listW.style.display = 'block';
        docsRenderList(items);
      } else {
        if (listW) listW.style.display = 'none';
        if (grid) {
          grid.style.display = 'block';
          grid.innerHTML = docsRenderGrid(items);
        }
      }
    }
    
    // Ensure filter chips stay styled correctly after a DOM wipe/rebuild (if it happens)
    document.querySelectorAll('.docs-filter-chip').forEach(function(el) {
        if(el.getAttribute('onclick') && el.getAttribute('onclick').indexOf('docsSetFilter') >= 0) {
            el.classList.toggle('active', el.getAttribute('onclick').indexOf("'" + DocsState.filter + "'") >= 0);
        }
    });
    
    // Ensure date filter chips
    document.querySelectorAll('[id^="docs-date-chip"]').forEach(function(el) {
       el.classList.remove('active'); 
    });
    if (DocsState.dateFilter === 'custom') {
        var rangeBtn = document.querySelector('[data-docs-date-range-btn]');
        if(rangeBtn) rangeBtn.classList.add('active');
    } else {
        var activeDateBtn = document.getElementById('docs-date-chip-' + DocsState.dateFilter);
        if (activeDateBtn) activeDateBtn.classList.add('active');
    }
    
    // Ensure custom text
    var customBtn = document.getElementById('docs-date-chip-custom');
    if (customBtn) {
        var textSpan = customBtn.querySelector('.btn-text');
        if (textSpan) {
            if (DocsState.dateFilter !== 'all' && DocsState.dateStart && DocsState.dateEnd) {
                 textSpan.textContent = DocsState.dateStart + ' ~ ' + DocsState.dateEnd;
            } else {
                 textSpan.textContent = '기간선택';
            }
        }
    }
    
    docsRefreshSelectionUI();
    docsUpdateViewButtons();
    docsFocusRenameInput();
  }

  function docsRenderGrid(items) {
    return '<div class="docs-grid-inner" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(144px,1fr));gap:12px;padding:16px;">' + items.map(docsGridCard).join('') + '</div>';
  }

  function docsItemNameHtml(item, view) {
    if (DocsState.renamingId === item.id) {
      return '<input class="docs-rename-input docs-rename-input-' + docsAttr(view) + '" data-id="' + docsAttr(item.id) + '" value="" placeholder="' + docsAttr(item.name) + '" onclick="event.stopPropagation()" ondblclick="event.stopPropagation()" oncontextmenu="event.stopPropagation()" onkeydown="docsRenameKeydown(event,\'' + docsAttr(item.id) + '\')" onblur="window.setTimeout(docsCancelRename,0)" />';
    }

    if (view === 'grid') {
      return '<div class="docs-card-name" title="' + docsAttr(item.name) + '">' + docsEsc(item.name) + '</div>';
    }
    return '<span class="docs-list-name" title="' + docsAttr(item.name) + '">' + docsEsc(item.name) + '</span>';
  }

  function docsFocusRenameInput() {
    if (!DocsState.renamingId) return;
    window.setTimeout(function () {
      var input = document.querySelector('.docs-rename-input');
      if (!input) return;
      input.focus();
      input.select();
    }, 0);
  }

  function docsCanDownload(item) {
    return item && item.type === 'file' && (!item.uploadStatus || item.uploadStatus === 'DONE');
  }

  function docsFileMeta(item) {
    if (!item || item.type !== 'file') return item && item.type === 'folder' ? '폴더' : '';
    if (item.uploadStatus === 'UPLOADING') return '업로드 중';
    if (item.uploadStatus === 'FAIL') return '업로드 실패';
    return docsFormatSize(item.size);
  }

  function docsFileStatusClass(item) {
    if (!item || item.type !== 'file') return '';
    if (item.uploadStatus === 'UPLOADING') return 'color:#2563eb;font-weight:800;';
    if (item.uploadStatus === 'FAIL') return 'color:#dc2626;font-weight:800;';
    return '';
  }

  function docsGridCard(item) {
    var isUp = item.type === 'up';
    var sel = !isUp && DocsState.selected.has(item.id);
    var icon = isUp ? 'more_horiz' : (item.type === 'folder' ? 'folder' : docsFileIcon(item.name));
    var iconClr = isUp ? '#64748b' : (item.type === 'folder' ? '#f59e0b' : docsFileIconColor(item.name));
    var meta = isUp ? '상위폴더' : docsFileMeta(item);
    var actionHtml = '';

    if (item.type === 'file') {
      var downloadAction = docsCanDownload(item)
        ? '<button class="docs-icon-btn" title="다운로드" onclick="event.stopPropagation();docsDownloadOne(\'' + docsAttr(item.id) + '\')"><span class="material-symbols-outlined" style="font-size:17px;">download</span></button>'
        : '<button class="docs-icon-btn" title="' + docsAttr(meta) + '" disabled style="opacity:.45;cursor:not-allowed"><span class="material-symbols-outlined" style="font-size:17px;">hourglass_empty</span></button>';
      actionHtml = '<div class="docs-card-actions">' +
        downloadAction +
        '<button class="docs-icon-btn" title="이름 바꾸기" onclick="event.stopPropagation();docsRename(\'' + docsAttr(item.id) + '\')"><span class="material-symbols-outlined" style="font-size:17px;">drive_file_rename_outline</span></button>' +
        '<button class="docs-icon-btn danger" title="휴지통" onclick="event.stopPropagation();docsDeleteOne(\'' + docsAttr(item.id) + '\')"><span class="material-symbols-outlined" style="font-size:17px;">delete</span></button>' +
        '</div>';
    } else if (item.type === 'folder') {
      actionHtml = '<div class="docs-card-actions">' +
        '<button class="docs-icon-btn" title="이름 바꾸기" onclick="event.stopPropagation();docsRename(\'' + docsAttr(item.id) + '\')"><span class="material-symbols-outlined" style="font-size:17px;">drive_file_rename_outline</span></button>' +
        '<button class="docs-icon-btn danger" title="휴지통" onclick="event.stopPropagation();docsDeleteOne(\'' + docsAttr(item.id) + '\')"><span class="material-symbols-outlined" style="font-size:17px;">delete</span></button>' +
        '</div>';
    }

    return '<div class="docs-card ' + (sel ? 'docs-card-selected ' : '') + (isUp ? 'docs-up-card' : '') + '" data-id="' + docsAttr(item.id) + '" data-type="' + docsAttr(item.type) + '" onclick="docsCardClick(event,\'' + docsAttr(item.id) + '\',\'' + docsAttr(item.type) + '\')" ondblclick="docsCardDblClick(\'' + docsAttr(item.id) + '\',\'' + docsAttr(item.type) + '\')" oncontextmenu="docsShowCtxMenu(event,\'' + docsAttr(item.id) + '\')">' +
      actionHtml +
      '<span class="material-symbols-outlined docs-card-main-icon" style="font-size:42px;color:' + iconClr + ';margin:18px 0 8px;display:block;text-align:center;">' + icon + '</span>' +
      docsItemNameHtml(item, 'grid') +
      '<div class="docs-card-meta" style="' + docsFileStatusClass(item) + '">' + docsEsc(meta) + '</div>' +
      '</div>';
  }

  function docsRenderList(items) {
    var thead = document.getElementById('docs-list-thead');
    var tbody = document.getElementById('docs-list-tbody');
    if (!thead || !tbody) return;
    thead.innerHTML = '<tr class="docs-list-head-row">' +
      '<th class="docs-list-name-cell">이름</th>' +
      '<th class="docs-list-size-cell">크기</th>' +
      '<th class="docs-list-date-cell">등록일시</th>' +
      '<th class="docs-list-action-cell">작업</th>' +
      '</tr>';

    tbody.innerHTML = items.map(function (item) {
      var isUp = item.type === 'up';
      var sel = !isUp && DocsState.selected.has(item.id);
      var icon = isUp ? 'more_horiz' : (item.type === 'folder' ? 'folder' : docsFileIcon(item.name));
      var clr = isUp ? '#64748b' : (item.type === 'folder' ? '#f59e0b' : docsFileIconColor(item.name));
      var size = isUp ? '-' : (item.type === 'folder' ? '-' : docsFileMeta(item));
      var date = isUp ? '-' : docsFormatDate(item.createdAt);
      var actions = '';

      if (item.type === 'file') {
        var rowDownloadAction = docsCanDownload(item)
          ? '<button class="docs-row-action" title="다운로드" onclick="event.stopPropagation();docsDownloadOne(\'' + docsAttr(item.id) + '\')"><span class="material-symbols-outlined" style="font-size:18px;">download</span></button>'
          : '<button class="docs-row-action" title="' + docsAttr(size) + '" disabled style="opacity:.45;cursor:not-allowed"><span class="material-symbols-outlined" style="font-size:18px;">hourglass_empty</span></button>';
        actions = rowDownloadAction +
          '<button class="docs-row-action" title="이름 바꾸기" onclick="event.stopPropagation();docsRename(\'' + docsAttr(item.id) + '\')"><span class="material-symbols-outlined" style="font-size:18px;">drive_file_rename_outline</span></button>' +
          '<button class="docs-row-action danger" title="휴지통" onclick="event.stopPropagation();docsDeleteOne(\'' + docsAttr(item.id) + '\')"><span class="material-symbols-outlined" style="font-size:18px;">delete</span></button>';
      } else if (item.type === 'folder') {
        actions = '<button class="docs-row-action" title="이름 바꾸기" onclick="event.stopPropagation();docsRename(\'' + docsAttr(item.id) + '\')"><span class="material-symbols-outlined" style="font-size:18px;">drive_file_rename_outline</span></button>' +
          '<button class="docs-row-action danger" title="휴지통" onclick="event.stopPropagation();docsDeleteOne(\'' + docsAttr(item.id) + '\')"><span class="material-symbols-outlined" style="font-size:18px;">delete</span></button>';
      }

      return '<tr class="docs-list-row ' + (sel ? 'docs-list-row-sel ' : '') + (isUp ? 'docs-up-row' : '') + '" data-id="' + docsAttr(item.id) + '" data-type="' + docsAttr(item.type) + '" onclick="docsCardClick(event,\'' + docsAttr(item.id) + '\',\'' + docsAttr(item.type) + '\')" ondblclick="docsCardDblClick(\'' + docsAttr(item.id) + '\',\'' + docsAttr(item.type) + '\')" oncontextmenu="docsShowCtxMenu(event,\'' + docsAttr(item.id) + '\')">' +
        '<td class="docs-list-name-cell"><div class="docs-list-name-wrap"><span class="material-symbols-outlined docs-list-main-icon" style="color:' + clr + ';">' + icon + '</span>' + docsItemNameHtml(item, 'list') + (isUp ? '<span class="docs-up-hint">한 번 클릭</span>' : '') + '</div></td>' +
        '<td class="docs-list-size-cell" style="' + docsFileStatusClass(item) + '">' + size + '</td>' +
        '<td class="docs-list-date-cell">' + date + '</td>' +
        '<td class="docs-list-action-cell"><div class="docs-list-actions">' + actions + '</div></td>' +
        '</tr>';
    }).join('');
  }

  function docsGoRoot() {
    docsLoadFolder(null);
  }

  function docsGoBack() {
    docsGoParent();
  }

  function docsGoParent() {
    docsLoadFolder(DocsState.parentFolderId || null);
  }

  function docsEnterFolder(id) {
    if (!id || id === 'up') return;
    docsLoadFolder(id);
  }

  function docsUpdateBreadcrumb(breadcrumb) {
    var el = document.getElementById('docs-breadcrumb');
    if (!el) return;
    
    // Clear out existing buttons if any to avoid duplicates
    var existingBack = document.getElementById('docs-back-btn');
    if (existingBack) existingBack.remove();
      
    var html = '<span onclick="docsGoRoot()" style="color:#475569;font-weight:800;cursor:pointer;">전체 문서</span>';
    (breadcrumb || []).forEach(function (b, i) {
      html += '<span class="material-symbols-outlined" style="font-size:14px;color:#cbd5e1;">chevron_right</span>';
      if (i < breadcrumb.length - 1) html += '<span onclick="docsJumpTo(\'' + docsAttr(b.id) + '\')" style="color:#475569;font-weight:800;cursor:pointer;">' + docsEsc(b.name) + '</span>';
      else html += '<span style="color:#94a3b8;font-weight:800;">' + docsEsc(b.name) + '</span>';
    });
    el.innerHTML = html;

    if (DocsState.currentFolderId) {
      var back = document.createElement('button');
      back.id = 'docs-back-btn';
      back.type = 'button';
      back.onclick = docsGoBack;
      back.className = 'docs-breadcrumb-back';
      back.style.cssText = 'margin-left:8px;padding:4px 8px;border:1px solid #e2e8f0;background:#fff;color:#64748b;font-size:11px;font-weight:800;cursor:pointer;border-radius:6px;display:inline-flex;align-items:center;gap:2px;';
      back.innerHTML = '<span class="material-symbols-outlined" style="font-size:14px;">arrow_upward</span>상위로';
      el.appendChild(back);
    }
  }

  function docsJumpTo(id) {
    docsLoadFolder(id || null);
  }

  function docsCardClick(event, id, type) {
    if (event) {
      var actionTarget = event.target.closest('button,input,label,a');
      if (actionTarget) return;
    }
    if (type === 'up' || id === 'up') {
      docsGoParent();
      return;
    }
    if (event && event.shiftKey) {
      docsSelectRange(id, !!(event.ctrlKey || event.metaKey));
      return;
    }
    if (event && (event.ctrlKey || event.metaKey)) {
      docsToggleSelect(id);
      return;
    }
    DocsState.selected.clear();
    DocsState.selected.add(id);
    DocsState.selectionAnchorId = id;
    docsUpdateActionBar();
    docsRefreshSelectionUI();
  }

  function docsCardDblClick(id, type) {
    if (type === 'folder') docsEnterFolder(id);
    else if (type === 'file') docsOpenPreview(id);
  }

  function docsToggleSelect(id) {
    if (!id || id === 'up') return;
    if (DocsState.selected.has(id)) DocsState.selected.delete(id);
    else DocsState.selected.add(id);
    DocsState.selectionAnchorId = id;
    docsUpdateActionBar();
    docsRefreshSelectionUI();
  }

  function docsSelectRange(id, append) {
    if (!id || id === 'up') return;
    var items = docsGetDisplayItems().filter(function (i) { return i.type !== 'up'; });
    var ids = items.map(function (i) { return i.id; });
    var anchor = DocsState.selectionAnchorId && ids.indexOf(DocsState.selectionAnchorId) >= 0 ? DocsState.selectionAnchorId : id;
    var from = ids.indexOf(anchor);
    var to = ids.indexOf(id);
    if (from < 0 || to < 0) return;
    if (!append) DocsState.selected.clear();
    ids.slice(Math.min(from, to), Math.max(from, to) + 1).forEach(function (rangeId) {
      DocsState.selected.add(rangeId);
    });
    docsUpdateActionBar();
    docsRefreshSelectionUI();
  }

  function docsToggleSelectAll(checked) {
    var items = docsGetDisplayItems().filter(function (i) { return i.type !== 'up'; });
    if (checked) items.forEach(function (i) { DocsState.selected.add(i.id); });
    else DocsState.selected.clear();
    docsUpdateActionBar();
    docsRefreshSelectionUI();
  }

  function docsClearSelection() {
    DocsState.selected.clear();
    DocsState.selectionAnchorId = null;
    docsUpdateActionBar();
    docsRefreshSelectionUI();
  }

  function docsRefreshSelectionUI() {
    document.querySelectorAll('.docs-card,.docs-list-row').forEach(function (el) {
      var selected = DocsState.selected.has(el.dataset.id);
      el.classList.toggle('docs-card-selected', selected);
      el.classList.toggle('docs-list-row-sel', selected);
    });
  }

  function docsUpdateActionBar() {
    var bar = document.getElementById('docs-action-bar');
    var cnt = document.getElementById('docs-sel-count');
    var toolbarActions = document.getElementById('docs-toolbar-selected-actions');
    var downloadBtn = toolbarActions ? toolbarActions.querySelector('[data-docs-selected-download]') : null;
    var hasSelected = DocsState.selected.size > 0;
    var hasFile = Array.from(DocsState.selected).some(function (id) {
      var item = DocsState.items.find(function (i) { return i.id === id; });
      return docsCanDownload(item);
    });
    if (bar) bar.style.display = 'none';
    if (toolbarActions) toolbarActions.style.display = hasSelected ? 'flex' : 'none';
    if (downloadBtn) downloadBtn.style.display = hasFile ? 'inline-flex' : 'none';
    if (cnt) cnt.textContent = DocsState.selected.size;
  }

  function docsSetView(mode) {
    DocsState.view = mode === 'list' ? 'list' : 'grid';
    localStorage.setItem('tacs.docs.view', DocsState.view);
    docsUpdateViewButtons();
    docsRender();
  }

  function docsUpdateViewButtons() {
    var gBtn = document.getElementById('docs-view-grid');
    var lBtn = document.getElementById('docs-view-list');
    if (gBtn) {
      gBtn.style.background = DocsState.view === 'grid' ? '#0f172a' : '#fff';
      gBtn.style.color = DocsState.view === 'grid' ? '#fff' : '#64748b';
    }
    if (lBtn) {
      lBtn.style.background = DocsState.view === 'list' ? '#0f172a' : '#fff';
      lBtn.style.color = DocsState.view === 'list' ? '#fff' : '#64748b';
    }
  }

  function docsSetFilter(type, btn) {
    DocsState.filter = type;
    localStorage.setItem('tacs.docs.filter', type);
    document.querySelectorAll('.docs-filter-chip[onclick^="docsSetFilter"]').forEach(function (el) { el.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    docsRender();
  }

  function docsSetDateFilter(type, btn) {
    DocsState.dateFilter = type;
    
    var now = new Date();
    if (type === 'today') {
      DocsState.dateStart = docsIsoDate(now);
      DocsState.dateEnd = docsIsoDate(now);
    } else if (type === 'week') {
      var weekAgo = new Date(now.getTime() - 7 * 86400000);
      DocsState.dateStart = docsIsoDate(weekAgo);
      DocsState.dateEnd = docsIsoDate(now);
    } else if (type === 'month') {
      var monthAgo = new Date(now.getTime() - 30 * 86400000);
      DocsState.dateStart = docsIsoDate(monthAgo);
      DocsState.dateEnd = docsIsoDate(now);
    } else if (type === 'all') {
      DocsState.dateStart = null;
      DocsState.dateEnd = null;
    }
    
    docsClearStoredDateFilter();
    
    var customBtn = document.getElementById('docs-date-chip-custom');
    if (customBtn) {
        var textSpan = customBtn.querySelector('.btn-text');
        if (textSpan) {
            if (type !== 'all' && DocsState.dateStart && DocsState.dateEnd) {
                 textSpan.textContent = DocsState.dateStart + ' ~ ' + DocsState.dateEnd;
            } else {
                 textSpan.textContent = '기간선택';
            }
        }
    }

    document.querySelectorAll('[id^="docs-date-chip"],[data-docs-date-range-btn]').forEach(function (el) { el.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    docsRender();
  }

  function docsOpenDatePicker(trigger) {
    var modal = document.getElementById('docs-date-picker-modal');
    if (!modal) return;
    DocsDatePicker.start = DocsState.dateStart || null;
    DocsDatePicker.end = DocsState.dateEnd || null;
    DocsDatePicker.month = docsMonthStart(docsParseIso(DocsDatePicker.start) || new Date());
    docsRenderDatePicker();

    modal.classList.add('docs-date-dropdown-overlay');
    modal.style.display = 'block';
    docsPositionDatePicker(trigger);
  }

  function docsCloseDatePicker(event) {
    var modal = document.getElementById('docs-date-picker-modal');
    if (!modal) return;
    if (!event || event.target === modal) modal.style.display = 'none';
  }

  function docsApplyDateFilter() {
    DocsState.dateStart = DocsDatePicker.start || null;
    DocsState.dateEnd = DocsDatePicker.end || null;
    DocsState.dateFilter = (DocsState.dateStart || DocsState.dateEnd) ? 'custom' : 'all';
    
    docsClearStoredDateFilter();
    
    docsCloseDatePicker();
    docsRender();
  }

  function docsPositionDatePicker(trigger) {
    var modal = document.getElementById('docs-date-picker-modal');
    var box = modal ? modal.querySelector('.docs-date-dropdown') : null;
    var btn = trigger || document.querySelector('[data-docs-date-range-btn]') || document.querySelector('button[onclick^="docsOpenDatePicker"]');
    if (!box || !btn || !btn.getBoundingClientRect) return;
    var rect = btn.getBoundingClientRect();
    var width = Math.min(620, window.innerWidth - 24);
    var left = Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12));
    box.style.width = width + 'px';
    box.style.left = left + 'px';
    box.style.top = Math.max(12, Math.min(rect.bottom + 8, window.innerHeight - 420)) + 'px';
  }

  function docsRenderDatePicker() {
    var modal = document.getElementById('docs-date-picker-modal');
    if (!modal) return;
    modal.innerHTML = '' +
      '<div class="docs-date-dropdown" onclick="event.stopPropagation()">' +
      '  <div class="docs-date-head">' +
      '    <button type="button" class="docs-date-nav" onclick="docsMoveDatePickerMonth(-1)"><span class="material-symbols-outlined">chevron_left</span></button>' +
      '    <div class="docs-date-title">' + docsEsc(docsRangeLabel()) + '</div>' +
      '    <button type="button" class="docs-date-nav" onclick="docsMoveDatePickerMonth(1)"><span class="material-symbols-outlined">chevron_right</span></button>' +
      '  </div>' +
      '  <div class="docs-date-calendars">' + docsCalendarHtml(DocsDatePicker.month) + docsCalendarHtml(docsAddMonths(DocsDatePicker.month, 1)) + '</div>' +
      '  <div class="docs-date-actions">' +
      '    <button type="button" class="mini mini-view" onclick="docsClearDatePickerRange()">초기화</button>' +
      '    <div style="flex:1"></div>' +
      '    <button type="button" class="mini mini-view" onclick="docsCloseDatePicker()">취소</button>' +
      '    <button type="button" class="mini mini-view docs-date-apply" onclick="docsApplyDateFilter()">적용</button>' +
      '  </div>' +
      '</div>';
    docsPositionDatePicker();
  }

  function docsMoveDatePickerMonth(delta) {
    DocsDatePicker.month = docsAddMonths(DocsDatePicker.month || docsMonthStart(new Date()), delta);
    docsRenderDatePicker();
  }

  function docsPickDateRange(iso) {
    if (!DocsDatePicker.start || (DocsDatePicker.start && DocsDatePicker.end)) {
      DocsDatePicker.start = iso;
      DocsDatePicker.end = null;
    } else if (iso < DocsDatePicker.start) {
      DocsDatePicker.end = DocsDatePicker.start;
      DocsDatePicker.start = iso;
    } else {
      DocsDatePicker.end = iso;
    }
    docsRenderDatePicker();
  }

  function docsClearDatePickerRange() {
    DocsDatePicker.start = null;
    DocsDatePicker.end = null;
    docsRenderDatePicker();
  }

  function docsCalendarHtml(monthDate) {
    var y = monthDate.getFullYear();
    var m = monthDate.getMonth();
    var first = new Date(y, m, 1);
    var startOffset = first.getDay();
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var names = ['일', '월', '화', '수', '목', '금', '토'];
    var html = '<div class="docs-calendar"><div class="docs-calendar-title">' + y + '년 ' + (m + 1) + '월</div>';
    html += '<div class="docs-calendar-week">' + names.map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</div>';
    html += '<div class="docs-calendar-grid">';
    for (var i = 0; i < startOffset; i++) html += '<span class="docs-calendar-empty"></span>';
    for (var d = 1; d <= daysInMonth; d++) {
      var iso = docsIsoDate(new Date(y, m, d));
      html += '<button type="button" class="' + docsDateCellClass(iso) + '" onclick="docsPickDateRange(\'' + iso + '\')">' + d + '</button>';
    }
    html += '</div></div>';
    return html;
  }

  function docsDateCellClass(iso) {
    var cls = ['docs-calendar-day'];
    if (iso === docsIsoDate(new Date())) cls.push('today');
    if (iso === DocsDatePicker.start) cls.push('range-start');
    if (iso === DocsDatePicker.end) cls.push('range-end');
    if (DocsDatePicker.start && DocsDatePicker.end && iso >= DocsDatePicker.start && iso <= DocsDatePicker.end) cls.push('in-range');
    return cls.join(' ');
  }

  function docsRangeLabel() {
    if (DocsDatePicker.start && DocsDatePicker.end) return DocsDatePicker.start + ' ~ ' + DocsDatePicker.end;
    if (DocsDatePicker.start) return DocsDatePicker.start + ' 이후 종료일 선택';
    return '기간 범위 선택';
  }

  function docsMonthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function docsAddMonths(date, delta) {
    return new Date(date.getFullYear(), date.getMonth() + delta, 1);
  }

  function docsParseIso(iso) {
    if (!iso) return null;
    var d = new Date(iso + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
  }

  function docsIsoDate(date) {
    var p = function (n) { return String(n).padStart(2, '0'); };
    return date.getFullYear() + '-' + p(date.getMonth() + 1) + '-' + p(date.getDate());
  }

  function docsNewFolder() {
    var name = prompt('새 폴더명을 입력하세요.', '새 폴더');
    if (!name || !name.trim()) return;
    docsApi('/folder/create.do', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), parentId: DocsState.currentFolderId })
    }).then(function () {
      docsLoadFolder(DocsState.currentFolderId);
    }).catch(function (err) {
      console.error(err);
      alert('폴더 생성에 실패했습니다.');
    });
  }

  function docsUploadFiles(files) {
    if (!files || files.length === 0) return;
    var used = DocsState.storage && DocsState.storage.usedCapa ? Number(DocsState.storage.usedCapa) : 0;
    var max = DocsState.storage && DocsState.storage.maxCapa ? Number(DocsState.storage.maxCapa) : DOCS_MAX_BYTES;
    var totalNew = Array.from(files).reduce(function (s, f) { return s + f.size; }, 0);
    if (used + totalNew > max) {
      alert('저장 용량이 부족합니다.\n현재 사용: ' + docsFormatSize(used) + ' / ' + docsFormatSize(max));
      return;
    }
    var fd = new FormData();
    Array.from(files).forEach(function (f) { fd.append('files', f); });
    if (DocsState.currentFolderId) fd.append('folderId', DocsState.currentFolderId);

    document.querySelectorAll('label.btn.btn-primary').forEach(function (l) { l.style.opacity = '0.55'; });
    fetch(DOCS_BASE + '/upload.do', { method: 'POST', body: fd, credentials: 'same-origin' })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          if (!res.ok) throw new Error(body.message || 'upload failed');
          return body;
        });
      })
      .then(function () { docsLoadFolder(DocsState.currentFolderId); })
      .catch(function (err) { console.error(err); alert(err.message || '파일 업로드에 실패했습니다.'); })
      .finally(function () {
        document.querySelectorAll('label.btn.btn-primary').forEach(function (l) { l.style.opacity = '1'; });
        document.querySelectorAll('input[type=file]').forEach(function (inp) { inp.value = ''; });
      });
  }

  function docsDownloadOne(id) {
    if (!id || id === 'up') return;
    var item = DocsState.items.find(function (i) { return i.id === id; });
    if (item && item.type === 'folder') {
      alert('폴더는 단일 다운로드를 지원하지 않습니다. 파일을 선택하세요.');
      return;
    }
    if (!docsCanDownload(item)) {
      alert('Google Drive 업로드가 완료된 파일만 다운로드할 수 있습니다.');
      return;
    }
    window.location.href = DOCS_BASE + '/download.do?id=' + encodeURIComponent(id);
  }

  function docsDownloadSelected() {
    var fileIds = Array.from(DocsState.selected).filter(function (id) {
      var item = DocsState.items.find(function (i) { return i.id === id; });
      return docsCanDownload(item);
    });
    if (fileIds.length === 0) {
      alert('다운로드 가능한 파일을 선택해 주세요.');
      return;
    }
    fileIds.forEach(function (id, idx) {
      setTimeout(function () {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = DOCS_BASE + '/download.do?id=' + encodeURIComponent(id);
        document.body.appendChild(iframe);
        setTimeout(function () { iframe.remove(); }, 60000);
      }, idx * 250);
    });
  }

  function docsDeleteOne(id) {
    if (!id || id === 'up') return;
    var item = DocsState.items.find(function (i) { return i.id === id; });
    var label = item ? item.name : '선택 항목';
    if (!confirm('[' + label + '] 항목을 휴지통으로 이동하시겠습니까?')) return;
    docsApi('/delete.do', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] })
    }).then(function () {
      DocsState.selected.delete(id);
      docsLoadFolder(DocsState.currentFolderId);
    }).catch(function (err) {
      console.error(err);
      alert('휴지통 이동에 실패했습니다.');
    });
  }

  function docsDeleteSelected() {
    var ids = Array.from(DocsState.selected).filter(function (id) { return id !== 'up'; });
    if (ids.length === 0) return;
    if (!confirm('선택한 ' + ids.length + '개 항목을 휴지통으로 이동하시겠습니까?')) return;
    docsApi('/delete.do', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: ids })
    }).then(function () {
      DocsState.selected.clear();
      docsUpdateActionBar();
      docsLoadFolder(DocsState.currentFolderId);
    }).catch(function (err) {
      console.error(err);
      alert('휴지통 이동에 실패했습니다.');
    });
  }

  function docsRename(id) {
    if (!id || id === 'up') return;
    var item = DocsState.items.find(function (i) { return i.id === id; });
    if (!item) return;
    DocsState.renamingId = id;
    DocsState.selected.clear();
    DocsState.selected.add(id);
    DocsState.selectionAnchorId = id;
    docsHideCtxMenu();
    docsClosePreview();
    docsRender();
  }

  function docsRenameKeydown(event, id) {
    if (event.key === 'Enter') {
      event.preventDefault();
      docsCommitRename(id, event.currentTarget);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      DocsState.renamingId = null;
      docsRender();
    }
  }

  function docsCancelRename() {
    if (!DocsState.renamingId) return;
    DocsState.renamingId = null;
    docsRender();
  }

  function docsCommitRename(id, input) {
    if (!id || !input) return;
    var item = DocsState.items.find(function (i) { return i.id === id; });
    if (!item) return;
    var newName = (input.value || '').trim();
    DocsState.renamingId = null;

    if (!newName) {
      docsRender();
      return;
    }
    if (newName === item.name) {
      docsRender();
      return;
    }

    item.name = newName;
    docsRender();
    docsApi('/rename.do', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, name: newName })
    }).then(function () {
      docsLoadFolder(DocsState.currentFolderId);
    }).catch(function (err) {
      console.error(err);
      alert('이름 변경에 실패했습니다.');
      docsLoadFolder(DocsState.currentFolderId);
    });
  }

  function docsOpenPreview(id) {
    if (!id || id === 'up') return;
    var item = DocsState.items.find(function (i) { return i.id === id; });
    if (!item) return;
    if (item.type === 'folder') {
      alert('폴더는 더블클릭하면 이동합니다.');
      return;
    }
    docsPreviewingId = id;
    window.docsPreviewingId = id;
    var nameEl = document.getElementById('docsPreviewName');
    var metaEl = document.getElementById('docsPreviewMeta');
    var iconEl = document.getElementById('docsPreviewIcon');
    var infoEl = document.getElementById('docsPreviewInfo');
    var modal = document.getElementById('docsPreviewModal');
    if (nameEl) nameEl.textContent = item.name;
    if (metaEl) metaEl.textContent = docsFormatSize(item.size) + ' · ' + docsFormatDate(item.createdAt);
    if (iconEl) iconEl.innerHTML = '<span class="material-symbols-outlined" style="font-size:76px;color:' + docsFileIconColor(item.name) + ';">' + docsFileIcon(item.name) + '</span>';
    if (infoEl) {
      var rows = [['파일명', item.name], ['크기', docsFormatSize(item.size)], ['등록일', docsFormatDate(item.createdAt)], ['수정일', docsFormatDate(item.updatedAt)]];
      infoEl.innerHTML = rows.map(function (r, idx) {
        var border = idx < rows.length - 1 ? 'border-bottom:1px solid #e2e8f0;' : '';
        return '<span style="color:#64748b;font-weight:800;padding:10px 14px;' + border + 'background:#f8fafc;">' + docsEsc(r[0]) + '</span><span style="padding:10px 14px;' + border + '">' + docsEsc(r[1]) + '</span>';
      }).join('');
    }
    if (modal) modal.style.display = 'flex';
  }

  function docsClosePreview(event) {
    var modal = document.getElementById('docsPreviewModal');
    if (!event || event.target === modal) {
      if (modal) modal.style.display = 'none';
    }
  }

  function docsShowCtxMenu(event, id) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!id || id === 'up') return;
    DocsState.ctxTargetId = id;
    var item = DocsState.items.find(function (i) { return i.id === id; });
    var menu = document.getElementById('docs-ctx-menu');
    if (!menu || !item) return;
    var preview = menu.querySelector('[data-action="preview"]');
    var download = menu.querySelector('[data-action="download"]');
    if (preview) preview.style.display = item.type === 'file' ? 'flex' : 'none';
    if (download) download.style.display = docsCanDownload(item) ? 'flex' : 'none';
    menu.style.display = 'block';
    menu.style.left = Math.min(event.pageX, document.body.clientWidth - 190) + 'px';
    menu.style.top = event.pageY + 'px';
  }

  function docsHideCtxMenu() {
    var menu = document.getElementById('docs-ctx-menu');
    if (menu) menu.style.display = 'none';
  }

  function docsCtxPreview() { docsOpenPreview(DocsState.ctxTargetId); }
  function docsCtxDownload() { docsDownloadOne(DocsState.ctxTargetId); }
  function docsCtxRename() { docsRename(DocsState.ctxTargetId); }
  function docsCtxDelete() { docsDeleteOne(DocsState.ctxTargetId); }

  function docsInitDragDrop() {
    if (window.__tacsDocsDragBound) return;
    window.__tacsDocsDragBound = true;
    var cnt = 0;
    document.addEventListener('dragenter', function (e) {
      if (!e.dataTransfer || !Array.from(e.dataTransfer.types || []).includes('Files')) return;
      cnt += 1;
      var overlay = document.getElementById('docs-drop-overlay');
      if (overlay) overlay.style.display = 'flex';
    });
    document.addEventListener('dragleave', function () {
      cnt -= 1;
      if (cnt <= 0) {
        cnt = 0;
        var overlay = document.getElementById('docs-drop-overlay');
        if (overlay) overlay.style.display = 'none';
      }
    });
    document.addEventListener('dragover', function (e) { e.preventDefault(); });
    document.addEventListener('drop', function (e) {
      e.preventDefault();
      cnt = 0;
      var overlay = document.getElementById('docs-drop-overlay');
      if (overlay) overlay.style.display = 'none';
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) docsUploadFiles(e.dataTransfer.files);
    });
  }

  function docsInitContextMenuClose() {
    if (window.__tacsDocsCtxBound) return;
    window.__tacsDocsCtxBound = true;
    document.addEventListener('click', docsHideCtxMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        docsHideCtxMenu();
        docsClosePreview();
      }
    });
  }

  function docsFormatSize(bytes) {
    bytes = Number(bytes || 0);
    if (!bytes) return '0 B';
    var k = 1024;
    var s = ['B', 'KB', 'MB', 'GB', 'TB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + s[Math.min(i, s.length - 1)];
  }

  function docsFormatDate(str) {
    if (!str) return '-';
    var d = new Date(str);
    if (isNaN(d.getTime())) return str;
    var p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function docsFileIcon(name) {
    var ext = (name || '').split('.').pop().toLowerCase();
    return ({
      pdf: 'picture_as_pdf', doc: 'description', docx: 'description', xls: 'table_chart', xlsx: 'table_chart',
      ppt: 'slideshow', pptx: 'slideshow', jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image',
      svg: 'image', zip: 'folder_zip', rar: 'folder_zip', '7z': 'folder_zip', txt: 'text_snippet', csv: 'grid_on',
      mp4: 'videocam', mov: 'videocam', avi: 'videocam', mp3: 'music_note', wav: 'music_note'
    })[ext] || 'insert_drive_file';
  }

  function docsFileIconColor(name) {
    var ext = (name || '').split('.').pop().toLowerCase();
    return ({
      pdf: '#ef4444', doc: '#3b82f6', docx: '#3b82f6', xls: '#22c55e', xlsx: '#22c55e',
      ppt: '#f97316', pptx: '#f97316', jpg: '#a855f7', jpeg: '#a855f7', png: '#a855f7', gif: '#a855f7',
      zip: '#f59e0b', rar: '#f59e0b', '7z': '#f59e0b', txt: '#64748b', csv: '#22c55e'
    })[ext] || '#64748b';
  }

  function docsInit() {
    docsResetDateFilter();
    docsEnsureScaffold();
    
    var urlParams = new URLSearchParams(window.location.search);
    var initFolder = urlParams.get('docsFolderId') || null;

    if (!window.__tacsDocsPopStateBound) {
        window.__tacsDocsPopStateBound = true;
        history.replaceState({ docsFolderId: initFolder }, '', window.location.href);
        window.addEventListener('popstate', function(e) {
            if (e.state && typeof e.state.docsFolderId !== 'undefined') {
                docsLoadFolder(e.state.docsFolderId, true);
            }
        });
    }

    docsLoadFolder(initFolder, true);
    docsInitDragDrop();
    docsInitContextMenuClose();
  }

  // Assign functions strictly required globally
  window.DocsState = DocsState;
  window.docsLoadFolder = docsLoadFolder;
  window.docsRender = docsRender;
  window.docsGoRoot = docsGoRoot;
  window.docsGoBack = docsGoBack;
  window.docsGoParent = docsGoParent;
  window.docsEnterFolder = docsEnterFolder;
  window.docsUpdateBreadcrumb = docsUpdateBreadcrumb;
  window.docsJumpTo = docsJumpTo;
  window.docsCardClick = docsCardClick;
  window.docsCardDblClick = docsCardDblClick;
  window.docsToggleSelect = docsToggleSelect;
  window.docsToggleSelectAll = docsToggleSelectAll;
  window.docsClearSelection = docsClearSelection;
  window.docsRefreshSelectionUI = docsRefreshSelectionUI;
  window.docsUpdateActionBar = docsUpdateActionBar;
  window.docsSetView = docsSetView;
  window.docsSetFilter = docsSetFilter;
  window.docsSetDateFilter = docsSetDateFilter;
  window.docsOpenDatePicker = docsOpenDatePicker;
  window.docsCloseDatePicker = docsCloseDatePicker;
  window.docsApplyDateFilter = docsApplyDateFilter;
  window.docsMoveDatePickerMonth = docsMoveDatePickerMonth;
  window.docsPickDateRange = docsPickDateRange;
  window.docsClearDatePickerRange = docsClearDatePickerRange;
  window.docsNewFolder = docsNewFolder;
  window.docsUploadFiles = docsUploadFiles;
  window.docsDownloadOne = docsDownloadOne;
  window.docsDownloadSelected = docsDownloadSelected;
  window.docsDeleteOne = docsDeleteOne;
  window.docsDeleteSelected = docsDeleteSelected;
  window.docsRename = docsRename;
  window.docsRenameKeydown = docsRenameKeydown;
  window.docsCancelRename = docsCancelRename;
  window.docsCommitRename = docsCommitRename;
  window.docsOpenPreview = docsOpenPreview;
  window.docsClosePreview = docsClosePreview;
  window.docsShowCtxMenu = docsShowCtxMenu;
  window.docsCtxPreview = docsCtxPreview;
  window.docsCtxDownload = docsCtxDownload;
  window.docsCtxRename = docsCtxRename;
  window.docsCtxDelete = docsCtxDelete;
  window.docsInit = docsInit;
  window.buildDocumentArchivePanel = buildDocumentArchivePanel;
  window.docsPreviewingId = docsPreviewingId;

  function docsBootIfNeeded() {
    if (window.TRANSPORT_DEFER_PAGE_BOOT) return;

    /*
     * 휴지통 화면은 trashContent.jsp가 전담한다.
     * 특히 운송담당자 화면은 TRANSPORT_INITIAL_VIEW.group 값이 docs라서
     * 휴지통에서도 docs.js가 문서함 본문을 강제로 주입하던 문제가 있었다.
     */
    if (document.getElementById('pg-docs-trash')) return;

    var shouldBoot = document.getElementById('pg-docs') || document.getElementById('docArchiveRoot') || document.getElementById('docs-container');
    if (shouldBoot) docsInit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', docsBootIfNeeded);
  } else {
    docsBootIfNeeded();
  }
})();
