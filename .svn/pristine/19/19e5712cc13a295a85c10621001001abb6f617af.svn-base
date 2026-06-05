/* ── 토스트 알림 ── */
function showToast(msg, level) {
  var bg = level === 'success' ? '#1d6b4f' : level === 'warn' ? '#d97706' : '#373f54';
  var t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:' + bg + ';color:#fff;padding:12px 24px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.2);min-width:280px;text-align:center;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.style.opacity='0'; t.style.transition='opacity .4s'; setTimeout(function(){ t.remove(); }, 400); }, 2800);
}

