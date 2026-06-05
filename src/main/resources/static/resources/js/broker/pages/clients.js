/* ===== 화주 관리 전용 JS =====
 * 서버 조회 방식으로 변경:
 * - 조회 버튼은 form submit
 * - 초기화는 /broker/clients.do 이동
 * - 상세 버튼은 /broker/clients/detail.do 이동
 * 기존 클라이언트 필터 함수명은 다른 페이지 호출 대비 유지
 */

function filterClientsTable() {
  var form = document.getElementById('clientsSearchForm');
  if (form) form.submit();
}

function resetClientsFilter() {
  var ctx = window.contextPath || '';
  location.href = ctx + '/broker/clients.do';
}

document.addEventListener('DOMContentLoaded', function () {
  ['f-no', 'f-client', 'f-item'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        filterClientsTable();
      }
    });
  });
});
