/* ── 수출 목록 검색 필터 ── */
var exportRows = null;

function filterExportList() {
    var q = (document.getElementById('export-search') ? document.getElementById('export-search').value.trim().toLowerCase() : '');
    var sf = (document.getElementById('export-status-filter') ? document.getElementById('export-status-filter').value : '');
    var from = (document.getElementById('export-date-from') ? document.getElementById('export-date-from').value : '');
    var to = (document.getElementById('export-date-to') ? document.getElementById('export-date-to').value : '');
    var tbody = document.getElementById('export-list-tbody');
    var emptyEl = document.getElementById('export-list-empty');
    if (!tbody) return;
    var rows = tbody.querySelectorAll('tr');
    var visCount = 0;
    rows.forEach(function (tr) {
        var text = tr.textContent.toLowerCase();
        var matchQ = !q || text.includes(q);
        var matchS = !sf || text.includes(sf.toLowerCase());
        var dateCell = tr.cells[5] ? tr.cells[5].textContent.trim() : '';
        var normalized = dateCell.match(/\d{4}-\d{2}-\d{2}/) ? dateCell.match(/\d{4}-\d{2}-\d{2}/)[0] : '';
        var matchFrom = !from || !normalized || normalized >= from;
        var matchTo = !to || !normalized || normalized <= to;
        var show = matchQ && matchS && matchFrom && matchTo;
        tr.style.display = show ? '' : 'none';
        if (show) visCount++;
    });
    if (emptyEl) emptyEl.style.display = visCount === 0 ? '' : 'none';
}

/* ── 수입 목록 검색 필터 ── */
function filterImportList() {
    var q = (document.getElementById('import-search') ? document.getElementById('import-search').value.trim().toLowerCase() : '');
    var sf = (document.getElementById('import-status-filter') ? document.getElementById('import-status-filter').value : '');
    var from = (document.getElementById('import-date-from') ? document.getElementById('import-date-from').value : '');
    var to = (document.getElementById('import-date-to') ? document.getElementById('import-date-to').value : '');
    var tbody = document.getElementById('import-list-tbody');
    var emptyEl = document.getElementById('import-list-empty');
    if (!tbody) return;
    var rows = tbody.querySelectorAll('tr');
    var visCount = 0;
    rows.forEach(function (tr) {
        var text = tr.textContent.toLowerCase();
        var matchQ = !q || text.includes(q);
        var matchS = !sf || text.includes(sf.toLowerCase());
        var dateCell = tr.cells[6] ? tr.cells[6].textContent.trim() : '';
        var normalized = dateCell.match(/\d{4}-\d{2}-\d{2}/) ? dateCell.match(/\d{4}-\d{2}-\d{2}/)[0] : '';
        var matchFrom = !from || !normalized || normalized >= from;
        var matchTo = !to || !normalized || normalized <= to;
        var show = matchQ && matchS && matchFrom && matchTo;
        tr.style.display = show ? '' : 'none';
        if (show) visCount++;
    });
    if (emptyEl) emptyEl.style.display = visCount === 0 ? '' : 'none';
}

/* ── 수출 뷰 전환 ── */
function showExportView(view) {
    document.getElementById('export-list-view').style.display = view === 'list' ? '' : 'none';
    document.getElementById('export-form-view').style.display = view === 'form' ? '' : 'none';
    document.getElementById('export-form-content').style.display = view === 'form' ? '' : 'none';
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function showExportDetail(id) {
    if (!id) return;
    document.getElementById('md-export-id-sub').textContent = '의뢰번호: ' + id;
    document.getElementById('exportDetailModal').classList.add('open');

    var isSupplement = (id === 'EXP-OW-20260415-007');

    // Step bar 렌더
    var stepBar = document.getElementById('md-export-step-bar');
    var steps, currentLabel, currentColor;
    if (isSupplement) {
        steps = [
            {state: 'done', label: '관세사 선택', role: '화주'},
            {state: 'done', label: '의뢰서 작성', role: '화주'},
            {state: 'done', label: '서류 업로드', role: '화주'},
            {state: 'done', label: '수출신고', role: '관세사'},
            {state: 'warn', label: '보완자료', role: '화주(요청시)'},
            {state: '', label: '심사·수리', role: '세관'},
            {state: '', label: '필증 수령', role: '화주'}
        ];
        currentLabel = '⑤ 보완자료 제출 필요';
        currentColor = '#dc2626';
    } else {
        steps = [
            {state: 'done', label: '관세사 선택', role: '화주'},
            {state: 'done', label: '의뢰서 작성', role: '화주'},
            {state: 'done', label: '서류 업로드', role: '화주'},
            {state: 'done', label: '수출신고', role: '관세사'},
            {state: 'done', label: '심사·수리', role: '세관'},
            {state: 'done', label: '보완자료', role: '화주(요청시)'},
            {state: 'active', label: '필증 수령', role: '화주'}
        ];
        currentLabel = '⑦ 필증 수령 완료';
        currentColor = '#1d6b4f';
    }

    var roleClass = {'화주': '화주', '관세사': '관세사', '세관': '세관', '화주(요청시)': '화주'};
    stepBar.innerHTML = steps.map(function (s) {
        return '<div class="step-item ' + s.state + '">' +
            '<div class="step-circle">' + (steps.indexOf(s) + 1) + '</div>' +
            '<div class="step-label">' + s.label + '</div>' +
            '<span class="step-role ' + (roleClass[s.role] || '화주') + '">' + s.role + '</span>' +
            '</div>';
    }).join('');
    document.getElementById('md-export-step-label').innerHTML =
        '현재 진행 단계 : <strong style="color:' + currentColor + '">' + currentLabel + '</strong>';

    // 알림 바
    var alertBar = document.getElementById('md-export-alertbar');
    if (isSupplement) {
        alertBar.className = 'alert-bar warn';
        alertBar.innerHTML = '<span class="material-symbols-outlined">warning</span> <strong>보완자료 제출 필요</strong> — 거래가격 소명자료와 품목 카탈로그를 D-1 마감 전에 업로드하세요.';
    } else {
        alertBar.className = 'alert-bar info';
        alertBar.innerHTML = '<span class="material-symbols-outlined">check_circle</span> <strong>수출신고 필증이 발급되었습니다.</strong> 선적 후 B/L 확인을 진행해 주세요.';
    }

    // 보완서류 섹션 표시/숨김
    document.getElementById('md-export-supplement-section').style.display = isSupplement ? '' : 'none';
}

/* ── 수입 뷰 전환 ── */
function showImportView(view) {
    document.getElementById('import-list-view').style.display = view === 'list' ? '' : 'none';
    document.getElementById('import-form-view').style.display = view === 'form' ? '' : 'none';
    var formDoc = document.getElementById('import-form-content');
    if (formDoc) formDoc.style.display = view === 'form' ? '' : 'none';
    var aiTax = document.getElementById('import-ai-tax');
    if (aiTax) aiTax.style.display = view === 'form' ? '' : 'none';
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function showImportDetail(id) {
    document.getElementById('md-import-id-sub').textContent = '의뢰번호: ' + id;
    document.getElementById('importDetailModal').classList.add('open');

    var isTaxPending = (id === 'IMP-OW-20260416-004');

    // Step bar 렌더
    var stepBar = document.getElementById('md-import-step-bar');
    var steps, currentLabel, currentColor;

    if (isTaxPending) {
        steps = [
            {state: 'done', label: '관세사 선택', role: '화주'},
            {state: 'done', label: '의뢰서 작성', role: '화주'},
            {state: 'done', label: '선적서류 제출', role: '화주'},
            {state: 'done', label: '보완자료', role: '화주(요청시)'},
            {state: 'done', label: '세액 확인', role: '화주'},
            {state: 'active', label: '세금 납부', role: '화주'},
            {state: '', label: '수입신고', role: '관세사'},
            {state: '', label: '심사·수리', role: '세관'},
            {state: '', label: '필증·D/O', role: '화주'}
        ];
        currentLabel = '⑥ 세금 납부 대기';
        currentColor = '#dc2626';
    } else {
        steps = [
            {state: 'done', label: '관세사 선택', role: '화주'},
            {state: 'active', label: '의뢰서 작성', role: '화주'},
            {state: '', label: '선적서류 제출', role: '화주'},
            {state: '', label: '보완자료', role: '화주(요청시)'},
            {state: '', label: '세액 확인', role: '화주'},
            {state: '', label: '세금 납부', role: '화주'},
            {state: '', label: '수입신고', role: '관세사'},
            {state: '', label: '심사·수리', role: '세관'},
            {state: '', label: '필증·D/O', role: '화주'}
        ];
        currentLabel = '② 의뢰서 작성/검토 중';
        currentColor = '#1d4ed8';
    }

    var roleClass = {'화주': '화주', '관세사': '관세사', '세관': '세관', '화주(요청시)': '화주'};
    stepBar.innerHTML = steps.map(function (s, idx) {
        return '<div class="step-item ' + s.state + '">' +
            '<div class="step-circle">' + (idx + 1) + '</div>' +
            '<div class="step-label">' + s.label + '</div>' +
            '<span class="step-role ' + (roleClass[s.role] || '화주') + '">' + s.role + '</span>' +
            '</div>';
    }).join('');
    document.getElementById('md-import-step-label').innerHTML =
        '현재 진행 단계 : <strong style="color:' + currentColor + '">' + currentLabel + '</strong>';

    // 알림 바
    var alertBar = document.getElementById('md-import-alertbar');
    if (isTaxPending) {
        alertBar.className = 'alert-bar warn';
        alertBar.innerHTML = '<span class="material-symbols-outlined">warning</span> <strong>세금 납부 대기</strong> — 산출된 관세/부가세 납부가 필요합니다. 납부 후 통관이 진행됩니다.';
    } else {
        alertBar.className = 'alert-bar info';
        alertBar.innerHTML = '<span class="material-symbols-outlined">info</span> <strong>서류 검토 중</strong> — 관세사가 제출하신 서류를 바탕으로 수입 요건을 확인하고 있습니다.';
    }
}

function closeImportDetailModal(e) {
    if (e && e.target !== document.getElementById('importDetailModal') && e.type === 'click') return;
    document.getElementById('importDetailModal').classList.remove('open');
}

function requestContract() {
    var s = document.getElementById('contract-fwd-select').value;
    if (!s) {
        alert('운송업체를 선택하세요.');
        return;
    }
    var type = document.querySelector('input[name=\'contract-type\']:checked').value === 'export' ? '수출' : '수입';
    var memo = document.getElementById('contract-transport-memo').value;

    // 계약 상태 업데이트 (시뮬레이션)
    var f = fwdData.find(x => x.name === s);
    if (f) f.isContracted = true;

    showToast('[' + type + '] ' + s + ' 계약 요청이 전송되었습니다. 수락 후 이용중으로 전환됩니다.', 'success');
    closeFwdContractForm();
    renderTransFwdList();
}

