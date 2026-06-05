/* ── 관세 납부 모달 관련 함수 ── */
function openDutyPaymentModal(id, amount) {
  document.getElementById('md-duty-id').textContent = id;
  document.getElementById('md-duty-total').textContent = '₩' + amount;
  document.getElementById('dutyPaymentModal').classList.add('open');
}

function processDutyPayment() {
  const id = document.getElementById('md-duty-id').textContent;
  const amount = document.getElementById('md-duty-total').textContent;
  alert(id + ' 건에 대한 ' + amount + ' 결제가 완료되었습니다.');
  document.getElementById('dutyPaymentModal').classList.remove('open');
};

/* ── 공지사항 상세 ── */
function showNoticeDetail(title, body) {
  document.getElementById('noticeModalTitle').textContent = title;
  document.getElementById('noticeModalDate').textContent = 'TACS 공지사항';
  document.getElementById('noticeModalBody').textContent = body;
  document.getElementById('noticeModal').classList.add('open');
}
function closeNoticeModal(e) {
  if (e && e.target !== document.getElementById('noticeModal')) return;
  document.getElementById('noticeModal').classList.remove('open');
}

/* ── 고객센터는 현재 FAQ 전용으로 운영 ── */
function showSupportDetail() {}
function closeSupportModal(e) {
  var modal = document.getElementById('supportModal');
  if (!modal) return;
  if (e && e.target !== modal) return;
  modal.classList.remove('open');
}
function submitSupport() {}
function resetSupportForm() {}

/* ── 운임 납부 ── */
function payFreight(inv, amount) {
  showToast(inv + ' · ' + amount + ' 납부가 완료되었습니다.', 'success');
}

/* ── 설정 저장 ── */
function saveSettings() {
  showToast('설정이 저장되었습니다.', 'success');
}

/* ── 관세납부 form 스크롤 시 토스트 방지 오버라이드 ── */
function openBulkDutyPayment() {
  var chks = document.querySelectorAll('.duty-chk:checked');
  var total = 0;
  chks.forEach(function(c) { total += parseInt(c.dataset.amount); });
  showToast(chks.length + '건 일괄 납부 · 합계 ₩' + total.toLocaleString() + ' 처리되었습니다.', 'success');
  // 체크 해제
  chks.forEach(function(c){ c.checked = false; });
  document.getElementById('dutyCheckAll').checked = false;
  updateDutySelection();
}

