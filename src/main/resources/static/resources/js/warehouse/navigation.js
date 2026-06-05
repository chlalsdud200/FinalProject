// 네비게이션 및 탭 관련 함수들

function toggleNav(key) {
  var sub = document.getElementById('ns-' + key);
  var arr = document.getElementById('na-' + key);
  if (!sub || !arr) return;

  var isOpen = sub.classList.contains('open');

  ['community', 'mypage'].forEach(function(k) {
    if (k !== key) {
      var s = document.getElementById('ns-' + k);
      var a = document.getElementById('na-' + k);
      var gb = document.getElementById('ngb-' + k);

      if (s) s.classList.remove('open');
      if (a) a.style.transform = '';
      if (gb) gb.classList.remove('active');
    }
  });

  var gb = document.getElementById('ngb-' + key);

  if (!isOpen) {
    sub.classList.add('open');
    arr.style.transform = 'rotate(90deg)';
    if (gb) gb.classList.add('active');
  } else {
    sub.classList.remove('open');
    arr.style.transform = '';
    if (gb) gb.classList.remove('active');
  }
}

function switchInboundTab(tab, btn) {
  ['pending', 'done'].forEach(function(t) {
    var el = document.getElementById('inbound-' + t);
    if (el) el.style.display = (t === tab) ? '' : 'none';
  });

  document.querySelectorAll('#pg-inbound .prog-tab').forEach(function(b) {
    b.classList.remove('active');
  });

  if (btn) {
    var tabParent = btn.closest('.prog-tab-bar');
    if (tabParent) {
      tabParent.querySelectorAll('.prog-tab').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    }
  }
}

function replaceWarehouseInboundUrl(tab) {
  if (!window.history || !window.history.replaceState) return;

  var meta = document.querySelector('meta[name="ctx-path"]');
  var ctx = meta ? meta.getAttribute('content') : '';

  window.history.replaceState(
    null,
    '',
    ctx + '/warehouse/inbound.do?tab=' + encodeURIComponent(tab || 'pending')
  );
}

var originalSwitchInboundTab = switchInboundTab;
switchInboundTab = function(tab, btn) {
    originalSwitchInboundTab(tab, btn);
    replaceWarehouseInboundUrl(tab);
};

function switchOutboundTab(tab, btn) {
  // 현재 outbound.jsp의 실제 탭 값
  var tabs = ['docs', 'release'];
  var targetTab = tabs.includes(tab) ? tab : 'docs';

  tabs.forEach(function(t) {
    var el = document.getElementById('outbound-' + t);
    if (el) {
      el.classList.toggle('active', t === targetTab);
    }
  });

  document.querySelectorAll('[data-outbound-tab]').forEach(function(b) {
    b.classList.toggle('active', b.dataset.outboundTab === targetTab);
  });

  if (btn) {
    var tabParent = btn.closest('.prog-tab-bar');
    if (tabParent) {
      tabParent.querySelectorAll('.prog-tab').forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
    }
  }
}

function replaceWarehouseOutboundUrl(tab) {
  if (!window.history || !window.history.replaceState) return;

  var meta = document.querySelector('meta[name="ctx-path"]');
  var ctx = meta ? meta.getAttribute('content') : '';

  window.history.replaceState(
    null,
    '',
    ctx + '/warehouse/outbound.do?tab=' + encodeURIComponent(tab || 'docs')
  );
}

var originalSwitchOutboundTab = switchOutboundTab;
switchOutboundTab = function(tab, btn) {
    var targetTab = (tab === 'release') ? 'release' : 'docs';
    originalSwitchOutboundTab(targetTab, btn);
    replaceWarehouseOutboundUrl(targetTab);
};

function switchCustomsTab(tab, btn) {
  ['status', 'docs'].forEach(function(t) {
    var el = document.getElementById('customs-' + t);
    if (el) el.style.display = (t === tab) ? '' : 'none';
  });

  document.querySelectorAll('#pg-customs .prog-tab').forEach(function(b) {
    b.classList.remove('active');
  });

  if (btn) {
    var tabParent = btn.closest('.prog-tab-bar');
    if (tabParent) {
      tabParent.querySelectorAll('.prog-tab').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    }
  }
}

function replaceWarehouseCustomsUrl(tab) {
  if (!window.history || !window.history.replaceState) return;

  var meta = document.querySelector('meta[name="ctx-path"]');
  var ctx = meta ? meta.getAttribute('content') : '';

  window.history.replaceState(
    null,
    '',
    ctx + '/warehouse/customs.do?tab=' + encodeURIComponent(tab || 'status')
  );
}

var originalSwitchCustomsTab = switchCustomsTab;
switchCustomsTab = function(tab, btn) {
    originalSwitchCustomsTab(tab, btn);
    replaceWarehouseCustomsUrl(tab);
};

function switchCommunityTab(tab, btn) {
  var tabs = ['notice', 'archive', 'support'];
  var currentTab = '';
  
  // 현재 활성화된 탭 확인
  tabs.forEach(function(t) {
    var el = document.getElementById('comm-' + t);
    if (el && el.style.display === 'block') currentTab = t;
  });

  // 이미 해당 탭이 활성화되어 있고, 데이터가 로드된 상태라면 중복 렌더링 방지
  // (단, 버튼을 직접 클릭한 경우에는 사용자 의도로 보고 재조회 허용 가능하나, 
  // 사이드바 중복 클릭 등에서의 깜빡임을 막기 위해 동일 탭이면 리턴)
  if (currentTab === tab && !btn) return;

  tabs.forEach(function(t) {
    var el = document.getElementById('comm-' + t);
    if (el) el.style.display = (t === tab) ? 'block' : 'none';
  });

  var subTabs = document.querySelectorAll('.content .prog-tab-bar .prog-tab');
  if (subTabs.length > 0) {
    subTabs.forEach(function(b, i) {
      b.classList.toggle('active', tabs[i] === tab);
    });
  }

  if (btn) {
    var tabParent = btn.closest('.prog-tab-bar');
    if (tabParent) {
      tabParent.querySelectorAll('.prog-tab').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    }
  }

  syncWarehouseCommunityNav(tab);
  replaceWarehouseCommunityUrl(tab);

  // 공지사항 등 각 탭의 초기화 로직 (이미 데이터가 있는 경우 재요청 방지 로직 포함 권장)
  if (tab === 'notice' && typeof renderNoticeList === 'function') {
    var noticeRoot = document.getElementById('comm-notice');
    // notice.js가 scaffold를 이미 만들었다면 재초기화 방지 (필요 시)
    if (noticeRoot && noticeRoot.dataset.noticeUnified !== 'Y') {
        renderNoticeList();
    } else if (currentTab !== tab) {
        // 탭이 바뀐 경우에만 재조회
        renderNoticeList();
    }
  }
  
  if (tab === 'archive' && typeof renderArchiveList === 'function') {
    if (currentTab !== tab) renderArchiveList();
  }
  
  if (tab === 'support' && typeof renderFaqList === 'function') {
    if (currentTab !== tab) renderFaqList();
  }
}

function syncWarehouseCommunityNav(tab) {
  document.querySelectorAll('#ns-community .nav-sub-link').forEach(function(link) {
    link.classList.toggle('active', link.dataset.communityTab === tab);
  });

  var sub = document.getElementById('ns-community');
  var arrow = document.getElementById('na-community');
  var groupBtn = document.getElementById('ngb-community');

  if (sub) sub.classList.add('open');
  if (arrow) arrow.style.transform = 'rotate(90deg)';
  if (groupBtn) groupBtn.classList.add('active');
}

function replaceWarehouseCommunityUrl(tab) {
  if (!window.history || !window.history.replaceState) return;

  var meta = document.querySelector('meta[name="ctx-path"]');
  var ctx = meta ? meta.getAttribute('content') : '';
  
  var newUrl = ctx + '/warehouse/community.do?tab=' + encodeURIComponent(tab || 'notice');
  if (window.location.href.indexOf(newUrl) === -1) {
      window.history.replaceState(null, '', newUrl);
  }
}

function switchMypageTab(tab, btn) {
  if (window.TacsMyPage && typeof window.TacsMyPage.syncTab === 'function') {
    window.TacsMyPage.syncTab(tab === 'notify' ? 'alarm' : (tab || 'profile'));
  }

  var tabs = ['profile', 'alarm'];
  var currentTab = '';
  tabs.forEach(function(t) {
    var el = document.getElementById('mypage-' + t);
    if (el && el.style.display === 'block') currentTab = t;
  });
  
  if (currentTab === tab && !btn) return;

  tabs.forEach(function(t) {
    var el = document.getElementById('mypage-' + t);
    if (el) el.style.display = (t === tab) ? 'block' : 'none';
  });

  document.querySelectorAll('.content .prog-tab-bar .prog-tab').forEach(function(b, i) {
    b.classList.toggle('active', tabs[i] === tab);
  });

  if (btn) {
    var tabParent = btn.closest('.prog-tab-bar');
    if (tabParent) {
      tabParent.querySelectorAll('.prog-tab').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    }
  }

  document.querySelectorAll('#ns-mypage .nav-sub-link').forEach(function(link) {
    var href = link.getAttribute('href') || '';
    var isNotify = href.indexOf('tab=alarm') !== -1 || href.indexOf('tab=notify') !== -1;

    if (tab === 'alarm' || tab === 'notify') {
      link.classList.toggle('active', isNotify);
    } else {
      link.classList.toggle('active', !isNotify);
    }
  });

  var sub = document.getElementById('ns-mypage');
  var arrow = document.getElementById('na-mypage');
  var groupBtn = document.getElementById('ngb-mypage');

  if (sub) sub.classList.add('open');
  if (arrow) arrow.style.transform = 'rotate(90deg)';
  if (groupBtn) groupBtn.classList.add('active');
  
  replaceWarehouseMypageUrl(tab);
}

function replaceWarehouseMypageUrl(tab) {
  if (!window.history || !window.history.replaceState) return;

  var meta = document.querySelector('meta[name="ctx-path"]');
  var ctx = meta ? meta.getAttribute('content') : '';

  var newUrl = ctx + '/warehouse/mypage.do?tab=' + encodeURIComponent((tab === 'notify' ? 'alarm' : (tab || 'profile')));
  if (window.location.href.indexOf(newUrl) === -1) {
      window.history.replaceState(null, '', newUrl);
  }
}

// 오버라이드 제거 (함수 내부에서 호출하도록 변경)
// var originalSwitchMypageTab = switchMypageTab;
// switchMypageTab = function(tab, btn) {
//     originalSwitchMypageTab(tab, btn);
//     replaceWarehouseMypageUrl(tab);
// };

function syncWarehouseMypageTab(tab) {
  var normalizedTab = tab === 'notify' ? 'alarm' : (tab || 'profile');

  if (window.TacsMyPage && typeof window.TacsMyPage.syncTab === 'function') {
    window.TacsMyPage.syncTab(normalizedTab);
    return;
  }

  if (typeof switchMypageTab === 'function') {
    switchMypageTab(normalizedTab);
  }
}

function goSub(page, tab) {
  var url = '';
  var meta = document.querySelector('meta[name="ctx-path"]');
  var ctx = meta ? meta.getAttribute('content') : '';

  if (page === 'community') {
    url = ctx + '/warehouse/community.do?tab=' + (tab || 'notice');
  } else if (page === 'mypage') {
    url = ctx + '/warehouse/mypage.do?tab=' + (tab === 'notify' ? 'alarm' : (tab || 'profile'));
  } else if (page === 'inbound') {
    url = ctx + '/warehouse/inbound.do?tab=' + (tab || 'pending');
	} else if (page === 'outbound') {
	  url = ctx + '/warehouse/outbound.do?tab=' + (tab || 'docs');
	}
  
  if (url) {
    loadPage(url);
  }
}

async function loadPage(url) {
  // 이미 진행 중인 요청이 있으면 취소하거나 무시하는 로직 (선택사항)
  
  var currentUrl = new URL(window.location.href);
  var targetUrl = new URL(url, window.location.origin);
  
  // URL이 완전히 동일한 경우 (쿼리 포함) 중복 동작 방지
  if (currentUrl.href === targetUrl.href) {
      if (targetUrl.pathname.indexOf('/warehouse/docs') !== -1) {
        if (typeof docsInit === 'function' && !document.getElementById('docs-container')) docsInit();
        else if (typeof docsGoRoot === 'function') docsGoRoot();
        updateSidebarActive(url);
      }
      return;
  }

  if (currentUrl.pathname === targetUrl.pathname) {
    // 탭만 변경되는 경우
    var tabParam = targetUrl.searchParams.get('tab');
    if (url.indexOf('community') !== -1) {
      if (typeof switchCommunityTab === 'function') switchCommunityTab(tabParam || 'notice');
      updateSidebarActive(url);
      return;
    } else if (url.indexOf('mypage') !== -1) {
      syncWarehouseMypageTab(tabParam || 'profile');
      updateSidebarActive(url);
      return;
    } else if (url.indexOf('inbound') !== -1) {
      if (typeof switchInboundTab === 'function') switchInboundTab(tabParam || 'pending');
      updateSidebarActive(url);
      return;
	  } else if (url.indexOf('outbound') !== -1) {
	    if (typeof switchOutboundTab === 'function') switchOutboundTab(tabParam || 'docs');
	    updateSidebarActive(url);
	    return;
    } else if (url.indexOf('customs') !== -1) {
      if (typeof switchCustomsTab === 'function') switchCustomsTab(tabParam || 'status');
      updateSidebarActive(url);
      return;
    }
  }

  var contentArea = document.querySelector('.content');
  if (!contentArea) return;

  // 로딩 상태 표시
  contentArea.style.opacity = '0.6';
  contentArea.style.transition = 'opacity 0.2s';

  try {
    var response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.status);
    }

    var html = await response.text();
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');

	// 스타일 시트 중복 로드 방지 및 신규 로드
	// AJAX로 페이지를 갈아끼울 때, CSS가 완전히 로드되기 전에 content를 넣으면
	// 테이블 정렬이나 폰트/간격이 잠깐 깨져 보일 수 있다.
	// 그래서 새 CSS가 있으면 load 완료를 기다린 뒤 content를 교체한다.
	var newStyles = doc.querySelectorAll('link[rel="stylesheet"]');
	var styleLoadPromises = [];
	
	/*
	 * 페이지별 CSS 누적 제거
	 *
	 * AJAX로 페이지를 이동하면 이전 화면의 CSS가 head에 계속 남아
	 * .data-table, .badge 같은 공통 클래스가 서로 덮어써질 수 있다.
	 *
	 * base.css, sidebar.css, topbar.css 같은 공통 CSS는 유지하고,
	 * dashboard.css, inbound.css, inventory.css, outbound.css 같은
	 * warehouse 페이지 전용 CSS만 새 페이지 로드 전에 제거한다.
	 */
	document.querySelectorAll('link[rel="stylesheet"]').forEach(function(link) {
	  var href = link.getAttribute('href') || '';

	  var isWarehouseCss = href.indexOf('/resources/css/warehouse/') !== -1;

	  var isCommonCss =
	    href.indexOf('/base.css') !== -1 ||
	    href.indexOf('/sidebar.css') !== -1 ||
	    href.indexOf('/topbar.css') !== -1;

	  if (isWarehouseCss && !isCommonCss) {
	    link.remove();
	  }
	});

	newStyles.forEach(function(style) {
	  var href = style.getAttribute('href');
	  if (!href) return;

	  // 상대경로/절대경로 차이 때문에 중복 체크가 실패할 수 있어서
	  // a 태그를 이용해 최종 URL 기준으로 비교한다.
	  var a = document.createElement('a');
	  a.href = href;
	  var normalizedHref = a.href;

	  var exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
	    .some(function(link) {
	      return link.href === normalizedHref;
	    });

	  if (!exists) {
	    var link = document.createElement('link');
	    link.rel = 'stylesheet';
	    link.href = normalizedHref;

	    var loadPromise = new Promise(function(resolve) {
	      link.onload = resolve;

	      // CSS 로드 실패해도 화면이 멈추면 안 되므로 resolve 처리
	      link.onerror = resolve;
	    });

	    styleLoadPromises.push(loadPromise);
	    document.head.appendChild(link);
	  }
	});

	// 새로 추가한 CSS가 있다면 로딩 완료까지 기다린다.
	if (styleLoadPromises.length > 0) {
	  await Promise.all(styleLoadPromises);
	}

    var newContent = doc.querySelector('.content');

    if (!newContent) {
      console.warn('.content 없음:', url);
      contentArea.innerHTML =
        '<div style="padding:30px;">페이지 구조 오류입니다. 해당 JSP 안에 <b>.content</b> 영역이 없습니다.</div>';
      return;
    }

    contentArea.innerHTML = newContent.innerHTML;

    // 스크립트 실행
    var pageScripts = doc.querySelectorAll('script[src]');
    for (var i = 0; i < pageScripts.length; i++) {
      var src = pageScripts[i].getAttribute('src');
      if (!src) continue;

      if (
        src.indexOf('/common.js') !== -1 ||
        src.indexOf('/navigation.js') !== -1
      ) {
        continue;
      }

      var oldScript = document.querySelector('script[src="' + src + '"]');
      if (oldScript) {
        oldScript.remove();
      }

      await new Promise(function(resolve, reject) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });
    }

    var inlineScripts = doc.querySelectorAll('script:not([src])');
    inlineScripts.forEach(function(oldScript) {
      var code = oldScript.textContent;
      if (!code || !code.trim()) return;

      var newScript = document.createElement('script');
      newScript.textContent = code;
      document.body.appendChild(newScript);
      document.body.removeChild(newScript);
    });

    // 페이지 로드 후 탭 상태 초기화
    var tabParam = targetUrl.searchParams.get('tab');

    if (url.indexOf('community') !== -1) {
      if (typeof switchCommunityTab === 'function') switchCommunityTab(tabParam || 'notice');
    } else if (url.indexOf('mypage') !== -1) {
      syncWarehouseMypageTab(tabParam || 'profile');
    } else if (url.indexOf('inbound') !== -1) {
      if (typeof switchInboundTab === 'function') switchInboundTab(tabParam || 'pending');
	  } else if (url.indexOf('outbound') !== -1) {
	    if (typeof switchOutboundTab === 'function') switchOutboundTab(tabParam || 'docs');

	    if (typeof window.initOutboundPage === 'function') {
	      window.initOutboundPage();
	    }
	  } else if (url.indexOf('customs') !== -1) {
      if (typeof switchCustomsTab === 'function') switchCustomsTab(tabParam || 'status');
    }

    updateSidebarActive(url);

    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', url);
    }

  } catch (error) {
    console.error('Fetch error:', error);
    contentArea.innerHTML =
      '<div style="padding:30px;">페이지를 불러오지 못했습니다.</div>';
  } finally {
    contentArea.style.opacity = '1';
  }
}

function updateSidebarActive(url) {
  var targetUrl = new URL(url, window.location.origin);
  var targetPath = targetUrl.pathname;
  var targetTab = targetUrl.searchParams.get('tab') || '';

  document.querySelectorAll('.nav-link, .nav-sub-link').forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href || href.indexOf('javascript') !== -1) return;

    var linkUrl = new URL(href, window.location.origin);
    var linkPath = linkUrl.pathname;
    var linkTab = linkUrl.searchParams.get('tab') || '';

    var isActive = false;

    if (targetPath === linkPath) {
      if (targetPath.indexOf('/warehouse/mypage') !== -1) {
        isActive = (targetTab || 'profile') === (linkTab || 'profile');
      } else if (targetPath.indexOf('/warehouse/community') !== -1) {
        isActive = (targetTab || 'notice') === (linkTab || 'notice');
      } else {
        isActive = true;
      }
    }

    link.classList.toggle('active', isActive);

    if (isActive && link.classList.contains('nav-sub-link')) {
      var parentSub = link.closest('.nav-sub');

      if (parentSub) {
        parentSub.classList.add('open');

        var key = parentSub.id.replace('ns-', '');
        var arrow = document.getElementById('na-' + key);
        var groupBtn = document.getElementById('ngb-' + key);

        if (arrow) arrow.style.transform = 'rotate(90deg)';
        if (groupBtn) groupBtn.classList.add('active');
      }
    }
  });
}

window.addEventListener('popstate', function() {
  loadPage(location.href);
});
