(function () {
  var ctx = document.querySelector('meta[name="ctx-path"]');
  var contextPath = ctx ? ctx.content : '';
  var currentList = [];

  function value(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function label(type) {
    return type === 'URGENT' ? '긴급' : type === 'UPDATE' ? '업데이트' : '공지';
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function params() {
    var p = new URLSearchParams();
    p.set('type', value('admin-notice-type') || 'all');
    p.set('keyword', value('admin-notice-keyword'));
    p.set('fromDate', value('admin-notice-from'));
    p.set('toDate', value('admin-notice-to'));
    p.set('page', '1');
    p.set('size', '100');
    return p;
  }

  window.loadAdminNotices = function () {
    fetch(contextPath + '/notice/api/list.do?' + params().toString(), {
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('공지 목록 조회 실패');
        return res.json();
      })
      .then(function (data) {
        currentList = data.dataList || data.list || [];
        render(data);
      })
      .catch(function (err) {
        alert(err.message);
      });
  };

  function render(data) {
    var tbody = document.getElementById('admin-notice-body');
    if (!tbody) return;
    if (!currentList.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#718096">등록된 공지가 없습니다.</td></tr>';
      return;
    }
    tbody.innerHTML = currentList.map(function (n, i) {
      return '<tr>' +
        '<td>' + ((data.totalRecord || data.totalCount || currentList.length) - i) + '</td>' +
        '<td><span class="badge ' + escapeHtml(n.noticeType) + '">' + label(n.noticeType) + '</span></td>' +
        '<td>' + escapeHtml(n.noticeTitle) + '</td>' +
        '<td>' + escapeHtml(n.noticeAdddate) + '</td>' +
        '<td>' + escapeHtml(n.noticeCnt || 0) + '</td>' +
        '<td><div class="actions">' +
        '<button type="button" class="secondary" onclick="editNotice(' + n.noticeNo + ')">수정</button>' +
        '<button type="button" class="danger" onclick="deleteNotice(' + n.noticeNo + ')">삭제</button>' +
        '</div></td>' +
        '</tr>';
    }).join('');
    var count = document.getElementById('admin-notice-count');
    if (count) count.textContent = '총 ' + (data.totalRecord || data.totalCount || 0) + '건';
  }

  window.editNotice = function (noticeNo) {
    var notice = currentList.find(function (item) { return item.noticeNo === noticeNo; });
    if (!notice) return;
    document.getElementById('form-title').textContent = '공지 수정';
    document.getElementById('notice-no').value = notice.noticeNo;
    document.getElementById('notice-type').value = notice.noticeType || 'NOTICE';
    document.getElementById('notice-title').value = notice.noticeTitle || '';
    document.getElementById('notice-content').value = notice.noticeContent || '';
  };

  window.resetNoticeForm = function () {
    document.getElementById('form-title').textContent = '공지 등록';
    document.getElementById('notice-no').value = '';
    document.getElementById('notice-type').value = 'NOTICE';
    document.getElementById('notice-title').value = '';
    document.getElementById('notice-content').value = '';
  };

  window.saveNotice = function () {
    var noticeNo = value('notice-no');
    var body = {
      noticeType: value('notice-type'),
      noticeTitle: value('notice-title'),
      noticeContent: value('notice-content')
    };
    if (!body.noticeTitle) {
      alert('제목을 입력하세요.');
      return;
    }
    if (!body.noticeContent) {
      alert('내용을 입력하세요.');
      return;
    }
    fetch(contextPath + '/admin/notices' + (noticeNo ? '/' + noticeNo : ''), {
      method: noticeNo ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('공지 저장 실패');
        return res.json();
      })
      .then(function () {
        resetNoticeForm();
        loadAdminNotices();
      })
      .catch(function (err) {
        alert(err.message);
      });
  };

  window.deleteNotice = function (noticeNo) {
    if (!confirm('공지사항을 삭제하시겠습니까?')) return;
    fetch(contextPath + '/admin/notices/' + noticeNo, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('공지 삭제 실패');
        return res.json();
      })
      .then(loadAdminNotices)
      .catch(function (err) {
        alert(err.message);
      });
  };

  document.addEventListener('DOMContentLoaded', loadAdminNotices);
})();
