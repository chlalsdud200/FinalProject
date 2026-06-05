(function () {
    'use strict';

    function getCtxPath() {
        var meta = document.querySelector('meta[name="ctx-path"]');
        return meta ? meta.getAttribute('content') : '';
    }

    window.goExportList = function () {
        location.href = getCtxPath() + '/owner/export/list.do';
    };

    window.goExportForm = function () {
        location.href = getCtxPath() + '/owner/export/form.do';
    };

    window.goExportDetail = function (erNo) {
        location.href = getCtxPath() + '/owner/export/detail.do/' + encodeURIComponent(erNo);
    };

    var originalConfirmBroker = window.confirmBroker;

    window.confirmBroker = function () {
        var checked = document.querySelector('input[name="brokerPick"]:checked');
        var idEl = document.getElementById('exportBrokerId');
        var displayEl = document.getElementById('exportBrokerDisplay');

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

    window.validateExportRequestForm = function () {
        var brokerId = document.getElementById('exportBrokerId');
        var cstmIdfNo = document.getElementById('erCstmIdfNo');
        var loadSchdYmd = document.getElementById('erLoadSchdYmd');
        var incoTermsCd = document.getElementById('erIncoTermsCd');
        var loadPortCd = document.getElementById('erLoadPortCd');
        var arrvPortCd = document.getElementById('erArrvPortCd');
        var file = document.getElementById('exportDocFile');
        var isCreateForm = !!document.getElementById('exportRequestForm');

        /*
         * 상세페이지에서는 담당 관세사 변경 불가라서
         * exportBrokerId hidden이 없을 수도 있음.
         * 그래서 존재할 때만 검사.
         */
        if (isCreateForm && brokerId && !brokerId.value) {
            alert('담당 관세사를 선택하세요.');
            return false;
        }

        if (!cstmIdfNo || !cstmIdfNo.value.trim()) {
            alert('통관고유부호를 입력하세요.');
            if (cstmIdfNo) cstmIdfNo.focus();
            return false;
        }

        if (!loadSchdYmd || !loadSchdYmd.value) {
            alert('선적예정일을 입력하세요.');
            if (loadSchdYmd) loadSchdYmd.focus();
            return false;
        }

        if (!incoTermsCd || !incoTermsCd.value) {
            alert('Incoterms를 선택하세요.');
            if (incoTermsCd) incoTermsCd.focus();
            return false;
        }

        if (!loadPortCd || !loadPortCd.value.trim()) {
            alert('선적항을 입력하세요.');
            if (loadPortCd) loadPortCd.focus();
            return false;
        }

        if (!arrvPortCd || !arrvPortCd.value.trim()) {
            alert('도착항을 입력하세요.');
            if (arrvPortCd) arrvPortCd.focus();
            return false;
        }

        /*
         * 상세페이지 파일 체크:
         * 기존 첨부파일이 있으면 새 파일을 안 올려도 통과.
         * 단, 기존 파일을 전부 삭제예정으로 만들고 새 파일도 없으면 막음.
         */
        var hasSavedFile = document.querySelector('.saved-file-row:not(.delete-file-row)');
        var hasNewFile = file && file.files && file.files.length > 0;

        if (!hasSavedFile && !hasNewFile) {
            alert('송장, 패킹리스트, B/L 등 관련 문서를 첨부하세요.');
            return false;
        }

        return true;
    };

    window.handleExportDocFiles = function (input) {
        setExportDocFileName(input);
        renderExportDocTable();
    };

    window.setExportDocFileName = function (input) {
        var target = document.getElementById('exportDocFileName');
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

    window.renderExportDocTable = function () {
        var input = document.getElementById('exportDocFile');
        var tbody = document.getElementById('exportDocUploadTbody');

        if (!input || !tbody) return;

        var emptyRow = tbody.querySelector('.empty-row');
        if (emptyRow) {
            emptyRow.remove();
        }

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
            var docType = guessExportDocType(file.name);
            var tr = document.createElement('tr');

            tr.className = 'new-file-row';

            tr.innerHTML = ''
                + '<td><span class="doc-type-pill">' + escapeHtml(docType) + '</span></td>'
                + '<td class="td-id"><span class="doc-file-name">' + escapeHtml(file.name) + '</span></td>'
                + '<td><span class="doc-status wait">추가예정</span></td>'
                + '<td class="doc-actions">'
                + '  <button type="button" class="mini mini-reject" onclick="removeExportDocRow(' + index + ')">삭제</button>'
                + '</td>';

            tbody.appendChild(tr);
        });
    };

    window.removeExportDocRow = function (removeIndex) {
        var input = document.getElementById('exportDocFile');
        if (!input || !input.files) return;

        var dt = new DataTransfer();

        Array.prototype.forEach.call(input.files, function (file, index) {
            if (index !== removeIndex) {
                dt.items.add(file);
            }
        });

        input.files = dt.files;

        setExportDocFileName(input);
        renderExportDocTable();
    };

    window.markDeleteExportFile = function (button, dfiFileNo) {
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
                + '<button type="button" class="mini mini-view" onclick="cancelDeleteExportFile(this, \'' + dfiFileNo + '\')">취소</button>';
        }

        var area = document.getElementById('deleteExportFileArea');
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

    window.cancelDeleteExportFile = function (button, dfiFileNo) {
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
                + ' <button type="button" class="mini mini-reject" onclick="markDeleteExportFile(this, \'' + dfiFileNo + '\')">삭제</button>';
        }

        var area = document.getElementById('deleteExportFileArea');
        if (area) {
            var input = area.querySelector('input[data-file-no="' + dfiFileNo + '"]');
            if (input) input.remove();
        }
    };

    function guessExportDocType(fileName) {
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

        if (name.indexOf('contract') > -1 || name.indexOf('계약') > -1) {
            return '계약서';
        }

        if (name.indexOf('origin') > -1 || name.indexOf('원산지') > -1) {
            return '원산지증명서';
        }

        if (name.indexOf('license') > -1 || name.indexOf('면허') > -1) {
            return '수출면허증';
        }

        return '기타 첨부문서';
    }

    document.addEventListener('DOMContentLoaded', function () {
        bindExportAjaxSubmit('exportRequestForm', '수출 의뢰 등록 중 오류가 발생했습니다.');
        bindExportButtons();
        bindExportDetailSubmit();
    });

    /*
    function bindExportUpdateButton() {
        var updateBtn = document.getElementById('exportUpdateBtn');
        var form = document.getElementById('exportDetailForm');

        if (!updateBtn || !form) {
            return;
        }

        updateBtn.addEventListener('click', async function () {
            if (typeof window.validateExportRequestForm === 'function') {
                var valid = window.validateExportRequestForm();
                if (!valid) {
                    return;
                }
            }

            if (!confirm('수출통관 의뢰 정보를 수정하시겠습니까?')) {
                return;
            }

            var formData = new FormData(form);

            try {
                showExportUploadLoading();

                var response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    credentials: 'same-origin'
                });

                if (!response.ok) {
                    throw new Error('요청 실패: ' + response.status);
                }

                var result = await response.json();

                if (result.result === 'OK' || result.success  === true) {
                    alert(result.message || '수정되었습니다.');
                    location.reload();
                    return;
                }

                alert(result.message || '수정에 실패했습니다.');

            } catch (err) {
                console.error(err);
                alert('수출 의뢰 수정 중 오류가 발생했습니다.');
            } finally {
                hideExportUploadLoading();
            }
        });
    }*/

    function bindExportButtons() {
        var form = document.getElementById('exportDetailForm');
        var submitType = document.getElementById('submitType');
        var updateBtn = document.getElementById('exportUpdateBtn');
        var suppBtn = document.getElementById('exportSuppSubmitBtn');

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

    function bindExportDetailSubmit() {
        var form = document.getElementById('exportDetailForm');

        if (!form) {
            return;
        }

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (typeof window.validateExportRequestForm === 'function') {
                var valid = window.validateExportRequestForm();
                if (!valid) {
                    return;
                }
            }

            var formData = new FormData(form);

            try {
                showExportUploadLoading();

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
                    location.href = getCtxPath()
                        + '/owner/export/detail.do/'
                        + encodeURIComponent(result.erNo);
                }

            } catch (err) {
                console.error(err);
                alert('수출통관 의뢰 처리 중 오류가 발생했습니다.');
            } finally {
                hideExportUploadLoading();
            }
        });
    }

    function bindExportAjaxSubmit(formId, errorMessage) {
        var form = document.getElementById(formId);

        if (!form) {
            return;
        }

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (typeof window.validateExportRequestForm === 'function') {
                var valid = window.validateExportRequestForm();
                if (!valid) {
                    return;
                }
            }

            var formData = new FormData(form);

            try {
                showExportUploadLoading();

                var response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    credentials: 'same-origin'
                });

                if (!response.ok) {
                    throw new Error('요청 실패: ' + response.status);
                }

                var result = await response.json();

                if (result.result) {
                    location.href = result.redirectUrl;
                    return;
                }

                alert(result.message || errorMessage);

            } catch (err) {
                console.error(err);
                alert(errorMessage);
            } finally {
                hideExportUploadLoading();
            }
        });
    }

    function showExportUploadLoading() {
        var el = document.getElementById('exportUploadLoadingOverlay');

        if (el) {
            el.style.display = 'flex';
        }
    }

    function hideExportUploadLoading() {
        var el = document.getElementById('exportUploadLoadingOverlay');

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
})();