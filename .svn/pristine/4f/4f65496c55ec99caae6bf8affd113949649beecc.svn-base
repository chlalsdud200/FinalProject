(function () {
  function contextPath() {
    return window.contextPath || '';
  }

  function switchBrokerCommunityTab(tab) {
    var routes = {
      notice: '/broker/community/notice.do',
      download: '/broker/community/download.do',
      cs: '/broker/community/cs.do'
    };

    // 탭 섹션 전환
    ['notice', 'download', 'cs'].forEach(function (name) {
      var targetId = name === 'download' ? 'cm-download' : (name === 'cs' ? 'cm-cs' : 'cm-notice');
      var panel = document.getElementById(targetId);
      if (panel) panel.style.display = name === tab ? 'block' : 'none';
    });

    // 우측 상단 탭 활성화 상태 업데이트
    document.querySelectorAll('#tabs-cm .prog-tab').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.communityTab === tab);
    });

    // 좌측 사이드바 활성화 상태 동기화
    document.querySelectorAll('.nav-sub[data-community-tab]').forEach(function (link) {
      link.classList.toggle('active', link.dataset.communityTab === tab);
    });

    // URL 업데이트 (비동기 전환 느낌을 주기 위해)
    if (window.history && window.history.replaceState && routes[tab]) {
      window.history.replaceState(null, '', contextPath() + routes[tab]);
    }

    // 데이터 로드
    if (tab === 'notice' && typeof window.initCommonNotice === 'function') {
      window.initCommonNotice();
    } else if (tab === 'download' && window.TacsResourceArchive) {
      window.TacsResourceArchive.load();
    } else if (tab === 'cs' && typeof window.initCommonFaq === 'function') {
      window.initCommonFaq();
    }
  }

  function toggleFaq(el) {
    var answer = el ? el.nextElementSibling : null;
    var icon = el ? el.querySelector('.material-symbols-outlined') : null;
    if (!answer) return;

    var open = answer.classList.toggle('open');
    if (icon) icon.textContent = open ? 'expand_less' : 'expand_more';
  }

  function filterFile() {
    if (window.TacsResourceArchive) window.TacsResourceArchive.load();
  }

  window.switchBrokerCommunityTab = switchBrokerCommunityTab;
  window.toggleFaq = toggleFaq;
  window.filterFile = filterFile;

  document.addEventListener('DOMContentLoaded', function () {
    var active = document.querySelector('#tabs-cm .prog-tab.active');
    var activeTab = active ? active.dataset.communityTab : 'notice';
    switchBrokerCommunityTab(activeTab);
  });
})();
