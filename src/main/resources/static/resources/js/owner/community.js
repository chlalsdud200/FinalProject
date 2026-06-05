/* ── 커뮤니티 탭 및 기능 고도화 ── */
var communityNotices = [
  {idx:0, badge:'긴급', badgeCls:'badge-urgent', title:'[긴급] 2026년 4월 관세율표 개정 안내', date:'2026-04-15', datetime:'2026-04-15 09:00', views:342, body:'<p>기획재정부 고시에 따라 2026년 4월 15일부터 일부 HS코드의 관세율이 변경됩니다.</p>'},
  {idx:1, badge:'업데이트', badgeCls:'badge-new', title:'수입통관 서류 제출 양식 업데이트 안내', date:'2026-03-20', datetime:'2026-03-20 10:30', views:156, body:'<p>2026년 3월 20일부터 수입통관 서류 제출 양식이 업데이트되었습니다.</p>'}
];


var faqData = [
  {cat:'system', q:'TACS 시스템 접속이 안 됩니다.', a:'인터넷 연결 상태를 확인해 주세요. Chrome 브라우저 사용을 권장합니다.'},
  {cat:'declare', q:'수입신고서 임시저장은 어디서 확인하나요?', a:'좌측 메뉴의 [문서함]에서 확인하실 수 있습니다.'}
];


function switchCommunityTab(tab, btn) {
  var tabs = ['notice', 'archive', 'support'];
  tabs.forEach(function(t) {
    var el = document.getElementById('comm-' + t);
    if(el) el.style.display = (t === tab) ? 'block' : 'none';
  });
  
  var subTabs = document.querySelectorAll('#pg-community .prog-tab');
  subTabs.forEach(function(b, i) {
    b.classList.toggle('active', tabs[i] === tab);
  });
  syncCommunityNav(tab);
  replaceCommunityUrl(tab);

  if (tab === 'notice') renderNoticeList();
  if (tab === 'archive' && window.TacsResourceArchive) window.TacsResourceArchive.load();
  if (tab === 'support') renderFaqList();
}

function syncCommunityNav(tab) {
  document.querySelectorAll('#ns-community .nav-sub-link').forEach(function(link) {
    link.classList.toggle('active', link.dataset.communityTab === tab);
  });

  var group = document.getElementById('ngb-community');
  var sub = document.getElementById('ns-community');
  var arrow = document.getElementById('na-community');
  if (group) group.classList.add('active');
  if (sub) sub.classList.add('open');
  if (arrow) arrow.style.transform = 'rotate(90deg)';
}

function replaceCommunityUrl(tab) {
  if (!window.history || !window.history.replaceState) return;
  var routes = {
    notice: '/owner/community/notice/list.do',
    archive: '/owner/community/archive/list.do',
    support: '/owner/community/support/list.do'
  };
  if (!routes[tab]) return;
  var contextPath = (typeof ctxPath === 'function') ? ctxPath() : '';
  window.history.replaceState(null, '', contextPath + routes[tab]);
}

function renderNoticeList() {
  var tbody = document.getElementById('notice-table-body');
  if(!tbody) return;
  var type = (document.getElementById('notice-type-filter') || {}).value || 'all';
  var kw = ((document.getElementById('notice-search') || {}).value || '').toLowerCase().trim();
  var from = ((document.getElementById('notice-date-from') || {}).value || '');
  var to = ((document.getElementById('notice-date-to') || {}).value || '');
  var list = communityNotices.filter(function(d){
    var typeOk = (type === 'all' || d.badge === type || (type === 'URGENT' && d.badge === '긴급') || (type === 'UPDATE' && d.badge === '업데이트') || (type === 'NOTICE' && d.badge === '공지'));
    var kwOk = !kw || d.title.toLowerCase().includes(kw);
    var fromOk = !from || d.date >= from;
    var toOk = !to || d.date <= to;
    return typeOk && kwOk && fromOk && toOk;
  });
  tbody.innerHTML = list.map(function(d, i){
    return '<tr><td>'+(i+1)+'</td><td><span class="badge '+d.badgeCls+'">'+d.badge+'</span> <span style="font-weight:700;cursor:pointer" onclick="openNoticeDetail('+d.idx+')">'+d.title+'</span></td><td class="td-muted">'+d.datetime+'</td><td>'+d.views+'</td></tr>';
  }).join('');
  if (!list.length) tbody.innerHTML = '<tr><td colspan="4" style="padding:32px;text-align:center;color:#94a3b8">검색 결과가 없습니다.</td></tr>';
}

function openNoticeDetail(idx) {
  var d = communityNotices[idx];
  document.getElementById('comm-notice').querySelector('.card-section').style.display = 'none';
  var detail = document.getElementById('notice-detail-view');
  detail.style.display = 'block';
  detail.innerHTML = '<div class="notice-detail"><button class="btn btn-outline" style="margin-bottom:16px" onclick="closeNoticeDetail()">목록으로</button>' +
    '<div class="nd-header"><div class="nd-title"><span class="badge '+d.badgeCls+'">'+d.badge+'</span> '+d.title+'</div>' +
    '<div class="nd-meta">등록일시: <span>'+d.datetime+'</span> · 조회수: <span>'+d.views+'</span></div></div>' +
    '<div class="nd-body">'+d.body+'</div></div>';
}

function closeNoticeDetail() {
  document.getElementById('notice-detail-view').style.display = 'none';
  document.getElementById('comm-notice').querySelector('.card-section').style.display = 'block';
}

function renderArchiveList() {
  // DB 자료실 전환으로 미사용. 공통 resourceArchive.js가 목록을 조회한다.
  if (window.TacsResourceArchive) window.TacsResourceArchive.load();
}

function openFileDetail(id) {
  // DB 자료실 전환으로 미사용.
}

function closeFileDetail() {
  // DB 자료실 전환으로 미사용.
}

function renderFaqList() {
  var container = document.getElementById('faq-container');
  if(!container) return;
  var kw = ((document.getElementById('faq-search') || {}).value || '').toLowerCase().trim();
  var active = document.querySelector('#comm-support .cs-category.active');
  var cat = active ? active.textContent.trim() : '전체';
  container.innerHTML = faqData.filter(function(d){
    var catOk = (cat === '전체') || (cat === '시스템 이용' && d.cat === 'system') || (cat === '통관/의뢰' && d.cat === 'declare');
    var kwOk = !kw || d.q.toLowerCase().includes(kw) || d.a.toLowerCase().includes(kw);
    return catOk && kwOk;
  }).map(function(d){
    return '<div class="faq-item" data-cat="'+d.cat+'"><div class="faq-q" onclick="toggleFaq(this)"><span>Q. '+d.q+'</span><span class="material-symbols-outlined">expand_more</span></div>' +
      '<div class="faq-a">A. '+d.a+'</div></div>';
  }).join('');
  if (!container.innerHTML) container.innerHTML = '<div style="padding:28px;text-align:center;color:#94a3b8;font-size:13px;">검색 결과가 없습니다.</div>';
}
function filterFaq(cat, btn) {
  document.querySelectorAll('#comm-support .cs-category').forEach(function(el){ el.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderFaqList();
}

function toggleFaq(el) {
  var a = el.nextElementSibling;
  var icon = el.querySelector('.material-symbols-outlined');
  var isOpen = a.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(function(x){ x.classList.remove('open'); });
  document.querySelectorAll('.faq-q .material-symbols-outlined').forEach(function(x){ x.textContent='expand_more'; });
  if(!isOpen) { a.classList.add('open'); icon.textContent='expand_less'; }
}



document.querySelectorAll('.nav-link[data-p]').forEach(function(btn) {
  btn.addEventListener('click', function() { go(btn.dataset.p); });
});

/* ══════════════════════════════════════
   도착통지서 (Arrival Notice)
══════════════════════════════════════ */
