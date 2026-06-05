function switchDocFlow(type) {
  document.getElementById('docflow-export').style.display = type === 'export' ? '' : 'none';
  document.getElementById('docflow-import').style.display = type === 'import' ? '' : 'none';
  document.getElementById('docflow-exp-btn').style.background = type === 'export' ? '#0f172a' : '#fff';
  document.getElementById('docflow-exp-btn').style.color = type === 'export' ? '#fff' : '#64748b';
  document.getElementById('docflow-exp-btn').style.borderColor = type === 'export' ? '#0f172a' : '#e2e8f0';
  document.getElementById('docflow-imp-btn').style.background = type === 'import' ? '#0f172a' : '#fff';
  document.getElementById('docflow-imp-btn').style.color = type === 'import' ? '#fff' : '#64748b';
  document.getElementById('docflow-imp-btn').style.borderColor = type === 'import' ? '#0f172a' : '#e2e8f0';
}

function toggleQuarantine(cb, prefix) {
  document.getElementById(prefix + '-quarantine-detail').style.display = cb.checked ? '' : 'none';
}

function submitSupplement(prefix) {
  var f = document.getElementById(prefix + '-supp-file');
  if (!f || !f.files[0]) { alert('보완서류 파일을 첨부해주세요.'); return; }
  var row = document.getElementById(prefix + '-supp-row');
  if (row) { row.style.background = '#f0fdf4'; row.querySelector('.doc-status').className = 'doc-status ok'; row.querySelector('.doc-status').textContent = '제출완료'; }
  showToast('보완서류가 제출되었습니다. 세관 검토 후 처리됩니다.', 'success');
}

function toggleAllDuty(cb) {
  document.querySelectorAll('.duty-chk').forEach(function(c) { c.checked = cb.checked; });
  updateDutySelection();
}
function updateDutySelection() {
  var chks = document.querySelectorAll('.duty-chk:checked');
  var total = 0;
  chks.forEach(function(c) { total += parseInt(c.dataset.amount); });
  var bar = document.getElementById('duty-action-bar');
  bar.style.display = chks.length > 0 ? 'flex' : 'none';
  document.getElementById('duty-selected-count').textContent = chks.length;
  document.getElementById('duty-selected-total').textContent = '₩' + total.toLocaleString();
  var allChk = document.getElementById('dutyCheckAll');
  var all = document.querySelectorAll('.duty-chk');
  allChk.indeterminate = chks.length > 0 && chks.length < all.length;
  allChk.checked = chks.length === all.length;
}
function openBulkDutyPayment() {
  var chks = document.querySelectorAll('.duty-chk:checked');
  var total = 0;
  chks.forEach(function(c) { total += parseInt(c.dataset.amount); });
  alert(chks.length + '건 일괄 납부 진행 — 합계 ₩' + total.toLocaleString());
}

function switchRefundTab(tab) {
  // 환급 탭 제거로 인해 납부 화면만 유지
  var el = document.getElementById('refund-duty');
  if (el) el.style.display = '';
}

function switchMypageTab(tab, btn) {
  var tabs = ['info', 'notify'];
  tabs.forEach(function(t) {
    var el = document.getElementById('mypage-' + t);
    if(el) el.style.display = (t === tab) ? 'block' : 'none';
  });
  if (btn) {
    var tabParent = btn.closest('.prog-tab-bar');
    if (tabParent) {
        tabParent.querySelectorAll('.prog-tab').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
    }
  }
}

function switchTransTab(tab) {
  var tabs = ['forwarder','export-trans','import-trans','freight'];
  var btns = document.querySelectorAll('#pg-transport .prog-tab');
  tabs.forEach(function(t, i) {
    var el = document.getElementById('trans-' + t);
    if (el) el.style.display = (t === tab) ? '' : 'none';
    if (btns[i]) btns[i].classList.toggle('active', t === tab);
  });

  if (tab === 'forwarder') {
    closeFwdContractForm();
    renderTransFwdList();
  }
}

function switchProgTab(tab, btn) {
  var parent = btn.closest('.card-section');
  parent.querySelectorAll('.prog-tab').forEach(function(t){ t.classList.remove('active'); });
  btn.classList.add('active');
  
  parent.querySelectorAll('.prog-list').forEach(function(l){ l.classList.remove('active'); });
  var target = document.getElementById('prog-' + tab);
  if (target) target.classList.add('active');
}

function switchDocReqTab(tab, btn) {
  var parent = btn.closest('.card-section');
  parent.querySelectorAll('.prog-tab').forEach(function(t){ t.classList.remove('active'); });
  btn.classList.add('active');

  parent.querySelectorAll('.prog-list').forEach(function(l){ l.classList.remove('active'); });
  var target = document.getElementById('doc-req-' + tab);
  if (target) target.classList.add('active');
}

function go(p) {
  // JSP 분리 이후: 같은 화면 안의 .page 전환이 가능하면 전환하고,
  // 해당 본문이 현재 JSP에 없으면 Spring MVC URL로 이동한다.
  var pageRoutes = {
    'dash': ctxPath() + '/owner/dashboard/list',
    'export': ctxPath() + '/owner/export/form',
    'import': ctxPath() + '/owner/import/form',
    'transport': ctxPath() + '/owner/transport/forwarder',
    'arrival-notice': ctxPath() + '/owner/arrival-notice/list.do',
    'refund': ctxPath() + '/owner/customs/duty',
    'customs-code': ctxPath() + '/owner/customs-code/list',
    'certs': ctxPath() + '/owner/certs/list',
    'docs': ctxPath() + '/owner/docs/list',
    'settings': ctxPath() + '/owner/settings',
    'mypage': ctxPath() + '/owner/mypage/info',
    'community': ctxPath() + '/owner/community/notice/list.do'
  };

  var t = document.getElementById('pg-' + p);
  if (!t && pageRoutes[p]) {
    location.href = pageRoutes[p];
    return;
  }

  document.querySelectorAll('.page').forEach(function(el) { el.classList.remove('active'); });
  if (t) t.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(function(n) { n.classList.remove('active'); });
  document.querySelectorAll('.nav-link[data-p="' + p + '"]').forEach(function(n) { n.classList.add('active'); });
  document.querySelectorAll('.nav-group-btn').forEach(function(n) { n.classList.remove('active'); });

  var gb = document.getElementById('ngb-' + p);
  if (gb) gb.classList.add('active');

  var accordionPages = ['transport','community','mypage','refund'];
  if (accordionPages.indexOf(p) === -1) {
    accordionPages.forEach(function(k) {
      var s = document.getElementById('ns-' + k);
      var a = document.getElementById('na-' + k);
      if (s) s.classList.remove('open');
      if (a) a.style.transform = '';
    });
  } else {
    accordionPages.forEach(function(k) {
      if (k !== p) {
        var s = document.getElementById('ns-' + k);
        var a = document.getElementById('na-' + k);
        if (s) s.classList.remove('open');
        if (a) a.style.transform = '';
      }
    });
    var sub = document.getElementById('ns-' + p);
    var arr = document.getElementById('na-' + p);
    if (sub) sub.classList.add('open');
    if (arr) arr.style.transform = 'rotate(90deg)';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if(p === 'community' && typeof switchCommunityTab === 'function') switchCommunityTab('notice');
  if(p === 'transport') {
    if (typeof switchTransTab === 'function') switchTransTab('forwarder');
    if (typeof renderTransFwdList === 'function') renderTransFwdList();
  }
  if (p === 'dash' && typeof initExportRankChart === 'function') initExportRankChart();
}

function ctxPath() {
  var meta = document.querySelector('meta[name="ctx-path"]');
  return meta ? meta.getAttribute('content') : '';
}

function toggleNav(key) {
  var sub = document.getElementById('ns-' + key);
  var arr = document.getElementById('na-' + key);
  if (!sub) {
    go(key);
    return;
  }
  var isOpen = sub.classList.contains('open');
  ['transport','community','mypage','refund'].forEach(function(k) {
    var s = document.getElementById('ns-' + k);
    var a = document.getElementById('na-' + k);
    var gb = document.getElementById('ngb-' + k);
    if (s) s.classList.remove('open');
    if (a) a.style.transform = '';
    if (gb) gb.classList.remove('active');
  });
  if (!isOpen) {
    sub.classList.add('open');
    if (arr) arr.style.transform = 'rotate(90deg)';
    var gb = document.getElementById('ngb-' + key);
    if (gb) gb.classList.add('active');
  }
}

function goSub(page, tab) {
  var subRoutes = {
    transport: {
      'forwarder': ctxPath() + '/owner/transport/forwarder',
      'export-trans': ctxPath() + '/owner/transport/export',
      'import-trans': ctxPath() + '/owner/transport/import',
      'freight': ctxPath() + '/owner/transport/freight'
    },
    mypage: {
      'info': ctxPath() + '/owner/mypage/info',
      'notify': ctxPath() + '/owner/mypage/notify',
      'activity': ctxPath() + '/owner/mypage/activity'
    },
    community: {
      'notice': ctxPath() + '/owner/community/notice/list.do',
      'archive': ctxPath() + '/owner/community/archive/list.do',
      'support': ctxPath() + '/owner/community/support/list.do'
    },
    refund: {
      'duty': ctxPath() + '/owner/customs/duty'
    }
  };

  var currentPage = document.getElementById('pg-' + page);
  if (!currentPage && subRoutes[page] && subRoutes[page][tab]) {
    location.href = subRoutes[page][tab];
    return;
  }

  go(page);
  if (page === 'transport' && typeof switchTransTab === 'function') switchTransTab(tab);
  if (page === 'mypage' && typeof switchMypageTab === 'function') switchMypageTab(tab);
  if (page === 'community' && typeof switchCommunityTab === 'function') switchCommunityTab(tab);
  if (page === 'refund' && typeof switchRefundTab === 'function') switchRefundTab(tab);

  document.querySelectorAll('.nav-sub-link').forEach(function(b) { b.classList.remove('active'); });
  var subLinks = document.querySelectorAll('#ns-' + page + ' .nav-sub-link');
  var tabMap = {
    transport: ['forwarder','export-trans','import-trans','freight'],
    mypage: ['info','notify','activity'],
    community: ['notice','archive','support'],
    refund: ['duty']
  };
  var idx = (tabMap[page] || []).indexOf(tab);
  if (idx >= 0 && subLinks[idx]) subLinks[idx].classList.add('active');
}
