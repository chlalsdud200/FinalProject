/* ── 보완서류 업로드 관련 ── */
var suppFiles = { 1: null, 2: null };
var suppSubmitted = { 1: false, 2: false };

function onSuppFileChange(n) {
  var input = document.getElementById('supp-file' + n);
  var nameEl = document.getElementById('supp-file' + n + '-name');
  if (input.files && input.files[0]) {
    suppFiles[n] = input.files[0];
    nameEl.textContent = input.files[0].name;
    nameEl.style.color = '#0f172a';
    nameEl.style.fontWeight = '600';
  }
}

function clearSuppFile(n) {
  suppFiles[n] = null;
  document.getElementById('supp-file' + n).value = '';
  document.getElementById('supp-file' + n + '-name').textContent = '파일 선택 (PDF · JPG · PNG · XLSX, 최대 20MB)';
  document.getElementById('supp-file' + n + '-name').style.color = '#94a3b8';
  document.getElementById('supp-file' + n + '-name').style.fontWeight = '';
  document.getElementById('supp-type' + n).selectedIndex = 0;
}

function submitSuppDoc(n) {
  var typeEl  = document.getElementById('supp-type' + n);
  var typeVal = typeEl.value;
  var file    = suppFiles[n];

  if (!typeVal) { showToast('서류 유형을 선택해 주세요.', 'warn'); return; }
  if (!file)    { showToast('파일을 선택해 주세요.', 'warn'); return; }

  // 파일 크기 체크 20MB
  if (file.size > 20 * 1024 * 1024) { showToast('파일 크기가 20MB를 초과합니다.', 'warn'); return; }

  var now = new Date();
  var dt  = now.getFullYear() + '-' +
            String(now.getMonth()+1).padStart(2,'0') + '-' +
            String(now.getDate()).padStart(2,'0') + ' ' +
            String(now.getHours()).padStart(2,'0') + ':' +
            String(now.getMinutes()).padStart(2,'0');

  var itemLabel = n === 1 ? '① 거래가격 소명자료' : '② 품목 카탈로그';
  var sizeMB = (file.size / 1024 / 1024).toFixed(2);

  // 업로드 영역 숨기고 완료 표시
  document.getElementById('supp-upload-area' + n).style.display = 'none';
  document.getElementById('supp-done-area' + n).style.display   = '';
  document.getElementById('supp-done-info' + n).innerHTML =
    '파일명: <strong>' + file.name + '</strong><br>' +
    '서류 유형: <strong>' + typeVal + '</strong><br>' +
    '제출일시: <strong>' + dt + '</strong><br>' +
    '파일 크기: ' + sizeMB + ' MB';

  // 상태 뱃지 변경
  document.getElementById('supp-req' + n + '-status').className = 'doc-status ok';
  document.getElementById('supp-req' + n + '-status').textContent = '제출완료';

  suppSubmitted[n] = true;

  // 이력 테이블에 행 추가
  var emptyRow = document.getElementById('supp-history-empty');
  if (emptyRow) emptyRow.style.display = 'none';

  var tbody = document.getElementById('supp-history-body');
  var tr = document.createElement('tr');
  tr.style.background = '#f0fdf4';
  tr.innerHTML =
    '<td style="font-size:11px;color:#64748b">' + dt + '</td>' +
    '<td style="font-weight:600">' + itemLabel + '</td>' +
    '<td>' + typeVal + '</td>' +
    '<td style="font-size:12px">' + file.name + '</td>' +
    '<td style="font-size:11px;color:#94a3b8">' + sizeMB + ' MB</td>' +
    '<td><span class="doc-status ok">검토 중</span></td>';
  tbody.appendChild(tr);

  // 미제출 카운트 업데이트
  var pending = (suppSubmitted[1] ? 0 : 1) + (suppSubmitted[2] ? 0 : 1);
  var badge = document.getElementById('supp-pending-badge');
  if (badge) {
    if (pending === 0) {
      badge.textContent = '모두 제출 완료';
      badge.style.background = '#16a34a';
    } else {
      badge.textContent = '미제출 ' + pending + '건';
    }
  }

  showToast(itemLabel + ' 보완서류가 제출되었습니다. 관세사 검토 후 처리됩니다.', 'success');
}


var _origGo = go;
go = function(p) {
  _origGo(p);
  if (p === 'export') {
    showExportView('list');
  }
  if (p === 'import') {
    showImportView('list');
  }
  if (p === 'transport') {
    renderTransFwdList();
  }
};

