/* ── 운송 상세 모달 제어 ── */
var _currentTransType = '';
function openTransDetail(id, type, route, firm, eta) {
  _currentTransType = type;
  document.getElementById('md-trans-id').textContent = id;
  document.getElementById('md-trans-route').textContent = route;
  document.getElementById('md-trans-firm').textContent = firm;
  document.getElementById('md-trans-eta').textContent = eta;
  
  var title = document.getElementById('md-bl-title');
  var guide = document.getElementById('md-bl-guide');
  var btn = document.querySelector('#md-bl-actions .btn-primary');
  
  // 수출신고필증 전달 섹션 표시 제어
  var certSection = document.getElementById('md-export-cert-section');
  if (certSection) {
    certSection.style.display = (type === 'export') ? 'block' : 'none';
  }
  
  if (type === 'export') {
    title.textContent = 'B/L 초안 검토';
    guide.textContent = '운송업체로부터 전달된 B/L 초안입니다. 내용을 확인 후 승인해 주세요. 승인 후 선사에서 B/L 원본이 발행됩니다.';
    btn.textContent = 'B/L 승인';
    btn.className = 'btn btn-primary';
  } else {
    title.textContent = 'B/L 수령 확인';
    guide.textContent = '운송업체로부터 B/L이 도착했습니다. 내용을 확인해 주세요.';
    btn.textContent = 'B/L 확인 완료';
    btn.className = 'btn btn-success';
  }
  
  document.getElementById('transDetailModal').classList.add('open');
}

function transferExportCert() {
  var fileName = document.getElementById('md-export-cert-name').textContent;
  if (fileName === '수출신고필증 파일 선택' || !fileName) {
    alert('전달할 수출신고필증 파일을 선택해주세요.');
    return;
  }
  showToast('수출신고필증이 운송사로 성공적으로 전달되었습니다.', 'success');
}

function closeTransDetailModal(e) {
  if (e && e.target !== document.getElementById('transDetailModal')) return;
  document.getElementById('transDetailModal').classList.remove('open');
}

function confirmBL() {
  var msg = _currentTransType === 'export' ? 'B/L 초안을 승인하였습니다.' : 'B/L 수령을 확인하였습니다.';
  showToast(msg, 'success');
  closeTransDetailModal();
}

/* ── 수출 상세 모달 제어 ── */
function closeExportDetailModal(e) {
  if (e && e.target !== document.getElementById('exportDetailModal') && e.type === 'click') return;
  document.getElementById('exportDetailModal').classList.remove('open');
}

function downloadDetailPDF(type) {
  var idLabel = type === 'export' ? 'md-export-id-sub' : 'md-import-id-sub';
  var idText = document.getElementById(idLabel).textContent;
  showToast(idText + ' 상세 내역을 PDF로 변환하여 다운로드를 시작합니다.', 'info');
}

function toggleInstallment(val) {
  var wrap = document.getElementById('installment-count-wrap');
  if (wrap) {
    wrap.style.display = (val === 'Y') ? 'flex' : 'none';
  }
}

function filterCertsList() {
  var kw = document.getElementById('certs-search-input').value.toLowerCase().trim();
  var type = (document.getElementById('certs-type-filter') || {}).value || '전체';
  var from = (document.getElementById('certs-date-from') || {}).value || '';
  var to = (document.getElementById('certs-date-to') || {}).value || '';
  var rows = document.querySelectorAll('#certs-list-body tr');
  var visible = 0;
  rows.forEach(function(row) {
    var text = row.textContent.toLowerCase();
    var rowType = row.cells[0] ? row.cells[0].textContent.trim() : '';
    var rowDate = row.cells[4] ? row.cells[4].textContent.trim() : '';
    var typeOk = (type === '전체') || rowType.includes(type);
    var kwOk = text.includes(kw);
    var fromOk = !from || !rowDate || rowDate >= from;
    var toOk = !to || !rowDate || rowDate <= to;
    var show = typeOk && kwOk && fromOk && toOk;
    row.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  showToast('조회 결과가 반영되었습니다. (' + visible + '건)', 'info');
}

let currentPortTarget = null;

function openPortModal(target) {
  currentPortTarget = target;

  const modal = document.getElementById("portModal");
  const searchInput = document.getElementById("portSearchInput");

  modal.classList.add("open");
  searchInput.value = "";

  filterPortList();

  setTimeout(function () {
    searchInput.focus();
  }, 50);
}

function closePortModal() {
  document.getElementById("portModal").classList.remove("open");
}

function filterPortList() {
  const keyword = document.getElementById("portSearchInput").value.trim().toLowerCase();
  const rows = document.querySelectorAll(".port-row");

  rows.forEach(function (row) {
    const searchText = row.dataset.search.toLowerCase();

    if (searchText.includes(keyword)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function selectPort(portCd, portNm) {
  if (currentPortTarget === "arrival") {
    document.getElementById("irArrvPortCd").value = portCd;
    document.getElementById("irArrvPortNm").value = portNm + " (" + portCd + ")";
  }

  closePortModal();
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closePortModal();
  }
});

document.addEventListener("click", function (e) {
  const modal = document.getElementById("portModal");

  if (e.target === modal) {
    closePortModal();
  }
});

