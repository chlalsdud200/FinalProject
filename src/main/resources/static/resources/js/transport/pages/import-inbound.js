/* import-inbound.js
 * 수입운송 상세의 입고관리 탭 렌더러.
 * import-ui.js가 window.buildImportInboundInlinePanel을 호출하므로 이 파일에서 전역으로 제공한다.
 */
window.buildImportInboundInlinePanel = function buildImportInboundInlinePanel(helpers, req) {
    const h = helpers || (typeof window.__TACS_IMPORT_INLINE_HELPERS === 'function' ? window.__TACS_IMPORT_INLINE_HELPERS() : {});
    const esc = h.esc || function (value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };
    const pick = h.pick || function (row, keys, fallback) {
        row = row || {};
        for (let i = 0; i < keys.length; i += 1) {
            const value = row[keys[i]];
            if (value !== undefined && value !== null && String(value).trim() !== '' && String(value).trim() !== '-') return value;
        }
        return fallback == null ? '' : fallback;
    };
    const normalizeText = h.normalizeText || function (value) { return String(value == null ? '' : value).trim(); };
    const statusText = h.statusText || function (value, fallback) { return normalizeText(value) || fallback || '-'; };
    const currentRequestNo = h.currentRequestNo || function (row) { return pick(row, ['trcNo', 'TRC_NO', 'requestNo', 'reqNo'], ''); };
    const workRow = h.workRow || function () { return {}; };
    const field = h.field || function (label, value, opts) {
        opts = opts || {};
        const name = opts.name ? ' name="' + esc(opts.name) + '"' : '';
        const readonly = opts.editable ? '' : ' readonly';
        const cls = opts.editable ? ' class="import-ui-editable"' : '';
        if (opts.textarea) return '<div class="import-ui-field"><label>' + esc(label) + '</label><textarea' + name + readonly + cls + '>' + esc(value || '') + '</textarea></div>';
        return '<div class="import-ui-field"><label>' + esc(label) + '</label><input type="' + esc(opts.type || 'text') + '"' + name + readonly + cls + ' value="' + esc(value || '-') + '"></div>';
    };
    const section = h.section || function (title, body) {
        return '<section class="import-ui-section"><h5>' + esc(title) + '</h5>' + body + '</section>';
    };
    const selectField = h.selectField || function (label, name, options, selectedValue) {
        const selected = normalizeText(selectedValue);
        const rows = Array.isArray(options) ? options : [];
        return '<div class="import-ui-field"><label>' + esc(label) + '</label><select name="' + esc(name) + '" class="import-ui-editable">'
            + rows.map(function (opt) {
                const value = normalizeText(opt.value);
                const labelText = normalizeText(opt.label || opt.value);
                return '<option value="' + esc(value) + '"' + (value === selected ? ' selected' : '') + '>' + esc(labelText || value) + '</option>';
            }).join('')
            + '</select></div>';
    };
    const selectedWarehouseValue = h.selectedWarehouseValue || function (row) { return pick(row, ['warehouseId', 'whNo', 'warehouseNo', 'WH_NO'], ''); };
    const dateOnly = h.dateOnly || function (value) {
        const raw = normalizeText(value).replace(/[./]/g, '-');
        const match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        return match ? match[1] + '-' + match[2].padStart(2, '0') + '-' + match[3].padStart(2, '0') : '';
    };
    const dateTimeMinute = h.dateTimeMinute || function (value) {
        const raw = normalizeText(value);
        if (!raw || raw === '-') return '';
        const normalized = raw.replace('T', ' ');
        return normalized.length >= 16 ? normalized.substring(0, 16) : normalized;
    };
    const isInboundReadonlyStatus = h.isInboundReadonlyStatus || function (value) {
        const raw = normalizeText(value);
        const upper = raw.toUpperCase();
        return ['입고대기', '입고요청', '입고요청완료', '입고완료', '보완완료', '보완제출완료', '보완승인'].includes(raw)
            || ['WAIT', 'IN_WAIT', 'REQ_SENT', 'SENT', 'IN_DONE', 'SUB', 'APR'].includes(upper);
    };
    const inboundSupplementNoticeHtml = h.inboundSupplementNoticeHtml || function () { return ''; };
    const inboundWarehouseOptions = h.inboundWarehouseOptions || function () { return []; };
    const warehouseAutoHiddenFields = h.warehouseAutoHiddenFields || function () { return ''; };
    const warehouseManagerReadonlyField = h.warehouseManagerReadonlyField || function () { return ''; };
    const incotermsOptions = [
        {value: '', label: '선택'},
        {value: 'FOB', label: 'FOB - 본선인도'},
        {value: 'CIF', label: 'CIF - 운임보험료포함'},
        {value: 'EXW', label: 'EXW - 공장인도'},
        {value: 'CFR', label: 'CFR - 운임포함'}
    ];
    const goodsSectionHtml = h.goodsSectionHtml || function () { return ''; };
    const applyReadonlyToInboundHtml = h.applyReadonlyToInboundHtml || function (html) { return html; };
    const goodsNameValue = h.goodsNameValue || function () {
        const rows = Array.prototype.slice.call(arguments).filter(Boolean);
        const keys = ['goodsName', 'itemNm', 'goodsNm', 'GOODS_NAME', 'ITEM_NM', 'frghtIemNm', 'cargoName', 'crrFrghtIemNm', 'wirFrghtIemNm', 'TRC_GOODS_NM', 'TRC_GOODS_NAME', 'TRC_ITEM_NM', 'CRR_FRGHT_IEM_NM', 'WIR_FRGHT_IEM_NM', 'itemCategory', 'TRC_ITEM_CTGRY_NM'];
        for (let i = 0; i < rows.length; i += 1) {
            const direct = pick(rows[i], keys, '');
            if (direct) return direct;
            const list = rows[i].goodsList || rows[i].itemList || rows[i].customsGoodsList || rows[i].goodsRows || rows[i].goods;
            if (Array.isArray(list)) {
                for (let j = 0; j < list.length; j += 1) {
                    const goodsName = pick(list[j], keys, '');
                    if (goodsName) return goodsName;
                }
            }
        }
        return '';
    };
    const cleanPackingGoodsName = h.cleanPackingGoodsName || function (value) {
        return normalizeText(value)
            .replace(/\s+P\.?\s*O\.?\s*NO\.?\s*[:#-]?.*$/i, '')
            .replace(/\s+PO\s*NO\.?\s*[:#-]?.*$/i, '')
            .replace(/\s+\d[\d,]*(?:\.\d+)?\s*(?:BAGS?|PCS|PIECES|CTNS?|CARTONS?|BOX(?:ES)?|PKGS?|PACKAGES?)\b.*$/i, '')
            .replace(/\s+\d[\d,]*(?:\.\d+)?\s*(?:KG|KGS|KILOGRAMS?|TONS?|T|CBM)\b.*$/i, '')
            .replace(/\s+US\$\s*[\d,]+(?:\.\d+)?.*$/i, '')
            .replace(/\(\s+/g, '(')
            .replace(/\s+\)/g, ')')
            .replace(/[\s,;:.-]+$/g, '')
            .trim();
    };
    const requestCargoGoodsName = h.requestCargoGoodsName || function (no, req, fallbackRow) {
        return pick(fallbackRow, [
            'goodsName', 'itemNm', 'goodsNm', 'GOODS_NAME', 'ITEM_NM',
            'TRC_GOODS_NM', 'TRC_GOODS_NAME', 'TRC_ITEM_NM',
            'frghtIemNm', 'cargoName'
        ], '') || pick(req, [
            'goodsName', 'itemNm', 'goodsNm', 'GOODS_NAME', 'ITEM_NM',
            'TRC_GOODS_NM', 'TRC_GOODS_NAME', 'TRC_ITEM_NM',
            'frghtIemNm', 'cargoName'
        ], '');
    };

    const clean = function (value) {
        if (value === null || value === undefined) return '';
        const textValue = String(value).trim();
        return textValue === '-' || textValue === '－' ? '' : textValue;
    };
    const optionValue = function (opt) {
        if (opt === null || opt === undefined) return '';
        if (typeof opt === 'string' || typeof opt === 'number') return normalizeText(opt);
        return normalizeText(opt.value || opt.wzNo || opt.WZ_NO || opt.whNo || opt.WH_NO || opt.wmId || opt.WM_ID || opt.label);
    };
    const optionLabel = function (opt) {
        if (opt === null || opt === undefined) return '';
        if (typeof opt === 'string' || typeof opt === 'number') return normalizeText(opt);
        return normalizeText(opt.label || opt.text || opt.warehouseZoneNm || opt.WZ_NM || opt.warehouseNm || opt.WH_NM || opt.warehouseManagerNm || opt.WM_NM || opt.value);
    };
    const uniqueSelectOptions = function (options, selectedValue) {
        const rows = Array.isArray(options) ? options : [];
        const selected = normalizeText(selectedValue);
        const selectedRow = selected ? rows.find(function (opt) {
            return optionValue(opt) === selected;
        }) : null;
        const orderedRows = selectedRow
            ? [selectedRow].concat(rows.filter(function (opt) { return opt !== selectedRow; }))
            : rows;
        const seenValues = new Set();
        const seenLabels = new Set();

        return orderedRows.filter(function (opt) {
            const valueKey = optionValue(opt).toUpperCase();
            const labelKey = optionLabel(opt).toUpperCase();

            if (valueKey && seenValues.has(valueKey)) return false;
            if (labelKey && seenLabels.has(labelKey)) return false;

            if (valueKey) seenValues.add(valueKey);
            if (labelKey) seenLabels.add(labelKey);
            return true;
        });
    };
    const requestKey = function (value) {
        const raw = clean(value).toUpperCase();
        if (!raw) return '';
        return raw.replace(/^TRC-/, '').replace(/-/g, '');
    };
    const rowsOf = function () {
        const rows = [];
        Array.prototype.slice.call(arguments).forEach(function (source) {
            if (Array.isArray(source)) rows.push.apply(rows, source);
        });
        return rows;
    };
    const findArrivalRow = function (requestNo) {
        const key = requestKey(requestNo);
        const rows = rowsOf(
            window.TRANSPORT_IMPORT_ARRIVAL_TRACKING,
            window.TRANSPORT_IMPORT_ARRIVAL_LIST,
            window.__TACS_IMPORT_ARRIVAL_TRACKING_ROWS
        );
        return rows.find(function (row) {
            return requestKey(pick(row, ['trcNo', 'requestNo', 'importRequestNo', 'ianTrcNo', 'IAN_TRC_NO'], '')) === key;
        }) || {};
    };
    const hardcodedArrivalMbl = function (requestNo) {
        const normalized = clean(requestNo).replace(/^TRC-/, '');
        return normalized ? 'MBL-' + normalized : '-';
    };

    req = req || {};
    const no = currentRequestNo(req);
    const requestRow = workRow('request', no) || {};
    const arrivalRow = Object.assign({}, findArrivalRow(no), workRow('arrival', no) || {});
    const row = workRow('inbound', no) || {};
    const ctx = Object.assign({}, requestRow, row);

    const inboundRawStatus = pick(row, ['inStatusNm', 'warehouseInStatusNm', 'wirStatusNm', 'statusNm', 'statusCd', 'warehouseInStatusCd', 'warehouseReplyStatusCd', 'wirStatusCd', 'whInStatusNm', 'whReplyStatusCd', 'wirWhReplyStatusCd', 'WIR_STATUS_CD', 'WIR_WH_REPLY_STATUS_CD'], '');
    const inboundRawUpper = normalizeText(inboundRawStatus).toUpperCase();
    const inboundStatus = inboundRawStatus ? (['WAIT', 'IN_WAIT'].includes(inboundRawUpper) ? '입고대기' : statusText(inboundRawStatus, '')) : '';
    const inboundReadonly = isInboundReadonlyStatus(inboundStatus) || isInboundReadonlyStatus(inboundRawStatus);
    const inboundSupplementStatus = normalizeText(pick(row, ['supplementStatusCd', 'srStatusCd', 'SR_STATUS_CD', 'inStatusCd', 'warehouseInStatusCd', 'statusCd', 'wirStatusCd', 'WIR_STATUS_CD'], '')).toUpperCase();
    const inboundIsSupplement = ['보완요청', '입고 보완요청', '입고보완요청', '입고반려', '반려'].includes(inboundStatus)
        || ['REQ', 'REQ_FIX', 'IN_FIX', 'FIX_REQ', 'REJECT', 'REJECTED'].includes(inboundSupplementStatus)
        || ['REQ_FIX', 'IN_FIX', 'FIX_REQ', 'REJECT', 'REJECTED'].includes(inboundRawUpper);
    const inboundEditable = inboundIsSupplement || !inboundReadonly;

    const wirNo = pick(row, ['wirNo', 'WIR_NO', 'wir_no', 'inboundRequestNo'], '-');
    const whId = selectedWarehouseValue(ctx);
    const inboundRequestDate = dateTimeMinute(pick(row, ['inPlanDt', 'wirInPlanDt', 'wirInPlanYmd', 'WIR_IN_PLAN_DT', 'wir_in_plan_dt'], ''))
        || dateTimeMinute(pick(requestRow, ['requestDt', 'reqDt', 'trcReqDt', 'trcRequestDt', 'TRC_REQ_DT', 'TRC_REQUEST_DT', 'registDt', 'createDt'], ''));
    const inboundRemark = pick(row, ['remark', 'wirRmrk', 'requestCn', 'WIR_RQST_CN', 'wirRqstCn'], '');
    const masterBl = clean(pick(arrivalRow, ['mblNo', 'masterBlNo', 'masterBl', 'blNo', 'icmMblNo', 'ICM_MBL_NO', 'biMblNo', 'BI_MBL_NO'], '')) || hardcodedArrivalMbl(no);
    const inboundIncoTerms = pick(row, ['incoTermsCd', 'wirIncoTermsCd', 'WIR_INCO_TERMS_CD'], pick(requestRow, ['incoTermsCd', 'trcIncoTermsCd', 'TRC_INCO_TERMS_CD'], ''));
    const inboundInvoiceNo = pick(row, ['invoiceNo', 'wirInvoiceNo', 'WIR_INVOICE_NO'], '');
    const inboundItemName = requestCargoGoodsName(no, req, requestRow);
    const inboundRequestNote = inboundRemark || pick(requestRow, ['requestNote', 'requestCn', 'trcRequestCn', 'TRC_RQST_CN'], '');

    const col1 = section('1. 입고요청 정보',
        field('입고요청번호', wirNo)
        + field('의뢰번호', no)
        + field('입고상태', inboundStatus || (inboundReadonly ? '보완제출완료' : '-'))
        + field('입고요청일시', inboundRequestDate)
    );
    const col2 = section('2. 창고 정보',
        selectField('창고명', 'warehouseId', uniqueSelectOptions(inboundWarehouseOptions(ctx), whId), whId)
        + warehouseManagerReadonlyField(ctx)
        + warehouseAutoHiddenFields(ctx)
        + field('화물관리번호', pick(ctx, ['cargoMgmtNo', 'cargoManagementNo', 'wirCargoMgmtNo', 'WIR_CARGO_MGMT_NO'], req.cargoMgmtNo || '발송 시 자동생성'), {name: 'cargoMgmtNo'})
    );
    const col3 = section('3. 입고 요청 정보',
        field('Master B/L', masterBl, {editable: false})
        + (inboundEditable ? selectField('인코텀즈', 'incoTermsCd', incotermsOptions, inboundIncoTerms) : field('인코텀즈', inboundIncoTerms, {editable: false}))
        + field('송장번호', inboundInvoiceNo, {editable: inboundEditable, name: 'invoiceNo'})
        + field('품명', inboundItemName, {editable: inboundEditable, name: 'itemNm'})
        + field('요청사항', inboundRequestNote, {textarea: true, editable: inboundEditable, name: 'remark'})
        + inboundSupplementNoticeHtml(row)
    );
    const goodsSource = Object.assign({}, req, requestRow, row);
    const goodsLists = [req.goodsList, requestRow.goodsList, row.goodsList];
    const packingGoodsList = goodsLists.find(function (list) {
        return Array.isArray(list) && list.some(function (item) { return item && item.__packingPrefill === true; });
    });
    const bestGoodsList = packingGoodsList || goodsLists.find(function (list) {
        return Array.isArray(list) && list.length;
    });

    if (bestGoodsList) {
        goodsSource.goodsList = bestGoodsList;
    }

    const goodsHtml = goodsSectionHtml(goodsSource, req, inboundEditable);

    const actions = inboundReadonly
        ? '<span class="info-chip">' + esc(inboundStatus || '-') + '</span>'
        : inboundIsSupplement
            ? '<button type="button" class="import-ui-btn import-ui-inbound-send-btn" data-supplement-submit="true" data-trc-no="' + esc(no) + '" data-wir-no="' + esc(wirNo === '-' ? '' : wirNo) + '">보완제출</button>'
            : '<button type="button" class="import-ui-btn import-ui-inbound-send-btn" data-trc-no="' + esc(no) + '" data-wir-no="' + esc(wirNo === '-' ? '' : wirNo) + '">발송</button>';

    const html = '<div class="import-ui-request-detail" data-work-type="inbound">'
        + '<div class="import-ui-grid3">' + col1 + col2 + col3 + '</div>'
        + goodsHtml
        + '<div class="import-ui-actions">' + actions + '</div>'
        + '</div>';

    return applyReadonlyToInboundHtml(html, inboundReadonly);
};
