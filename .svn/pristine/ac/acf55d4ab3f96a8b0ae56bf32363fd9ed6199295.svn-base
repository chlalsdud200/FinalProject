<%@ page pageEncoding="UTF-8" %>
<div id="importTrackModal" class="fixed inset-0 bg-black/40 z-[120] items-center justify-center p-4" style="display:none;">
  <div class="w-full max-w-3xl bg-white shadow-2xl overflow-hidden">
    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
      <h3 class="text-base font-black text-slate-900">입항 추적 상세</h3>
      <button id="trackModalCloseBtn" class="text-slate-500 hover:text-slate-800 text-xl leading-none">×</button>
    </div>
    <div class="p-6 space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div><label class="field-label">의뢰번호</label><input id="trackRequestNo" class="field-input bg-slate-50" type="text" readonly /></div>
        <div><label class="field-label">MBL번호</label><input id="trackMblNo" class="field-input bg-slate-50" type="text" readonly /></div>
        <div><label class="field-label">HBL번호</label><input id="trackHblNo" class="field-input bg-slate-50" type="text" readonly /></div>
        <div><label class="field-label">현재 위치</label><input id="trackLocation" class="field-input bg-slate-50" type="text" readonly /></div>
        <div><label class="field-label">도착상태</label><input id="trackStatus" class="field-input bg-slate-50" type="text" readonly /></div>
        <div><label class="field-label">ETA</label><input id="trackEta" class="field-input bg-slate-50" type="text" readonly /></div>
        <div><label class="field-label">화물관리번호</label><input id="trackCargoMgmtNo" class="field-input bg-slate-50" type="text" readonly /></div>
        <div class="md:col-span-2"><label class="field-label">운송 경로</label><textarea id="trackRoute" class="field-textarea h-28 bg-slate-50" readonly></textarea></div>
      </div>
    </div>
    <div class="px-6 py-4 border-t border-slate-200 flex justify-end bg-slate-50">
      <button class="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold bg-white" onclick="document.getElementById('importTrackModal').style.display='none'">닫기</button>
    </div>
  </div>
</div>

<div id="importArrivalNoticeModal" class="fixed inset-0 bg-black/40 z-[120] items-center justify-center p-4" style="display:none;">
  <div class="w-full max-w-2xl bg-white shadow-2xl overflow-hidden">
    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
      <h3 class="text-base font-black text-slate-900">도착통지서 발송</h3>
      <button id="arrivalNoticeCloseBtn" class="text-slate-500 hover:text-slate-800 text-xl leading-none">×</button>
    </div>
    <div class="p-6 space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div><label class="field-label">B/L번호</label><input id="arrivalNoticeBlNo" class="field-input bg-slate-50" type="text" readonly /></div>
        <div><label class="field-label">운송편명</label><input id="arrivalNoticeVessel" class="field-input bg-slate-50" type="text" readonly /></div>
        <div><label class="field-label">ETA</label><input id="arrivalNoticeEta" class="field-input bg-slate-50" type="text" readonly /></div>
        <div><label class="field-label">터미널</label><input id="arrivalNoticeTerminal" class="field-input bg-slate-50" type="text" readonly /></div>
        <div><label class="field-label">통지상태</label><input id="arrivalNoticeStatus" class="field-input bg-slate-50" type="text" readonly /></div>
      </div>
    </div>
    <div class="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
      <button class="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold bg-white" onclick="document.getElementById('importArrivalNoticeModal').style.display='none'">닫기</button>
      <button id="arrivalNoticeSendBtn" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold">발송</button>
    </div>
  </div>
</div>

<div id="houseBlIssueModal" class="fixed inset-0 bg-black/40 z-[110] hidden items-center justify-center p-4 overflow-y-auto">
  <div class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
      <h3 class="text-base font-black text-slate-900">House B/L 발행 폼</h3>
      <button id="houseBlIssueClose" class="text-slate-500 hover:text-slate-800 text-xl leading-none">×</button>
    </div>
    <div class="p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div><label class="field-label">Shipper</label><input class="field-input" type="text" placeholder="바이어 입력" /></div>
        <div><label class="field-label">Consignee</label><input class="field-input" type="text" placeholder="바이어 입력" /></div>
        <div><label class="field-label">Notify Party</label><input class="field-input" type="text" placeholder="도착 통지처 입력" /></div>
        <div><label class="field-label">House B/L No.</label><input class="field-input" type="text" placeholder="포워더 발행 번호 입력" /></div>
        <div><label class="field-label">Master B/L No.</label><input class="field-input" type="text" placeholder="선사 발행 번호 입력" /></div>
        <div><label class="field-label">Vessel & Voyage</label><input class="field-input" type="text" placeholder="해상명 및 항차 입력" /></div>
        <div><label class="field-label">Port of Loading</label><input class="field-input" type="text" placeholder="선적항 입력" /></div>
        <div><label class="field-label">Port of Discharge</label><input class="field-input" type="text" placeholder="양하항 입력" /></div>
        <div><label class="field-label">Final Destination</label><input class="field-input" type="text" placeholder="최종 목적지 입력" /></div>
        <div><label class="field-label">ETD / ETA</label><input class="field-input" type="text" placeholder="출발일 / 도착 예정일 입력" /></div>
        <div><label class="field-label">Description of Goods</label><input class="field-input" type="text" placeholder="품명 입력" /></div>
        <div><label class="field-label">No. of Packages</label><input class="field-input" type="text" placeholder="포장 수량 입력" /></div>
        <div><label class="field-label">Gross Weight</label><input class="field-input" type="text" placeholder="총 중량(KGS) 입력" /></div>
        <div><label class="field-label">Measurement</label><input class="field-input" type="text" placeholder="용적(CBM) 입력" /></div>
      </div>
    </div>
    <div class="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
      <button id="houseBlIssueCancel" class="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold bg-white">닫기</button>
      <button class="px-4 py-2 bg-primary text-on-primary text-xs font-bold">발행 저장</button>
    </div>
  </div>
</div>

<div id="rejectModal" class="fixed inset-0 bg-black/40 z-[100] hidden items-center justify-center p-4">
  <div class="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
      <h3 class="text-base font-black text-slate-900">운송 의뢰 반려</h3>
      <button id="rejectModalClose" class="text-slate-500 hover:text-slate-800 text-xl leading-none">×</button>
    </div>
    <div class="p-6 space-y-4">
      <div>
        <label class="field-label">반려 구분</label>
        <input id="rejectType" class="field-input bg-slate-50" type="text" readonly />
      </div>
      <div>
        <label class="field-label">반려 사유</label>
        <select id="rejectReasonSelect" class="field-select">
          <option value="서류 누락">서류 누락</option>
          <option value="필수 정보 오류">필수 정보 오류</option>
          <option value="기타">기타</option>
        </select>
      </div>
      <div>
        <label class="field-label">반려 메모</label>
        <textarea id="rejectMemo" class="field-textarea h-28" placeholder="반려 메모를 입력하세요."></textarea>
      </div>
    </div>
    <div class="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
      <button id="rejectModalCancel" class="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold bg-white">닫기</button>
      <button id="rejectModalSave" class="px-4 py-2 bg-red-700 text-white text-xs font-bold">반려</button>
    </div>
  </div>
</div>


<div id="rejectReasonViewModal" class="fixed inset-0 bg-black/40 z-[120] hidden items-center justify-center p-4">
  <div class="w-full max-w-lg bg-white shadow-2xl overflow-hidden">
    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
      <h3 class="text-base font-black text-slate-900">접수 반려 사유</h3>
      <button id="rejectReasonViewClose" class="text-slate-500 hover:text-slate-800 text-xl leading-none">×</button>
    </div>
    <div class="p-6 space-y-4">
      <div>
        <label class="field-label">의뢰번호</label>
        <input id="rejectReasonRequestNo" class="field-input bg-slate-50" type="text" readonly />
      </div>
      <div>
        <label class="field-label">화주명</label>
        <input id="rejectReasonShipper" class="field-input bg-slate-50" type="text" readonly />
      </div>
      <div>
        <label class="field-label">반려 사유</label>
        <textarea id="rejectReasonText" class="field-textarea h-32 bg-slate-50" readonly></textarea>
      </div>
    </div>
    <div class="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
      <button id="rejectReasonViewCancel" class="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold bg-white">닫기</button>
    </div>
  </div>
</div>
