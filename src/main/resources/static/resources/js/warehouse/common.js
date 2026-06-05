// 공통 함수들

function doSearch() {
  var v = document.getElementById('gSearch').value.trim();
  if (!v) { 
    alert('검색어를 입력하세요.'); 
    return; 
  }
  alert('"' + v + '" 기준 화면으로 이동했습니다.');
}

function openReminderModal(bl, shipper, amount) {
  document.getElementById('remind-bl').value = bl;
  document.getElementById('remind-shipper').value = shipper;
  document.getElementById('remind-amount').value = '₩ ' + amount;
  document.getElementById('remind-msg').value = `[TACS 알림] 귀사의 화물(${bl})에 대한 보관료가 미납되었습니다. 원활한 반출을 위해 빠른 결제 부탁드립니다.`;
  document.getElementById('reminderModal').classList.add('open');
}

function closeReminderModal(e) {
  if (e && e.target !== document.getElementById('reminderModal') && e.type === 'click') return;
  document.getElementById('reminderModal').classList.remove('open');
}

function sendReminder() {
  const shipper = document.getElementById('remind-shipper').value;
  alert(shipper + ' 화주에게 독촉 알림이 발송되었습니다.\n(화주 포털의 최근 알림 피드에 즉시 반영됩니다)');
  closeReminderModal();
}

function refreshPageData(btn) {
  const icon = btn.querySelector('.material-symbols-outlined');
  if (icon) icon.classList.add('spin');
  btn.disabled = true;
  setTimeout(() => {
    if (icon) icon.classList.remove('spin');
    btn.disabled = false;
  }, 800);
}

function showToast(msg, level) {
  var bg = level === 'success' ? '#1d6b4f' : level === 'warn' ? '#d97706' : '#373f54';
  var t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:' + bg + ';color:#fff;padding:12px 24px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.2);min-width:280px;text-align:center;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.style.opacity='0'; t.style.transition='opacity .4s'; setTimeout(function(){ t.remove(); }, 400); }, 2800);
}

function saveSettings() {
  showToast('설정이 저장되었습니다.', 'success');
}

window.loadPage = function(url) {
    if (url) location.href = url;
}
