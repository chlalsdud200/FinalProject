/* ===== 공통 JS (TACS 시스템) =====
 * - 모든 페이지에서 공통으로 사용되는 함수
 * - showModal, hideModal, toggleAcc, cTab, 페이지네이션
 * - window.contextPath 는 각 페이지 jsp에서 미리 주입됨
 */

/* ===== 모달 표시/숨김 ===== */
window.showModal = function (id) {
  var m = document.getElementById('modal-' + id);
  if (m) m.classList.add('show');
};
window.hideModal = function (id) {
  var m = document.getElementById('modal-' + id);
  if (m) m.classList.remove('show');
};

/* ===== 사이드바 아코디언 토글 ===== */
function toggleAcc(btn) {
  var wrap = btn.parentElement;
  var openNow = wrap.classList.contains('open');
  // 다른 아코디언은 닫기 (단일 펼침). 동시에 펼치고 싶으면 이 줄 삭제
  document.querySelectorAll('.nav-acc-wrap.open').forEach(function (w) { w.classList.remove('open'); });
  if (!openNow) wrap.classList.add('open');
}

/* ===== 페이지 내부 서브탭 전환 (selector-bar / sub-tabs) ===== */
function cTab(grp, tab) {
  var prefix = grp + '-';
  document.querySelectorAll('[id^="' + prefix + '"]').forEach(function (el) {
    if (el.closest('.sub-tabs') || el.closest('.selector-bar')) return;
    el.style.display = 'none';
  });
  var t = document.getElementById(prefix + tab);
  if (t) t.style.display = 'block';
  var cont = document.getElementById('tabs-' + grp);
  if (cont) cont.querySelectorAll('.sub-tab').forEach(function (s) { s.classList.remove('active'); });
  if (event && event.target) event.target.classList.add('active');
}

/* ===== 마이페이지 이동 ===== */
function openProfileWithPwd() {
  var ctx = window.contextPath || '';
  location.href = ctx + '/broker/mypage.do?tab=profile';
}

/* ===== 페이지네이션 클릭 처리 (시각용 mock) ===== */
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.pagination .page-btn');
  if (!btn || btn.disabled || btn.classList.contains('active')) return;

  // 숫자 버튼만 active 토글
  var label = (btn.textContent || '').trim();
  if (/^\d+$/.test(label)) {
    var pagination = btn.parentElement;
    pagination.querySelectorAll('.page-btn.active').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
  }
  // « ‹ › » 는 시각적 효과만 (실제 데이터 없으니 동작 생략)
});
