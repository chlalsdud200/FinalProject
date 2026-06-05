/* ===== 정보조회 페이지 전용 JS - 전체 리셋 안정판 ===== */
(function () {
  'use strict';

  var ctx = window.contextPath || '';

  var templates = {
    'customs-code': {
      title: '통관고유부호 조회',
      icon: 'pin',
      notice: '수입/수출 의뢰 테이블에 등록된 통관고유부호를 조회합니다.',
      form: `
        <form id="info-search-form" class="info-filter-card" onsubmit="event.preventDefault(); showInfoResult('customs-code');">
          <div class="info-form-grid compact">
            <div class="fg-label">부호구분</div>
            <div class="fg-value">
              <select name="codeType">
                <option value="">전체</option>
                <option value="IMPORT">수입</option>
                <option value="EXPORT">수출</option>
              </select>
            </div>
            <div class="fg-label">통관고유부호</div>
            <div class="fg-value"><input type="text" name="customsCode" placeholder="통관고유부호"></div>
            <div class="fg-label">사업자/법인번호</div>
            <div class="fg-value"><input type="text" name="bizrno" placeholder="하이픈 없이 입력 가능"></div>
            <div class="fg-label">화주명</div>
            <div class="fg-value"><input type="text" name="ownerName" placeholder="수출 데이터 기준"></div>
            <div class="fg-label">화주ID</div>
            <div class="fg-value fg-full"><input type="text" name="ownerId" placeholder="화주 ID"></div>
          </div>
          ${buttonRow()}
        </form>`,
      render: renderCustomsCode
    },
    'standard-name': {
      title: '표준품명 조회',
      icon: 'category',
      notice: 'GOODS와 HS_CODE에 존재하는 컬럼만 조회조건으로 사용합니다.',
      form: `
        <form id="info-search-form" class="info-filter-card" onsubmit="event.preventDefault(); showInfoResult('standard-name');">
          <div class="info-form-grid compact">
            <div class="fg-label">물품명</div>
            <div class="fg-value"><input type="text" name="goodsName" placeholder="물품명"></div>
            <div class="fg-label">세번부호</div>
            <div class="fg-value"><input type="text" name="hsCode" placeholder="HS Code"></div>
            <div class="fg-label">HS 품명</div>
            <div class="fg-value fg-full"><input type="text" name="hsName" placeholder="HS 품명"></div>
          </div>
          ${buttonRow()}
        </form>`,
      render: renderStandardName
    },
    'tariff-rate': {
      title: '세율·세번 조회',
      icon: 'percent',
      notice: 'HS_CODE 기준 세율과 HS_CONTROLS/CONTROLS 기준 수입요건을 조회합니다.',
      form: `
        <form id="info-search-form" class="info-filter-card" onsubmit="event.preventDefault(); showInfoResult('tariff-rate');">
          <div class="info-form-grid compact">
            <div class="fg-label">세번부호</div>
            <div class="fg-value"><input type="text" name="hsCode" placeholder="예: 8542"></div>
            <div class="fg-label">품명</div>
            <div class="fg-value"><input type="text" name="hsName" placeholder="HS 품명"></div>
            <div class="fg-label">수입요건</div>
            <div class="fg-value fg-full">
              <select name="needIns" style="max-width:220px">
                <option value="">전체</option>
                <option value="Y">검사/요건 필요</option>
                <option value="N">검사/요건 불필요</option>
              </select>
            </div>
          </div>
          ${buttonRow()}
        </form>`,
      render: renderTariffRate
    },
    'item-class': {
      title: '품목분류',
      icon: 'account_tree',
      notice: 'HS_CODE 앞 2자리인 류 기준으로 조회합니다.',
      form: `
        <form id="info-search-form" class="info-filter-card" onsubmit="event.preventDefault(); showInfoResult('item-class');">
          <div class="info-form-grid compact">
            <div class="fg-label">류</div>
            <div class="fg-value">
              <select name="chapterCode">
                <option value="">전체</option>
                ${chapterOptions()}
              </select>
            </div>
            <div class="fg-label">세번부호</div>
            <div class="fg-value"><input type="text" name="hsCode" placeholder="HS Code"></div>
            <div class="fg-label">품명</div>
            <div class="fg-value fg-full"><input type="text" name="hsName" placeholder="HS 품명"></div>
          </div>
          ${buttonRow()}
        </form>`,
      render: renderItemClass
    }
  };

  function chapterOptions() {
    var html = '';
    for (var i = 1; i <= 97; i++) {
      var code = String(i).padStart(2, '0');
      html += '<option value="' + code + '">' + code + '류</option>';
    }
    return html;
  }

  function buttonRow() {
    return `
      <div class="info-action-row">
        <button type="submit" class="btn btn-primary"><span class="material-symbols-outlined">search</span> 조회</button>
        <button type="button" class="btn btn-secondary" onclick="resetInfoForm()"><span class="material-symbols-outlined">refresh</span> 초기화</button>
      </div>`;
  }

  function resolveType() {
    if (window.infoActiveType) return window.infoActiveType;
    var path = location.pathname || '';
    if (path.indexOf('customs-code.do') > -1) return 'customs-code';
    if (path.indexOf('standard-name.do') > -1) return 'standard-name';
    if (path.indexOf('tariff-rate.do') > -1) return 'tariff-rate';
    if (path.indexOf('item-class.do') > -1) return 'item-class';
    return 'customs-code';
  }

  window.switchInfo = function (type) {
    var t = templates[type] || templates['customs-code'];
    var formArea = document.getElementById('info-form-area') || document.getElementById('info-form-content');
    var resultArea = document.getElementById('info-result-area');
    var oldEmpty = document.getElementById('info-empty');
    var oldFormWrap = document.getElementById('info-form');

    if (oldEmpty) oldEmpty.style.display = 'none';
    if (oldFormWrap) oldFormWrap.style.display = 'block';

    if (formArea) {
      formArea.innerHTML = `
        <div class="info-section">
          <h4><span class="material-symbols-outlined">${t.icon}</span>${t.title}</h4>
          <div class="info-notice"><span class="material-symbols-outlined">info</span><span>${t.notice}</span></div>
          ${t.form}
        </div>`;
    }

    if (resultArea) resultArea.innerHTML = emptyResult('조회 조건을 입력하고 조회 버튼을 눌러주세요.');
  };

  window.showInfoResult = function (type) {
    var t = templates[type] || templates['customs-code'];
    var resultArea = document.getElementById('info-result-area');
    if (!resultArea) {
      var formArea = document.getElementById('info-form-area') || document.getElementById('info-form-content');
      if (formArea) {
        formArea.insertAdjacentHTML('afterend', '<div id="info-result-area"></div>');
        resultArea = document.getElementById('info-result-area');
      }
    }
    if (resultArea) resultArea.innerHTML = loadingResult();

    var url = ctx + '/broker/info/api/' + type + '.do';
    var qs = collectParams();
    if (qs) url += '?' + qs;

    fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status + ' / ' + url);
        return res.json();
      })
      .then(function (data) {
        if (resultArea) resultArea.innerHTML = t.render(Array.isArray(data) ? data : []);
      })
      .catch(function (err) {
        if (resultArea) resultArea.innerHTML = errorResult(err.message);
      });
  };

  window.resetInfoForm = function () {
    var form = document.getElementById('info-search-form');
    if (form) form.reset();
    var resultArea = document.getElementById('info-result-area');
    if (resultArea) resultArea.innerHTML = emptyResult('조회 조건을 초기화했습니다.');
  };

  function collectParams() {
    var params = new URLSearchParams();
    var form = document.getElementById('info-search-form');
    if (!form) return '';
    form.querySelectorAll('input[name], select[name]').forEach(function (el) {
      var value = (el.value || '').trim();
      if (value !== '') params.append(el.name, value);
    });
    return params.toString();
  }

  function cell(row, key) {
    var v = row[key];
    if (v === undefined) v = row[key.toUpperCase()];
    if (v === undefined) v = row[toSnakeUpper(key)];
    return v == null ? '' : v;
  }
  function toSnakeUpper(str) { return String(str).replace(/[A-Z]/g, function (m) { return '_' + m; }).toUpperCase(); }
  function esc(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function summary(count) { return `<div class="info-result-summary"><span>검색결과 <strong>${count}</strong>건</span></div>`; }
  function loadingResult() { return `<div class="info-state"><span class="material-symbols-outlined">hourglass_empty</span> 조회 중입니다.</div>`; }
  function emptyResult(msg) { return `<div class="info-state muted"><span class="material-symbols-outlined">search</span> ${esc(msg)}</div>`; }
  function errorResult(msg) { return `<div class="info-state error"><span class="material-symbols-outlined">error</span> 조회 실패: ${esc(msg)}</div>`; }
  function noDataRow(colspan) { return `<tr><td colspan="${colspan}" class="td-muted" style="text-align:center;padding:24px">조회 결과가 없습니다.</td></tr>`; }
  function formatRate(v) { return (v === '' || v == null) ? '-' : esc(v) + '%'; }
  function formatNeedIns(v) { if (v === 'Y') return '<span class="badge badge-urgent">필요</span>'; if (v === 'N') return '<span class="badge badge-ok">불필요</span>'; return '-'; }

  function renderCustomsCode(rows) {
    var body = rows.length ? rows.map(function (r, i) {
      return `<tr><td>${i + 1}</td><td><span class="badge ${cell(r, 'codeType') === 'IMPORT' ? 'badge-ok' : 'badge-wait'}">${esc(cell(r, 'codeTypeNm'))}</span></td><td class="td-id">${esc(cell(r, 'customsCode'))}</td><td>${esc(cell(r, 'bizrno'))}</td><td>${esc(cell(r, 'ownerName') || '-')}</td><td>${esc(cell(r, 'ownerId'))}</td><td>${esc(cell(r, 'refNo'))}</td></tr>`;
    }).join('') : noDataRow(7);
    return `<div class="info-result-area"><h4><span class="material-symbols-outlined">fact_check</span>통관고유부호 조회 결과</h4>${summary(rows.length)}<table class="data-table"><thead><tr><th>No</th><th>부호구분</th><th>통관고유부호</th><th>사업자/법인번호</th><th>화주명</th><th>화주ID</th><th>참조번호</th></tr></thead><tbody>${body}</tbody></table></div>`;
  }
  function renderStandardName(rows) {
    var body = rows.length ? rows.map(function (r, i) {
      return `<tr><td>${i + 1}</td><td class="td-id">${esc(cell(r, 'goodsNo'))}</td><td>${esc(cell(r, 'goodsName'))}</td><td class="td-id">${esc(cell(r, 'hsCode'))}</td><td>${esc(cell(r, 'hsName'))}</td><td>${formatRate(cell(r, 'tariffRate'))}</td></tr>`;
    }).join('') : noDataRow(6);
    return `<div class="info-result-area"><h4><span class="material-symbols-outlined">category</span>표준품명 조회 결과</h4>${summary(rows.length)}<table class="data-table"><thead><tr><th>No</th><th>물품번호</th><th>물품명</th><th>세번부호</th><th>HS 품명</th><th>세율</th></tr></thead><tbody>${body}</tbody></table></div>`;
  }
  function renderTariffRate(rows) {
    var body = rows.length ? rows.map(function (r, i) {
      return `<tr><td>${i + 1}</td><td class="td-id">${esc(cell(r, 'hsCode'))}</td><td>${esc(cell(r, 'hsName'))}</td><td>${formatRate(cell(r, 'tariffRate'))}</td><td>${esc(cell(r, 'controlsName') || '-')}</td><td>${formatNeedIns(cell(r, 'needIns'))}</td></tr>`;
    }).join('') : noDataRow(6);
    return `<div class="info-result-area"><h4><span class="material-symbols-outlined">percent</span>세율·세번 조회 결과</h4>${summary(rows.length)}<table class="data-table"><thead><tr><th>No</th><th>세번부호</th><th>품명</th><th>기본세율</th><th>수입요건</th><th>검사필요</th></tr></thead><tbody>${body}</tbody></table></div>`;
  }
  function renderItemClass(rows) {
    var body = rows.length ? rows.map(function (r, i) {
      return `<tr><td>${i + 1}</td><td>${esc(cell(r, 'chapterCode'))}류</td><td class="td-id">${esc(cell(r, 'hsCode'))}</td><td>${esc(cell(r, 'hsName'))}</td><td>${formatRate(cell(r, 'tariffRate'))}</td></tr>`;
    }).join('') : noDataRow(5);
    return `<div class="info-result-area"><h4><span class="material-symbols-outlined">account_tree</span>품목분류 조회 결과</h4>${summary(rows.length)}<table class="data-table"><thead><tr><th>No</th><th>류</th><th>세번부호</th><th>품명</th><th>세율</th></tr></thead><tbody>${body}</tbody></table></div>`;
  }

  document.addEventListener('DOMContentLoaded', function () { window.switchInfo(resolveType()); });
})();
