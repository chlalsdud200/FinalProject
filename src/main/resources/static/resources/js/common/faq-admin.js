(function () {
  var contextPath = window.location.pathname.substring(0, window.location.pathname.indexOf('/admin'));
  var currentFaqs = [];

  var CAT_MAP = {
    ACCOUNT: '계정/인증',
    SYSTEM: '시스템 이용',
    IMPORT: '수입통관',
    EXPORT: '수출통관',
    TRANSPORT: '운송',
    WAREHOUSE: '창고',
    DOC: '문서함',
    PAYMENT: '세금/환급',
    ETC: '기타'
  };

  var ROLE_MAP = {
    ALL: '전체',
    OWNER: '화주',
    BROKER: '관세사',
    OFFICER: '행정공무원',
    FIELD_OFFICER: '현장공무원',
    TRANSPORT_MANAGER: '운송담당자',
    WAREHOUSE_MANAGER: '창고관리자',
    SYSTEM_ADMIN: '시스템관리자'
  };

  function el(id) {
    return document.getElementById(id);
  }

  function val(id) {
    return el(id) ? el(id).value.trim() : '';
  }

  function rolesOf(faq) {
    if (Array.isArray(faq.targetRoleCds)) return faq.targetRoleCds;
    if (faq.targetRoleText) return faq.targetRoleText.split(/\s*,\s*/).filter(Boolean);
    return [];
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.toggleAllRoles = function (allBtn) {
    var isAll = allBtn.checked;
    document.querySelectorAll('input[name="target-role"]').forEach(function (check) {
      if (check.value !== 'ALL') {
        check.checked = false;
        check.disabled = isAll;
      }
    });
  };

  function initRoleEvents() {
    var allBtn = document.querySelector('input[name="target-role"][value="ALL"]');
    var others = document.querySelectorAll('input[name="target-role"]:not([value="ALL"])');

    if (allBtn) {
      allBtn.addEventListener('change', function () {
        toggleAllRoles(this);
      });
      toggleAllRoles(allBtn);
    }

    others.forEach(function (check) {
      check.addEventListener('change', function () {
        if (this.checked && allBtn && allBtn.checked) {
          allBtn.checked = false;
          toggleAllRoles(allBtn);
          this.checked = true;
        }
      });
    });
  }

  window.loadFaqs = function (page) {
    var params = new URLSearchParams();
    params.set('ctgryCd', val('filter-ctgry') || 'all');
    params.set('keyword', val('filter-keyword'));
    params.set('roleCd', val('filter-role') || 'all');
    params.set('currentPage', page || 1);

    fetch(contextPath + '/admin/faqs/list.do?' + params.toString())
      .then(function (res) {
        if (!res.ok) throw new Error('FAQ 목록을 불러오지 못했습니다.');
        return res.json();
      })
      .then(function (data) {
        currentFaqs = data.dataList || [];
        renderList(data);
      })
      .catch(function (err) {
        alert(err.message || 'FAQ 목록 조회 중 오류가 발생했습니다.');
      });
  };

  function renderList(data) {
    var tbody = el('faq-list-body');
    if (!tbody) return;

    if (!currentFaqs.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">등록된 FAQ가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = currentFaqs.map(function (faq) {
      var roleHtml = rolesOf(faq).map(function (role) {
        return '<span class="role-tag">' + escapeHtml(ROLE_MAP[role] || role) + '</span>';
      }).join('');

      return '<tr onclick="editFaq(' + faq.faqNo + ')">'
        + '<td>' + escapeHtml(faq.faqNo) + '</td>'
        + '<td><span class="cat-badge">' + escapeHtml(CAT_MAP[faq.faqCtgryCd] || faq.faqCtgryCd) + '</span></td>'
        + '<td style="font-weight:600">' + escapeHtml(faq.faqQstnCn) + '</td>'
        + '<td>' + roleHtml + '</td>'
        + '<td>' + escapeHtml(faq.faqSortSn) + '</td>'
        + '<td style="color:#64748b;font-size:12px">' + escapeHtml(faq.faqRegistDt ? faq.faqRegistDt.substring(0, 10) : '-') + '</td>'
        + '</tr>';
    }).join('');

    renderPagination(data);
  }

  function renderPagination(data) {
    var nav = el('pagination');
    if (!nav) return;
    nav.innerHTML = '';

    var totalPage = data.totalPage || data.totalPageCount || 0;
    if (!totalPage || totalPage <= 1) return;

    for (var i = 1; i <= totalPage; i++) {
      var btn = document.createElement('button');
      btn.className = 'page-btn' + (i === data.currentPage ? ' active' : '');
      btn.textContent = i;
      btn.type = 'button';
      btn.dataset.page = i;
      btn.onclick = function (event) {
        event.stopPropagation();
        loadFaqs(this.dataset.page);
      };
      nav.appendChild(btn);
    }
  }

  window.editFaq = function (faqNo) {
    var fallback = currentFaqs.find(function (item) {
      return String(item.faqNo) === String(faqNo);
    });
    if (!fallback) return;

    fetch(contextPath + '/admin/faqs/' + faqNo)
      .then(function (res) {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(function (detail) {
        fillFaqForm(detail || fallback);
      })
      .catch(function () {
        fillFaqForm(fallback);
      });
  };

  function fillFaqForm(faq) {
    el('form-title').textContent = 'FAQ 수정';
    el('faq-no').value = faq.faqNo || '';
    el('faq-ctgry').value = faq.faqCtgryCd || 'ACCOUNT';
    el('faq-qstn').value = faq.faqQstnCn || '';
    el('faq-ans').value = faq.faqAnsCn || '';
    el('faq-sort').value = faq.faqSortSn || 1;
    el('btn-delete').style.display = 'block';

    var roles = rolesOf(faq);
    var isAll = roles.indexOf('ALL') > -1;
    document.querySelectorAll('input[name="target-role"]').forEach(function (check) {
      check.checked = roles.indexOf(check.value) > -1;
      check.disabled = check.value !== 'ALL' && isAll;
    });
  }

  window.resetFaqForm = function () {
    el('form-title').textContent = 'FAQ 등록';
    el('faq-no').value = '';
    el('faq-ctgry').selectedIndex = 0;
    el('faq-qstn').value = '';
    el('faq-ans').value = '';
    el('faq-sort').value = '1';
    el('btn-delete').style.display = 'none';

    document.querySelectorAll('input[name="target-role"]').forEach(function (check) {
      check.checked = check.value === 'ALL';
      check.disabled = false;
    });

    var allBtn = document.querySelector('input[name="target-role"][value="ALL"]');
    if (allBtn) toggleAllRoles(allBtn);
  };

  window.saveFaq = function () {
    var faqNo = val('faq-no');
    var roles = [];
    document.querySelectorAll('input[name="target-role"]:checked').forEach(function (check) {
      roles.push(check.value);
    });

    var body = {
      faqCtgryCd: val('faq-ctgry'),
      faqQstnCn: val('faq-qstn'),
      faqAnsCn: val('faq-ans'),
      faqSortSn: parseInt(val('faq-sort'), 10) || 1,
      faqUseYn: 'Y',
      targetRoleCds: roles
    };

    if (!body.faqCtgryCd) return alert('FAQ 분류를 선택해 주세요.');
    if (!body.faqQstnCn) return alert('질문을 입력해 주세요.');
    if (!body.faqAnsCn) return alert('답변을 입력해 주세요.');
    if (!roles.length) return alert('노출 대상을 선택해 주세요.');

    fetch(contextPath + '/admin/faqs' + (faqNo ? '/' + faqNo : ''), {
      method: faqNo ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (err) { throw err; });
        return res.json();
      })
      .then(function () {
        alert('저장되었습니다.');
        resetFaqForm();
        loadFaqs(1);
      })
      .catch(function (err) {
        alert(err.message || '저장 중 오류가 발생했습니다.');
      });
  };

  window.deleteFaq = function () {
    var faqNo = val('faq-no');
    if (!faqNo || !confirm('정말 삭제하시겠습니까?')) return;

    fetch(contextPath + '/admin/faqs/' + faqNo, { method: 'DELETE' })
      .then(function (res) {
        if (!res.ok) throw new Error('삭제 중 오류가 발생했습니다.');
        return res.json();
      })
      .then(function () {
        alert('삭제되었습니다.');
        resetFaqForm();
        loadFaqs(1);
      })
      .catch(function (err) {
        alert(err.message || '삭제 중 오류가 발생했습니다.');
      });
  };

  document.addEventListener('DOMContentLoaded', function () {
    initRoleEvents();
    loadFaqs(1);
  });
})();
