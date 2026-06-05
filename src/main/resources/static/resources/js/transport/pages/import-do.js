
(function installTacsImportListLineFix(){
    if (document.getElementById('tacs-import-list-line-fix-style')) return;
    var style = document.createElement('style');
    style.id = 'tacs-import-list-line-fix-style';
    style.textContent = "#detail-body .import-request-action-cell{display:table-cell!important;text-align:center!important;vertical-align:middle!important;white-space:nowrap!important;}#detail-body .import-request-action-cell button,#detail-body .import-request-action-cell a{display:inline-flex!important;align-items:center!important;justify-content:center!important;margin:0 3px!important;}";
    document.head.appendChild(style);
})();

/* import-do.js - D/O 정산화면 하드코딩 제거 수정본 2026-05-17 */
function requestImportDOListRefresh(force) {
    if (window.__TACS_IMPORT_DO_LOADING) return;
    if (!force && window.__TACS_IMPORT_DO_LOADED) return;

    window.__TACS_IMPORT_DO_LOADING = true;
    const contextPath = window.contextPath || document.body?.dataset?.contextPath || '';

    fetch(contextPath + '/transport/import/do/list.do?_=' + Date.now(), {
        method: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json'},
        cache: 'no-store'
    })
        .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function (json) {
            /*
             * /transport/import/do/list.do 응답은 프로젝트 상태에 따라
             * 배열 그대로 오거나 {data/list/rows/result...} 래퍼로 온다.
             * 기존 코드는 배열만 인정해서 래퍼 응답이면 빈 배열을 저장했고,
             * 그 상태로 __TACS_IMPORT_DO_LOADED=true가 되어 상세 D/O 탭이
             * 다시 조회하지 못해 운임비/창고비/정산설명이 계속 0원/빈칸으로 보였다.
             */
            function unwrapRows(payload) {
                if (Array.isArray(payload)) return payload;
                if (!payload || typeof payload !== 'object') return [];
                var keys = ['data', 'list', 'rows', 'result', 'resultList', 'doList', 'items'];
                for (var i = 0; i < keys.length; i += 1) {
                    var v = payload[keys[i]];
                    if (Array.isArray(v)) return v;
                    if (v && typeof v === 'object') {
                        var nested = unwrapRows(v);
                        if (nested.length) return nested;
                    }
                }
                return [];
            }

            window.TRANSPORT_IMPORT_DO_LIST = unwrapRows(json);
            window.__TACS_IMPORT_DO_LOADED = true;
            window.__TACS_IMPORT_DO_LAST_LOADED_AT = Date.now();

            const body = document.getElementById('detail-body');
            const currentItem = body?.dataset ? (body.dataset.currentItem || '') : '';
            const isDoScreen = body && (
                currentItem === 'TACS-FW-030' ||
                (body.textContent || '').includes('D/O 관리') ||
                (body.textContent || '').includes('D/O 관리 데이터를 불러오는 중입니다.')
            );
            if (isDoScreen) {
                body.innerHTML = '<div class="space-y-6">' + buildDOIssueReissuePanel() + '</div>';
                body.dataset.currentGroup = 'import';
                body.dataset.currentItem = 'TACS-FW-030';
                if (typeof bindDOIssueReissueActions === 'function') bindDOIssueReissueActions('import', 'TACS-FW-030');
                if (typeof normalizeDetailActionButtons === 'function') normalizeDetailActionButtons();
            }
        })
        .catch(function (err) {
            console.error('[D/O 관리 목록 조회 실패]', err);
            window.__TACS_IMPORT_DO_LOADED = false;
        })
        .finally(function () {
            window.__TACS_IMPORT_DO_LOADING = false;
        });
}

function getImportDOIssueRows() {
    const src = Array.isArray(window.TRANSPORT_IMPORT_DO_LIST) ? window.TRANSPORT_IMPORT_DO_LIST : [];
    const list = src;

    function pick(row, keys, defaultValue) {
        for (const key of keys) {
            if (row && row[key] !== undefined && row[key] !== null && row[key] !== '') return row[key];
        }
        return defaultValue;
    }

    function pickMoney(row, keys) {
        const v = pick(row, keys, 0);
        return Number(String(v).replace(/[^0-9.-]/g, '')) || 0;
    }

    function splitFileList(value) {
        return String(value == null ? '' : value)
            .split(',')
            .map(function (item) { return item.trim(); })
            .filter(function (item) { return item !== ''; });
    }

    function isCertFileName(value) {
        const s = String(value == null ? '' : value).toLowerCase();
        return s.indexOf('cert') >= 0
            || s.indexOf('declaration') >= 0
            || String(value || '').indexOf('신고') >= 0
            || String(value || '').indexOf('필증') >= 0;
    }

    function normalizeDoAttachmentFields(row) {
        const doNoRaw = pick(row, ['doPdfFileNo', 'doFileNo', 'impDoFileNo', 'DO_PDF_FILE_NO', 'DO_FILE_NO', 'IMP_DO_FILE_NO', 'doPdfDfiNo', 'doDfiNo'], '');
        const doNmRaw = pick(row, ['doPdfFile', 'doFile', 'impDoFile', 'DO_PDF_FILE', 'DO_FILE', 'IMP_DO_FILE', 'doPdfFileNm', 'doOrgNm'], '');
        const certNoRaw = pick(row, ['doCertFileNo', 'customsCertFileNo', 'importDeclCertFileNo', 'DO_CERT_FILE_NO', 'CUSTOMS_CERT_FILE_NO', 'IMP_DO_CERT_FILE_NO', 'IMP_DO_CERT_DFI_NO', 'certDfiNo'], '');
        const certNmRaw = pick(row, ['doCertFile', 'customsCertFile', 'importDeclCertFile', 'importDeclarationCertFile', 'declCertFile', 'DO_CERT_FILE', 'CUSTOMS_CERT_FILE', 'IMP_DO_CERT_FILE', 'IMP_DO_CERT_FILE_NM', 'certFileNm', 'certOrgNm'], '');
        const commonNoRaw = pick(row, ['dfiFileNo', 'DFI_FILE_NO'], '');
        const commonNmRaw = pick(row, ['dfiOrgNm', 'DFI_ORG_NM', 'orgNm'], '');

        const fileNos = splitFileList([doNoRaw, certNoRaw, commonNoRaw].filter(Boolean).join(', '));
        const fileNms = splitFileList([doNmRaw, certNmRaw, commonNmRaw].filter(Boolean).join(', '));
        const doNos = [];
        const doNms = [];
        const certNos = [];
        const certNms = [];

        fileNms.forEach(function (name, idx) {
            const no = fileNos[idx] || '';
            if (isCertFileName(name)) {
                if (no) certNos.push(no);
                certNms.push(name);
            } else {
                if (no) doNos.push(no);
                doNms.push(name);
            }
        });

        return {
            doPdfFileNo: doNos.join(', '),
            doPdfFile: doNms.join(', '),
            doCertFileNo: certNos.join(', '),
            doCertFile: certNms.join(', ')
        };
    }

    return list
        .filter(function (row) {
            const requestNo = pick(row, ['trcNo', 'tcsTrcNo', 'reqNo', 'requestNo', 'TCS_TRC_NO', 'TRC_NO'], '');
            if (!requestNo) return false;
            return true;
        })
        .map(function (row, idx) {
            const key = pick(row, ['trcNo', 'tcsTrcNo', 'reqNo', 'requestNo', 'TCS_TRC_NO', 'TRC_NO'], '');
            const dbDoNo = pick(row, ['doNo', 'diDoNo', 'doNoCd', 'DI_DO_NO'], '');
            const doNo = dbDoNo;
            const dbDoStatusRaw = pick(row, ['doStatusNm', 'doStatusCd', 'doStatus', 'diStatusCd', 'DI_STATUS_CD'], '');
            const rawDoStatus = dbDoStatusRaw || '';
            const doStatus = normalizeDoStatusText(rawDoStatus, !!doNo);

            const dbSettlementRaw = pick(row, ['settlementStatusNm', 'settlementStatusCd', 'settlementStatus', 'stlStatus', 'stlStatusCd', 'tcsStlStatusNm', 'tcsStlStatusCd', 'tcsStlStatus', 'TCS_STL_STATUS_CD', 'TCS_STL_STATUS'], '');
            const rawSettlement = dbSettlementRaw || '미정산';
            const settlementStatus = normalizeSettlementStatusText(rawSettlement);

            const dbFreight = pickMoney(row, ['freight', 'freightAmt', 'tcsFrgtAmt', 'tcsFrghtAmt', 'tcsFreightAmt', 'TCS_FRGT_AMT', 'TCS_FRGHT_AMT', 'TCS_FREIGHT_AMT']);
            const dbWarehouse = pickMoney(row, ['warehouse', 'warehouseAmt', 'whAmt', 'tcsWhAmt', 'tcsWarehouseAmt', 'TCS_WH_AMT', 'TCS_WAREHOUSE_AMT']);
            const dbTotalBillAmt = pickMoney(row, ['totalBillAmt', 'totalAmt', 'billAmt', 'tcsTotBillAmt', 'tcsTotalBillAmt', 'TCS_TOT_BILL_AMT', 'TCS_TOTAL_BILL_AMT']);
            const dbSettlementExpln = pick(row, ['settlementExpln', 'settlementMemo', 'settlementDesc', 'stlExpln', 'tcsStlExpln', 'tcsStlDesc', 'tcsStlMemo', 'TCS_STL_EXPLN'], '');
            const doAttachments = normalizeDoAttachmentFields(row);

            return {
                requestNo: key,
                owner: pick(row, ['ownerNm', 'owrNm', 'ownerId', 'tcsOwrId', 'owrId', 'TCS_OWR_ID', 'TRC_OWR_ID'], ''),
                ownerNm: pick(row, ['ownerNm', 'owrNm', 'ownerId', 'tcsOwrId', 'owrId', 'TCS_OWR_ID', 'TRC_OWR_ID'], ''),
                doNo: doNo,
                mbl: pick(row, ['mblNo', 'masterBlNo', 'masterBlnNo', 'tcsMblNo', 'icmMblNo', 'blNo', 'TCS_MBL_NO', 'ICM_MBL_NO', 'IR_BL_AWB_NO'], ''),
                hbl: pick(row, ['hblNo', 'houseBlNo', 'houseBlnNo', 'tcsHblNo', 'icmHblNo', 'TCS_HBL_NO', 'ICM_HBL_NO'], ''),
                freight: dbFreight,
                freightAmt: dbFreight,
                tcsFrgtAmt: dbFreight,
                warehouse: dbWarehouse,
                warehouseAmt: dbWarehouse,
                tcsWhAmt: dbWarehouse,
                totalBillAmt: dbTotalBillAmt || (dbFreight + dbWarehouse),
                tcsTotBillAmt: dbTotalBillAmt || (dbFreight + dbWarehouse),
                settlementStatus: settlementStatus,
                settlementStatusNm: settlementStatus,
                doStatus: doStatus,
                doStatusNm: doStatus,
                reqDt: pick(row, ['doReqDt', 'diReqDt', 'DI_REQ_DT', 'requestDt', 'trcRqstDt'], ''),
                receiveDt: pick(row, ['doReceiveDt', 'diReceiveDt', 'DI_RECEIVE_DT'], ''),
                deliveryDt: pick(row, ['deliveryDt', 'doDlvrDt', 'diDeliveryDt', 'DI_DLVRY_DT'], ''),
                deliveryTargetNm: isImportDOManagerPlaceholder(pick(row, ['deliveryTargetNm', 'doDlvrOwnerNm', 'diDlvryOwrNm', 'DI_DLVRY_OWR_NM'], '')) ? '' : pick(row, ['deliveryTargetNm', 'doDlvrOwnerNm', 'diDlvryOwrNm', 'DI_DLVRY_OWR_NM'], ''),
                deliveryMethodCd: pick(row, ['deliveryMethodCd', 'doDlvrMthdCd', 'diDlvryMthdCd', 'DI_DLVRY_MTHD_CD'], ''),
                issueTargetNm: isImportDOManagerPlaceholder(pick(row, ['issueTargetNm', 'doIssuOwnerNm', 'diIssuOwrNm', 'DI_ISSU_OWR_NM'], '')) ? '' : pick(row, ['issueTargetNm', 'doIssuOwnerNm', 'diIssuOwrNm', 'DI_ISSU_OWR_NM'], ''),
                settlementExpln: dbSettlementExpln,
                doTfgNo: pick(row, ['doTfgNo', 'doCertTfgNo', 'diTfgNo', 'DI_TFG_NO'], ''),
                doPdfFileNo: doAttachments.doPdfFileNo,
                doPdfFile: doAttachments.doPdfFile,
                doCertTfgNo: pick(row, ['doCertTfgNo', 'doTfgNo', 'diTfgNo', 'DI_TFG_NO'], ''),
                doCertFileNo: doAttachments.doCertFileNo,
                doCertFile: doAttachments.doCertFile,
                selected: idx === 0
            };
        });
}

function escHtml(v) {
    return String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


function buildDOIssueReissuePanel() {
    if (!window.__TACS_IMPORT_DO_LOADED && !window.__TACS_IMPORT_DO_LOADING) {
        requestImportDOListRefresh(false);
    }

    const rows = getImportDOIssueRows();
    const reqFilter = String(window.__TACS_IMPORT_DO_REQ_FILTER || '').trim().toLowerCase();
    const ownerFilter = String(window.__TACS_IMPORT_DO_OWNER_FILTER || '').trim().toLowerCase();
    const doNoFilter = String(window.__TACS_IMPORT_DO_NO_FILTER || '').trim().toLowerCase();
    const blFilter = String(window.__TACS_IMPORT_DO_BL_FILTER || '').trim().toLowerCase();
    const settlementFilter = String(window.__TACS_IMPORT_DO_SETTLEMENT_FILTER || '');
    const doStatusFilter = String(window.__TACS_IMPORT_DO_STATUS_FILTER || '');

    const filteredRows = rows.filter(function (row) {
        const req = String(row.requestNo || '').toLowerCase();
        const owner = String(row.owner || '').toLowerCase();
        const doNo = String(row.doNo || '').toLowerCase();
        const bl = String((row.mbl || '') + ' ' + (row.hbl || '')).toLowerCase();
        return (!reqFilter || req.indexOf(reqFilter) >= 0)
            && (!ownerFilter || owner.indexOf(ownerFilter) >= 0)
            && (!doNoFilter || doNo.indexOf(doNoFilter) >= 0)
            && (!blFilter || bl.indexOf(blFilter) >= 0)
            && (!settlementFilter || String(row.settlementStatus || '') === settlementFilter)
            && (!doStatusFilter || String(row.doStatus || '') === doStatusFilter);
    });

    const tbody = filteredRows.length
        ? filteredRows.map(function (row) {
            const status = row.doStatus || '발급대기';
            const showDoNo = !!row.doNo;
            return '' +
                '<tr class="do-row" data-request-no="' + escHtml(row.requestNo) + '"' +
                ' data-owner="' + escHtml(row.owner || '') + '"' +
                ' data-do-no="' + escHtml(row.doNo || '') + '"' +
                ' data-mbl="' + escHtml(row.mbl || '') + '"' +
                ' data-hbl="' + escHtml(row.hbl || '') + '"' +
                ' data-freight="' + escHtml(row.freight || 0) + '"' +
                ' data-warehouse="' + escHtml(row.warehouse || 0) + '"' +
                ' data-total-bill-amt="' + escHtml(row.totalBillAmt || 0) + '"' +
                ' data-settlement-status="' + escHtml(row.settlementStatus || '') + '"' +
                ' data-settlement-expln="' + escHtml(row.settlementExpln || '') + '"' +
                ' data-do-status="' + escHtml(status || '') + '"' +
                ' data-do-tfg-no="' + escHtml(row.doTfgNo || row.doCertTfgNo || '') + '"' +
                ' data-do-pdf-file-no="' + escHtml(row.doPdfFileNo || '') + '"' +
                ' data-do-pdf-file="' + escHtml(row.doPdfFile || '') + '"' +
                ' data-do-cert-file-no="' + escHtml(row.doCertFileNo || '') + '"' +
                ' data-do-cert-file="' + escHtml(row.doCertFile || '') + '"' +
                ' data-cert-yn="' + escHtml(row.certYn || '') + '">' +
                '<td class="font-bold">' + escHtml(row.requestNo) + '</td>' +
                '<td>' + escHtml(row.owner || '-') + '</td>' +
                '<td>' + escHtml(showDoNo ? row.doNo : '') + '</td>' +
                '<td>' + escHtml(row.mbl || '-') + '</td>' +
                '<td>' + escHtml(row.hbl || '-') + '</td>' +
                '<td>' + Number(row.freight || 0).toLocaleString('ko-KR') + '원</td>' +
                '<td>' + Number(row.warehouse || 0).toLocaleString('ko-KR') + '원</td>' +
                '<td><span class="info-chip">' + escHtml(row.settlementStatus || '-') + '</span></td>' +
                '<td class="truncate" title="' + escHtml(row.settlementExpln || '') + '">' + escHtml(row.settlementExpln || '-') + '</td>' +
                '<td><span class="info-chip">' + escHtml(status) + '</span></td>' +
                '</tr>';
        }).join('')
        : `<tr><td colspan="10" class="text-center py-8 text-slate-500">${window.__TACS_IMPORT_DO_LOADING ? 'D/O 관리 데이터를 불러오는 중입니다.' : '조건에 맞는 D/O 관리 데이터가 없습니다.'}</td></tr>`;

    const settlementSelected = function (value) { return settlementFilter === value ? ' selected' : ''; };
    const doSelected = function (value) { return doStatusFilter === value ? ' selected' : ''; };
    const val = function (name) { return escHtml(window[name] || ''); };

    return `
    <div id="doListPanel" class="section-card import-left-list-card">
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h4 class="text-sm font-bold text-slate-900">D/O 관리</h4>
      </div>

      <div class="p-6 space-y-4">
        <div class="do-list-search-grid">
          <div><label class="field-label">의뢰번호</label><input id="doReqFilter" class="field-input" value="${val('__TACS_IMPORT_DO_REQ_FILTER')}" placeholder="의뢰번호"></div>
          <div><label class="field-label">화주명</label><input id="doOwnerFilter" class="field-input" value="${val('__TACS_IMPORT_DO_OWNER_FILTER')}" placeholder="화주명"></div>
          <div><label class="field-label">D/O 번호</label><input id="doNoFilter" class="field-input" value="${val('__TACS_IMPORT_DO_NO_FILTER')}" placeholder="D/O 번호"></div>
          <div><label class="field-label">B/L 번호</label><input id="doBlFilter" class="field-input" value="${val('__TACS_IMPORT_DO_BL_FILTER')}" placeholder="Master/House B/L"></div>
          <div>
            <label class="field-label">정산상태</label>
            <select id="doSettlementStatusFilter" class="field-select">
              <option value="">전체</option>
              <option value="미정산"${settlementSelected('미정산')}>미정산</option>
              <option value="정산요청"${settlementSelected('정산요청')}>정산요청</option>
              <option value="정산완료"${settlementSelected('정산완료')}>정산완료</option>
            </select>
          </div>
          <div>
            <label class="field-label">D/O 상태</label>
            <select id="doStatusFilter" class="field-select">
              <option value="">전체</option>
              <option value="발급대기"${doSelected('발급대기')}>발급대기</option>
              <option value="발급완료"${doSelected('발급완료')}>발급완료</option>
              <option value="전달완료"${doSelected('전달완료')}>전달완료</option>
            </select>
          </div>
          <div><button id="doListSearchBtn" type="button" class="px-4 py-2 bg-slate-800 text-white text-xs font-bold hover:bg-slate-900">조회</button></div>
        </div>

        <div class="overflow-hidden border border-slate-200">
          <table class="w-full tbl table-fixed">
            <colgroup>
              <col style="width:13%"><col style="width:9%"><col style="width:12%"><col style="width:12%"><col style="width:12%"><col style="width:9%"><col style="width:9%"><col style="width:8%"><col style="width:10%"><col style="width:6%">
            </colgroup>
            <thead>
              <tr>
                <th>의뢰번호</th><th>화주명</th><th>D/O 번호</th><th>Master B/L</th><th>House B/L</th>
                <th>수입 운임비</th><th>창고비</th><th>정산상태</th><th>정산설명</th><th>D/O 상태</th>
              </tr>
            </thead>
            <tbody class="text-[11px] text-slate-700">${tbody}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}





function normalizeSettlementStatusText(value) {
    const raw = String(value || '').trim();
    const upper = raw.toUpperCase();
    if (upper === 'TRC_STL_PAID' || upper === 'PAID' || upper === 'DONE' || upper === 'COMPLETE' || upper === 'COMPLETED' || raw === '정산완료') return '정산완료';
    if (upper === 'TRC_STL_REQ' || upper === 'REQ' || upper === 'REQUEST' || upper === 'REQUESTED' || raw === '정산요청' || raw === '정산요청완료') return '정산요청';
    if (upper === 'TRC_STL_UNPAID' || upper === 'UNPAID' || raw === '미정산') return '미정산';
    return raw || '미정산';
}

function normalizeDoStatusText(value, hasDoNo) {
    const raw = String(value || '').trim();
    const upper = raw.toUpperCase();

    if (['TRC_DO_REQ', 'DELIVERED', 'DLVR'].includes(upper) || raw === '전달완료' || raw === 'D/O전달완료') return '전달완료';
    if (['TRC_DO_ISSUED', 'ISSUED'].includes(upper) || raw === '발급완료' || raw === 'D/O발급완료') return '발급완료';
    if (['TRC_DO_READY', 'READY', 'REQUESTED', 'WAIT', 'DRAFT', 'ISSUABLE'].includes(upper) || raw === '발급가능' || raw === '발급대기' || raw === 'D/O발급대기') return '발급대기';

    return raw || (hasDoNo ? '발급완료' : '발급대기');
}

function bindDOIssueReissueActions(groupKey, itemId) {
    if (itemId !== 'TACS-FW-030') return;

    const byId = function (id) { return document.getElementById(id); };
    const applyFilter = function () {
        window.__TACS_IMPORT_DO_REQ_FILTER = byId('doReqFilter') ? byId('doReqFilter').value : '';
        window.__TACS_IMPORT_DO_OWNER_FILTER = byId('doOwnerFilter') ? byId('doOwnerFilter').value : '';
        window.__TACS_IMPORT_DO_NO_FILTER = byId('doNoFilter') ? byId('doNoFilter').value : '';
        window.__TACS_IMPORT_DO_BL_FILTER = byId('doBlFilter') ? byId('doBlFilter').value : '';
        window.__TACS_IMPORT_DO_SETTLEMENT_FILTER = byId('doSettlementStatusFilter') ? byId('doSettlementStatusFilter').value : '';
        window.__TACS_IMPORT_DO_STATUS_FILTER = byId('doStatusFilter') ? byId('doStatusFilter').value : '';

        const body = document.getElementById('detail-body');
        if (body && body.dataset.currentItem === 'TACS-FW-030') {
            body.innerHTML = '<div class="space-y-6">' + buildDOIssueReissuePanel() + '</div>';
            bindDOIssueReissueActions('import', 'TACS-FW-030');
            if (typeof normalizeDetailActionButtons === 'function') normalizeDetailActionButtons();
        }
    };

    const searchBtn = byId('doListSearchBtn');
    if (searchBtn) searchBtn.addEventListener('click', applyFilter);
    ['doReqFilter','doOwnerFilter','doNoFilter','doBlFilter','doSettlementStatusFilter','doStatusFilter'].forEach(function (id) {
        const el = byId(id);
        if (el) el.addEventListener('keydown', function (event) { if (event.key === 'Enter') applyFilter(); });
    });
}



/* === 2026-05-27 D/O 정산금액/설명 재조회 바인딩 보정 ===
 * 목록 행에 실린 운임비/창고비/총청구금액/정산설명을 상세 폼 input/textarea가 존재하면 즉시 채운다.
 * import-ui.js 쪽 상세 탭 ID가 조금 달라도 name/id 후보를 넓게 잡아 화면 값 누락을 막는다.
 */
(function installTacsImportDoSettlementFieldBinder(){
    if (window.__TACS_IMPORT_DO_SETTLEMENT_FIELD_BINDER_20260527) return;
    window.__TACS_IMPORT_DO_SETTLEMENT_FIELD_BINDER_20260527 = true;

    function txt(v){ return String(v == null ? '' : v).trim(); }
    function money(v){ return String(v == null || v === '' ? '0' : v).replace(/[^0-9.-]/g, ''); }
    function setField(root, selectors, value, isMoney){
        var normalized = isMoney ? money(value) : txt(value);
        for (var i = 0; i < selectors.length; i++) {
            var el = root.querySelector(selectors[i]);
            if (!el) continue;
            el.value = normalized;
            el.setAttribute('value', normalized);
            try { el.dispatchEvent(new Event('input', {bubbles:true})); } catch(e) {}
            try { el.dispatchEvent(new Event('change', {bubbles:true})); } catch(e) {}
            return true;
        }
        return false;
    }
    function bindFromRow(row){
        if (!row || !row.dataset) return;
        var root = document.getElementById('detail-body') || document;
        setField(root, [
            '#costFreight', '#doFreightAmt', '#freightAmt', '#tcsFrgtAmt',
            'input[name="freightAmt"]', 'input[name="tcsFrgtAmt"]', 'input[name="TCS_FRGT_AMT"]'
        ], row.dataset.freight, true);
        setField(root, [
            '#costWarehouse', '#doWarehouseAmt', '#warehouseAmt', '#tcsWhAmt',
            'input[name="warehouseAmt"]', 'input[name="tcsWhAmt"]', 'input[name="TCS_WH_AMT"]'
        ], row.dataset.warehouse, true);
        setField(root, [
            '#costTotal', '#doTotalBillAmt', '#totalBillAmt', '#tcsTotBillAmt',
            'input[name="totalBillAmt"]', 'input[name="tcsTotBillAmt"]', 'input[name="TCS_TOT_BILL_AMT"]'
        ], row.dataset.totalBillAmt || ((Number(money(row.dataset.freight)) || 0) + (Number(money(row.dataset.warehouse)) || 0)), true);
        setField(root, [
            '#costExpln', '#settlementExpln', '#stlExpln', '#tcsStlExpln',
            'textarea[name="settlementExpln"]', 'textarea[name="tcsStlExpln"]', 'textarea[name="TCS_STL_EXPLN"]',
            'input[name="settlementExpln"]', 'input[name="tcsStlExpln"]', 'input[name="TCS_STL_EXPLN"]'
        ], row.dataset.settlementExpln, false);
    }
    document.addEventListener('click', function(event){
        var target = event.target instanceof Element ? event.target : null;
        var row = target ? target.closest('#doListPanel .do-row, tr.do-row') : null;
        if (!row) return;
        document.querySelectorAll('#doListPanel .do-row.bg-slate-100').forEach(function(el){ el.classList.remove('bg-slate-100'); });
        row.classList.add('bg-slate-100');
        bindFromRow(row);
    }, true);
    window.bindImportDOSettlementFieldsFromActiveRow = function(){
        var root = document.getElementById('detail-body') || document;
        var row = root.querySelector('#doListPanel .do-row.bg-slate-100, tr.do-row.bg-slate-100, tr.do-row.selected');
        bindFromRow(row);
    };
})();


window.refreshImportDOFileDisplay = function () {
    window.__TACS_IMPORT_DO_LOADED = false;
    requestImportDOListRefresh(true);
};


/* === 2026-05-17 final size fix for D/O filters === */
(function(){function s(){if(document.getElementById('do-filter-size-fix'))return;var st=document.createElement('style');st.id='do-filter-size-fix';st.textContent='#detail-body #doSettlementStatusFilter,#detail-body #doStatusFilter{height:40px!important;min-height:40px!important;box-sizing:border-box!important;}#detail-body #doListSearchBtn{height:40px!important;min-height:40px!important;width:52px!important;min-width:52px!important;max-width:52px!important;padding:0!important;background:#334155!important;border:1px solid #334155!important;color:#fff!important;-webkit-text-fill-color:#fff!important;}';document.head.appendChild(st);}document.addEventListener('DOMContentLoaded',s);s();})();


/* === 2026-05-19 D/O settlement button guard ===
 * 정산완료(TRC_STL_PAID) 건은 정산 버튼이 다시 눌리지 않도록 시각/이벤트를 모두 차단한다.
 */
(function installTacsImportDoSettleGuard(){
    if (window.__TACS_IMPORT_DO_SETTLE_GUARD_20260519) return;
    window.__TACS_IMPORT_DO_SETTLE_GUARD_20260519 = true;

    function installStyle(){
        if (document.getElementById('tacs-import-do-settle-guard-style')) return;
        var style = document.createElement('style');
        style.id = 'tacs-import-do-settle-guard-style';
        style.textContent = '#detail-body .import-ui-do-flow-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:112px!important;min-width:112px!important;height:34px!important;padding:0 12px!important;border-radius:0!important;font-size:12px!important;font-weight:900!important;box-shadow:none!important;}#detail-body .import-ui-do-flow-btn.is-active{background:#1e293b!important;border-color:#1e293b!important;color:#fff!important;-webkit-text-fill-color:#fff!important;cursor:pointer!important;}#detail-body .import-ui-do-flow-btn:disabled,#detail-body .import-ui-do-flow-btn.is-locked,#detail-body .import-ui-do-flow-btn.is-done{opacity:1!important;cursor:not-allowed!important;background:#e5e7eb!important;border-color:#cbd5e1!important;color:#64748b!important;-webkit-text-fill-color:#64748b!important;pointer-events:none!important;box-shadow:none!important;}';
        document.head.appendChild(style);
    }

    function normalize(value){ return String(value == null ? '' : value).trim(); }

    document.addEventListener('DOMContentLoaded', installStyle);
    installStyle();

    document.addEventListener('click', function(event){
        var target = event.target instanceof Element ? event.target : null;
        var button = target ? target.closest('.import-ui-do-settle-btn') : null;
        if (!button) return;
        var status = normalize(button.dataset.settlementStatus);
        /* 버튼 문구가 예전 값(정산요청완료)으로 남아 있어도
         * data-settlement-status가 미정산이면 클릭 가능해야 한다.
         * 그래서 차단 기준은 버튼 문구가 아니라 DB에서 내려온 상태값만 본다.
         */
        if (button.disabled || status === '정산완료' || status === '정산요청') {
            event.preventDefault();
            event.stopPropagation();
            if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
        }
    }, true);
})();


/* D/O 정산완료 최종 가드: 목록/상세 어느 화면이든 TRC_STL_PAID면 정산 재처리 차단 */
(function TACS_DO_FINAL_PAID_GUARD(){
  function txt(v){ return String(v == null ? '' : v).trim(); }
  function isPaidText(v){ v = txt(v); return v === '정산완료' || v.toUpperCase() === 'TRC_STL_PAID' || v.toUpperCase() === 'PAID'; }
  function isReqText(v){ v = txt(v); return v === '정산요청' || v === '정산요청완료' || v.toUpperCase() === 'TRC_STL_REQ' || v.toUpperCase() === 'REQUESTED'; }
  function isUnpaidText(v){ v = txt(v); return v === '' || v === '미정산' || v.toUpperCase() === 'UNPAID' || v.toUpperCase() === 'TRC_STL_UNPAID'; }
  function guard(scope){
    var root = scope || document;
    root.querySelectorAll('.import-ui-do-settle-btn, #doSettleBtn, [data-action="do-settle"]').forEach(function(btn){
      var ds = txt(btn.dataset && btn.dataset.settlementStatus);
      var label = txt(btn.textContent);
      // 예전 코드는 화면 전체 텍스트에 '정산완료'가 하나라도 있으면 버튼을 막아서
      // 미정산 건의 정산 처리 버튼까지 빈 버튼처럼 죽는 문제가 있었다.
      // 이제 버튼 자신의 상태값/문구만 보고 차단한다.
      /* 상태값이 미정산이면 버튼 문구가 예전 값이어도 무조건 다시 살린다. */
      if (isUnpaidText(ds)) {
        btn.disabled = false;
        btn.removeAttribute('disabled');
        btn.removeAttribute('aria-disabled');
        btn.textContent = '정산요청';
      } else if (isPaidText(ds)) {
        btn.disabled = true;
        btn.setAttribute('disabled','disabled');
        btn.setAttribute('aria-disabled','true');
        btn.textContent = '정산완료';
      } else if (isReqText(ds)) {
        btn.disabled = true;
        btn.setAttribute('disabled','disabled');
        btn.setAttribute('aria-disabled','true');
        btn.textContent = '정산요청';
      } else if (isPaidText(label)) {
        btn.disabled = true;
        btn.setAttribute('disabled','disabled');
        btn.setAttribute('aria-disabled','true');
        btn.textContent = '정산완료';
      } else if (isReqText(label)) {
        btn.disabled = true;
        btn.setAttribute('disabled','disabled');
        btn.setAttribute('aria-disabled','true');
        btn.textContent = '정산요청';
      }
    });
  }
  document.addEventListener('click', function(e){
    var t = e.target instanceof Element ? e.target.closest('.import-ui-do-settle-btn, #doSettleBtn, [data-action="do-settle"]') : null;
    if (!t) return;
    guard(t.closest('.import-inline-tabs-0513, #detail-body, body'));
    if (t.disabled) { e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation(); }
  }, true);
  document.addEventListener('DOMContentLoaded', function(){ guard(document); });
  setInterval(function(){ guard(document); }, 800);
})();

/* === 2026-05-21 D/O PDF + 수입신고필증 필수 검증 ===
 * 정책:
 * 1) D/O 발급은 D/O PDF가 있어야 가능
 * 2) D/O 전달은 D/O PDF + 수입신고필증 PDF가 모두 있어야 가능
 * 기존 버튼/화면 구조를 크게 건드리지 않고, 클릭/submit/fetch 직전에 방어한다.
 */
(function installTacsImportDoRequiredPdfGuard(){
  if (window.__TACS_IMPORT_DO_REQUIRED_PDF_GUARD_20260521) return;
  window.__TACS_IMPORT_DO_REQUIRED_PDF_GUARD_20260521 = true;

  function txt(v){ return String(v == null ? '' : v).trim(); }
  function lower(v){ return txt(v).toLowerCase(); }
  function normalizeReqNo(v){
    return txt(v).replace(/^TRC-/i, '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
  }
  function sameReqNo(a, b){
    var aa = normalizeReqNo(a);
    var bb = normalizeReqNo(b);
    return !!aa && !!bb && (aa === bb || aa.indexOf(bb) >= 0 || bb.indexOf(aa) >= 0);
  }
  function isCertName(v){
    var s = lower(v);
    return s.indexOf('cert') >= 0 || s.indexOf('declaration') >= 0 || txt(v).indexOf('신고') >= 0 || txt(v).indexOf('필증') >= 0;
  }
  function isDoName(v){
    var s = lower(v);
    var t = txt(v);
    return !!t && !isCertName(t);
  }
  function findRoot(el){
    // 전달완료 버튼은 오른쪽/하단 영역에 있고, 첨부문서 목록은 왼쪽 영역에 있을 수 있다.
    // 가장 가까운 section/form만 보면 등록된 D/O PDF/수입신고필증 PDF를 못 읽어서 계속 첨부하라는 alert가 뜬다.
    return document.getElementById('detail-body') || document;
  }
  function selectedRequestNo(root){
    // 아무 [data-request-no]나 잡으면 목록 첫 번째 행을 선택한 것으로 오판한다.
    // 실제 선택 표시가 있는 행만 우선 사용하고, 없으면 화면의 의뢰번호 입력/표시값으로 보정한다.
    var active = root.querySelector('[data-request-no].bg-slate-100, [data-request-no].selected, [data-request-no][aria-selected="true"]');
    if (active) return txt(active.dataset.requestNo);

    var reqInput = root.querySelector('#doRequestNo, #doReqNo, input[name="trcNo"], input[name="requestNo"], [data-current-trc-no], [data-trc-no]');
    if (reqInput) {
      return txt(reqInput.value || reqInput.dataset.currentTrcNo || reqInput.dataset.trcNo || reqInput.textContent);
    }

    var body = document.getElementById('detail-body') || document;
    var text = txt(body.textContent);
    var match = text.match(/TRC-IMP-\d{8}-\d{3}|IMP-\d{4}-\d{4}-\d{3}/);
    return match ? match[0] : '';
  }
  function findDoRow(root){
    var reqNo = selectedRequestNo(root);
    var rows = (typeof getImportDOIssueRows === 'function') ? getImportDOIssueRows() : [];
    if (reqNo) {
      for (var i=0; i<rows.length; i++) if (sameReqNo(rows[i].requestNo, reqNo)) return rows[i];
    }
    // 선택 의뢰번호를 못 잡아도 D/O 목록에 첨부파일이 있는 행이 하나뿐이면 그 행을 기존첨부로 인정한다.
    var withDo = rows.filter(function(r){ return txt(r.doPdfFileNo) || isDoName(r.doPdfFile); });
    if (withDo.length === 1) return withDo[0];
    return null;
  }
  function ensureIssue(root){
    // D/O 발급은 더 이상 첨부파일 선택을 요구하지 않는다.
    return true;
  }
  function ensureDeliver(root){
    // D/O 전달 요청도 화면 첨부파일 선택 여부로 막지 않는다.
    return true;
  }
  document.addEventListener('click', function(e){
    var target = e.target instanceof Element ? e.target : null;
    if (!target) return;
    var btn = target.closest('button, a, input[type="button"], input[type="submit"]');
    if (!btn) return;
    var label = txt(btn.textContent || btn.value || btn.getAttribute('aria-label') || btn.title);
    var action = lower(btn.dataset && (btn.dataset.action || btn.dataset.role || ''));
    var cls = lower(btn.className || '');
    var root = findRoot(btn);
    var isDoControl = cls.indexOf('import-ui-do-') >= 0
      || action.indexOf('do') >= 0
      || label.indexOf('D/O') >= 0
      || label.indexOf('DO ') >= 0;
    var isIssue = isDoControl && (cls.indexOf('import-ui-do-issue-btn') >= 0 || action.indexOf('issue') >= 0 || label.indexOf('발급') >= 0);
    var isDeliver = isDoControl && (cls.indexOf('import-ui-do-deliver-btn') >= 0 || action.indexOf('deliver') >= 0 || label.indexOf('전달') >= 0);
    if (isIssue && !ensureIssue(root)) {
      e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      return;
    }
    if (isDeliver && !ensureDeliver(root)) {
      e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
  }, true);
})();
