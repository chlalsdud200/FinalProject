/* ===== 처리현황 페이지 전용 JS =====
 * - 통합조회: openStatusDetail, renderStatusModalList, selectStatusDeclare, closeStDetailPreview, statusDeclareStore, currentStatusClient
 * - 세금납부: openTaxDetail, openTaxPay, openTaxSchedule, taxDataStore
 * - 신고필증: openCertDetail, openCertPrint, openCertSend, certDataStore
 */

/* ============================================================
 * 1) 통합조회 — 화주별 신고서 모달 & 하단 미리보기
 * ============================================================ */

/* 화주별 신고서 Mock 데이터 (화주와 접수일시 기준으로 조회) */

/* ============================================================
 * 통합조회 — 보완수정 모델/규격 행 추가/삭제
 * ============================================================ */
function addSuppMdlspecRow() {
  var body = document.getElementById('supp-mdlspec-body');
  if (!body) return;

  var tr = document.createElement('tr');
  tr.innerHTML =
    '<td><input name="idimMdlspecNo" placeholder="규격번호"></td>' +
    '<td><input name="idimMdlspecNm" placeholder="모델/규격명"></td>' +
    '<td><input name="idimQty1" placeholder="수량"></td>' +
    '<td><input name="idimQty1UnitCd" placeholder="EA"></td>' +
    '<td><input name="idimUnitPrc" placeholder="단가"></td>' +
    '<td><input name="idimAmt" placeholder="금액"></td>' +
    '<td><button type="button" class="mini mini-reject" onclick="removeSuppMdlspecRow(this)">삭제</button></td>';

  body.appendChild(tr);
}

function removeSuppMdlspecRow(btn) {
  var tr = btn.closest('tr');
  var body = document.getElementById('supp-mdlspec-body');
  if (!tr || !body) return;

  if (body.querySelectorAll('tr').length <= 1) {
    tr.querySelectorAll('input').forEach(function (input) {
      input.value = '';
    });
    return;
  }

  tr.remove();
}


/* ============================================================
 * 2) 세금납부 관리 — 상세/납부/일정 모달
 * ============================================================ */

var taxDataStore = {
  'IMP-20240520-001': {
    client: 'SK하이닉스(주)', bizNo: '221-81-54321', item: '정밀기기',
    hs: '9018.19', bl: 'MSKU1234567', acceptDate: '2024-05-18',
    customs: '₩12,450,000', vat: '₩4,580,000', edu: '₩320,000', spc: '₩0', other: '₩0',
    total: '₩17,350,000', totalNum: 17350000, dueDate: '2024-05-22', dday: 2,
    status: 'unpaid', enpNo: '-', payDate: '-',
    installments: []
  },
  'IMP-20240519-012': {
    client: '포스코(주)', bizNo: '302-81-77777', item: '철강제품',
    hs: '7208.51', bl: 'KMTC20240519B', acceptDate: '2024-05-17',
    customs: '₩89,200,000', vat: '₩31,220,000', edu: '₩0', spc: '₩0', other: '₩0',
    total: '₩120,420,000', totalNum: 120420000, dueDate: '2024-05-23', dday: 3,
    status: 'unpaid', enpNo: '-', payDate: '-',
    installments: []
  },
  'IMP-20240518-008': {
    client: 'LG화학(주)', bizNo: '110-81-12345', item: '수입원재료',
    hs: '2915.29', bl: 'HJSCU20240518', acceptDate: '2024-05-16',
    customs: '₩5,600,000', vat: '₩1,960,000', edu: '₩0', spc: '₩0', other: '₩0',
    total: '₩7,560,000', totalNum: 7560000, dueDate: '2024-05-28', dday: 8,
    status: 'installment', enpNo: 'ENP-2024-0518-001', payDate: '-',
    installments: [
      { n: '1/2', amt: '₩3,780,000', date: '2024-05-20', status: 'paid' },
      { n: '2/2', amt: '₩3,780,000', date: '2024-05-28', status: 'scheduled' }
    ]
  },
  'IMP-20240510-021': {
    client: 'CJ제일제당(주)', bizNo: '104-86-09456', item: '식품첨가물',
    hs: '2106.90', bl: 'EMC20240510A', acceptDate: '2024-05-08',
    customs: '₩34,000,000', vat: '₩11,800,000', edu: '₩0', spc: '₩0', other: '₩0',
    total: '₩45,800,000', totalNum: 45800000, dueDate: '2024-06-10', dday: 21,
    status: 'installment', enpNo: 'ENP-2024-0510-002', payDate: '-',
    installments: [
      { n: '1/3', amt: '₩15,266,667', date: '2024-06-10', status: 'scheduled' },
      { n: '2/3', amt: '₩15,266,667', date: '2024-07-10', status: 'pending' },
      { n: '3/3', amt: '₩15,266,666', date: '2024-08-10', status: 'pending' }
    ]
  }
};

/* ===== 상세 ===== */
function openTaxDetail(no) {
  var d = taxDataStore[no]; if (!d) d = taxDataStore['IMP-20240520-001'];
  document.getElementById('taxD-no').textContent = no;
  document.getElementById('taxD-client').textContent = d.client;
  document.getElementById('taxD-bizNo').textContent = d.bizNo;
  document.getElementById('taxD-item').textContent = d.item;
  document.getElementById('taxD-hs').textContent = d.hs;
  document.getElementById('taxD-bl').textContent = d.bl;
  document.getElementById('taxD-acceptDate').textContent = d.acceptDate;
  document.getElementById('taxD-customs').textContent = d.customs;
  document.getElementById('taxD-vat').textContent = d.vat;
  document.getElementById('taxD-edu').textContent = d.edu;
  document.getElementById('taxD-spc').textContent = d.spc;
  document.getElementById('taxD-other').textContent = d.other;
  document.getElementById('taxD-total').textContent = d.total;
  document.getElementById('taxD-dueDate').textContent = d.dueDate;
  document.getElementById('taxD-enpNo').textContent = d.enpNo;
  document.getElementById('taxD-payDate').textContent = d.payDate;

  var statusMap = {
    unpaid: { label: '미납', cls: 'unpaid', icon: 'error' },
    installment: { label: '분납중', cls: 'installment', icon: 'schedule' },
    paid: { label: '납부완료', cls: 'paid', icon: 'check_circle' }
  };
  var s = statusMap[d.status] || statusMap.unpaid;
  document.getElementById('taxD-status').innerHTML =
    '<span class="pay-badge ' + s.cls + '"><span class="material-symbols-outlined">' + s.icon + '</span>' + s.label + '</span>';

  var ddayCls = d.dday <= 3 ? 'danger' : (d.dday <= 7 ? 'warn' : 'safe');
  document.getElementById('taxD-dday').innerHTML =
    '<span class="dday-chip ' + ddayCls + '">D-' + d.dday + '</span>';

  showModal('tax-detail-v2');
}

/* ===== 납부 ===== */
function openTaxPay(no) {
  var d = taxDataStore[no]; if (!d) d = taxDataStore['IMP-20240520-001'];
  document.getElementById('taxP-no').textContent = no;
  document.getElementById('taxP-client').textContent = d.client;
  document.getElementById('taxP-total').textContent = d.total;
  document.getElementById('taxP-dueDate').textContent = d.dueDate;
  showModal('tax-pay-v2');
}

/* ===== 일정 ===== */
function openTaxSchedule(no) {
  var d = taxDataStore[no]; if (!d) d = taxDataStore['IMP-20240518-008'];
  document.getElementById('taxS-no').textContent = no;
  document.getElementById('taxS-client').textContent = d.client;
  document.getElementById('taxS-total').textContent = d.total;

  var paid = d.installments.filter(function (i) { return i.status === 'paid' }).length;
  var totalCnt = d.installments.length;
  document.getElementById('taxS-progress').textContent = paid + ' / ' + totalCnt;
  document.getElementById('taxS-progressBar').style.width = (totalCnt ? paid / totalCnt * 100 : 0) + '%';

  var stepMap = { paid: 'done', scheduled: 'active', pending: '' };
  var stepperHtml = '';
  d.installments.forEach(function (ins, i) {
    stepperHtml += '<div class="step ' + stepMap[ins.status] + '"><div class="circle">' + (i + 1) + '</div>' + ins.n + '차</div>';
  });
  document.getElementById('taxS-stepper').innerHTML = stepperHtml;

  var statusLabel = {
    paid: '<span class="pay-badge paid"><span class="material-symbols-outlined">check_circle</span>납부완료</span>',
    scheduled: '<span class="pay-badge scheduled"><span class="material-symbols-outlined">event</span>납부예정</span>',
    pending: '<span class="pay-badge pending">예정</span>'
  };
  var rows = '';
  d.installments.forEach(function (ins) {
    var rowBg = ins.status === 'scheduled' ? 'style="background:#fffbeb"' : '';
    var actionBtn = ins.status === 'scheduled'
      ? '<button class="mini" style="background:#565e74;color:#fff;font-size:9px" onclick="hideModal(\'tax-schedule\');openTaxPay(\'' + document.getElementById('taxS-no').textContent + '\')">지금 납부</button>'
      : (ins.status === 'paid' ? '<button class="mini mini-view" onclick="alert(\'영수증 출력\')">영수증</button>' : '-');
    rows += '<tr ' + rowBg + '><td style="font-weight:800">' + ins.n + '</td><td style="font-weight:700">' + ins.amt + '</td><td>' + ins.date + '</td><td>' + statusLabel[ins.status] + '</td><td>' + actionBtn + '</td></tr>';
  });
  document.getElementById('taxS-rows').innerHTML = rows;

  showModal('tax-schedule');
  
}

/* ============================================================
 * 3) 신고필증 관리 — 상세/출력/화주전달 모달
 * ============================================================ */

var currentCertStore = {};

/* null/undefined 방지 */
function certText(v) {
  return (v === null || v === undefined || v === '') ? '-' : v;
}

/* 요소가 없을 때 JS 전체가 죽지 않게 처리 */
function certSetText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = certText(value);
}

function certSetColor(id, color) {
  var el = document.getElementById(id);
  if (el) el.style.color = color;
}

/* 서버에서 신고필증 상세 조회 */
function fetchCertDetail(ciNo, callback) {
  var ctx = window.contextPath || '';

  fetch(ctx + '/broker/status/cert/detail.json?ciNo=' + encodeURIComponent(ciNo), {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (res) {
      if (!res.success || !res.data) {
        alert(res.message || '신고필증 정보를 찾을 수 없습니다.');
        return;
      }

      currentCertStore[ciNo] = res.data;

      if (typeof callback === 'function') {
        callback(res.data);
      }
    })
    .catch(function (err) {
      console.error(err);
      alert('신고필증 조회 중 오류가 발생했습니다.\n' + err.message);
    });
}

/* 1) 상세 모달 */
function openCertDetail(ciNo) {
  fetchCertDetail(ciNo, function (d) {
    var typeText = certText(d.ciDclrTypeNm);

    certSetText('certD-no', d.ciNo);
    certSetText('certD-type', typeText + '신고필증');
    certSetColor('certD-type', d.ciDclrTypeCd === 'IMPORT' ? '#565e74' : '#1d6b4f');

    certSetText('certD-client', d.ownerNm);
    certSetText('certD-clientCode', d.ownerCstmIdfNo);
    certSetText('certD-bizNo', d.ownerBizrno);

    certSetText('certD-item', d.itemNm);
    certSetText('certD-hs', d.hsCd);
    certSetText('certD-acceptDate', d.ciIssueDtText);
    certSetText('certD-customs', d.customsNm);
    certSetText('certD-officer', d.officerNm);
    certSetText('certD-bl', d.blNo);

    certSetText('certD-tax', d.totalTaxAmtText);
    certSetText('certD-payStatus', d.payStatusNm);
    certSetText('certD-enpNo', d.ciDclrNo);

    showModal('cert-detail-v2');
  });
}



function fillCertPrintModal(d) {
  certSetText('certP-no', d.ciNo);
  certSetText('certP-client', d.ownerNm);
  certSetText('certP-item', d.itemNm);
  certSetText('certP-type', certText(d.ciDclrTypeNm) + '신고필증');

  showModal('cert-print');
}



function downloadCertPdf() {
  var ciNoEl = document.getElementById('certP-no');
  var ciNo = ciNoEl ? ciNoEl.textContent : '';

  if (!ciNo || ciNo === '-') {
    alert('신고필증 번호가 없습니다.');
    return;
  }

  var ctx = window.contextPath || '';
  location.href = ctx + '/broker/status/cert/download.do?ciNo=' + encodeURIComponent(ciNo);
}
/* 상세 모달에서 바로 PDF 다운로드 */
function downloadCertPdfFromDetail() {
  var ciNoEl = document.getElementById('certD-no');
  var ciNo = ciNoEl ? ciNoEl.textContent : '';

  if (!ciNo || ciNo === '-') {
    alert('신고필증 번호가 없습니다.');
    return;
  }

  var ctx = window.contextPath || '';
  location.href = ctx + '/broker/status/cert/download.do?ciNo=' + encodeURIComponent(ciNo);
}

/* ============================================================
 * 세금납부 · 화주청구 계산상세 모달
 * - status.jsp의 계산상세 버튼 data-* 값을 읽어서 모달에 출력
 * ============================================================ */

function chargeCalcNumber(value) {
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  var str = String(value)
    .replace(/,/g, '')
    .replace(/원/g, '')
    .replace(/%/g, '')
    .trim();

  if (str === '' || str === '-' || str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined') {
    return 0;
  }

  var num = Number(str);

  if (isNaN(num)) {
    console.warn('숫자 변환 실패:', value);
    return 0;
  }

  return num;
}

function chargeCalcWon(value) {
  return chargeCalcNumber(value).toLocaleString('ko-KR') + '원';
}

function openChargeCalcModal(btn) {
  if (!btn) {
    alert('계산상세 버튼 정보를 찾을 수 없습니다.');
    return;
  }

  var ds = btn.dataset || {};
  console.log('계산상세 dataset:', ds);

  function num(value) {
    if (value === undefined || value === null || value === '') return 0;

    var str = String(value)
      .replace(/,/g, '')
      .replace(/원/g, '')
      .replace(/%/g, '')
      .trim();

    if (str === '' || str === '-' || str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined') {
      return 0;
    }

    var n = Number(str);
    return isNaN(n) ? 0 : n;
  }

  function won(value) {
    return num(value).toLocaleString('ko-KR') + '원';
  }

  function rate(value) {
    var n = num(value);
    if (n <= 0) return '0%';
    if (n <= 1) n = n * 100;

    return n.toLocaleString('ko-KR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }) + '%';
  }

  function text(value) {
    return value === undefined || value === null || value === '' ? '-' : value;
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = value;
    }
  }

  setText('ccm-bc-no', text(ds.bcNo));
  setText('ccm-ir-no', text(ds.irNo));
  setText('ccm-owr-nm', text(ds.owrNm));
  setText('ccm-item-nm', text(ds.reprItemNm));

  setText('ccm-policy-nm', text(ds.policyNm));

  var minDclrAmt = ds.minDclrAmt || '';
  var maxDclrAmt = ds.maxDclrAmt || '';

  if (minDclrAmt !== '' || maxDclrAmt !== '') {
    setText(
      'ccm-policy-range',
      won(minDclrAmt) + ' ~ ' + (maxDclrAmt === '' ? '상한 없음' : won(maxDclrAmt))
    );
  } else {
    setText('ccm-policy-range', '-');
  }

  setText('ccm-base-fee', won(ds.baseFee));
  setText('ccm-rate', rate(ds.rate));
  setText('ccm-min-max-fee', won(ds.minFee) + ' / ' + won(ds.maxFee));

  setText('ccm-dclr-amt', won(ds.dclrAmt));
  setText('ccm-tax-amt', won(ds.taxAmt));
  setText('ccm-broker-fee', won(ds.brokerFee));
  setText('ccm-fee-vat', won(ds.feeVat));
  setText('ccm-total-amt', won(ds.totalAmt));

  var hiddenIrNo = document.getElementById('ccm-ir-no-hidden');
  if (hiddenIrNo) {
    hiddenIrNo.value = ds.irNo || '';
  }

  var doneBtn = document.getElementById('ccm-done-btn');
  if (doneBtn) {
    doneBtn.style.display = (ds.irStatusCd === 'CSTM_TAX_PAID') ? 'inline-flex' : 'none';
  }

  showModal('charge-calc');
}



function closeChargeCalcModal() {
  var modal = document.getElementById('modal-charge-calc');
  if (!modal) return;

  modal.classList.remove('show');
  modal.style.display = 'none';
  modal.style.visibility = 'hidden';
  modal.style.opacity = '0';
  modal.style.pointerEvents = 'none';
}

function ensureChargeCalcModal() {
  var old = document.getElementById('modal-charge-calc');
  if (old) {
    return;
  }

  var ctx = window.contextPath || '';

  var csrfInput = document.querySelector('input[name="_csrf"]');
  var csrfHtml = '';
  if (csrfInput) {
    csrfHtml =
      '<input type="hidden" name="_csrf" value="' + csrfInput.value + '">';
  }

  var modal = document.createElement('div');
  modal.id = 'modal-charge-calc';

  modal.style.cssText =
    'display:none;' +
    'position:fixed;' +
    'left:0;' +
    'top:0;' +
    'right:0;' +
    'bottom:0;' +
    'width:100vw;' +
    'height:100vh;' +
    'z-index:2147483647;' +
    'background:rgba(15,23,42,0.55);' +
    'align-items:center;' +
    'justify-content:center;' +
    'padding:24px;' +
    'box-sizing:border-box;';

  modal.innerHTML =
    '<div style="width:720px;max-width:95vw;max-height:90vh;overflow-y:auto;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.35);">' +

      '<div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid #e5edf5;">' +
        '<h3 style="display:flex;align-items:center;gap:6px;margin:0;font-size:17px;font-weight:900;color:#16283a;">' +
          '<span class="material-symbols-outlined">calculate</span> 수수료 계산 상세' +
        '</h3>' +
        '<button type="button" onclick="closeChargeCalcModal()" style="border:0;background:transparent;font-size:24px;cursor:pointer;color:#64748b;">×</button>' +
      '</div>' +

      '<div style="padding:20px 22px;">' +

        '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:14px;background:#f8fafc;border:1px solid #dbe7f1;margin-bottom:18px;">' +
          chargeCalcSummaryBox('청구번호', 'ccm-bc-no') +
          chargeCalcSummaryBox('통관의뢰번호', 'ccm-ir-no') +
          chargeCalcSummaryBox('화주', 'ccm-owr-nm') +
          chargeCalcSummaryBox('대표품목', 'ccm-item-nm') +
        '</div>' +

        '<div style="margin-top:16px;">' +
          '<h4 style="margin:0 0 8px;font-size:14px;font-weight:900;color:#16283a;">적용 수수료 정책</h4>' +
          '<table style="width:100%;border-collapse:collapse;border-top:1px solid #dbe7f1;">' +
            chargeCalcRow('정책명', 'ccm-policy-nm') +
            chargeCalcRow('신고금액 구간', 'ccm-policy-range') +
            chargeCalcRow('기본수수료', 'ccm-base-fee') +
            chargeCalcRow('수수료율', 'ccm-rate') +
            chargeCalcRow('최소/최대 수수료', 'ccm-min-max-fee') +
          '</table>' +
        '</div>' +

        '<div style="margin-top:16px;">' +
          '<h4 style="margin:0 0 8px;font-size:14px;font-weight:900;color:#16283a;">계산 결과</h4>' +
          '<table style="width:100%;border-collapse:collapse;border-top:1px solid #dbe7f1;">' +
            chargeCalcRow('신고금액', 'ccm-dclr-amt') +
            chargeCalcRow('세금합계', 'ccm-tax-amt') +
            chargeCalcRow('관세사 수수료', 'ccm-broker-fee') +
            chargeCalcRow('수수료 부가세', 'ccm-fee-vat') +
            chargeCalcTotalRow('최종 청구금액', 'ccm-total-amt') +
          '</table>' +
        '</div>' +

        '<div style="margin-top:16px;padding:12px;background:#f8fafc;border-left:4px solid #565e74;font-size:12px;color:#334155;">' +
          '계산식: 최종 청구금액 = 세금합계 + 관세사 수수료 + 수수료 부가세' +
        '</div>' +
      '</div>' +

      '<div style="display:flex;justify-content:flex-end;gap:8px;padding:14px 22px;border-top:1px solid #e5edf5;">' +
        '<button type="button" class="btn btn-secondary" onclick="closeChargeCalcModal()">닫기</button>' +

        '<form method="post" action="' + ctx + '/broker/status/charge/confirmDone.do" style="display:inline-flex;">' +
          csrfHtml +
          '<input type="hidden" name="irNo" id="ccm-ir-no-hidden">' +
          '<button type="submit" id="ccm-done-btn" class="btn btn-primary" style="display:none;" onclick="return confirm(\'결제완료 건을 최종 완료 처리하시겠습니까?\');">확인</button>' +
        '</form>' +
      '</div>' +

    '</div>';

  document.body.appendChild(modal);
}

function chargeCalcSummaryBox(label, id) {
  return '' +
    '<div>' +
      '<span style="display:block;font-size:11px;color:#64748b;margin-bottom:4px;">' + label + '</span>' +
      '<strong id="' + id + '">-</strong>' +
    '</div>';
}

function chargeCalcRow(label, id) {
  return '' +
    '<tr>' +
      '<th style="width:180px;background:#f5f8fb;color:#334155;text-align:left;font-size:12px;padding:10px 12px;border-bottom:1px solid #dbe7f1;">' + label + '</th>' +
      '<td id="' + id + '" style="font-size:12px;color:#16283a;padding:10px 12px;border-bottom:1px solid #dbe7f1;">-</td>' +
    '</tr>';
}

function chargeCalcTotalRow(label, id) {
  return '' +
    '<tr>' +
      '<th style="width:180px;background:#fff7f7;color:#9f403d;text-align:left;font-size:14px;font-weight:900;padding:10px 12px;border-bottom:1px solid #dbe7f1;">' + label + '</th>' +
      '<td id="' + id + '" style="font-size:14px;font-weight:900;color:#9f403d;background:#fff7f7;padding:10px 12px;border-bottom:1px solid #dbe7f1;">-</td>' +
    '</tr>';
}




function setChargeCalcText(id, value) {
  var el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}
