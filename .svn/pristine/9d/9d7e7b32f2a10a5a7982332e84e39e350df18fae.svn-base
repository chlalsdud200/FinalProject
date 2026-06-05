/* ── 운송업체 관련 동작 함수 ── */
function renderTransFwdList() {
    var kw = (document.getElementById('trans-fwd-search') ? document.getElementById('trans-fwd-search').value.toLowerCase() : '');
    var tbody = document.getElementById('trans-fwd-list-tbody');
    if (!tbody) return;

    var filtered = fwdData.filter(function (f) {
        return !kw || f.name.toLowerCase().includes(kw) || f.manager.toLowerCase().includes(kw) || f.route.toLowerCase().includes(kw);
    });

    var html = '';
    filtered.forEach(function (f) {
        var originalIdx = fwdData.indexOf(f);
        var badge = f.isContracted ? '<span class="doc-status ok">이용중</span>' : '<span class="doc-status none">계약종료</span>';
        var actionBtn = f.isContracted
            ? '<button class="mini mini-reject" onclick="terminateContract(' + originalIdx + ')">계약 종료</button>'
            : '<button class="mini mini-primary" onclick="openFwdContractForm(' + originalIdx + ')">계약 요청</button>';

        html += '<tr>' +
            '<td class="td-id">' + f.name + '</td>' +
            '<td>' + f.manager + '<br><span class="td-muted">' + f.tel + '</span></td>' +
            '<td>' + f.route + '</td>' +
            '<td>' + f.type + '</td>' +
            '<td>★' + f.rating + ' <span class="td-muted">(' + f.cases + '건)</span></td>' +
            '<td>' + badge + '</td>' +
            '<td><div class="btn-row">' + actionBtn + '<button class="mini mini-view" onclick="openFwdCompanyDetail(' + originalIdx + ')">상세</button></div></td>' +
            '</tr>';
    });
    tbody.innerHTML = html || '<tr><td colspan="7" style="padding:40px; text-align:center; color:#94a3b8;">검색 결과가 없습니다.</td></tr>';
}

function openFwdContractForm(idx) {
    var f = (typeof idx === 'number') ? fwdData[idx] : null;
    document.getElementById('trans-fwd-list-view').style.display = 'none';
    document.getElementById('trans-fwd-contract-view').style.display = 'block';
    document.getElementById('contract-target-fwd').textContent = f ? (f.name + ' - 계약 요청 및 서류 전송') : '운송업체 계약 요청 · 서류 전송';
    var select = document.getElementById('contract-fwd-select');
    if (select) select.value = f ? f.name : '';
}

function closeFwdContractForm() {
    document.getElementById('trans-fwd-list-view').style.display = 'block';
    document.getElementById('trans-fwd-contract-view').style.display = 'none';
}

function terminateContract(idx) {
    if (confirm(fwdData[idx].name + ' 업체와의 계약을 종료하시겠습니까?')) {
        fwdData[idx].isContracted = false;
        showToast('계약이 종료되었습니다.', 'warn');
        renderTransFwdList();
    }
}

function openFwdCompanyDetail(idx) {
    var f = fwdData[idx];
    if (!f) return;
    document.getElementById('md-fwd-name').textContent = f.name;
    document.getElementById('md-fwd-manager').textContent = f.manager;
    document.getElementById('md-fwd-tel').textContent = f.tel;
    document.getElementById('md-fwd-route').textContent = f.route;
    document.getElementById('md-fwd-type').textContent = f.type;
    document.getElementById('md-fwd-rating').textContent = '★ ' + f.rating;
    document.getElementById('md-fwd-cases').textContent = f.cases + '건';
    document.getElementById('fwdCompanyDetailModal').classList.add('open');
}

function doSearch() {
    var v = document.getElementById('gSearch').value.trim();
    if (!v) {
        alert('검색어를 입력하세요.');
        return;
    }
    if (v.startsWith('EXP')) go('export');
    else if (v.startsWith('IMP')) go('import');
    else if (v.startsWith('TRS')) go('transport');
    else if (v.toUpperCase().includes('BL') || v.toUpperCase().includes('AWB')) go('transport');
    else go('dash');
    alert('"' + v + '" 기준 화면으로 이동했습니다.');
}

/* ── 추가 서류 섹션 노출 ── */
function showSupplement() {
    const section = document.getElementById('supplement-section');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
}

/* ── 관세사 선택 모달 ── */
var _brokerContext = 'export';
var _selectedCard = null;


window.openBrokerModal = function (type) {
    _brokerContext = type || 'export';

    var modal = document.getElementById('brokerModal');

    if (!modal) {
        alert('관세사 선택 모달이 없습니다.');
        return;
    }

    modal.classList.add('open');
};

/* ── 운송 타입 UI 업데이트 (수정됨) ── */
function updateContractTypeUI(type) {
    const exportCard = document.getElementById('type-card-export');
    const importCard = document.getElementById('type-card-import');

    // 라디오 버튼 강제 체크
    document.querySelector('input[name="contract-type"][value="' + type + '"]').checked = true;

    if (type === 'export') {
        exportCard.style.cssText = "border:2px solid #3b82f6; background:#eff6ff; padding:16px; border-radius:8px !important; text-align:center; transition:0.2s;";
        exportCard.querySelector('span:first-child').style.color = "#3b82f6";
        exportCard.querySelector('span:last-child').style.color = "#1d4ed8";
        importCard.style.cssText = "border:1px solid #e2e8f0; background:#fff; padding:16px; border-radius:8px !important; text-align:center; transition:0.2s; opacity:0.6;";
        importCard.querySelector('span:first-child').style.color = "#64748b";
        importCard.querySelector('span:last-child').style.color = "#64748b";
    } else {
        importCard.style.cssText = "border:2px solid #16a34a; background:#f0fdf4; padding:16px; border-radius:8px !important; text-align:center; transition:0.2s;";
        importCard.querySelector('span:first-child').style.color = "#16a34a";
        importCard.querySelector('span:last-child').style.color = "#15803d";
        exportCard.style.cssText = "border:1px solid #e2e8f0; background:#fff; padding:16px; border-radius:8px !important; text-align:center; transition:0.2s; opacity:0.6;";
        exportCard.querySelector('span:first-child').style.color = "#64748b";
        exportCard.querySelector('span:last-child').style.color = "#64748b";
    }
}

window.closeBrokerModal = function () {
    var modal = document.getElementById('brokerModal');

    if (modal) {
        modal.classList.remove('open');
    }
};

function selectBroker(el, firm, person, spec, meta) {
    if (_selectedCard) _selectedCard.classList.remove('selected');
    el.classList.add('selected');
    _selectedCard = el;
    document.getElementById('brokerSelectedPreview').innerHTML =
        '<strong>' + firm + '</strong> / ' + person;
    document.getElementById('brokerConfirmBtn').disabled = false;
}

window.confirmBroker = function () {
    var checked = document.querySelector('input[name="brokerPick"]:checked');

    if (!checked) {
        alert('관세사를 선택하세요.');
        return;
    }

    var brokerId = checked.value;
    var brokerName = checked.getAttribute('data-name') || brokerId;
    var brokerOffice = checked.getAttribute('data-office') || '';

    var idEl = null;
    var displayEl = null;

    if (_brokerContext === 'import') {
        idEl = document.getElementById('importBrokerId');
        displayEl = document.getElementById('importBrokerDisplay');
    } else {
        idEl = document.getElementById('exportBrokerId');
        displayEl = document.getElementById('exportBrokerDisplay');
    }

    if (idEl) {
        idEl.value = brokerId;
    }

    if (displayEl) {
        displayEl.textContent = brokerOffice
            ? brokerName + ' / ' + brokerOffice
            : brokerName + ' (' + brokerId + ')';
    }

    closeBrokerModal();
};

function filterBrokers() {
    var q = document.getElementById('brokerSearchInput').value.toLowerCase();
    document.querySelectorAll('.broker-card').forEach(function (c) {
        var text = c.textContent.toLowerCase();
        c.classList.toggle('hidden', q.length > 0 && !text.includes(q));
    });
}

window.filterBrokerModalList = function () {
    var input = document.getElementById('brokerSearchInput');
    var keyword = input ? input.value.trim().toLowerCase() : '';

    var rows = document.querySelectorAll('#brokerList .broker-pick-row');

    rows.forEach(function (row) {
        var text = (row.getAttribute('data-search') || row.innerText || '').toLowerCase();
        row.style.display = !keyword || text.indexOf(keyword) > -1 ? 'block' : 'none';
    });
};

function setBrokerTab(btn, tag) {
    document.querySelectorAll('.modal-tab').forEach(function (t) {
        t.classList.remove('active');
    });
    btn.classList.add('active');
    document.getElementById('brokerSearchInput').value = '';
    document.querySelectorAll('.broker-card').forEach(function (c) {
        if (tag === 'all') {
            c.classList.remove('hidden');
            return;
        }
        var tags = (c.dataset.tag || '').split(' ');
        c.classList.toggle('hidden', !tags.includes(tag));
    });
}

let currentMode = 'search';

function switchTrack(mode) {
    currentMode = mode;
    const isSearch = mode === 'search';

    // 탭 UI 변경
    document.getElementById('tab-search').style.background = isSearch ? '#fff' : 'transparent';
    document.getElementById('tab-search').style.color = isSearch ? '#4f46e5' : '#718096';
    document.getElementById('tab-search').style.boxShadow = isSearch ? '0 4px 6px rgba(0,0,0,0.05)' : 'none';

    document.getElementById('tab-issue').style.background = !isSearch ? '#fff' : 'transparent';
    document.getElementById('tab-issue').style.color = !isSearch ? '#4f46e5' : '#718096';
    document.getElementById('tab-issue').style.boxShadow = !isSearch ? '0 4px 6px rgba(0,0,0,0.05)' : 'none';

    // 텍스트 변경
    document.getElementById('track-title').innerHTML = isSearch ?
        '<span class="material-symbols-outlined" style="font-size: 20px; color: #4f46e5;">search</span> 기존 부호 조회' :
        '<span class="material-symbols-outlined" style="font-size: 20px; color: #4f46e5;">add_circle</span> 신규 부호 발급';
    document.getElementById('main-btn').innerText = isSearch ? '조회하기' : '발급하기';
    document.getElementById('main-btn').style.background = isSearch ? '#4f46e5' : '#1e293b';

    resetDisplay();
}

function resetDisplay() {
    ['res-init', 'res-loading', 'res-exist', 'res-none'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById('res-init').style.display = 'block';
}

<!--통관고유부호-->
function executeProcess() {
    const name = document.getElementById('name').value;
    if (!name) return alert("성명을 입력해주세요.");

    // 로딩 시작
    document.getElementById('res-init').style.display = 'none';
    document.getElementById('res-none').style.display = 'none';
    document.getElementById('res-exist').style.display = 'none';
    document.getElementById('res-loading').style.display = 'block';

    setTimeout(() => {
        document.getElementById('res-loading').style.display = 'none';

        if (currentMode === 'search') {
            // 조회 모드일 때 (임경호 이름으로 테스트)
            if (name.includes("임경호")) {
                document.getElementById('res-exist').style.display = 'block';
            } else {
                document.getElementById('res-none').style.display = 'block';
            }
        } else {
            // 발급 모드일 때
            document.getElementById('code-val').innerText = "P" + Math.floor(Math.random() * 899999999999 + 100000000000);
            document.getElementById('res-exist').style.display = 'block';
            alert("신규 발급이 완료되었습니다!");
        }
    }, 1200);
}

