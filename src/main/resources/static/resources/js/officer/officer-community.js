(function () {
  function contextPath() {
    if (window.contextPath) return window.contextPath;
    var meta = document.querySelector('meta[name="ctx-path"]');
    return meta && meta.content ? meta.content : '';
  }

  function normalizeTab(tab) {
    if (tab === 'archive') return 'download';
    if (tab === 'support') return 'cs';
    if (tab === 'download' || tab === 'cs' || tab === 'notice') return tab;
    return 'notice';
  }

  function tabUrl(tab) {
    tab = normalizeTab(tab);
    if (tab === 'download') return contextPath() + '/officer/community/download.do';
    if (tab === 'cs') return contextPath() + '/officer/community/cs.do';
    return contextPath() + '/officer/community/notice.do';
  }

  function showPanel(tab) {
    var panels = {
      notice: document.getElementById('cm-notice-admin'),
      download: document.getElementById('cm-download-admin'),
      cs: document.getElementById('cm-cs-admin')
    };

    Object.keys(panels).forEach(function (key) {
      if (panels[key]) panels[key].style.display = key === tab ? 'block' : 'none';
    });

    document.querySelectorAll('[data-officer-community-tab]').forEach(function (el) {
      el.classList.toggle('active', normalizeTab(el.getAttribute('data-officer-community-tab')) === tab);
    });

    if (tab === 'notice' && typeof window.initCommonNotice === 'function') {
      window.initCommonNotice();
    }
    if (tab === 'download' && window.TacsResourceArchive) {
      window.TacsResourceArchive.bind();
      window.TacsResourceArchive.load();
    }
    if (tab === 'cs' && typeof window.initCommonFaq === 'function') {
      window.initCommonFaq();
    }
  }

  window.switchOfficerCommunityTab = function (tab) {
    tab = normalizeTab(tab);
    if (document.getElementById('page-community')) {
      showPanel(tab);
      if (window.history && history.pushState) {
        history.pushState({ officerCommunityTab: tab }, '', tabUrl(tab));
      }
      return false;
    }
    window.location.href = tabUrl(tab);
    return false;
  };

  window.__goOfficerCommunity = window.switchOfficerCommunityTab;
  window.showAdminCommunityTab = window.switchOfficerCommunityTab;

  document.addEventListener('DOMContentLoaded', function () {
    var initialTab = normalizeTab(window.officerCommunityInitialTab);
    showPanel(initialTab);
  });

  window.addEventListener('popstate', function () {
    var path = window.location.pathname || '';
    var tab = 'notice';
    if (path.indexOf('/download') !== -1 || path.indexOf('/archive') !== -1) tab = 'download';
    if (path.indexOf('/cs') !== -1 || path.indexOf('/support') !== -1) tab = 'cs';
    showPanel(tab);
  });
})();
