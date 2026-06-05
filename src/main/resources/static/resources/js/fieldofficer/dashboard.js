// =========================================================
// TACS 현장공무원 대시보드 전용 스크립트
// - 대시보드 전용 기능 관리
// =========================================================

document.addEventListener('DOMContentLoaded', function () {
  var dashboardPage = document.getElementById('pg-dash');

  if (!dashboardPage) {
    return;
  }

  // 현재 대시보드는 onclick="go(...)" 방식으로 이동만 처리함
  // 추후 DB 연동 시 신규 요청 수, 검역 판정 대기 수, 처리율 등을 여기서 갱신하면 됨
});