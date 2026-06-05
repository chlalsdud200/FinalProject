(function () {
  'use strict';

  function text(value) {
    return value !== undefined && value !== null && String(value).trim() ? String(value).trim() : '-';
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = text(value);
  }

  function escapeHtml(value) {
    return text(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function closest(el, selector) {
    while (el && el.nodeType === 1) {
      if (el.matches && el.matches(selector)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function rowData(row, key) {
    return row ? row.getAttribute('data-' + key) : '';
  }

  function normalizeType(row) {
    return rowData(row, 'cargo-type') || (rowData(row, 'type') === 'house' ? '혼재화물' : '적재화물');
  }

  function declareTypeText(row) {
    var value = rowData(row, 'declare-type');
    if (value === 'IMPORT') return '수입';
    if (value === 'EXPORT') return '수출';
    return '-';
  }

  function mainNoValue(row) {
    return rowData(row, 'bl-no') || rowData(row, 'mbl-no');
  }

  function declareStatusValue(row) {
    return text(rowData(row, 'declare-status'));
  }

  function memoKey(row) {
    var type = rowData(row, 'type') || 'loading';
    var keyNo = rowData(row, 'req-no') || rowData(row, 'bl-no') || rowData(row, 'mbl-no') || row.rowIndex;
    return 'loadedCargoMemo:' + type + ':' + keyNo;
  }

  function activeColspan(row) {
    var table = row ? row.closest('table') : null;
    if (!table) return row ? row.children.length || 1 : 1;
    return table.querySelectorAll('thead th').length || row.children.length || 1;
  }

  function panelHome() {
    return document.querySelector('.loadedCargoList-page .inline-screen-body') || document.body;
  }

  function removeDetailRow() {
    var detailRow = document.getElementById('cargo-detail-inline-row');
    if (detailRow && detailRow.parentNode) detailRow.parentNode.removeChild(detailRow);
  }

  function hideDetail() {
    var panel = document.getElementById('cargo-list-detail-panel');
    if (panel) {
      panel.style.display = 'none';
      panelHome().appendChild(panel);
    }
    removeDetailRow();
    document.querySelectorAll('.cargo-click-row').forEach(function (row) {
      row.classList.remove('row-selected');
    });
  }

  function setCargoListTab(key, btn) {
    key = key || 'all-list';
    document.querySelectorAll('[data-tab-group="cargo-list-type"]').forEach(function (tab) {
      tab.classList.toggle('active', tab === btn || (!btn && tab.getAttribute('data-tab-key') === key));
    });
    document.querySelectorAll('[data-panel-group="cargo-list-type"]').forEach(function (panel) {
      panel.style.display = panel.getAttribute('data-panel-key') === key ? 'block' : 'none';
    });
    hideDetail();
  }

  function createDetailRow(row, panel) {
    removeDetailRow();

    var detailRow = document.createElement('tr');
    detailRow.id = 'cargo-detail-inline-row';
    detailRow.className = 'cargo-detail-inline-row';

    var detailCell = document.createElement('td');
    detailCell.colSpan = activeColspan(row);
    detailCell.className = 'cargo-detail-inline-cell';
    detailCell.appendChild(panel);

    detailRow.appendChild(detailCell);
    row.parentNode.insertBefore(detailRow, row.nextSibling);
  }

  function renderFallbackItemRow(row) {
    var body = document.getElementById('cargoCompareBody');
    if (!body) return;

    body.innerHTML = '<tr>'
      + '<td>' + escapeHtml(rowData(row, 'item-name')) + '</td>'
      + '<td>' + escapeHtml(rowData(row, 'quantity')) + '</td>'
      + '<td>' + escapeHtml(rowData(row, 'weight')) + '</td>'
      + '</tr>';
  }

  function getContextPath() {
    var path = window.location.pathname || '';
    var idx = path.indexOf('/officer/');
    return idx > 0 ? path.substring(0, idx) : '';
  }

  function renderItemRows(row) {
    var body = document.getElementById('cargoCompareBody');
    if (!body || !row) return;

    var reqNo = rowData(row, 'req-no');
    var declareType = rowData(row, 'declare-type');

    if (!reqNo) {
      renderFallbackItemRow(row);
      return;
    }

    body.innerHTML = '<tr><td colspan="3" class="empty-cell">품목 상세내역을 불러오는 중입니다.</td></tr>';

    var url = getContextPath()
      + '/officer/loadedCargoItems.do?reqNo=' + encodeURIComponent(reqNo)
      + '&declareType=' + encodeURIComponent(declareType || 'ALL');

    fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('품목 상세 조회 실패');
        return res.json();
      })
      .then(function (items) {
        if (!items || !items.length) {
          body.innerHTML = '<tr><td colspan="3" class="empty-cell">조회된 품목 상세내역이 없습니다.</td></tr>';
          return;
        }

        body.innerHTML = items.map(function (item) {
          return '<tr>'
            + '<td>' + escapeHtml(item.itemName) + '</td>'
            + '<td>' + escapeHtml(item.quantity) + '</td>'
            + '<td>' + escapeHtml(item.weight) + '</td>'
            + '</tr>';
        }).join('');
      })
      .catch(function () {
        renderFallbackItemRow(row);
      });
  }

  function openCargoDetail(row) {
    var panel = document.getElementById('cargo-list-detail-panel');
    if (!panel || !row) return;

    if (row.classList.contains('row-selected')) {
      hideDetail();
      return;
    }

    document.querySelectorAll('.cargo-click-row').forEach(function (item) {
      item.classList.remove('row-selected');
    });
    row.classList.add('row-selected');

    createDetailRow(row, panel);

    setText('detailType', normalizeType(row));
    setText('detailDeclareType', declareTypeText(row));
    setText('detailReqNo', rowData(row, 'req-no'));
    setText('detailCargoManageNo', rowData(row, 'cargo-manage-no'));
    setText('detailOwnerName', rowData(row, 'owner-name'));
    setText('detailItemName', rowData(row, 'item-name'));
    setText('detailTotalQuantity', rowData(row, 'quantity'));
    setText('detailTotalWeight', rowData(row, 'weight'));
    setText('detailDeclareStatus', declareStatusValue(row));
    setText('detailSubmitDate', rowData(row, 'submit-date'));
    setText('detailMainNo', mainNoValue(row));
    setText('detailMblNo', rowData(row, 'mbl-no'));
    setText('detailRemark', rowData(row, 'remark'));

    renderItemRows(row);

    var memo = document.getElementById('cargoMemo');
    if (memo) {
      memo.value = localStorage.getItem(memoKey(row)) || '';
      memo.setAttribute('data-memo-key', memoKey(row));
    }

    var saved = document.getElementById('cargoMemoSavedText');
    if (saved) saved.textContent = '';

    panel.style.display = 'block';
  }

  function bindMemoSave() {
    var button = document.getElementById('btnSaveCargoMemo');
    var memo = document.getElementById('cargoMemo');
    var saved = document.getElementById('cargoMemoSavedText');
    if (!button || !memo) return;

    button.onclick = function () {
      var key = memo.getAttribute('data-memo-key');
      if (!key) return;
      localStorage.setItem(key, memo.value || '');
      if (saved) {
        saved.textContent = '메모가 저장되었습니다.';
        setTimeout(function () { saved.textContent = ''; }, 1800);
      }
    };
  }

  function bindSearchButtons() {
    var resetBtn = document.getElementById('btnResetLoadedCargoSearch');
    if (resetBtn) {
      resetBtn.onclick = function () { window.location.href = window.location.pathname; };
    }

    var recentBtn = document.getElementById('btnRecentWeek');
    if (!recentBtn) return;

    recentBtn.onclick = function () {
      var end = new Date();
      var start = new Date();
      start.setDate(end.getDate() - 7);

      function format(date) {
        return date.getFullYear() + '-'
          + String(date.getMonth() + 1).padStart(2, '0') + '-'
          + String(date.getDate()).padStart(2, '0');
      }

      var startDate = document.getElementById('startDate');
      var endDate = document.getElementById('endDate');
      if (startDate) startDate.value = format(start);
      if (endDate) endDate.value = format(end);
    };
  }

  function handleClick(event) {
    var tab = closest(event.target, '[data-tab-group="cargo-list-type"]');
    if (tab) {
      event.preventDefault();
      event.stopPropagation();
      setCargoListTab(tab.getAttribute('data-tab-key') || 'all-list', tab);
      return;
    }

    var detailButton = closest(event.target, '.btn-cargo-detail');
    var row = detailButton ? closest(detailButton, '.cargo-click-row') : closest(event.target, '.cargo-click-row');
    if (!row || closest(event.target, 'a, input, select, textarea, label')) return;

    event.preventDefault();
    event.stopPropagation();
    openCargoDetail(row);
  }

  function init() {
    if (window.__loadedCargoListBound) return;
    window.__loadedCargoListBound = true;
    document.addEventListener('click', handleClick, true);
    bindMemoSave();
    bindSearchButtons();
    setCargoListTab('all-list');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.setCargoListTab = setCargoListTab;
  window.openCargoDetail = openCargoDetail;
})();
