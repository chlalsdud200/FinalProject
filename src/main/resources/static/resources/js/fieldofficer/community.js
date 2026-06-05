// =========================================================
// TACS 현장공무원 커뮤니티 전용 스크립트
// - 커뮤니티 탭 초기화
// - FAQ 토글/필터
// - 공지사항 상세
// - 고객센터 FAQ
// - 자료실 상세
// =========================================================


// =========================================================
// 1. FAQ 토글 / 필터
// =========================================================

function switchFieldCommunityTab(tab, btn) {
  var tabMap = {
    notice: 'notice',
    center: 'cs',
    archive: 'download'
  };
  var panelTab = tabMap[tab] || 'notice';

  if (typeof resetTabGroup === 'function') {
    resetTabGroup('cm', panelTab, btn);
  }

  document.querySelectorAll('#tabs-cm .sub-tab').forEach(function (el) {
    el.classList.toggle('active', el.dataset.communityTab === tab);
  });
  document.querySelectorAll('#community-menu .nav-sub-link').forEach(function (el) {
    el.classList.toggle('active-sub', el.dataset.communityTab === tab);
  });

  var routes = {
    notice: '/fieldofficer/community.do?tab=notice',
    center: '/fieldofficer/community.do?tab=center',
    archive: '/fieldofficer/community.do?tab=archive'
  };
  if (window.history && window.history.replaceState && routes[tab]) {
    window.history.replaceState(null, '', getContextPath() + routes[tab]);
  }

  if (panelTab === 'download' && window.TacsResourceArchive) {
    window.TacsResourceArchive.load();
  } else if (panelTab === 'cs' && typeof window.initCommonFaq === 'function') {
    window.initCommonFaq();
  }
}

function toggleFaq(el) {
  var answer = el.nextElementSibling;
  var icon = el.querySelector('.material-symbols-outlined');

  if (!answer) {
    return;
  }

  if (answer.classList.contains('open')) {
    answer.classList.remove('open');

    if (icon) {
      icon.textContent = 'expand_more';
    }
  } else {
    document.querySelectorAll('.faq-a.open').forEach(function (a) {
      a.classList.remove('open');

      var prevIcon = a.previousElementSibling.querySelector('.material-symbols-outlined');

      if (prevIcon) {
        prevIcon.textContent = 'expand_more';
      }
    });

    answer.classList.add('open');

    if (icon) {
      icon.textContent = 'expand_less';
    }
  }
}

function filterFaq(cat, btn) {
  document.querySelectorAll('#cm-cs .cs-category').forEach(function (b) {
    b.classList.remove('active');
  });

  if (btn) {
    btn.classList.add('active');
  }

  document.querySelectorAll('.faq-item').forEach(function (item) {
    if (cat === 'all' || item.dataset.cat === cat) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function filterFile(cat, btn) {
  // DB 자료실 전환으로 미사용. 공통 resourceArchive.js가 필터와 목록을 처리한다.
  if (window.TacsResourceArchive) window.TacsResourceArchive.load();
}


// =========================================================
// 2. 공지사항 상세 데이터
// =========================================================

var noticeData = [
  {
    idx: 0,
    badge: '공지',
    badgeCls: 'badge-new',
    title: '2026년도 관세 환급 일정 변경 안내',
    author: '관리자',
    date: '2026-03-01',
    views: 621,
    category: '공지',
    body: ''
      + '<p>2026년도 관세 환급 처리 일정이 아래와 같이 변경되었습니다.</p>'
      + '<h4>변경사항</h4>'
      + '<ul>'
      + '<li>환급 신청 마감: 매월 20일 → <strong>매월 25일</strong>로 변경</li>'
      + '<li>환급금 지급: 마감일 후 10영업일 → <strong>7영업일</strong>로 단축</li>'
      + '<li>온라인 환급 신청 시 서류 우편제출 면제</li>'
      + '</ul>'
      + '<p>변경된 일정은 2026년 3월 신청분부터 적용됩니다.</p>',
    attachments: [
      { name: '2026_환급일정표.pdf', size: '1.2MB' }
    ]
  },
  {
    idx: 1,
    badge: '업데이트',
    badgeCls: 'badge-ok',
    title: 'TACS 모바일 앱 v3.0 출시 안내',
    author: '기술팀',
    date: '2026-03-15',
    views: 534,
    category: '업데이트',
    body: ''
      + '<p>TACS 모바일 앱 v3.0이 출시되었습니다.</p>'
      + '<h4>주요 업데이트</h4>'
      + '<ul>'
      + '<li>대시보드 UI 전면 개편</li>'
      + '<li>푸시 알림 세분화 설정 기능</li>'
      + '<li>모바일 전용 간편 신고서 작성 기능</li>'
      + '<li>생체 인증 로그인 지원</li>'
      + '</ul>',
    attachments: [
      { name: 'TACS_v3.0_릴리즈노트.pdf', size: '3.4MB' },
      { name: '모바일앱_사용가이드.pdf', size: '5.1MB' }
    ]
  },
  {
    idx: 2,
    badge: '안내',
    badgeCls: 'badge-new',
    title: '관세사 자격증 갱신 교육 일정 안내',
    author: '관리자',
    date: '2026-03-20',
    views: 412,
    category: '안내',
    body: ''
      + '<p>2026년도 관세사 보수교육 일정을 안내드립니다.</p>'
      + '<h4>교육 일정</h4>'
      + '<ul>'
      + '<li>1차: 2026. 05. 12 ~ 05. 14</li>'
      + '<li>2차: 2026. 07. 08 ~ 07. 10</li>'
      + '<li>3차: 2026. 09. 15 ~ 09. 17</li>'
      + '</ul>',
    attachments: [
      { name: '2026_보수교육_안내문.hwp', size: '890KB' }
    ]
  },
  {
    idx: 3,
    badge: '공지',
    badgeCls: 'badge-new',
    title: '수입식품 검역 신규 서식 적용 안내',
    author: '관리자',
    date: '2026-03-28',
    views: 178,
    category: '공지',
    body: ''
      + '<p>식품의약품안전처 고시 개정에 따라 수입식품 검역 신고서 서식이 변경됩니다.</p>'
      + '<h4>주요 변경 내용</h4>'
      + '<ul>'
      + '<li>GMO 표시 관련 항목 추가</li>'
      + '<li>해외제조업소 HACCP 인증번호 필수 기재</li>'
      + '<li>알레르기 유발물질 표시 항목 신설</li>'
      + '</ul>'
      + '<p><strong>적용 시기:</strong> 2026년 4월 15일부터</p>',
    attachments: [
      { name: '수입식품_신규서식_2026.xlsx', size: '156KB' },
      { name: '변경사항_비교표.pdf', size: '420KB' }
    ]
  },
  {
    idx: 4,
    badge: '업데이트',
    badgeCls: 'badge-ok',
    title: '전자통관시스템 연동 업데이트 v2.5',
    author: '기술팀',
    date: '2026-04-05',
    views: 201,
    category: '업데이트',
    body: ''
      + '<p>전자통관시스템 연동 모듈이 v2.5로 업데이트되었습니다.</p>'
      + '<h4>개선사항</h4>'
      + '<ul>'
      + '<li>수입신고서 전송 속도 개선</li>'
      + '<li>수리 결과 실시간 수신 안정화</li>'
      + '<li>다건 동시 전송 오류 수정</li>'
      + '</ul>',
    attachments: []
  },
  {
    idx: 5,
    badge: '공지',
    badgeCls: 'badge-new',
    title: '2026년 상반기 FTA 원산지검증 강화 안내',
    author: '관리자',
    date: '2026-04-10',
    views: 289,
    category: '공지',
    body: ''
      + '<p>2026년 상반기부터 FTA 원산지 사후검증이 강화됩니다.</p>'
      + '<h4>주요 내용</h4>'
      + '<ul>'
      + '<li>FTA 대상 사후검증 물량 확대</li>'
      + '<li>원산지증명서 발급 이력 관리 강화</li>'
      + '</ul>',
    attachments: [
      { name: 'FTA_원산지검증_가이드_2026.pdf', size: '2.8MB' }
    ]
  },
  {
    idx: 6,
    badge: '공지',
    badgeCls: 'badge-new',
    title: 'TACS 시스템 정기점검 안내',
    author: '관리자',
    date: '2026-04-14',
    views: 156,
    category: '공지',
    body: ''
      + '<p>서버 안정화를 위한 정기점검이 진행됩니다.</p>'
      + '<h4>점검 일시</h4>'
      + '<p><strong>2026년 4월 20일 02:00 ~ 06:00</strong></p>'
      + '<h4>영향 범위</h4>'
      + '<ul>'
      + '<li>TACS 웹 서비스 이용 불가</li>'
      + '<li>전자통관 연동 전송 일시 중단</li>'
      + '</ul>',
    attachments: []
  },
  {
    idx: 7,
    badge: '긴급',
    badgeCls: 'badge-urgent',
    title: '[긴급] 2026년 4월 관세율표 개정 안내',
    author: '관리자',
    date: '2026-04-15',
    views: 342,
    category: '긴급공지',
    body: ''
      + '<p>일부 HS코드의 관세율이 변경됩니다.</p>'
      + '<h4>주요 변경 품목</h4>'
      + '<ul>'
      + '<li>반도체 집적회로: 세율 인하</li>'
      + '<li>의약품 기타: 세율 인상</li>'
      + '<li>열연강판: 신규 부과</li>'
      + '</ul>'
      + '<p>기존 임시저장 건은 세율 확인이 필요합니다.</p>',
    attachments: [
      { name: '2026_04_관세율표_개정_신구대조표.pdf', size: '1.8MB' },
      { name: 'HS코드_변경_요약.xlsx', size: '340KB' }
    ]
  }
];


// =========================================================
// 3. 공지사항 상세
// =========================================================

function initNoticeClicks() {
  var rows = document.querySelectorAll('#cm-notice .data-table tbody tr');

  rows.forEach(function (row, i) {
    row.style.cursor = 'pointer';

    row.onclick = function () {
      openNoticeDetail(noticeData.length - 1 - i);
    };
  });
}

function openNoticeDetail(idx) {
  var data = noticeData[idx];

  if (!data) {
    return;
  }

  var noticeWrap = document.querySelector('#cm-notice .data-table');

  if (noticeWrap && noticeWrap.parentElement) {
    noticeWrap.parentElement.querySelectorAll(':scope > *').forEach(function (el) {
      if (el.id !== 'notice-detail-view') {
        el.style.display = 'none';
      }
    });
  }

  var detailView = document.getElementById('notice-detail-view');

  if (detailView) {
    detailView.style.display = 'block';
  }

  setText('nd-badge', data.badge);
  setText('nd-title-text', data.title);
  setText('nd-author', data.author);
  setText('nd-date', data.date);
  setText('nd-views', data.views);
  setText('nd-category', data.category);

  var badge = document.getElementById('nd-badge');

  if (badge) {
    badge.className = 'badge ' + data.badgeCls;
  }

  var body = document.getElementById('nd-body');

  if (body) {
    body.innerHTML = data.body;
  }

  renderNoticeAttachments(data.attachments);

  var prev = noticeData[idx - 1];
  var next = noticeData[idx + 1];

  var prevEl = document.getElementById('nd-prev');
  var nextEl = document.getElementById('nd-next');

  if (prevEl) {
    prevEl.textContent = prev ? prev.title : '이전글이 없습니다';
    prevEl.dataset.idx = prev ? prev.idx : '';
  }

  if (nextEl) {
    nextEl.textContent = next ? next.title : '다음글이 없습니다';
    nextEl.dataset.idx = next ? next.idx : '';
  }
}

function renderNoticeAttachments(attachments) {
  var attachBox = document.getElementById('nd-attach');
  var attachList = document.getElementById('nd-attach-list');

  if (!attachBox || !attachList) {
    return;
  }

  if (!attachments || attachments.length === 0) {
    attachBox.style.display = 'none';
    attachList.innerHTML = '';
    return;
  }

  attachBox.style.display = 'block';

  var html = '';

  attachments.forEach(function (file) {
    html += ''
      + '<div class="file-item" style="border:none;padding:8px 0">'
      + '<div class="file-left">'
      + '<div class="file-icon" style="width:28px;height:28px">'
      + '<span class="material-symbols-outlined" style="font-size:16px">attach_file</span>'
      + '</div>'
      + '<div>'
      + '<span style="font-size:12px;font-weight:700;color:#203444">' + file.name + '</span>'
      + '<span style="font-size:11px;color:#697d8f;margin-left:8px">(' + file.size + ')</span>'
      + '</div>'
      + '</div>'
      + '<button class="file-dl" style="font-size:10px;padding:4px 10px" onclick="alert(\'' + file.name + ' 다운로드\')">'
      + '<span class="material-symbols-outlined" style="font-size:12px">download</span>'
      + '</button>'
      + '</div>';
  });

  attachList.innerHTML = html;
}

function openNoticeByIdx(idx) {
  if (idx === '' || idx === undefined) {
    return;
  }

  openNoticeDetail(parseInt(idx, 10));
}

function closeNoticeDetail() {
  var detailView = document.getElementById('notice-detail-view');

  if (detailView) {
    detailView.style.display = 'none';
  }

  var noticeWrap = document.querySelector('#cm-notice .data-table');

  if (noticeWrap && noticeWrap.parentElement) {
    noticeWrap.parentElement.querySelectorAll(':scope > *').forEach(function (el) {
      if (el.id !== 'notice-detail-view') {
        el.style.display = '';
      }
    });
  }
}


// =========================================================
// 4. 고객센터 탭 / 자료실 탭
// =========================================================

function showCsList() {
  var listView = document.getElementById('cs-list-view');
  var detailView = document.getElementById('cs-detail-view');
  var writeView = document.getElementById('cs-write-view');

  if (listView) listView.style.display = 'block';
  if (detailView) detailView.style.display = 'none';
  if (writeView) writeView.style.display = 'none';
}

function openCsWrite() {
  var listView = document.getElementById('cs-list-view');
  var detailView = document.getElementById('cs-detail-view');
  var writeView = document.getElementById('cs-write-view');

  if (listView) listView.style.display = 'none';
  if (detailView) detailView.style.display = 'none';
  if (writeView) writeView.style.display = 'block';
}

function openCsPost(id) {
  // 고객센터는 현재 FAQ 전용으로 운영한다.
}


function showCsTab(tab, btn) {
  document.querySelectorAll('.cs-tab').forEach(function (el) {
    el.classList.remove('active');
  });

  if (btn) {
    btn.classList.add('active');
  }

  document.querySelectorAll('.cs-tab-panel').forEach(function (el) {
    el.style.display = 'none';
  });

  var target = document.getElementById('cs-tab-' + tab);

  if (target) {
    target.style.display = 'block';
  }
}

function showArchiveList() {
  var listView = document.getElementById('archive-list-view');
  var detailView = document.getElementById('archive-detail-view');
  var uploadView = document.getElementById('archive-upload-view');

  if (listView) listView.style.display = 'block';
  if (detailView) detailView.style.display = 'none';
  if (uploadView) uploadView.style.display = 'none';
}

function openArchiveUpload() {
  var listView = document.getElementById('archive-list-view');
  var detailView = document.getElementById('archive-detail-view');
  var uploadView = document.getElementById('archive-upload-view');

  if (listView) listView.style.display = 'none';
  if (detailView) detailView.style.display = 'none';
  if (uploadView) uploadView.style.display = 'block';
}

function showArchiveTab(tab, btn) {
  document.querySelectorAll('.archive-tab').forEach(function (el) {
    el.classList.remove('active');
  });

  if (btn) {
    btn.classList.add('active');
  }

  document.querySelectorAll('.archive-tab-panel').forEach(function (el) {
    el.style.display = 'none';
  });

  var target = document.getElementById('archive-tab-' + tab);

  if (target) {
    target.style.display = 'block';
  }
}


// =========================================================
// 6. 자료실 상세 데이터
// =========================================================

var fileData = [];

function initFileClicks() {
  // DB 자료실 전환으로 미사용. 공통 resourceArchive.js를 사용한다.
  if (window.TacsResourceArchive) window.TacsResourceArchive.load();
}

function openFileDetail(idx) {
  // DB 자료실 전환으로 미사용.
}

function renderFileVersions(versions) {
  // DB 자료실 전환으로 미사용.
}

function renderRelatedFiles(related) {
  // DB 자료실 전환으로 미사용.
}

function closeFileDetail() {
  // DB 자료실 전환으로 미사용.
}


// =========================================================
// 7. 공통 유틸
// =========================================================

function setText(id, value) {
  var el = document.getElementById(id);

  if (el) {
    el.textContent = value || '';
  }
}


// =========================================================
// 8. 커뮤니티 페이지 초기화
// =========================================================

document.addEventListener('DOMContentLoaded', function () {
  var communityPage = document.getElementById('pg-community');

  if (!communityPage) {
    return;
  }

  initNoticeClicks();

  var params = new URLSearchParams(window.location.search);
  var tab = params.get('tab') || 'notice';

  switchFieldCommunityTab(tab);
  if (tab === 'archive' && window.TacsResourceArchive) window.TacsResourceArchive.load();
});
