/* ── 운송업체 목록 동적 렌더링 ── */
function renderTransFwdList() {
  var kw = (document.getElementById('trans-fwd-search') ? document.getElementById('trans-fwd-search').value.toLowerCase() : '');
  var typeF = (document.getElementById('trans-fwd-type-filter') ? document.getElementById('trans-fwd-type-filter').value : '');
  var statusF = (document.getElementById('trans-fwd-status-filter') ? document.getElementById('trans-fwd-status-filter').value : '');
  var from = (document.getElementById('trans-fwd-date-from') ? document.getElementById('trans-fwd-date-from').value : '');
  var to = (document.getElementById('trans-fwd-date-to') ? document.getElementById('trans-fwd-date-to').value : '');
  var tbody = document.getElementById('trans-fwd-list-tbody');
  if(!tbody) return;

  var filtered = fwdData.filter(function(f) {
    var kwOk = !kw || f.name.toLowerCase().includes(kw) || f.manager.toLowerCase().includes(kw) || f.route.toLowerCase().includes(kw);
    var typeOk = !typeF || f.type.includes(typeF);
    var statusText = f.isContracted ? '이용중' : '계약종료';
    var statusOk = !statusF || statusText === statusF;
    var baseDate = f.isContracted ? f.contractDate : '';
    var fromOk = !from || !baseDate || baseDate >= from;
    var toOk = !to || !baseDate || baseDate <= to;
    return kwOk && typeOk && statusOk && fromOk && toOk;
  });

  var html = '';
  filtered.forEach(function(f) {
    var originalIdx = fwdData.indexOf(f);
    // 상태를 '이용중' 또는 '계약종료'로 표시
    var badge = f.isContracted ? '<span class="doc-status ok">이용중</span>' : '<span class="doc-status none">계약종료</span>';
    var actionBtn = f.isContracted 
      ? '<button class="mini mini-reject" onclick="terminateContract(' + originalIdx + ')">계약 종료</button>'
      : '<button class="mini mini-primary" onclick="openFwdContractForm(' + originalIdx + ')">계약 요청</button>';

    html += '<tr>' +
        '<td class="td-id">' + f.name + '</td>' +
        '<td>' + f.manager + '<br><span class="td-muted">' + f.tel + '</span></td>' +
        '<td>' + f.route + '</td>' +
        '<td>' + f.type + '</td>' +
        '<td>★' + f.rating + ' <span class="td-muted">(' + f.cases + '건)</span></td>' +
        '<td>' + badge + '</td>' +
        '<td><div class="btn-row">' + actionBtn + '<button class="mini mini-view" onclick="openFwdCompanyDetail(' + originalIdx + ')">상세</button></div></td>' +
      '</tr>';
  });
  tbody.innerHTML = html || '<tr><td colspan="7" style="padding:40px; text-align:center; color:#94a3b8;">검색 결과가 없습니다.</td></tr>';
}

function openFwdContractForm(idx) {
  var f = (typeof idx === 'number') ? fwdData[idx] : null;
  document.getElementById('trans-fwd-list-view').style.display = 'none';
  document.getElementById('trans-fwd-contract-view').style.display = 'block';
  document.getElementById('contract-target-fwd').textContent = f ? (f.name + ' - 계약 요청 및 서류 전송') : '운송업체 계약 요청 · 서류 전송';
  var select = document.getElementById('contract-fwd-select');
  if(select) select.value = f ? f.name : '';
}

function closeFwdContractForm() {
  document.getElementById('trans-fwd-list-view').style.display = 'block';
  document.getElementById('trans-fwd-contract-view').style.display = 'none';
}

var fwdTypeFilter = ''; // 이 변수는 사용되지 않는 것 같아 보입니다.

function openForwarderModal() {
  fwdSelected = null;
  fwdTypeFilter = '';
  document.getElementById('fwdSearch').value = '';
  document.querySelectorAll('#forwarderModal .modal-tab').forEach(function(b,i){ b.classList.toggle('active', i===0); });
  renderForwarders(fwdData);
  document.getElementById('forwarderModal').classList.add('open');
}
function closeForwarderModal(e) {
  if (e && e.target !== document.getElementById('forwarderModal')) return;
  document.getElementById('forwarderModal').classList.remove('open');
}
function setFwdTab(type) {
  fwdTypeFilter = type;
  document.querySelectorAll('#forwarderModal .modal-tab').forEach(function(b){
    b.classList.toggle('active', b.textContent.trim() === (type||'전체'));
  });
  filterForwarders();
}
function filterForwarders() {
  var kw = document.getElementById('fwdSearch').value.toLowerCase();
  var filtered = fwdData.filter(function(f) {
    return (!kw || f.name.toLowerCase().includes(kw) || f.manager.includes(kw)) &&
           (!fwdTypeFilter || f.type === fwdTypeFilter);
  });
  renderForwarders(filtered);
}
function renderForwarders(list) {
  var typeColor = {해상:'#1d4ed8', 항공:'#7c3aed', 복합:'#0891b2'};
  var typeBg   = {해상:'#dbeafe', 항공:'#ede9fe', 복합:'#cffafe'};
  var html = '';
  list.forEach(function(f) {
    var sel = fwdSelected && fwdSelected.name === f.name;
    var idx = fwdData.indexOf(f);
    html += '<div class="broker-card' + (sel ? ' selected' : '') + '" onclick="selectFwd(' + idx + ')">' +
      '<div class="broker-card-header">' +
        '<div>' +
          '<div class="broker-card-name">' + f.name + (sel ? ' <span style="font-size:11px;color:#16a34a">✓ 선택됨</span>' : '') + '</div>' +
          '<div class="broker-card-meta">' + f.manager + ' · ' + f.tel + '</div>' +
        '</div>' +
        '<span style="background:' + typeBg[f.type] + ';color:' + typeColor[f.type] + ';font-size:10px;font-weight:800;padding:3px 9px">' + f.type + '</span>' +
      '</div>' +
      '<div class="broker-card-body">' +
        '<div class="broker-card-row"><span class="broker-card-label">전문구간</span><span>' + f.route + '</span></div>' +
        '<div class="broker-card-footer">' +
          '<span style="font-size:11px;color:#64748b">처리건수 ' + f.cases + '건</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  });
  document.getElementById('forwarderList').innerHTML = html ||
    '<div style="padding:32px;text-align:center;color:#94a3b8;font-size:13px">검색 결과 없음</div>';
}
function selectFwd(i) {
  fwdSelected = fwdData[i];
  filterForwarders();
}
function confirmForwarder() {
  if (!fwdSelected) { alert('운송업체를 선택하세요.'); return; }
  document.getElementById('forwarderModal').classList.remove('open');
  showToast(fwdSelected.name + ' (' + fwdSelected.manager + ')을(를) 선택했습니다. 계약 요청이 전송됩니다.', 'success');
}

