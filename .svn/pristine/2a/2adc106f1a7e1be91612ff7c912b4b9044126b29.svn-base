document.addEventListener('DOMContentLoaded', function () {
  bindRowClick();
  bindResetButton();
});

function bindRowClick() {
  document.querySelectorAll('.clickable-row').forEach(function (row) {
    row.addEventListener('click', function () {
      var url = row.dataset.url;
      if (url) location.href = url;
    });
  });

  document.querySelectorAll('.clickable-row a, .clickable-row button').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });
}

function bindResetButton() {
  var btnReset = document.getElementById('btnReset');
  if (!btnReset) return;

  btnReset.addEventListener('click', function () {
    location.href = (window.contextPath || '') + '/officer/basicScreenList.do';
  });
}

function collectSearchParams() {
  var form = document.getElementById('basicSearchForm');
  var params = new URLSearchParams();
  if (!form) return params;

  form.querySelectorAll('input[name], select[name]').forEach(function (el) {
    if (el.name === 'page' || el.name === 'size') return;

    if (el.type === 'radio' || el.type === 'checkbox') {
      if (el.checked && el.value !== '') params.set(el.name, el.value);
      return;
    }

    if (el.value !== '') params.set(el.name, el.value);
  });

  return params;
}

function goPage(page) {
  var params = collectSearchParams();
  var sizeSelect = document.getElementById('pageSizeSelect');

  params.set('page', page);
  params.set('size', sizeSelect ? sizeSelect.value : 10);

  location.href = (window.contextPath || '') + '/officer/basicScreenList.do?' + params.toString();
}

function changePageSize(size) {
  var params = collectSearchParams();

  params.set('page', 1);
  params.set('size', size);

  location.href = (window.contextPath || '') + '/officer/basicScreenList.do?' + params.toString();
}
