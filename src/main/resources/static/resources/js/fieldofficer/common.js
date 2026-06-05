// =========================================================
// TACS 현장공무원 공통 스크립트
// - 페이지 이동
// - 공통 탭 전환
// - 상단 통합검색
// =========================================================

function getContextPath() {
  return (typeof contextPath !== 'undefined') ? contextPath : '';
}

function go(p) {
  var actualP = p;

  // 커뮤니티 하위 메뉴는 community 페이지로 이동
  if (p === 'notice' || p === 'center' || p === 'archive' || p === 'community') {
    actualP = 'community';
  }

  var pageUrlMap = {
    dash: '/fieldofficer/dashboard.do',
    receipt: '/fieldofficer/inspectionRequest.do',
    cert: '/fieldofficer/certs.do',
    docs: '/fieldofficer/docs.do',
    myDocs: '/fieldofficer/docs.do',
    trash: '/fieldofficer/docs/trash.do',
    community: '/fieldofficer/community.do',
    mypage: '/fieldofficer/mypage.do',
    search: '/fieldofficer/search.do',

    // 기존 버튼 호환용
    inspect: '/fieldofficer/inspectionRequest.do',
    result: '/fieldofficer/certs.do',
    risk: '/fieldofficer/inspectionRequest.do'
  };

  var url = pageUrlMap[actualP];

  if (!url) {
    return;
  }

  // 커뮤니티 하위 탭 이동 처리
  if (actualP === 'community') {
    if (p === 'center') {
      url += '?tab=center';
    } else if (p === 'archive') {
      url += '?tab=archive';
    } else {
      url += '?tab=notice';
    }
  }

  window.location.href = getContextPath() + url;
}

// ===== 사이드바 메뉴 클릭 =====
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav-link[data-p]').forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      if (event.defaultPrevented) return;
      event.preventDefault();
      go(btn.dataset.p);
    });
  });

  document.querySelectorAll('.nav-sub-link[data-p]').forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      if (event.defaultPrevented) return;
      event.preventDefault();
      go(btn.dataset.p);
    });
  });

  document.querySelectorAll('.nav-card.single[data-p]').forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      if (event.defaultPrevented) return;
      event.preventDefault();
      go(btn.dataset.p);
    });
  });
});

// ===== 공통 탭 전환 =====
function cTab(grp, tab, btn) {
  resetTabGroup(grp, tab, btn);
}

function resetTabGroup(grp, tab, btn) {
  var prefix = grp + '-';

  document.querySelectorAll('[id^="' + prefix + '"]').forEach(function (el) {
    if (el.closest('.sub-tabs')) return;
    el.style.display = 'none';
  });

  var target = document.getElementById(prefix + tab);
  if (target) {
    target.style.display = 'block';
  }

  var tabs = document.getElementById('tabs-' + grp);
  if (tabs) {
    tabs.querySelectorAll('.sub-tab').forEach(function (s) {
      s.classList.remove('active');
    });

    if (btn) {
      btn.classList.add('active');
    } else {
      var defaultBtn = tabs.querySelector('[onclick*="cTab(\'' + grp + '\',\'' + tab + '\'"]');
      if (defaultBtn) {
        defaultBtn.classList.add('active');
      }
    }
  }
}

// ===== 상단 통합검색 =====
function doSearch() {
  var searchInput = document.getElementById('gSearch');

  if (!searchInput) {
    return;
  }

  var keyword = searchInput.value.trim();

  if (!keyword) {
    alert('검색어를 입력하세요.');
    return;
  }

  window.location.href = getContextPath() + '/fieldofficer/search.do?keyword=' + encodeURIComponent(keyword);
}
