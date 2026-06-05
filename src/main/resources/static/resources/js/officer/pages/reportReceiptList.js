// reportReceiptList.js - 신고접수목록 전용
(function () {
  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  function ctx() {
    return window.contextPath || '';
  }

  function formatDate(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  function setDateRange(days) {
    var end = new Date();
    var start = new Date();
    start.setDate(end.getDate() - days);

    var startInput = qs('input[name="startDate"]');
    var endInput = qs('input[name="endDate"]');

    if (startInput) startInput.value = formatDate(start);
    if (endInput) endInput.value = formatDate(end);
  }

  function resetSearch() {
    location.href = ctx() + '/officer/reportReceiptList.do';
  }

  function moveDetail(reqNo) {
    if (reqNo) {
      location.href = ctx() + '/officer/basicScreenDetail.do?reqNo=' + encodeURIComponent(reqNo);
    }
  }

  function toggleAllRows() {
    var checkAll = qs('#checkAll');
    if (!checkAll) return;

    qsa('.row-check:not(:disabled)').forEach(function (checkbox) {
      checkbox.checked = checkAll.checked;
    });
  }

  function receiveBatch() {
    var checkedList = qsa('.row-check:checked');

    if (checkedList.length === 0) {
      alert('접수 처리할 신고건을 선택하세요.');
      return;
    }

    if (!confirm(checkedList.length + '건을 일괄 접수 처리하시겠습니까?')) {
      return;
    }

    var form = qs('#batchAcceptForm');
    if (!form) return;

    form.querySelectorAll('input[name="reqNoList"], input[name="declareTypeList"]').forEach(function (input) {
      input.remove();
    });

    checkedList.forEach(function (checkbox) {
      var reqInput = document.createElement('input');
      reqInput.type = 'hidden';
      reqInput.name = 'reqNoList';
      reqInput.value = checkbox.value;
      form.appendChild(reqInput);

      var typeInput = document.createElement('input');
      typeInput.type = 'hidden';
      typeInput.name = 'declareTypeList';
      typeInput.value = checkbox.dataset.declareType || '';
      form.appendChild(typeInput);
    });

    form.submit();
  }

  function openRejectModal(reqNo, declareType) {
    var modal = qs('#rejectModal');

    if (qs('#rejectReqNo')) qs('#rejectReqNo').value = reqNo || '';
    if (qs('#rejectDeclareType')) qs('#rejectDeclareType').value = declareType || '';
    if (qs('#rejectReason')) qs('#rejectReason').value = '';

    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeRejectModal() {
    var modal = qs('#rejectModal');

    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function openRejectReasonModal(button) {
    var modal = qs('#rejectReasonModal');

    if (qs('#rejectReasonReqNo')) qs('#rejectReasonReqNo').value = button.dataset.reqNo || '';
    if (qs('#rejectReasonDate')) qs('#rejectReasonDate').value = button.dataset.date || '-';
    if (qs('#rejectReasonType')) qs('#rejectReasonType').value = button.dataset.type || '-';
    if (qs('#rejectReasonView')) {
      qs('#rejectReasonView').value = button.dataset.reason || '등록된 반려사유가 없습니다.';
    }

    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeRejectReasonModal() {
    var modal = qs('#rejectReasonModal');

    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function bindEvents() {
    if (qs('#checkAll')) qs('#checkAll').addEventListener('change', toggleAllRows);
    if (qs('#btnReset')) qs('#btnReset').addEventListener('click', resetSearch);
    if (qs('#btnBatchReceive')) qs('#btnBatchReceive').addEventListener('click', receiveBatch);

    qsa('.btn-quick').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        setDateRange(Number(button.dataset.range || 7));
      });
    });

    qsa('.btn-detail').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        moveDetail(button.dataset.reqNo);
      });
    });

    qsa('.btn-reject').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        openRejectModal(button.dataset.reqNo, button.dataset.declareType);
      });
    });

    qsa('.btn-reject-reason').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        openRejectReasonModal(button);
      });
    });

    if (qs('#btnRejectReasonClose')) {
      qs('#btnRejectReasonClose').addEventListener('click', closeRejectReasonModal);
    }

    if (qs('#btnRejectReasonCancel')) {
      qs('#btnRejectReasonCancel').addEventListener('click', closeRejectReasonModal);
    }
  }

  window.closeRejectModal = closeRejectModal;
  window.closeRejectReasonModal = closeRejectReasonModal;

  document.addEventListener('DOMContentLoaded', bindEvents);
})();
