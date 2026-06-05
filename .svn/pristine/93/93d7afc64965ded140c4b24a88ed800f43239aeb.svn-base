// Community 페이지 스크립트




var faqData = [
  {cat:'system', q:'TACS 시스템 접속이 안 됩니다.', a:'인터넷 연결 상태를 확인해 주세요. Chrome 브라우저 사용을 권장합니다.'},
  {cat:'declare', q:'수입신고서 임시저장은 어디서 확인하나요?', a:'좌측 메뉴의 [문서함]에서 확인하실 수 있습니다.'}
];








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


document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const currentTab = params.get('tab') || 'notice';

    // loadPage에서 이미 처리되었을 수 있으므로 중복 실행 방지
    // (네비게이션 로딩 시 깜빡임 문제 해결)
    if (!window._communityInitialLoaded) {
        if (typeof switchCommunityTab === 'function') {
            setTimeout(function() { switchCommunityTab(currentTab); }, 10);
        } else if (currentTab === 'archive') {
            setTimeout(renderArchiveList, 10);
        } else {
            setTimeout(renderNoticeList, 10);
        }
        window._communityInitialLoaded = true;
    }
});

// 추가로: 탭 버튼을 클릭할 때도 렌더링 함수를 호출하도록 버튼에 연결되어 있어야 합니다!
