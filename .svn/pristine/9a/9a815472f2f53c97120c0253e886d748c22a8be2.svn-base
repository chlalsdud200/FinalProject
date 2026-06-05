/**
 * sidebar.js
 * 행정공무원 사이드바 아코디언 전용
 */

(function () {
  if (window.__officerSidebarInitialized) return;
  window.__officerSidebarInitialized = true;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function closeOtherMenus(current) {
    document.querySelectorAll('.aside .nav-card').forEach(function (card) {
      if (card !== current) {
        card.classList.remove('open');
        card.classList.remove('active');
      }
    });
  }

  function initSidebar() {
    var aside = document.querySelector('.aside');
    if (!aside) return;

    // 현재 active 된 하위메뉴가 있으면 그 부모 메뉴는 처음부터 열어둠
    aside.querySelectorAll('.nav-card').forEach(function (card) {
      if (card.classList.contains('active') || card.querySelector('.active-sub')) {
        card.classList.add('open');
      }
    });

    aside.addEventListener('click', function (e) {
      var header = e.target.closest('.nav-group-header');
      if (!header || !aside.contains(header)) return;

      e.preventDefault();

      var current = header.closest('.nav-card');
      if (!current) return;

      var isOpen = current.classList.contains('open');

      // 다른 메뉴는 닫기
      closeOtherMenus(current);

      // 같은 메뉴 다시 클릭하면 닫힘
      if (isOpen) {
        current.classList.remove('open');
      } else {
        current.classList.add('open');
      }
    });

    // 하위 메뉴 클릭 시 부모 메뉴 유지
    aside.querySelectorAll('.nav-sub-link').forEach(function (link) {
      link.addEventListener('click', function () {
        var parent = link.closest('.nav-card');
        if (parent) {
          closeOtherMenus(parent);
          parent.classList.add('open');
        }
      });
    });
  }

  ready(initSidebar);
})();