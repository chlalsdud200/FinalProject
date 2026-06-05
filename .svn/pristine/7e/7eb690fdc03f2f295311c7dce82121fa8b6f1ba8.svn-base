// TACS Owner Portal common JavaScript
// 원본 화주.html의 인라인 스크립트를 분리한 파일입니다.
// JSP 분리 후에도 본문 내부 탭/모달/필터 기능을 유지합니다.


/* ── [하드코딩 데이터] 실제 계약된 운송사 목록 ── */
var fwdData = [
  {contractId: 'CONT-2024-0018', name:'대한포워딩', manager:'김운송 팀장', tel:'02-1234-5678', route:'북미(LA/NY) 직항', type:'해상 FCL/LCL', contractDate: '2024-01-01', expiryDate: '2025-12-31', isContracted: true, rating: '4.8', cases: 142},
  {contractId: 'CONT-2024-0042', name:'글로벌로지스', manager:'이물류 과장', tel:'02-9876-5432', route:'유럽 전지역 복합운송', type:'해상/항공 복합', contractDate: '2024-03-15', expiryDate: '2026-03-14', isContracted: true, rating: '4.6', cases: 98},
  {contractId: 'CONT-2024-0105', name:'스타쉽핑', manager:'박선적 차장', tel:'051-234-5678', route:'동남아(베트남/태국)', type:'해상 LCL 전문', contractDate: '2024-05-01', expiryDate: '2025-04-30', isContracted: true, rating: '4.9', cases: 77},
  {contractId: '미체결', name:'에어코리아로지스', manager:'최항공', tel:'032-345-6789', route:'전세계 항공 운송', type:'항공 전용', contractDate: '-', expiryDate: '-', isContracted: false, rating: '4.7', cases: 63},
  {contractId: '미체결', name:'퍼시픽라인', manager:'정태평', tel:'02-5555-7777', route:'중남미 항로 특화', type:'해상 FCL', contractDate: '-', expiryDate: '-', isContracted: false, rating: '4.4', cases: 55}
];

var _fwdSelectContext = 'export';
var _fwdSelectedCard = null;

function openContractedFwdModal(ctx) {
  _fwdSelectContext = ctx;
  _fwdSelectedCard = null;
  document.getElementById('fwdSelectSearchInput').value = '';
  document.getElementById('fwdSelectConfirmBtn').disabled = true;
  renderContractedFwdList(); // 이 함수가 fwdData에서 isContracted: true인 것만 필터링합니다.
  document.getElementById('fwdSelectModal').classList.add('open');
}

function renderContractedFwdList() {
  var kw = document.getElementById('fwdSelectSearchInput').value.toLowerCase().trim();
  var listEl = document.getElementById('fwdSelectList');
  var contracted = fwdData.filter(f => f.isContracted && (f.name.includes(kw) || f.manager.includes(kw)));

  listEl.innerHTML = contracted.map(f => {
    const initial = f.name[0];
    return `
    <div class="broker-card" onclick="event.stopPropagation(); selectFwdForDoc(this, '${f.name}', '${f.manager}')" style="padding: 18px; display: flex; flex-direction: column; align-items: stretch; gap: 12px; border-radius: 8px !important; margin-bottom: 8px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="broker-avatar" style="background:#373f54; width: 40px; height: 40px; font-size: 14px;">${initial}</div>
          <div>
            <div class="broker-name" style="font-size: 15px; font-weight: 800; color: #1e293b;">${f.name} <span class="badge badge-ok" style="margin-left:8px; font-size: 9px;">계약체결</span></div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">운송의뢰번호: ${f.contractId}</div>
          </div>
        </div>
        <div class="broker-check material-symbols-outlined" style="font-size: 28px;">check_circle</div>
      </div>
      <div style="display: block; padding: 12px; background: #f8fafc; border: 1px solid #edf2f7;">
        <div>
          <div style="font-size: 10px; color: #94a3b8; font-weight: 700; margin-bottom: 4px;">담당자</div>
          <div style="font-size: 12px; color: #334155; font-weight: 600;">${f.manager}</div>
          <div style="font-size: 11px; color: #64748b;">${f.tel}</div>
        </div>
      </div>
    </div>`;
  }).join('') || '<div style="padding:60px 20px; text-align:center; color:#94a3b8; font-size:13px;">계약 체결된 운송사가 없습니다.</div>';
}

function selectFwdForDoc(el, name, manager) {
  if (_fwdSelectedCard) _fwdSelectedCard.classList.remove('selected');
  el.classList.add('selected');
  _fwdSelectedCard = el;
  document.getElementById('fwdSelectConfirmBtn').disabled = false;
  _tempSelectedFwd = { name, manager };
}

var _tempSelectedFwd = null;
function confirmFwdForDoc() {
  if (!_tempSelectedFwd) return;
  var displayId = _fwdSelectContext === 'export' ? 'exportForwarderDisplay' : 'importForwarderDisplay';
  var el = document.getElementById(displayId);
  el.textContent = _tempSelectedFwd.name + " (" + _tempSelectedFwd.manager + ")";
  el.classList.add('selected');
  el.style.color = '#0f172a';
  el.style.fontWeight = '700';
  document.getElementById('fwdSelectModal').classList.remove('open');
}

function submitDeclaration(type) {
  var displayId = type === 'export' ? 'exportForwarderDisplay' : 'importForwarderDisplay';
  if (!document.getElementById(displayId).classList.contains('selected')) {
    alert('담당 운송사를 먼저 선택해주세요.');
    return;
  }
  var num = type === 'export' ? 'EXP' : 'IMP';
  var now = new Date();
  var dateStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
  var newId = num + '-OW-' + dateStr.replace(/-/g,'') + '-' + String(Math.floor(Math.random()*900)+100);

  // 성공 토스트 표시 후 목록으로 이동
  showToast((type === 'export' ? '수출' : '수입') + '신고 의뢰가 등록되었습니다. 의뢰번호: ' + newId, 'success');
  if (type === 'export') showExportView('list');
  else showImportView('list');
}

