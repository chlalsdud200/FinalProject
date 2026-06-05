function buildBLIssuePanel() {
  return `
    <div class="section-card border border-slate-300">
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h4 class="text-sm font-bold text-slate-900">B/L 발행, 제출 및 정산</h4>
        <p class="text-xs text-slate-500 mt-1">왼쪽 목록에서 대상 건을 선택하고, 오른쪽에서 수출 비용 정산 후 House B/L 발급 및 화주 제출을 진행합니다.</p>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 bl-panel-grid">
          <div class="xl:col-span-5 border border-slate-200 overflow-hidden">
            <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h5 class="text-sm font-bold text-slate-900">B/L 발행 대상 목록</h5>
                <p class="text-xs text-slate-500 mt-1">미정산 건은 미정산으로 표시됩니다.</p>
              </div>
              <button id="blIssueSearchBtn" type="button" class="px-3 py-1 bg-primary text-on-primary text-xs font-bold">조회</button>
            </div>
            <div class="p-4 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label class="field-label">의뢰번호</label><input id="blSearchRequestNo" class="field-input" type="text" placeholder="의뢰번호 검색" /></div>
                <div><label class="field-label">화주명</label><input id="blSearchShipper" class="field-input" type="text" placeholder="화주명 검색" /></div>
                <div><label class="field-label">House B/L</label><input id="blSearchHbl" class="field-input" type="text" placeholder="House B/L 검색" /></div>
              </div>
              <div class="overflow-hidden border border-slate-200">
                <table id="blIssueTargetTable" class="w-full tbl table-fixed">
                  <colgroup>
                    <col style="width:30%"><col style="width:18%"><col style="width:25%"><col style="width:15%"><col style="width:12%">
                  </colgroup>
                  <thead>
                    <tr>
                      <th>의뢰번호</th>
                      <th>화주</th>
                      <th>House B/L</th>
                      <th>상태</th>
                      <th>처리</th>
                    </tr>
                  </thead>
                  <tbody class="text-sm text-slate-700">
                    <tr><td colspan="5" class="text-center text-slate-500 py-6">조회된 B/L 발행 및 정산 대상이 없습니다.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="xl:col-span-7 border border-slate-200 overflow-hidden">
            <div class="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <h5 class="text-sm font-bold text-slate-900">B/L 발행 및 제출 입력</h5>
              <p class="text-xs text-slate-500 mt-1">수출비용 정산완료 상태가 되면 House B/L 발급 버튼이 활성화되고, 발급 후 화주에게 제출합니다.</p>
            </div>

            <div class="p-4 space-y-6">
              <div>
                <h6 class="text-[11px] font-black uppercase tracking-widest mb-3 border-l-4 border-slate-700 pl-3 text-slate-700">House B/L 발행 정보</h6>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label class="field-label">의뢰번호</label><input id="blIssueRequestNo" class="field-input bg-slate-50" readonly /></div>
                  <div><label class="field-label">화주명</label><input id="blIssueShipper" class="field-input bg-slate-50" readonly /></div>
                  <div><label class="field-label">Master B/L 번호</label><input id="blIssueMBL" class="field-input bg-slate-50" readonly /></div>
                  <div><label class="field-label">House B/L 번호</label><input id="blIssueHBL" class="field-input bg-slate-50" readonly /></div>
                  <div><label class="field-label">B/L 상태</label><input id="blIssueStatus" class="field-input bg-slate-50" readonly /></div>
                  <div class="md:col-span-2">
                    <label class="field-label">품명 리스트</label>
                    <div class="border border-slate-200 overflow-hidden bg-white">
                      <table class="w-full tbl table-fixed">
                        <colgroup>
                          <col style="width:34%"><col style="width:16%"><col style="width:16%"><col style="width:17%"><col style="width:17%">
                        </colgroup>
                        <thead>
                          <tr>
                            <th>품명</th>
                            <th>수량</th>
                            <th>포장단위</th>
                            <th>총중량</th>
                            <th>부피</th>
                          </tr>
                        </thead>
                        <tbody id="blIssueItemListBody" class="text-sm text-slate-700">
                          <tr><td colspan="5" class="text-center text-slate-400">왼쪽 목록에서 B/L 발행 대상을 선택하세요.</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <p id="blIssueItemSummary" class="text-xs text-slate-500 mt-2">B/L에 포함될 화물 품명 리스트가 표시됩니다.</p>
                  </div>
                  <div class="md:col-span-2"><label class="field-label">화주 제출 메시지</label><textarea id="blIssueSubmitMessage" class="field-textarea h-20">House B/L을 발급하여 화주에게 제출합니다. 내용 확인 후 승인 또는 반려 처리해주세요.</textarea></div>
                </div>
              </div>

              <div>
                <h6 class="text-[11px] font-black uppercase tracking-widest mb-3 border-l-4 border-slate-700 pl-3 text-slate-700">수출 비용 정산</h6>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label class="field-label">정산상태</label><input id="blCostStatus" class="field-input bg-slate-50" readonly /></div>
                  <div><label class="field-label">수출 운임비</label><input id="blCostFreight" class="field-input bg-slate-50" readonly /></div>
                  <div><label class="field-label">창고비</label><input id="blCostWarehouse" class="field-input bg-slate-50" readonly /></div>
                  <div class="md:col-span-3"><label class="field-label">총 청구금액</label><input id="blCostTotal" class="field-input bg-slate-50" readonly /></div>
                  <div class="md:col-span-3"><label class="field-label">정산 설명</label><textarea class="field-textarea h-20 bg-slate-50" readonly>운송담당자가 창고관리자에게 창고비를 선지급한 뒤, 수출 운임비와 창고비를 합산하여 화주에게 정산받는 구조입니다.</textarea></div>
                </div>
              </div>

              <div id="blSupplementForm" class="hidden border border-red-200 bg-red-50/30 p-4">
                <h6 class="text-[11px] font-black uppercase tracking-widest mb-3 border-l-4 border-red-700 pl-3 text-red-700">B/L 보완 및 재발급 폼</h6>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2"><label class="field-label">화주 반려 사유</label><textarea id="blSupplementRejectReason" class="field-textarea h-24 bg-slate-50" readonly></textarea></div>
                  <div><label class="field-label">수정 House B/L 번호</label><input id="blSupplementHbl" class="field-input" /></div>
                  <div><label class="field-label">B/L 상태</label><input class="field-input bg-slate-50" value="재발급 보완중" readonly /></div>
                  <div class="md:col-span-2"><label class="field-label">수정 품명 리스트</label><textarea id="blSupplementItem" class="field-textarea h-20" placeholder="품명 / 수량 / 포장단위 / 총중량 / 부피 형식으로 입력하세요."></textarea></div>
                  <div class="md:col-span-2"><label class="field-label">보완 내용</label><textarea id="blSupplementContent" class="field-textarea h-24" placeholder="거래자 주소, 포장 수량 등 보완한 내용을 입력하세요."></textarea></div>
                </div>
                <div class="flex justify-end gap-2 mt-4">
                  <button id="blSupplementCancelBtn" type="button" class="px-4 py-2 border border-slate-300 bg-white text-slate-700 text-xs font-bold">취소</button>
                  <button id="blSupplementSaveBtn" type="button" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold hover:bg-primary-dim">보완 제출</button>
                </div>
              </div>
            </div>

            <div class="px-4 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
              <button id="blRejectReasonBtn" type="button" class="hidden px-4 py-2 bg-red-700 text-white text-xs font-bold">반려사유 확인</button>
              <button id="blSupplementOpenBtn" type="button" class="hidden px-4 py-2 bg-slate-800 text-white text-xs font-bold">수정보완</button>
              <button id="blCostSettleBtn" type="button" class="px-4 py-2 bg-slate-800 text-white text-xs font-bold">정산 처리</button>
              <button id="blIssueSendBtn" type="button" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold hover:bg-primary-dim">B/L 발급 및 화주 제출</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="blRejectModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/50 px-4">
      <div class="w-full max-w-xl bg-white shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <h4 class="text-base font-bold text-slate-900">화주 반려 사유</h4>
          <button type="button" id="blRejectModalClose" class="text-slate-500 text-xl leading-none">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div><label class="field-label">의뢰번호</label><input id="blRejectRequestNo" class="field-input bg-slate-50" readonly /></div>
          <div><label class="field-label">반려 사유</label><textarea id="blRejectReasonText" class="field-textarea h-32 bg-slate-50" readonly></textarea></div>
        </div>
        <div class="flex justify-end border-t border-slate-200 px-6 py-4 bg-slate-50">
          <button type="button" id="blRejectModalConfirm" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold hover:bg-primary-dim">확인</button>
        </div>
      </div>
    </div>
  `;
}

function normalizeExportBLIssueDoLayout() {
  const root = document.querySelector('.bl-panel-grid');
  if (!root || root.dataset.doLayout === 'true') return;

  const listPanel = root.children[0];
  const formPanel = root.children[1];
  if (!listPanel || !formPanel) return;

  const formBody = formPanel.querySelector('.p-4.space-y-6');
  if (!formBody) return;

  const costSection = Array.from(formBody.children).find(function(child) {
    return child && child.textContent && child.textContent.indexOf('수출 비용 정산') !== -1;
  });
  if (!costSection) return;

  root.dataset.doLayout = 'true';
  root.className = 'space-y-5 bl-panel-grid';
  listPanel.className = 'border border-slate-200 overflow-hidden';
  formPanel.className = 'xl:col-span-7 border border-slate-200 overflow-hidden';

  const lowerGrid = document.createElement('div');
  lowerGrid.className = 'grid grid-cols-1 xl:grid-cols-12 gap-3';
  root.appendChild(lowerGrid);
  lowerGrid.appendChild(formPanel);

  const costPanel = document.createElement('div');
  costPanel.className = 'xl:col-span-5 border border-slate-200 overflow-hidden bg-white';
  costPanel.innerHTML = ''
      + '<div class="px-4 py-3 bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-900">수출 비용 정산</div>'
      + '<div class="p-4 space-y-4"></div>';
  lowerGrid.appendChild(costPanel);
  costPanel.querySelector('.p-4').appendChild(costSection);
}

function bindBLIssueActions(groupKey, itemId) {
  if (itemId !== 'TACS-FW-010B') return;
  normalizeExportBLIssueDoLayout();

  const rows = detailBody.querySelectorAll('.bl-row');
  const requestNo = document.getElementById('blIssueRequestNo');
  const shipper = document.getElementById('blIssueShipper');
  const mbl = document.getElementById('blIssueMBL');
  const hbl = document.getElementById('blIssueHBL');
  const itemListBody = document.getElementById('blIssueItemListBody');
  const itemSummary = document.getElementById('blIssueItemSummary');
  const status = document.getElementById('blIssueStatus');

  const costStatus = document.getElementById('blCostStatus');
  const costFreight = document.getElementById('blCostFreight');
  const costWarehouse = document.getElementById('blCostWarehouse');
  const costTotal = document.getElementById('blCostTotal');

  const settleBtn = document.getElementById('blCostSettleBtn');
  const issueBtn = document.getElementById('blIssueSendBtn');
  const rejectReasonBtn = document.getElementById('blRejectReasonBtn');
  const supplementOpenBtn = document.getElementById('blSupplementOpenBtn');
  const supplementForm = document.getElementById('blSupplementForm');
  const supplementRejectReason = document.getElementById('blSupplementRejectReason');
  const supplementHbl = document.getElementById('blSupplementHbl');
  const supplementItem = document.getElementById('blSupplementItem');
  const supplementContent = document.getElementById('blSupplementContent');
  const supplementCancelBtn = document.getElementById('blSupplementCancelBtn');
  const supplementSaveBtn = document.getElementById('blSupplementSaveBtn');

  const rejectModal = document.getElementById('blRejectModal');
  const rejectClose = document.getElementById('blRejectModalClose');
  const rejectConfirm = document.getElementById('blRejectModalConfirm');
  const rejectRequestNo = document.getElementById('blRejectRequestNo');
  const rejectReasonText = document.getElementById('blRejectReasonText');
  const searchBtn = document.getElementById('blIssueSearchBtn');
  const searchRequestNo = document.getElementById('blSearchRequestNo');
  const searchShipper = document.getElementById('blSearchShipper');
  const searchHbl = document.getElementById('blSearchHbl');

  let activeRow = null;

  function money(num) {
    return Number(num || 0).toLocaleString('ko-KR') + '원';
  }

  function parseBlItems(row) {
    const raw = row?.dataset.items || '';
    return raw.split(';').filter(Boolean).map(item => {
      const [name, qty, unit, weight, volume] = item.split('|');
      return { name: name || '-', qty: qty || '-', unit: unit || '-', weight: weight || '-', volume: volume || '-' };
    });
  }

  function renderBlItemList(row) {
    const items = parseBlItems(row);
    if (!itemListBody) return;
    if (!items.length) {
      itemListBody.innerHTML = '<tr><td colspan="5" class="text-center text-slate-400">등록된 품명 리스트가 없습니다.</td></tr>';
      if (itemSummary) itemSummary.textContent = '등록된 품명 리스트가 없습니다.';
      return;
    }
    itemListBody.innerHTML = items.map(item => `
      <tr>
        <td class="font-bold">${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.unit}</td>
        <td>${item.weight}</td>
        <td>${item.volume}</td>
      </tr>
    `).join('');
    if (itemSummary) itemSummary.textContent = `${items[0].name}${items.length > 1 ? ' 외 ' + (items.length - 1) + '건' : ''} · 총 ${items.length}개 품목`;
  }

  function blItemsToText(row) {
    return parseBlItems(row).map(item => `${item.name} / ${item.qty} / ${item.unit} / ${item.weight} / ${item.volume}`).join('\n');
  }

  function renderListStatus(row) {
    const cell = row.querySelector('.bl-list-status-cell');
    const hblCell = row.querySelector('.bl-hbl-cell');
    if (!cell) return;

    if (row.dataset.blStatus === '반려') {
      cell.innerHTML = '<span class="info-chip bg-red-100 text-red-700">반려</span>';
    } else if (row.dataset.blStatus === '발급완료') {
      cell.innerHTML = '<span class="info-chip">발급완료</span>';
    } else if (row.dataset.blStatus === '재발급가능') {
      cell.innerHTML = '<span class="info-chip">재발급가능</span>';
    } else if (row.dataset.settlementStatus === '정산완료') {
      cell.innerHTML = '<span class="info-chip">발행준비</span>';
      row.dataset.blStatus = '발행준비';
    } else {
      cell.innerHTML = buildStatusChip('미정산');
      row.dataset.blStatus = '미정산';
    }
    if (hblCell) hblCell.textContent = (row.dataset.blStatus === '발급완료' || row.dataset.blStatus === '반려') ? (row.dataset.hbl || '') : '';
  }

  function applyBlSearch() {
    const requestText = (searchRequestNo?.value || '').trim().toLowerCase();
    const shipperText = (searchShipper?.value || '').trim().toLowerCase();
    const hblText = (searchHbl?.value || '').trim().toLowerCase();
    rows.forEach(row => {
      const visible =
          (!requestText || (row.dataset.requestNo || '').toLowerCase().includes(requestText)) &&
          (!shipperText || (row.dataset.shipper || '').toLowerCase().includes(shipperText)) &&
          (!hblText || (row.dataset.hbl || '').toLowerCase().includes(hblText));
      row.classList.toggle('hidden', !visible);
    });
  }

  function selectRow(row) {
    if (!row) return;
    activeRow = row;
    rows.forEach(r => r.classList.remove('bg-slate-100'));
    row.classList.add('bg-slate-100');

    requestNo.value = row.dataset.requestNo || '';
    shipper.value = row.dataset.shipper || '';
    mbl.value = row.dataset.mbl || '';
    const hblVisible = row.dataset.blStatus === '발급완료' || row.dataset.blStatus === '반려';
    hbl.value = hblVisible ? (row.dataset.hbl || '') : '';
    renderBlItemList(row);
    status.value = row.dataset.blStatus || '';

    const freight = Number(row.dataset.freight || 0);
    const warehouse = Number(row.dataset.warehouse || 0);
    costStatus.value = row.dataset.settlementStatus || '';
    costFreight.value = money(freight);
    costWarehouse.value = money(warehouse);
    costTotal.value = money(freight + warehouse);

    const isUnsettled = row.dataset.settlementStatus !== '정산완료';
    const canIssue = row.dataset.settlementStatus === '정산완료' && (row.dataset.blStatus === '발행준비' || row.dataset.blStatus === '재발급가능');
    const isRejected = row.dataset.blStatus === '반려';

    settleBtn.classList.toggle('hidden', !isUnsettled);
    issueBtn.classList.toggle('hidden', !canIssue);
    rejectReasonBtn.classList.toggle('hidden', !isRejected);
    supplementOpenBtn.classList.toggle('hidden', !isRejected);
    if (!isRejected && supplementForm) supplementForm.classList.add('hidden');

    if (isUnsettled) status.value = '미정산';
  }

  if (searchBtn) searchBtn.addEventListener('click', applyBlSearch);
  [searchRequestNo, searchShipper, searchHbl].forEach(input => {
    if (input) input.addEventListener('keydown', event => {
      if (event.key === 'Enter') applyBlSearch();
    });
  });

  function openRejectModal(row) {
    if (!row) return;
    rejectRequestNo.value = row.dataset.requestNo || '';
    rejectReasonText.value = row.dataset.rejectReason || '화주 반려 사유가 등록되어 있지 않습니다.';
    rejectModal.classList.remove('hidden');
    rejectModal.classList.add('flex');
  }

  function closeRejectModal() {
    rejectModal.classList.add('hidden');
    rejectModal.classList.remove('flex');
  }

  rows.forEach(row => {
    renderListStatus(row);
    row.addEventListener('click', function(e) {
      selectRow(this);
      if (this.dataset.blStatus === '반려' && e.target.closest('.bl-select-btn')) {
        openRejectModal(this);
      }
    });
  });

  if (rows.length) selectRow(rows[0]);

  if (settleBtn) {
    settleBtn.addEventListener('click', function() {
      if (!activeRow) return;
      activeRow.dataset.settlementStatus = '정산완료';
      activeRow.dataset.blStatus = '발행준비';
      renderListStatus(activeRow);
      selectRow(activeRow);
      alert('수출 운임비와 창고비 정산이 완료되었습니다. B/L 발행준비 상태로 변경되었습니다.');
    });
  }

  if (issueBtn) {
    issueBtn.addEventListener('click', function() {
      if (!activeRow) return;
      if (activeRow.dataset.settlementStatus !== '정산완료') {
        alert('정산 완료 후 B/L 발급 및 제출이 가능합니다.');
        return;
      }
      activeRow.dataset.blStatus = '발급완료';
      renderListStatus(activeRow);
      selectRow(activeRow);
      alert('House B/L이 발급되어 화주에게 제출되었습니다.');
    });
  }

  if (rejectReasonBtn) {
    rejectReasonBtn.addEventListener('click', function() {
      openRejectModal(activeRow);
    });
  }


  if (supplementOpenBtn) {
    supplementOpenBtn.addEventListener('click', function() {
      if (!activeRow) return;
      supplementRejectReason.value = activeRow.dataset.rejectReason || '';
      supplementHbl.value = activeRow.dataset.hbl || '';
      supplementItem.value = blItemsToText(activeRow);
      supplementContent.value = '';
      supplementForm.classList.remove('hidden');
    });
  }

  if (supplementCancelBtn) {
    supplementCancelBtn.addEventListener('click', function() {
      supplementForm.classList.add('hidden');
    });
  }

  if (supplementSaveBtn) {
    supplementSaveBtn.addEventListener('click', function() {
      if (!activeRow) return;
      activeRow.dataset.hbl = supplementHbl.value || activeRow.dataset.hbl;
      if (supplementItem && supplementItem.value.trim()) {
        activeRow.dataset.items = supplementItem.value.split('\n').filter(Boolean).map(line => line.split('/').map(v => v.trim()).join('|')).join(';');
      }
      activeRow.dataset.blStatus = '재발급가능';
      activeRow.dataset.rejectReason = '';
      renderListStatus(activeRow);
      selectRow(activeRow);
      supplementForm.classList.add('hidden');
      alert('B/L 보완 내용이 제출되었습니다. 이제 재발급 및 화주 제출이 가능합니다.');
    });
  }

  if (rejectClose) rejectClose.addEventListener('click', closeRejectModal);
  if (rejectConfirm) rejectConfirm.addEventListener('click', closeRejectModal);
  if (rejectModal) rejectModal.addEventListener('click', e => { if (e.target === rejectModal) closeRejectModal(); });
}
