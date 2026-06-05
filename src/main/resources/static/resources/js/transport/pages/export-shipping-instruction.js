function buildShippingInstructionSubmitPanel() {
  return `
    <div id="shippingInstructionListWrap" class="section-card border border-slate-300">
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h4 class="text-sm font-bold text-slate-900">선적지시서 작성 및 제출</h4>
          <p class="text-xs text-slate-500 mt-1">선적 가능한 수출 건을 선택해 선사 제출용 선적지시서를 작성합니다.</p>
        </div>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="w-full tbl">
            <thead>
              <tr>
                <th>의뢰번호</th>
                <th>화주명</th>
                <th>Booking No</th>
                <th>선사명</th>
                <th>선박명/항차(VESSEL / VOYAGE)</th>
                <th>출발항 / 도착항</th>
                <th>수출신고번호</th>
                <th>상태</th>
                <th>처리</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colspan="9" class="text-center text-slate-500 py-6">조회된 선적지시서 대상이 없습니다.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div id="shippingInstructionFormWrap" class="section-card border border-slate-300 hidden">
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h4 class="text-sm font-bold text-slate-900">선적지시서 작성 및 제출</h4>
          <p class="text-xs text-slate-500 mt-1">Booking 정보와 화물 내역을 확인한 뒤 선적지시서를 저장하거나 제출합니다.</p>
        </div>
        <button type="button" id="shippingInstructionBackBtn" class="px-3 py-1 border border-slate-300 bg-white text-slate-700 text-xs font-bold">목록으로</button>
      </div>
      <div class="p-6 space-y-8">
        <div>
          <h5 class="text-[11px] font-black uppercase tracking-widest mb-4 border-l-4 border-slate-700 pl-3 text-slate-700">시스템 자동 생성 / 자동 매칭 정보</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="field-label">의뢰번호</label>
              <input class="field-input bg-slate-50" id="siRequestNo" type="text" readonly />
            </div>
            <div>
              <label class="field-label">화주명</label>
              <input class="field-input bg-slate-50" id="siSeller" type="text" readonly />
            </div>
          </div>
        </div>

        <div>
          <h5 class="text-[11px] font-black uppercase tracking-widest mb-4 border-l-4 border-slate-700 pl-3 text-slate-700">이전 단계 자동 연동 정보</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="field-label">송하인(SHIPPER)</label>
              <textarea class="field-textarea h-24 bg-slate-50" id="siShipper" readonly></textarea>
            </div>
            <div>
              <label class="field-label">수하인(CONSIGNEE)</label>
              <textarea class="field-textarea h-24 bg-slate-50" id="siConsignee" readonly></textarea>
            </div>
            <div>
              <label class="field-label">선박명/항차(VESSEL / VOYAGE)</label>
              <input class="field-input bg-slate-50" id="siVessel" type="text" readonly />
            </div>
            <div>
              <label class="field-label">선적항/양하항(PORT OF LOADING / DISCHARGE)</label>
              <input class="field-input bg-slate-50" id="siPort" type="text" readonly />
            </div>
          </div>
        </div>

        <div>
          <h5 class="text-[11px] font-black uppercase tracking-widest mb-4 border-l-4 border-slate-700 pl-3 text-slate-700">패킹리스트 기반 자동 계산 정보</h5>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label class="field-label">총 수량(TOTAL QUANTITY)</label>
              <input class="field-input bg-slate-50" id="siQuantity" type="text" readonly />
            </div>
            <div>
              <label class="field-label">총 중량(TOTAL WEIGHT)</label>
              <input class="field-input bg-slate-50" id="siWeight" type="text" readonly />
            </div>
            <div>
              <label class="field-label">총 부피(TOTAL MEASUREMENT)</label>
              <input class="field-input bg-slate-50" id="siMeasurement" type="text" readonly />
            </div>
          </div>
        </div>

        <div>
          <h5 class="text-[11px] font-black uppercase tracking-widest mb-4 border-l-4 border-slate-700 pl-3 text-slate-700">서류 자동 체크 정보</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="field-label">수출신고번호(EXPORT DECLARATION NO)</label>
              <input class="field-input bg-slate-50" id="siExportNo" type="text" readonly />
            </div>
            <div>
              <label class="field-label">제출대상 선사</label>
              <input class="field-input bg-slate-50" id="siCarrier" type="text" readonly />
            </div>
          </div>
        </div>
      </div>
      <div class="section-card-action-footer flex justify-end gap-2 px-6 py-4 border-t border-slate-200">
        <button id="shippingInstructionSubmitBtn" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold hover:bg-primary-dim">제출</button>
      </div>
    </div>
  `;
}

function bindShippingInstructionActions(groupKey, itemId) {
  if (itemId !== 'TACS-FW-010') return;

  const listWrap = document.getElementById('shippingInstructionListWrap');
  const formWrap = document.getElementById('shippingInstructionFormWrap');
  const backBtn = document.getElementById('shippingInstructionBackBtn');
  const submitBtn = document.getElementById('shippingInstructionSubmitBtn');
  const openButtons = detailBody.querySelectorAll('.shipping-instruction-open-btn');
  let selectedSiRow = null;
  let currentSiMode = 'create';

  const fields = {
    requestNo: document.getElementById('siRequestNo'),
    seller: document.getElementById('siSeller'),
    siNo: document.getElementById('siNo'),
    bookingNo: document.getElementById('siBookingNo'),
    shipper: document.getElementById('siShipper'),
    consignee: document.getElementById('siConsignee'),
    vessel: document.getElementById('siVessel'),
    port: document.getElementById('siPort'),
    quantity: document.getElementById('siQuantity'),
    weight: document.getElementById('siWeight'),
    measurement: document.getElementById('siMeasurement'),
    exportNo: document.getElementById('siExportNo'),
    carrier: document.getElementById('siCarrier')
  };

  function openForm(data, mode, sourceButton) {
    fields.requestNo.value = data.requestNo || '';
    fields.seller.value = data.seller || '';
    if (fields.siNo) fields.siNo.value = data.siNo || '';
    if (fields.bookingNo) fields.bookingNo.value = data.bookingNo || '';
    fields.shipper.value = data.shipper || '';
    fields.consignee.value = data.consignee || '';
    fields.vessel.value = data.vessel || '';
    fields.port.value = data.port || '';
    fields.quantity.value = data.quantity || '';
    fields.weight.value = data.weight || '';
    fields.measurement.value = data.measurement || '';
    fields.exportNo.value = data.exportNo || '';
    fields.carrier.value = data.carrier || '';
    currentSiMode = mode || 'create';
    selectedSiRow = sourceButton ? sourceButton.closest('tr') : null;
    submitBtn.textContent = '제출';
    if (mode === 'view') {
      submitBtn.classList.add('hidden');
    } else {
      submitBtn.classList.remove('hidden');
    }
    listWrap.classList.add('hidden');
    formWrap.classList.remove('hidden');
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      openForm({
        requestNo: this.dataset.requestNo,
        seller: this.dataset.seller,
        siNo: this.dataset.siNo,
        bookingNo: this.dataset.bookingNo,
        shipper: this.dataset.shipper,
        consignee: this.dataset.consignee,
        vessel: this.dataset.vessel,
        port: this.dataset.port,
        quantity: this.dataset.quantity,
        weight: this.dataset.weight,
        measurement: this.dataset.measurement,
        exportNo: this.dataset.exportNo,
        carrier: this.dataset.carrier
      }, this.dataset.mode, this);
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      if (currentSiMode === 'view') return;

      alert('제출되었습니다.');

      if (selectedSiRow) {
        const statusCell = selectedSiRow.querySelector('.si-status-cell');
        const actionBtn = selectedSiRow.querySelector('.shipping-instruction-open-btn');

        if (statusCell) statusCell.innerHTML = buildStatusChip('작성완료');
        if (actionBtn) {
          actionBtn.textContent = '조회';
          actionBtn.dataset.mode = 'view';
          actionBtn.className = 'shipping-instruction-open-btn px-3 py-1 border border-slate-300 bg-white text-slate-700 text-xs font-bold';
        }
      }

      formWrap.classList.add('hidden');
      listWrap.classList.remove('hidden');
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', function() {
      formWrap.classList.add('hidden');
      listWrap.classList.remove('hidden');
    });
  }
}
