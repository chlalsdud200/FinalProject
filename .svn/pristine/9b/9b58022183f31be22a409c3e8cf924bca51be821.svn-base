// =========================================================
// TACS 현장공무원 통합검색 전용 스크립트
// - 통합검색 페이지 초기화
// - URL keyword 파라미터 처리
// =========================================================

document.addEventListener('DOMContentLoaded', function () {
  var searchPage = document.getElementById('pg-search');

  if (!searchPage) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var keyword = params.get('keyword');

  if (keyword) {
    var searchInput = document.getElementById('searchKeyword');

    if (searchInput) {
      searchInput.value = keyword;
    }

    var summaryKeyword = document.getElementById('searchSummaryKeyword');

    if (summaryKeyword) {
      summaryKeyword.textContent = keyword;
    }
  }
});