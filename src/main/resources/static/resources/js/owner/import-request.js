(function () {
    'use strict';

    function getCtxPath() {
        var meta = document.querySelector('meta[name="ctx-path"]');
        return meta ? meta.getAttribute('content') : '';
    }

    window.goImportList = function () {
        location.href = getCtxPath() + '/owner/import/list.do';
    };

    window.goImportForm = function () {
        location.href = getCtxPath() + '/owner/import/form.do';
    };

    window.goImportDetail = function (irNo) {
        location.href = getCtxPath() + '/owner/import/detail.do?irNo=' + encodeURIComponent(irNo);
    };

    window.filterImportList = function () {
        var keywordEl = document.getElementById('import-search');
        var statusEl = document.getElementById('import-status-filter');
        var tbody = document.getElementById('import-list-tbody');
        var empty = document.getElementById('import-list-empty');

        if (!tbody) return;

        var keyword = keywordEl ? keywordEl.value.trim().toLowerCase() : '';
        var status = statusEl ? statusEl.value.trim() : '';
        var rows = tbody.querySelectorAll('tr');
        var visibleCount = 0;

        rows.forEach(function (row) {
            var rowText = row.innerText.toLowerCase();
            var badge = row.querySelector('.badge');
            var statusText = badge ? badge.innerText.trim() : '';

            var keywordMatched = !keyword || rowText.indexOf(keyword) > -1;
            var statusMatched = !status || statusText === status;

            if (keywordMatched && statusMatched) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        if (empty) {
            empty.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    };

    var originalConfirmBroker = window.confirmBroker;

    window.confirmBroker = function () {
        var checked = document.querySelector('input[name="brokerPick"]:checked');
        var idEl = document.getElementById('importBrokerId');
        var displayEl = document.getElementById('importBrokerDisplay');

        if (checked && idEl && displayEl) {
            var brokerId = checked.value;
            var brokerName = checked.getAttribute('data-name') || checked.dataset.name || brokerId;
            var brokerOffice = checked.getAttribute('data-office') || '';

            idEl.value = brokerId;
            displayEl.textContent = brokerOffice
                ? brokerName + ' / ' + brokerOffice
                : brokerName;

            var modal = document.getElementById('brokerModal');
            if (modal) {
                modal.classList.remove('open');
                modal.classList.remove('show');
            }

            return;
        }

        if (typeof originalConfirmBroker === 'function') {
            originalConfirmBroker();
        }
    };

    window.handleImportDocFiles = function (input) {
        setImportDocFileName(input);
        renderImportDocTable();
    };

    window.setImportDocFileName = function (input) {
        var target = document.getElementById('importDocFileName');
        if (!target || !input || !input.files) return;

        if (input.files.length === 0) {
            target.textContent = 'PDF · JPG · PNG · XLSX — 최대 20MB';
            return;
        }

        if (input.files.length === 1) {
            target.textContent = input.files[0].name;
            return;
        }

        target.textContent = input.files[0].name + ' 외 ' + (input.files.length - 1) + '개';
    };

    window.renderImportDocTable = function () {
        var input = document.getElementById('importDocFile');
        var tbody = document.getElementById('importDocUploadTbody');

        if (!input || !tbody) return;

        // 빈 행 제거
        var emptyRow = tbody.querySelector('.empty-row');
        if (emptyRow) {
            emptyRow.remove();
        }

        // 기존 첨부파일(saved-file-row)은 유지하고
        // 새로 선택했던 파일 행(new-file-row)만 다시 그림
        tbody.querySelectorAll('.new-file-row').forEach(function (row) {
            row.remove();
        });

        if (!input.files || input.files.length === 0) {
            var hasSavedFile = tbody.querySelector('.saved-file-row');

            if (!hasSavedFile) {
                tbody.innerHTML = ''
                    + '<tr class="empty-row">'
                    + '  <td colspan="4" style="text-align:center;color:#94a3b8;padding:18px;">'
                    + '      첨부된 문서가 없습니다.'
                    + '  </td>'
                    + '</tr>';
            }

            return;
        }

        Array.prototype.forEach.call(input.files, function (file, index) {
            var docType = guessImportDocType(file.name);
            var tr = document.createElement('tr');

            tr.className = 'new-file-row';

            tr.innerHTML = ''
                + '<td><span class="doc-type-pill">' + escapeHtml(docType) + '</span></td>'
                + '<td class="td-id"><span class="doc-file-name">' + escapeHtml(file.name) + '</span></td>'
                + '<td><span class="doc-status wait">추가예정</span></td>'
                + '<td class="doc-actions">'
                + '  <button type="button" class="mini mini-reject" onclick="removeImportDocRow(' + index + ')">삭제</button>'
                + '</td>';

            tbody.appendChild(tr);
        });
    };

    window.removeImportDocRow = function (removeIndex) {
        var input = document.getElementById('importDocFile');
        if (!input || !input.files) return;

        if (typeof DataTransfer === 'undefined') {
            alert('현재 브라우저에서는 선택한 파일 일부 삭제가 지원되지 않습니다. 파일을 다시 선택하세요.');
            input.value = '';
            setImportDocFileName(input);
            renderImportDocTable();
            return;
        }

        var dt = new DataTransfer();

        Array.prototype.forEach.call(input.files, function (file, index) {
            if (index !== removeIndex) {
                dt.items.add(file);
            }
        });

        input.files = dt.files;

        setImportDocFileName(input);
        renderImportDocTable();
    };

    window.markDeleteImportFile = function (button, dfiFileNo) {
        if (!confirm('기존 첨부파일을 삭제하시겠습니까?\n수정 저장 시 실제 삭제 처리됩니다.')) {
            return;
        }

        var row = button.closest('tr');
        if (!row) return;

        row.classList.add('delete-file-row');

        var status = row.querySelector('.doc-status');
        if (status) {
            status.className = 'doc-status delete';
            status.textContent = '삭제예정';
        }

        var actions = row.querySelector('.doc-actions');
        if (actions) {
            actions.innerHTML = ''
                + '<button type="button" class="mini mini-view" onclick="cancelDeleteImportFile(this, \'' + dfiFileNo + '\')">취소</button>';
        }

        var area = document.getElementById('deleteImportFileArea');
        if (!area) return;

        var exists = area.querySelector('input[value="' + dfiFileNo + '"]');
        if (exists) return;

        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'deleteDfiFileNoList';
        input.value = dfiFileNo;
        input.setAttribute('data-file-no', dfiFileNo);

        area.appendChild(input);
    };

    window.cancelDeleteImportFile = function (button, dfiFileNo) {
        var row = button.closest('tr');
        if (!row) return;

        row.classList.remove('delete-file-row');

        var status = row.querySelector('.doc-status');
        if (status) {
            status.className = 'doc-status done';
            status.textContent = '기존첨부';
        }

        var actions = row.querySelector('.doc-actions');
        var ctx = getCtxPath();

        if (actions) {
            actions.innerHTML = ''
                + '<a href="' + ctx + '/common/file/download.do?fileNo=' + encodeURIComponent(dfiFileNo) + '" class="mini mini-view">다운로드</a>'
                + ' <button type="button" class="mini mini-reject" onclick="markDeleteImportFile(this, \'' + dfiFileNo + '\')">삭제</button>';
        }

        var area = document.getElementById('deleteImportFileArea');
        if (area) {
            var input = area.querySelector('input[data-file-no="' + dfiFileNo + '"]');
            if (input) input.remove();
        }
    };

    window.validateImportRequestForm = function () {
        var brokerId = document.getElementById('importBrokerId');
        var cstmIdfNo = document.getElementById('irCstmIdfNo');
        var arrvPortCd = document.getElementById('irArrvPortCd');
        var arrvSchdYmd = document.getElementById('irArrvSchdYmd');
        var blAwbNo = document.getElementById('irBlAwbNo');
        var currCd = document.getElementById('irDclrCurrCd');
        var invcAmt = document.getElementById('irInvcAmt');
        var file = document.getElementById('importDocFile');
        var isCreateForm = !!document.getElementById('importRequestForm');

        if (isCreateForm && (!brokerId || !brokerId.value)) {
            alert('담당 관세사를 선택하세요.');
            return false;
        }

        if (!cstmIdfNo || !cstmIdfNo.value.trim()) {
            alert('통관고유부호를 입력하세요.');
            if (cstmIdfNo) cstmIdfNo.focus();
            return false;
        }

        if (!arrvPortCd || !arrvPortCd.value.trim()) {
            alert('도착항을 입력하세요.');
            if (arrvPortCd) arrvPortCd.focus();
            return false;
        }

        if (!arrvSchdYmd || !arrvSchdYmd.value) {
            alert('도착예정일을 입력하세요.');
            if (arrvSchdYmd) arrvSchdYmd.focus();
            return false;
        }

        if (!blAwbNo || !blAwbNo.value.trim()) {
            alert('B/L 또는 AWB 번호를 입력하세요.');
            if (blAwbNo) blAwbNo.focus();
            return false;
        }

        if (!currCd || !currCd.value) {
            alert('신고통화를 선택하세요.');
            if (currCd) currCd.focus();
            return false;
        }

        if (!invcAmt || !invcAmt.value) {
            alert('송장금액을 입력하세요.');
            if (invcAmt) invcAmt.focus();
            return false;
        }

        var hasSavedFile = document.querySelector('.saved-file-row:not(.delete-file-row)');
        var hasNewFile = file && file.files && file.files.length > 0;

        if (!hasSavedFile && !hasNewFile) {
            alert('송장, 패킹리스트, B/L 등 관련 문서를 첨부하세요.');
            return false;
        }

        return true;
    };

    window.saveImportDraft = function () {
        alert('임시저장은 컨트롤러 연결 후 처리하면 됩니다.');
    };

    window.handleImportSupplementFiles = function (input) {
        var target = document.getElementById('importSuppFileName');

        if (!target || !input || !input.files) return;

        if (input.files.length === 0) {
            target.textContent = '선택된 파일이 없습니다.';
            return;
        }

        if (input.files.length === 1) {
            target.textContent = input.files[0].name;
            return;
        }

        target.textContent = input.files[0].name + ' 외 ' + (input.files.length - 1) + '개';
    };

    window.submitImportSupplement = function () {
        var input = document.getElementById('importSuppFile');

        if (!input || !input.files || input.files.length === 0) {
            alert('제출할 보완 파일을 선택하세요.');
            return;
        }

        alert('보완 서류 제출은 컨트롤러 연결 후 처리하면 됩니다.');
    };

    function guessImportDocType(fileName) {
        var name = String(fileName || '').toLowerCase();

        if (name.indexOf('invoice') > -1 || name.indexOf('송장') > -1) {
            return '송장';
        }

        if (name.indexOf('packing') > -1 || name.indexOf('패킹') > -1 || name.indexOf('포장') > -1) {
            return '포장명세서';
        }

        if (name.indexOf('bl') > -1 || name.indexOf('b_l') > -1 || name.indexOf('b-l') > -1 || name.indexOf('선하') > -1) {
            return 'B/L';
        }

        if (name.indexOf('awb') > -1 || name.indexOf('항공') > -1) {
            return 'AWB';
        }

        if (name.indexOf('origin') > -1 || name.indexOf('원산지') > -1) {
            return '원산지증명서';
        }

        if (name.indexOf('insurance') > -1 || name.indexOf('보험') > -1) {
            return '보험증권';
        }

        if (name.indexOf('contract') > -1 || name.indexOf('계약') > -1) {
            return '계약서';
        }

        return '첨부문서';
    }

    document.addEventListener('DOMContentLoaded', function () {
        bindImportAjaxSubmit('importRequestForm', '수입 의뢰 등록 중 오류가 발생했습니다.');
        bindImportButtons();
        bindImportDetailSubmit();
    });

    function bindImportButtons() {
        var form = document.getElementById('importDetailForm');
        var submitType = document.getElementById('submitType');
        var updateBtn = document.getElementById('importUpdateBtn');
        var suppBtn = document.getElementById('importSuppSubmitBtn');

        if (!form || !submitType) {
            return;
        }

        if (updateBtn) {
            updateBtn.addEventListener('click', function () {
                submitType.value = 'UPDATE';
                form.requestSubmit();
            });
        }

        if (suppBtn) {
            suppBtn.addEventListener('click', function () {
                submitType.value = 'SUPP_SUBMIT';
                form.requestSubmit();
            });
        }
    }

    function bindImportAjaxSubmit(formId, errorMessage) {
        var form = document.getElementById(formId);

        if (!form) {
            return;
        }

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (typeof window.validateImportRequestForm === 'function') {
                var valid = window.validateImportRequestForm();
                if (!valid) {
                    return;
                }
            }

            var formData = new FormData(form);

            if (e.submitter && e.submitter.name) {
                formData.append(e.submitter.name, e.submitter.value);
            }

            try {
                showImportUploadLoading();

                var response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    credentials: 'same-origin'
                });

                if (!response.ok) {
                    throw new Error('요청 실패: ' + response.status);
                }

                var result = await response.json();

                if (result.result === "OK") {
                    location.href = result.redirectUrl;
                    return;
                }

                alert(result.message || errorMessage);

            } catch (err) {
                console.error(err);
                alert(errorMessage);
            } finally {
                hideImportUploadLoading();
            }
        });
    }

    /*
    function bindImportUpdateButton() {
        var updateBtn = document.getElementById("importUpdateBtn");
        var form = document.getElementById("importDetailForm");

        if (!updateBtn || !form) {
            return;
        }

        updateBtn.addEventListener("click", async function () {
            if (typeof window.validateImportRequestForm === 'function') {
                var valid = window.validateImportRequestForm();
                if (!valid) {
                    return;
                }
            }

            if (!confirm("수입통관 의뢰 정보를 수정하시겠습니까?")) {
                return;
            }

            var formData = new FormData(form);

            try {
                showImportUploadLoading();

                var response = await fetch(getCtxPath() + "/owner/import/update.do", {
                    method: "POST",
                    body: formData,
                    credentials: "same-origin"
                });

                if (!response.ok) {
                    throw new Error("요청 실패: " + response.status);
                }

                var data = await response.json();

                if (data.result === "OK" || data.success === true) {
                    alert(data.message || "수정되었습니다.");
                    location.reload();
                    return;
                }

                alert(data.message || "수정에 실패했습니다.");

            } catch (error) {
                console.error(error);
                alert("수정 처리 중 오류가 발생했습니다.");
            } finally {
                hideImportUploadLoading();
            }
        });
    }*/

    function bindImportDetailSubmit() {
        var form = document.getElementById('importDetailForm');

        if (!form) {
            return;
        }

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            var formData = new FormData(form);

            try {
                var response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    credentials: 'same-origin'
                });

                if (!response.ok) {
                    throw new Error('요청 실패: ' + response.status);
                }

                var result = await response.json();

                alert(result.message || '처리되었습니다.');

                if (result.result === 'OK') {
                    location.href = getCtxPath() + '/owner/import/detail.do/' + encodeURIComponent(result.irNo);
                    return;
                }

            } catch (err) {
                console.error(err);
                alert('수입통관 의뢰 처리 중 오류가 발생했습니다.');
            }
        });
    }

    function showImportUploadLoading() {
        var el = document.getElementById('importUploadLoadingOverlay');

        if (el) {
            el.style.display = 'flex';
        }
    }

    function hideImportUploadLoading() {
        var el = document.getElementById('importUploadLoadingOverlay');

        if (el) {
            el.style.display = 'none';
        }
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    var payTypeEl = document.getElementById("irPayTypeCd");

    if (payTypeEl) {
        payTypeEl.addEventListener("change", function () {
            var box = document.getElementById("instlPayCntBox");
            var input = document.getElementById("irInstlPayCnt");

            if (!box || !input) {
                return;
            }

            if (this.value === "INSTL") {
                box.style.display = "";
                input.disabled = false;
                input.required = true;
            } else {
                box.style.display = "none";
                input.value = "";
                input.disabled = true;
                input.required = false;
            }
        });
    }
})();
