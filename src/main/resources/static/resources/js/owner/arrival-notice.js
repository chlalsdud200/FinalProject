var arrivalNotices = [
  { req:'IMP-004', firm:'글로벌로지스', bl:'SZXA2404169901', eta:'2026-04-22', received:'2026-04-21', status:'pending', memo:'인천항 도착 예정. 선사 비용 정산 후 D/O 발행 가능.' },
  { req:'IMP-009', firm:'대한포워딩', bl:'BSPN2404187710', eta:'2026-04-23', received:'2026-04-23', status:'pending', memo:'부산항 도착. CY 반출 기한 확인 필요.' },
  { req:'IMP-002', firm:'대한포워딩', bl:'KRINC2404109903', eta:'2026-04-18', received:'2026-04-17', status:'confirmed', memo:'도착통지서 확인 완료(2026-04-18).' }
];
var arrivalSelectedReq = null;

function anStatusBadge(s) {
  if (s === 'pending') return '<span class="doc-status wait">미확인</span>';
  if (s === 'confirmed') return '<span class="doc-status ok">확인완료</span>';
  return '<span class="doc-status none">-</span>';
}

function anTextMatch(n, q) {
  if (!q) return true;
  q = q.toLowerCase();
  return (n.req + ' ' + n.firm + ' ' + n.bl).toLowerCase().includes(q);
}

function renderArrivalNoticeKpi() {
  var total = arrivalNotices.length;
  var pending = arrivalNotices.filter(function(n){ return n.status === 'pending'; }).length;
  var todayStr = new Date().toISOString().slice(0,10);
  var today = arrivalNotices.filter(function(n){ return n.received === todayStr; }).length;
  var elTotal = document.getElementById('an-kpi-total');
  var elPending = document.getElementById('an-kpi-pending');
  var elToday = document.getElementById('an-kpi-today');
  if (elTotal) elTotal.textContent = total;
  if (elPending) elPending.textContent = pending;
  if (elToday) elToday.textContent = today;
}

function renderArrivalNoticeList() {
  var tbody = document.getElementById('an-list-tbody');
  if (!tbody) return;
  var statusFilter = (document.getElementById('an-status-filter') ? document.getElementById('an-status-filter').value : 'all');
  var q = (document.getElementById('an-search') ? document.getElementById('an-search').value.trim() : '');

  var rows = arrivalNotices.filter(function(n){
    if (statusFilter !== 'all' && n.status !== statusFilter) return false;
    return anTextMatch(n, q);
  });

  tbody.innerHTML = rows.map(function(n){
    var isSel = (n.req === arrivalSelectedReq);
    return '' +
      '<tr' + (isSel ? ' style="background:#eff6ff"' : '') + '>' +
        '<td style="font-weight:700;color:#0f172a"><span style="background:#dcfce7;color:#15803d;font-size:10px;font-weight:700;padding:2px 6px;margin-right:6px">수입</span>' + n.req + '</td>' +
        '<td>' + n.firm + '</td>' +
        '<td style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;font-size:12px">' + n.bl + '</td>' +
        '<td>' + n.eta + '</td>' +
        '<td style="color:#94a3b8;font-size:11px">' + n.received + '</td>' +
        '<td>' + anStatusBadge(n.status) + '</td>' +
        '<td><button class="mini mini-view" onclick="openArrivalNotice(\'' + n.req + '\')">보기</button></td>' +
      '</tr>';
  }).join('') || '<tr><td colspan="8" style="padding:14px 12px;color:#64748b;font-size:12px">표시할 도착통지서가 없습니다.</td></tr>';

  renderArrivalNoticeKpi();
}

function openArrivalNotice(req) {
  arrivalSelectedReq = req;
  var n = arrivalNotices.find(function(x){ return x.req === req; });
  var wrap = document.getElementById('an-detail');
  if (!n || !wrap) { renderArrivalNoticeList(); return; }

  // 레이아웃을 2컬럼(grid)으로 변경하고 상세 섹션 노출
  document.getElementById('an-layout').style.display = 'grid';
  document.getElementById('an-detail-section').style.display = 'block';

  wrap.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px">' +
      '<div>' +
        '<div style="font-size:11px;color:#94a3b8;font-weight:700;margin-bottom:6px">의뢰번호</div>' +
        '<div style="font-size:16px;font-weight:900;color:#0f172a">' + n.req + '</div>' +
        '<div style="margin-top:6px">' + anStatusBadge(n.status) + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">' +
        '<button class="btn btn-secondary" style="font-size:12px;padding:8px 14px" onclick="downloadArrivalNotice(\'' + n.req + '\')">다운로드</button>' +
        (n.status === 'pending'
          ? '<button class="btn btn-success" style="font-size:12px;padding:8px 14px" onclick="confirmArrivalNotice(\'' + n.req + '\')">수령 확인</button>'
          : '') +
      '</div>' +
    '</div>' +
    '<div style="border:1px solid #e2e8f0;background:#f8fafc;padding:14px 16px;font-size:12px;color:#475569;line-height:1.8;margin-bottom:14px">' +
      '<div style="display:grid;grid-template-columns:110px 1fr;gap:6px 10px">' +
        '<span style="color:#94a3b8;font-weight:700">의뢰번호</span><span style="font-weight:700">' + n.req + '</span>' +
        '<span style="color:#94a3b8;font-weight:700">운송업체</span><span style="font-weight:700">' + n.firm + '</span>' +
        '<span style="color:#94a3b8;font-weight:700">B/L 번호</span><span style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace">' + n.bl + '</span>' +
        '<span style="color:#94a3b8;font-weight:700">도착일</span><span>' + n.eta + '</span>' +
        '<span style="color:#94a3b8;font-weight:700">수신일</span><span>' + n.received + '</span>' +
      '</div>' +
    '</div>';

  renderArrivalNoticeList();
}

function confirmArrivalNotice(req) {
  var n = arrivalNotices.find(function(x){ return x.req === req; });
  if (!n) return;
  n.status = 'confirmed';
  showToast('도착통지서 수령 확인이 완료되었습니다.', 'success');

  // 상세 화면 숨기기 및 레이아웃을 다시 전체 너비(block)로 변경
  document.getElementById('an-layout').style.display = 'block';
  document.getElementById('an-detail-section').style.display = 'none';
  
  arrivalSelectedReq = null;
  renderArrivalNoticeList();
}

function downloadArrivalNotice(id) {
  alert('도착통지서 다운로드(데모)\\n\\n- ' + id + '.pdf');
}

/* ══════════════════════════════════════
   문서함 (Drive-style) - 고도화 버전
═══════════════════════════════════════ */

