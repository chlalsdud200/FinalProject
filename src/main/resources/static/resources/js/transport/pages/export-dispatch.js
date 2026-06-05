function buildPickupDispatchPanel() {
  return `
    <div id="pickupDispatchListPanel" class="section-card border border-slate-300 overflow-hidden">
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h4 class="text-sm font-bold text-slate-900">선적배차처리</h4>
          <p class="text-xs text-slate-500 mt-1">보세구역 반출요청 이후, 창고에서 선적항/선박 반입 지점까지 이동할 배차를 진행합니다.</p>
        </div>
        <button type="button" id="pickupListSearchBtn" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold hover:bg-primary-dim">조회</button>
      </div>

      <div class="p-6 space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4">
          <div><label class="field-label">의뢰번호</label><input id="pickupSearchRequest" class="field-input" type="text" placeholder="의뢰번호 입력" /></div>
          <div><label class="field-label">화주명</label><input id="pickupSearchOwner" class="field-input" type="text" placeholder="화주명 입력" /></div>
          <div><label class="field-label">상차지</label><input id="pickupSearchLoadingPlace" class="field-input" type="text" placeholder="상차지 입력" /></div>
            <div><label class="field-label">반출일시</label><input id="pickupSearchDate" class="field-input" type="date" /></div>
          <div class="flex items-end"><button id="pickupInlineSearchBtn" type="button" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold hover:bg-primary-dim">검색</button></div>
        </div>

        <div class="overflow-hidden border border-slate-200">
          <table class="w-full tbl table-fixed">
            <colgroup>
              <col style="width:22%"><col style="width:18%"><col style="width:32%"><col style="width:18%"><col style="width:10%">
            </colgroup>
            <thead>
              <tr>
                <th>의뢰번호</th>
                <th>화주</th>
                <th>상차지(보세구역)</th>
                <th>반출일시</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody class="text-sm text-slate-700">
              <tr><td colspan="5" class="text-center text-slate-500 py-6">조회된 선적배차 대상이 없습니다.</td></tr>
            </tbody>
          </table>
        </div>        </div>
      </div>
    </div>

    <div id="pickupDispatchFormPanel" class="section-card border border-slate-300 hidden overflow-hidden">
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h4 class="text-sm font-bold text-slate-900">선적배차 입력</h4>
          <p class="text-xs text-slate-500 mt-1">선택한 반출 승인 화물을 기준으로 보세구역 창고에서 선적항/선박 반입 지점까지 이동할 차량과 기사를 배정합니다.</p>
        </div>
        <button type="button" id="pickupBackToListBtn" class="px-4 py-2 border border-slate-300 bg-white text-slate-700 text-xs font-bold">목록으로</button>
      </div>

      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div><label class="field-label">의뢰번호</label><input class="field-input bg-slate-50" id="pickupRequestNoInput" type="text" readonly /></div>
          <div><label class="field-label">화주명</label><input class="field-input bg-slate-50" id="pickupOwnerInput" type="text" readonly /></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="field-label">차량번호</label>
            <div class="flex gap-2">
              <input class="field-input bg-slate-50" id="pickupVehicleInput" type="text" placeholder="차량 선택" readonly />
              <button type="button" id="pickupDispatchSearchBtn" class="px-3 py-2 border border-slate-300 bg-white text-slate-700 text-sm font-bold">🔍</button>
            </div>
          </div>
          <div>
            <label class="field-label">기사명</label>
            <input class="field-input bg-slate-50" id="pickupDriverInput" type="text" placeholder="자동 입력" readonly />
          </div>
          <div>
            <label class="field-label">상차지(보세구역)</label>
            <input class="field-input bg-slate-50" id="pickupLoadingPlaceInput" type="text" placeholder="자동 입력" readonly />
          </div>
          <div>
            <label class="field-label">연락처</label>
            <input class="field-input bg-slate-50" id="pickupDriverPhone" type="text" placeholder="자동 입력" readonly />
          </div>
          <div class="md:col-span-2">
                  <label class="field-label">반출일시</label>
            <input class="field-input bg-slate-50" id="pickupDateDisplay" type="text" placeholder="자동 입력" readonly />
          </div>
        </div>
      </div>

      <div class="section-card-action-footer flex justify-end gap-2 px-6 py-4 border-t border-slate-200">
        <button type="button" id="pickupCancelBtn" class="px-4 py-2 border border-slate-300 bg-white text-slate-700 text-xs font-bold">취소</button>
        <button type="button" id="pickupProcessBtn" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold hover:bg-primary-dim">배차완료</button>
      </div>
    </div>

    <div id="pickupDispatchModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/50 px-4">
      <div class="w-full max-w-5xl bg-white shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <h4 class="text-base font-bold text-slate-900">배차 가능 기사 목록</h4>
          <button type="button" id="pickupDispatchModalClose" class="text-slate-500 text-xl leading-none">×</button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-xs text-slate-500">배차 가능한 기사 중 하나를 선택하세요. 선택한 차량번호, 기사명, 연락처, 보세구역 상차지가 선적배차 입력창에 자동 반영됩니다.</p>
          <div class="overflow-hidden border border-slate-200">
            <table class="w-full tbl table-fixed">
              <colgroup>
                <col style="width:8%"><col style="width:17%"><col style="width:18%"><col style="width:22%"><col style="width:35%">
              </colgroup>
              <thead>
                <tr>
                  <th>선택</th>
                  <th>기사명</th>
                  <th>차량번호</th>
                  <th>기사전화번호</th>
                  <th>상차지</th>
                </tr>
              </thead>
              <tbody id="pickupDispatchCandidateBody">
                <tr><td colspan="5" class="text-center text-slate-500 py-6">조회된 배차 후보가 없습니다.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="flex justify-end gap-2 border-t border-slate-200 px-6 py-4 bg-slate-50">
          <button type="button" id="pickupDispatchModalCancel" class="px-4 py-2 border border-slate-300 bg-white text-slate-700 text-xs font-bold">취소</button>
          <button type="button" id="pickupDispatchModalConfirm" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold hover:bg-primary-dim">확인</button>
        </div>
      </div>
    </div>
  `;
}

function bindPickupDispatchActions(groupKey, itemId) {
  if (itemId !== 'TACS-FW-007') return;

  const listPanel = document.getElementById('pickupDispatchListPanel');
  const formPanel = document.getElementById('pickupDispatchFormPanel');
  const backBtn = document.getElementById('pickupBackToListBtn');
  const cancelFormBtn = document.getElementById('pickupCancelBtn');
  const processBtn = document.getElementById('pickupProcessBtn');
  const listSearchBtn = document.getElementById('pickupListSearchBtn');
  const inlineSearchBtn = document.getElementById('pickupInlineSearchBtn');
  const pickupSearchRequest = document.getElementById('pickupSearchRequest');
  const pickupSearchOwner = document.getElementById('pickupSearchOwner');
  const pickupSearchLoadingPlace = document.getElementById('pickupSearchLoadingPlace');
  const pickupSearchDate = document.getElementById('pickupSearchDate');

  const searchBtn = document.getElementById('pickupDispatchSearchBtn');
  const modal = document.getElementById('pickupDispatchModal');
  const closeBtn = document.getElementById('pickupDispatchModalClose');
  const cancelBtn = document.getElementById('pickupDispatchModalCancel');
  const confirmBtn = document.getElementById('pickupDispatchModalConfirm');
  const candidateBody = document.getElementById('pickupDispatchCandidateBody');

  const requestNoInput = document.getElementById('pickupRequestNoInput');
  const ownerInput = document.getElementById('pickupOwnerInput');
  const vehicleInput = document.getElementById('pickupVehicleInput');
  const driverInput = document.getElementById('pickupDriverInput');
  const phoneInput = document.getElementById('pickupDriverPhone');
  const loadingPlaceInput = document.getElementById('pickupLoadingPlaceInput');
  const pickupDateDisplay = document.getElementById('pickupDateDisplay');

  if (!listPanel || !formPanel) return;

  function applyPickupSearch() {
    const requestText = (pickupSearchRequest?.value || '').trim().toLowerCase();
    const ownerText = (pickupSearchOwner?.value || '').trim().toLowerCase();
    const loadingText = (pickupSearchLoadingPlace?.value || '').trim().toLowerCase();
    const dateText = (pickupSearchDate?.value || '').trim().toLowerCase();

    detailBody.querySelectorAll('tr[data-pickup-row]').forEach(row => {
      const applyBtn = row.querySelector('.pickup-apply-btn');
      const cells = row.querySelectorAll('td');
      const requestNo = (applyBtn?.dataset.requestNo || cells[0]?.textContent || '').toLowerCase();
      const owner = (applyBtn?.dataset.owner || cells[1]?.textContent || '').toLowerCase();
      const loadingPlace = (applyBtn?.dataset.loadingPlace || cells[2]?.textContent || '').toLowerCase();
      const pickupDate = (applyBtn?.dataset.pickupDate || cells[3]?.textContent || '').toLowerCase();
      const visible =
          (!requestText || requestNo.includes(requestText)) &&
          (!ownerText || owner.includes(ownerText)) &&
          (!loadingText || loadingPlace.includes(loadingText)) &&
          (!dateText || pickupDate.includes(dateText));
      row.classList.toggle('hidden', !visible);
    });
  }

  function showList() {
    listPanel.classList.remove('hidden');
    formPanel.classList.add('hidden');
    if (typeof backBtn !== 'undefined' && backBtn) {
      backBtn.innerHTML = '<span class="material-symbols-outlined text-lg">arrow_back</span><span>대시보드로</span>';
      backBtn.onclick = showDashboard;
    }
  }

  function showFormFromButton(btn) {
    listPanel.classList.add('hidden');
    formPanel.classList.remove('hidden');
    if (typeof backBtn !== 'undefined' && backBtn) {
      backBtn.innerHTML = '목록으로';
      backBtn.onclick = showList;
    }
    selectedPickupDispatchRequestNo = btn.dataset.requestNo || '';

    requestNoInput.value = btn.dataset.requestNo || '';
    ownerInput.value = btn.dataset.owner || '';
    loadingPlaceInput.value = btn.dataset.loadingPlace || '';
    pickupDateDisplay.value = btn.dataset.pickupDate || '';

    vehicleInput.value = '';
    driverInput.value = '';
    phoneInput.value = '';
  }

  detailBody.querySelectorAll('.pickup-apply-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      showFormFromButton(this);
    });
  });

  [listSearchBtn, inlineSearchBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', applyPickupSearch);
  });
  [pickupSearchRequest, pickupSearchOwner, pickupSearchLoadingPlace, pickupSearchDate].forEach(input => {
    if (input) input.addEventListener('keydown', event => {
      if (event.key === 'Enter') applyPickupSearch();
    });
  });

  if (cancelFormBtn) cancelFormBtn.addEventListener('click', showList);
  if (processBtn) {
    processBtn.addEventListener('click', function() {
      if (!selectedPickupDispatchRequestNo) {
        alert('처리할 배차신청 건이 없습니다.');
        return;
      }
      if (!vehicleInput.value || !driverInput.value) {
        alert('차량과 기사를 먼저 선택하세요.');
        return;
      }

      const targetRow = detailBody.querySelector(`tr[data-pickup-row="${selectedPickupDispatchRequestNo}"]`);
      if (targetRow) {
        const actionCell = targetRow.querySelector('.pickup-action-cell');
        if (actionCell) actionCell.innerHTML = '<button type="button" class="px-3 py-1 border border-slate-300 bg-white text-slate-500 text-xs font-bold" disabled>배차완료</button>';
      }

      alert('선적배차가 완료 처리되었습니다.');
      showList();
    });
  }

  if (!searchBtn || !modal || !closeBtn || !cancelBtn || !confirmBtn || !candidateBody || !vehicleInput || !driverInput || !phoneInput || !loadingPlaceInput) return;

  function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  searchBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });

  candidateBody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', function(e) {
      const radio = this.querySelector('input[name="pickupDispatchCandidate"]');
      if (radio) radio.checked = true;
    });
  });

  confirmBtn.addEventListener('click', function() {
    const checked = candidateBody.querySelector('input[name="pickupDispatchCandidate"]:checked');
    if (!checked) {
      alert('배차할 기사를 선택하세요.');
      return;
    }
    vehicleInput.value = checked.dataset.vehicle || '';
    driverInput.value = checked.dataset.driver || '';
    phoneInput.value = checked.dataset.phone || '';
    loadingPlaceInput.value = checked.dataset.loadingPlace || loadingPlaceInput.value;
    closeModal();
  });
}
