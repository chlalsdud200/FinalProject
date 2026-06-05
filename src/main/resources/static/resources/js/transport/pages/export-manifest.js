/* =========================================================
 * export-manifest.js
 * 수출 적하목록 조회 전용 화면
 * - 왼쪽 카테고리 클릭 시 목록만 표시
 * - 행 클릭 시 아코디언 상세 펼침
 * - 작성/제출/PDF 업로드 제거
 * ========================================================= */
(function () {
  'use strict';

  const MENU_ITEM_ID = 'TACS-FW-011';
  const API_LIST = '/transport/export/manifest/list.do';

  function buildExportManifestPanel() {
    injectExportManifestStyle();
    return `
      <section id="exportManifestAccordionPanel" class="exp-mf-wrap">
        <div class="exp-mf-card">
          <div class="exp-mf-head">
            <div>
              <h3 class="exp-mf-title">수출 적하목록 조회</h3>
              <p class="exp-mf-desc">수출 운송의뢰 기준으로 적하목록 대상과 제출 정보를 조회합니다. 행을 누르면 상세 정보가 펼쳐집니다.</p>
            </div>
            <button type="button" id="exportManifestReloadBtn" class="exp-mf-btn exp-mf-btn-primary">조회</button>
          </div>

          <div class="exp-mf-search-grid">
            <label class="exp-mf-search-field">의뢰번호
              <input id="exportManifestSearchTrcNo" type="text" placeholder="의뢰번호 검색">
            </label>
            <label class="exp-mf-search-field">화주명
              <input id="exportManifestSearchOwner" type="text" placeholder="화주명 검색">
            </label>
            <label class="exp-mf-search-field">MBL/HBL
              <input id="exportManifestSearchBl" type="text" placeholder="B/L 번호 검색">
            </label>
            <label class="exp-mf-search-field">상태
              <select id="exportManifestSearchStatus">
                <option value="">전체</option>
                <option value="DRAFT">작성대기</option>
                <option value="SUBMITTED">제출완료</option>
                <option value="SUPPLEMENT">보완요청</option>
              </select>
            </label>
            <div class="exp-mf-search-actions">
              <button type="button" id="exportManifestSearchBtn" class="exp-mf-btn exp-mf-btn-primary">검색</button>
              <button type="button" id="exportManifestResetBtn" class="exp-mf-btn exp-mf-btn-light">초기화</button>
            </div>
          </div>

          <div class="exp-mf-table-wrap">
            <table class="exp-mf-table">
              <thead>
                <tr>
                  <th style="width:15%">의뢰번호</th>
                  <th style="width:13%">화주명</th>
                  <th style="width:12%">송장번호</th>
                  <th style="width:13%">화물관리번호</th>
                  <th style="width:11%">Master B/L</th>
                  <th style="width:11%">HOUSE B/L</th>
                  <th style="width:10%">출발항</th>
                  <th style="width:10%">도착항</th>
                  <th style="width:5%">상태</th>
                </tr>
              </thead>
              <tbody id="exportManifestListBody">
                <tr><td colspan="9" class="exp-mf-empty">조회 버튼을 눌러 수출 적하목록을 불러오세요.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  function bindExportManifestActions(groupKey, itemId) {
    if (itemId !== MENU_ITEM_ID) return;

    const reloadBtn = document.getElementById('exportManifestReloadBtn');
    const searchBtn = document.getElementById('exportManifestSearchBtn');
    const resetBtn = document.getElementById('exportManifestResetBtn');
    const tbody = document.getElementById('exportManifestListBody');

    if (reloadBtn && !reloadBtn.dataset.bound) {
      reloadBtn.dataset.bound = 'true';
      reloadBtn.addEventListener('click', loadExportManifestList);
    }

    if (searchBtn && !searchBtn.dataset.bound) {
      searchBtn.dataset.bound = 'true';
      searchBtn.addEventListener('click', renderFilteredExportManifestList);
    }

    if (resetBtn && !resetBtn.dataset.bound) {
      resetBtn.dataset.bound = 'true';
      resetBtn.addEventListener('click', function () {
        setValue('exportManifestSearchTrcNo', '');
        setValue('exportManifestSearchOwner', '');
        setValue('exportManifestSearchBl', '');
        setValue('exportManifestSearchStatus', '');
        renderExportManifestList(window.EXPORT_MANIFEST_LIST || []);
      });
    }

    ['exportManifestSearchTrcNo', 'exportManifestSearchOwner', 'exportManifestSearchBl'].forEach(function (id) {
      const input = document.getElementById(id);
      if (input && !input.dataset.bound) {
        input.dataset.bound = 'true';
        input.addEventListener('keydown', function (event) {
          if (event.key === 'Enter') renderFilteredExportManifestList();
        });
      }
    });

    const statusSelect = document.getElementById('exportManifestSearchStatus');
    if (statusSelect && !statusSelect.dataset.bound) {
      statusSelect.dataset.bound = 'true';
      statusSelect.addEventListener('change', renderFilteredExportManifestList);
    }

    if (tbody && !tbody.dataset.bound) {
      tbody.dataset.bound = 'true';
      tbody.addEventListener('click', function (event) {
        const row = event.target.closest('tr[data-exp-mf-row]');
        if (!row) return;
        toggleExportManifestAccordion(row.dataset.expMfRow);
      });
    }

    loadExportManifestList();
  }

  function loadExportManifestList() {
    const tbody = document.getElementById('exportManifestListBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="exp-mf-empty">수출 적하목록을 조회 중입니다...</td></tr>';

    return fetch((window.contextPath || '') + API_LIST + '?_=' + Date.now(), {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      cache: 'no-store',
      credentials: 'same-origin'
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (list) {
        window.EXPORT_MANIFEST_LIST = Array.isArray(list) ? list : [];
        renderExportManifestList(window.EXPORT_MANIFEST_LIST);
      })
      .catch(function (err) {
        console.error('[수출 적하목록 조회 실패]', err);
        if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="exp-mf-empty exp-mf-error">수출 적하목록 목록을 불러오지 못했습니다.</td></tr>';
      });
  }

  function renderFilteredExportManifestList() {
    const list = window.EXPORT_MANIFEST_LIST || [];
    const trcNo = lowerValue('exportManifestSearchTrcNo');
    const owner = lowerValue('exportManifestSearchOwner');
    const bl = lowerValue('exportManifestSearchBl');
    const status = valueOf('exportManifestSearchStatus');

    const filtered = list.filter(function (item) {
      const itemTrcNo = lower(pick(item, ['trcNo', 'requestNo', 'treId']));
      const itemOwner = lower(pick(item, ['ownerNm', 'shipperName', 'owrNm']));
      const itemBl = lower([
        pick(item, ['mblNo', 'masterBlNo', 'blNo']),
        pick(item, ['hblNo', 'houseBlNo'])
      ].join(' '));
      const itemStatus = String(pick(item, ['manifestStatusCd', 'statusCd'])).toUpperCase();

      return (!trcNo || itemTrcNo.includes(trcNo))
        && (!owner || itemOwner.includes(owner))
        && (!bl || itemBl.includes(bl))
        && (!status || itemStatus === status);
    });

    renderExportManifestList(filtered);
  }

  function renderExportManifestList(list) {
    const tbody = document.getElementById('exportManifestListBody');
    if (!tbody) return;

    window.EXPORT_MANIFEST_VISIBLE_LIST = Array.isArray(list) ? list : [];
    window.EXPORT_MANIFEST_OPEN_KEY = null;

    if (!window.EXPORT_MANIFEST_VISIBLE_LIST.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="exp-mf-empty">조회된 수출 적하목록이 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = window.EXPORT_MANIFEST_VISIBLE_LIST.map(function (item, index) {
      return buildListRow(item, index);
    }).join('');
  }

  function buildListRow(item, index) {
    const statusCd = pick(item, ['manifestStatusCd', 'statusCd'], 'DRAFT');
    const statusNm = normalizeManifestStatusNm(statusCd, pick(item, ['manifestStatusNm', 'statusNm']));
    const rowKey = String(index);

    return `
      <tr class="exp-mf-row" data-exp-mf-row="${escAttr(rowKey)}">
        <td class="exp-mf-strong">${esc(pick(item, ['trcNo', 'requestNo', 'treId']))}</td>
        <td>${esc(pick(item, ['ownerNm', 'shipperName', 'owrNm']))}</td>
        <td>${esc(pick(item, ['invoiceNo', 'invoiceFile']))}</td>
        <td>${esc(pick(item, ['cargoMgmtNo']))}</td>
        <td>${esc(pick(item, ['mblNo', 'masterBlNo', 'blNo']))}</td>
        <td>${esc(pick(item, ['hblNo', 'houseBlNo']))}</td>
        <td>${esc(pick(item, ['deptPortNm', 'deptPortCd', 'origin']))}</td>
        <td>${esc(pick(item, ['arvlPortNm', 'arvlPortCd', 'destination']))}</td>
        <td><span class="${statusClass(statusCd)}">${esc(statusNm)}</span></td>
      </tr>
      <tr id="exportManifestAccordion-${escAttr(rowKey)}" class="exp-mf-accordion hidden">
        <td colspan="9">${buildAccordionDetail(item)}</td>
      </tr>
    `;
  }

  function buildAccordionDetail(item) {
    return `
      <div class="exp-mf-detail">
        <div class="exp-mf-detail-title">
          <span>적하목록 상세정보</span>
          <span class="exp-mf-detail-sub">${esc(pick(item, ['trcNo', 'requestNo', 'treId']))}</span>
        </div>
        <div class="exp-mf-detail-grid">
          ${detailBox('1. 의뢰/화주 정보', [
            ['의뢰번호', pick(item, ['trcNo', 'requestNo', 'treId'])],
            ['화물그룹번호', pick(item, ['ggNo', 'tfgNo'])],
            ['화주ID', pick(item, ['ownerId'])],
            ['화주명', pick(item, ['ownerNm', 'shipperName', 'owrNm'])],
            ['화주 연락처', pick(item, ['ownerTelno', 'ownerTel', 'shipperPhone'])],
            ['화주 이메일', pick(item, ['ownerEmail', 'shipperEmail'])]
          ])}
          ${detailBox('2. B/L 및 항로 정보', [
            ['Master B/L', pick(item, ['mblNo', 'masterBlNo', 'blNo'])],
            ['HOUSE B/L', pick(item, ['hblNo', 'houseBlNo'])],
            ['선사/운송수단', pick(item, ['carrierNm', 'carrierName', 'transportMeanNm'])],
            ['출발항', pick(item, ['deptPortNm', 'deptPortCd', 'origin'])],
            ['도착항', pick(item, ['arvlPortNm', 'arvlPortCd', 'destination'])],
            ['출항/접수일자', pick(item, ['eta', 'requestDt', 'receiptDate'])]
          ])}
          ${detailBox('3. 화물 정보', [
            ['송장번호', pick(item, ['invoiceNo', 'invoiceFile'])],
            ['화물관리번호', pick(item, ['cargoMgmtNo'])],
            ['화물번호', pick(item, ['cgNo', 'goodsNo'])],
            ['품목명', pick(item, ['goodsName', 'itemCategory', 'itemNm'])],
            ['수량', pick(item, ['qty', 'quantity'])],
            ['중량', pick(item, ['weight'])],
            ['단가', formatNumber(pick(item, ['price']))],
            ['총액', formatNumber(pick(item, ['goodsTotalPrice', 'totalPrice']))],
            ['원산지', pick(item, ['origin'])]
          ])}
          ${detailBox('4. 적하목록/보완 정보', [
            ['적하목록번호', pick(item, ['manifestNo'])],
            ['적하목록 상태', normalizeManifestStatusNm(pick(item, ['manifestStatusCd', 'statusCd']), pick(item, ['manifestStatusNm', 'statusNm']))],
            ['제출일자', pick(item, ['manifestSubmitDt'])],
            ['제출파일', pick(item, ['manifestPdfFile'])],
            ['송장 수신파일', pick(item, ['invoiceFile'])],
            ['포장명세서 수신파일', pick(item, ['packingListFile'])],
            ['보완요청번호', pick(item, ['supplementNo'])],
            ['보완유형', formatSupplementType(pick(item, ['supplementTypeCd']))],
            ['보완요청내용', pick(item, ['rejectReason'])],
            ['비고', pick(item, ['manifestRemark'])]
          ], true)}
        </div>
      </div>
    `;
  }

  function detailBox(title, rows, wide) {
    return `
      <section class="exp-mf-detail-box ${wide ? 'exp-mf-detail-box-wide' : ''}">
        <h4>${esc(title)}</h4>
        <div class="exp-mf-field-grid">
          ${rows.map(function (row) {
            return `<div class="exp-mf-field"><span>${esc(row[0])}</span><div>${esc(row[1])}</div></div>`;
          }).join('')}
        </div>
      </section>
    `;
  }

  function toggleExportManifestAccordion(rowKey) {
    const openKey = window.EXPORT_MANIFEST_OPEN_KEY;
    document.querySelectorAll('#exportManifestListBody tr.exp-mf-accordion').forEach(function (row) {
      row.classList.add('hidden');
    });
    document.querySelectorAll('#exportManifestListBody tr.exp-mf-row').forEach(function (row) {
      row.classList.remove('is-open');
    });

    if (openKey === rowKey) {
      window.EXPORT_MANIFEST_OPEN_KEY = null;
      return;
    }

    const detailRow = document.getElementById('exportManifestAccordion-' + rowKey);
    const listRow = document.querySelector('#exportManifestListBody tr[data-exp-mf-row="' + cssEscape(rowKey) + '"]');
    if (detailRow) detailRow.classList.remove('hidden');
    if (listRow) listRow.classList.add('is-open');
    window.EXPORT_MANIFEST_OPEN_KEY = rowKey;
  }

  function injectExportManifestStyle() {
    if (document.getElementById('export-manifest-accordion-style-20260522')) return;
    const style = document.createElement('style');
    style.id = 'export-manifest-accordion-style-20260522';
    style.textContent = `
      #detail-body .exp-mf-wrap{width:100%;box-sizing:border-box;color:#10233f;}
      #detail-body .exp-mf-card{background:#fff;border:1px solid #c9d8ea;overflow:hidden;}
      #detail-body .exp-mf-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid #d8e2ef;background:#f8fafc;}
      #detail-body .exp-mf-title{margin:0;font-size:16px;font-weight:900;color:#0f172a;}
      #detail-body .exp-mf-desc{margin:5px 0 0;font-size:12px;font-weight:600;color:#64748b;}
      #detail-body .exp-mf-btn{height:36px;padding:0 16px;border:1px solid #cbd5e1;font-size:12px;font-weight:900;cursor:pointer;white-space:nowrap;}
      #detail-body .exp-mf-btn-primary{background:#334155!important;color:#fff!important;border-color:#334155!important;}
      #detail-body .exp-mf-btn-light{background:#fff;color:#334155;border-color:#cbd5e1;}
      #detail-body .exp-mf-search-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr)) auto;gap:12px;padding:16px 20px;border-bottom:1px solid #e2e8f0;background:#fff;align-items:end;}
      #detail-body .exp-mf-search-field{display:flex;flex-direction:column;gap:7px;font-size:12px;font-weight:900;color:#334155;}
      #detail-body .exp-mf-search-field input,#detail-body .exp-mf-search-field select{height:38px;border:1px solid #cbd5e1;background:#fff;padding:0 10px;font-size:13px;color:#0f172a;box-sizing:border-box;}
      #detail-body .exp-mf-search-actions{display:flex;gap:6px;align-items:end;}
      #detail-body .exp-mf-table-wrap{overflow-x:auto;}
      #detail-body .exp-mf-table{min-width:1180px;width:100%;border-collapse:collapse;table-layout:fixed;font-size:12px;}
      #detail-body .exp-mf-table th{background:#f1f5f9;color:#334155;font-weight:900;text-align:left;padding:12px 11px;border-bottom:1px solid #cbd5e1;white-space:nowrap;}
      #detail-body .exp-mf-table td{padding:12px 11px;border-bottom:1px solid #e2e8f0;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;}
      #detail-body .exp-mf-row{cursor:pointer;background:#fff;}
      #detail-body .exp-mf-row:hover td,#detail-body .exp-mf-row.is-open td{background:#eef4fb!important;}
      #detail-body .exp-mf-strong{font-weight:900;color:#0f172a!important;}
      #detail-body .exp-mf-empty{height:80px;text-align:center!important;color:#64748b!important;font-weight:800;}
      #detail-body .exp-mf-error{color:#dc2626!important;}
      #detail-body .exp-mf-status{display:inline-flex;align-items:center;justify-content:center;min-width:58px;height:26px;padding:0 8px;border-radius:0;font-size:11px;font-weight:900;}
      #detail-body .exp-mf-status-draft{background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;}
      #detail-body .exp-mf-status-submitted{background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;}
      #detail-body .exp-mf-status-supplement{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;}
      #detail-body .exp-mf-accordion>td{padding:0!important;background:#f8fbff!important;border-bottom:1px solid #c9d8ea!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;}
      #detail-body .exp-mf-detail{padding:18px 20px 20px;background:#f8fbff;}
      #detail-body .exp-mf-detail-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;font-size:14px;font-weight:900;color:#0f172a;}
      #detail-body .exp-mf-detail-sub{font-size:12px;color:#475569;font-weight:800;}
      #detail-body .exp-mf-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}
      #detail-body .exp-mf-detail-box{background:#fff;border:1px solid #c9d8ea;padding:16px;}
      #detail-body .exp-mf-detail-box-wide{grid-column:1 / -1;}
      #detail-body .exp-mf-detail-box h4{margin:0 0 12px;font-size:13px;font-weight:900;color:#0f172a;border-left:4px solid #334155;padding-left:9px;}
      #detail-body .exp-mf-field-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px;}
      #detail-body .exp-mf-field span{display:block;margin-bottom:5px;font-size:11px;font-weight:900;color:#475569;}
      #detail-body .exp-mf-field div{min-height:38px;background:#e2e6eb;border:1px solid #c8d1dd;padding:10px 11px;color:#1f3856;font-size:12px;font-weight:700;white-space:pre-wrap;word-break:break-word;box-sizing:border-box;}
      @media(max-width:1180px){#detail-body .exp-mf-search-grid{grid-template-columns:repeat(2,minmax(0,1fr));}#detail-body .exp-mf-search-actions{grid-column:1 / -1;}#detail-body .exp-mf-detail-grid{grid-template-columns:1fr;}}
      @media(max-width:760px){#detail-body .exp-mf-head{align-items:flex-start;flex-direction:column;}#detail-body .exp-mf-search-grid{grid-template-columns:1fr;}#detail-body .exp-mf-field-grid{grid-template-columns:1fr;}}
    `;
    document.head.appendChild(style);
  }

  function pick(row, keys, fallback) {
    for (let i = 0; i < keys.length; i++) {
      const value = row && row[keys[i]];
      if (value !== undefined && value !== null && String(value).trim() !== '') return value;
    }
    return fallback === undefined ? '' : fallback;
  }

  function normalizeManifestStatusNm(statusCd, statusNm) {
    const cd = String(statusCd || '').toUpperCase();
    if (statusNm && !['DRAFT', 'SUBMITTED', 'SUPPLEMENT'].includes(String(statusNm).toUpperCase())) return statusNm;
    if (cd === 'SUBMITTED') return '제출완료';
    if (cd === 'SUPPLEMENT') return '보완요청';
    return '작성대기';
  }

  function statusClass(statusCd) {
    const cd = String(statusCd || '').toUpperCase();
    if (cd === 'SUBMITTED') return 'exp-mf-status exp-mf-status-submitted';
    if (cd === 'SUPPLEMENT') return 'exp-mf-status exp-mf-status-supplement';
    return 'exp-mf-status exp-mf-status-draft';
  }

  function formatSupplementType(typeCd) {
    const labels = {
      FILE: '파일 재제출',
      FILE_REUPLOAD: '파일 재제출',
      DOC: '서류 보완',
      DOCUMENT: '서류 보완',
      DATA: '입력값 정정',
      INFO: '입력값 정정'
    };
    return typeCd ? (labels[typeCd] || typeCd) : '';
  }

  function formatNumber(value) {
    if (value === null || value === undefined || value === '') return '';
    const number = Number(String(value).replace(/,/g, ''));
    return Number.isNaN(number) ? value : number.toLocaleString('ko-KR');
  }

  function valueOf(id) {
    const el = document.getElementById(id);
    return el ? String(el.value || '').trim() : '';
  }

  function lowerValue(id) {
    return lower(valueOf(id));
  }

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  function lower(value) {
    return String(value || '').toLowerCase();
  }

  function esc(value) {
    if (value === undefined || value === null || value === '') return '-';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escAttr(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
  }

  window.buildExportManifestPanel = buildExportManifestPanel;
  window.bindExportManifestActions = bindExportManifestActions;
  window.loadExportManifestList = loadExportManifestList;
})();
