(function () {
    'use strict';

    window.handleContractDocFiles = function (input) {
        setContractDocFileName(input);
        renderContractDocTable();
    };

    window.setContractDocFileName = function (input) {
        var target = document.getElementById('contractDocFileName');
        if (!target || !input || !input.files) return;

        if (input.files.length === 0) {
            target.textContent = 'PDF · JPG · PNG · XLSX · DOCX — 최대 20MB';
            return;
        }

        if (input.files.length === 1) {
            target.textContent = input.files[0].name;
            return;
        }

        target.textContent = input.files[0].name + ' 외 ' + (input.files.length - 1) + '개';
    };

    window.renderContractDocTable = function () {
        var input = document.getElementById('contractDocFile');
        var tbody = document.getElementById('contractDocUploadTbody');

        if (!input || !tbody) return;

        var emptyRow = tbody.querySelector('.empty-row');
        if (emptyRow) {
            emptyRow.remove();
        }

        tbody.querySelectorAll('.new-file-row').forEach(function (row) {
            row.remove();
        });

        if (!input.files || input.files.length === 0) {
            tbody.innerHTML = ''
                + '<tr class="empty-row">'
                + '  <td colspan="4" class="contract-empty-cell">'
                + '      첨부된 문서가 없습니다.'
                + '  </td>'
                + '</tr>';
            return;
        }

        Array.prototype.forEach.call(input.files, function (file, index) {
            var docType = guessContractDocType(file.name);
            var tr = document.createElement('tr');

            tr.className = 'new-file-row';

            tr.innerHTML = ''
                + '<td><span class="doc-type-pill">' + escapeHtml(docType) + '</span></td>'
                + '<td class="td-id"><span class="doc-file-name">' + escapeHtml(file.name) + '</span></td>'
                + '<td><span class="doc-status wait">추가예정</span></td>'
                + '<td class="doc-actions">'
                + '  <button type="button" class="mini mini-reject" onclick="removeContractDocRow(' + index + ')">삭제</button>'
                + '</td>';

            tbody.appendChild(tr);
        });
    };

    window.removeContractDocRow = function (removeIndex) {
        var input = document.getElementById('contractDocFile');
        if (!input || !input.files) return;

        var dt = new DataTransfer();

        Array.prototype.forEach.call(input.files, function (file, index) {
            if (index !== removeIndex) {
                dt.items.add(file);
            }
        });

        input.files = dt.files;

        setContractDocFileName(input);
        renderContractDocTable();
    };

    function guessContractDocType(fileName) {
        var name = String(fileName || '').toLowerCase();

        if (name.indexOf('invoice') > -1 || name.indexOf('송장') > -1) {
            return '상업송장';
        }

        if (name.indexOf('packing') > -1 || name.indexOf('패킹') > -1 || name.indexOf('포장') > -1) {
            return '포장명세서';
        }

        if (name.indexOf('shipping') > -1 || name.indexOf('운송') > -1 || name.indexOf('선적') > -1) {
            return '운송의뢰서';
        }

        if (name.indexOf('bl') > -1 || name.indexOf('b_l') > -1 || name.indexOf('b-l') > -1) {
            return 'B/L';
        }

        if (name.indexOf('contract') > -1 || name.indexOf('계약') > -1) {
            return '계약서';
        }

        return '기타 첨부문서';
    }

    window.updateContractTypeUI = function (type) {
        var exportCard = document.getElementById('type-card-export');
        var importCard = document.getElementById('type-card-import');

        if (!exportCard || !importCard) return;

        exportCard.classList.toggle('active', type === 'export');
        importCard.classList.toggle('active', type === 'import');
    };

    window.openTransportManagerModal = function () {
        var modal = document.getElementById('transportManagerModal');
        if (!modal) return;

        modal.classList.add('open');

        renderTransportCompanyList(window.tranManagerList || []);
        resetTransportManagerList();

        var keyword = document.getElementById('transportManagerSearchKeyword');
        if (keyword) {
            keyword.focus();
        }
    };

    window.closeTransportManagerModal = function () {
        var modal = document.getElementById('transportManagerModal');
        if (!modal) return;

        modal.classList.remove('open');
    };

    window.searchTransportCompanyList = function () {
        var keywordInput = document.getElementById('transportManagerSearchKeyword');
        var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
        var list = window.tranManagerList || [];

        var filtered = list.filter(function (item) {
            if (!keyword) return true;

            return containsIgnoreCase(item.companyName, keyword)
                || containsIgnoreCase(item.managerName, keyword)
                || containsIgnoreCase(item.companyTelNo, keyword)
                || containsIgnoreCase(item.tranMnCd, keyword)
        });

        renderTransportCompanyList(filtered);
        resetTransportManagerList();
    };

    function renderTransportCompanyList(list) {
        var box = document.getElementById('transportCompanyList');
        if (!box) return;

        if (!list || list.length === 0) {
            box.innerHTML = '<div class="contract-modal-empty">검색 결과가 없습니다.</div>';
            return;
        }

        var companyMap = {};

        list.forEach(function (item) {
            var companyName = item.companyName || '미지정 업체';

            if (!companyMap[companyName]) {
                companyMap[companyName] = {
                    companyName: companyName,
                    managerCount: 0
                };
            }

            companyMap[companyName].managerCount++;
        });

        var companies = Object.keys(companyMap).map(function (key) {
            return companyMap[key];
        });

        var html = '';

        companies.forEach(function (company) {
            html += ''
                + '<button type="button" class="contract-company-item"'
                + ' onclick="selectTransportCompany(\'' + escapeContractJs(company.companyName) + '\')">'
                + '  <div class="contract-company-name">' + escapeHtml(company.companyName) + '</div>'
                + '  <div class="contract-company-meta">소속 담당자 ' + company.managerCount + '명</div>'
                + '</button>';
        });

        box.innerHTML = html;
    }

    window.selectTransportCompany = function (companyName) {
        var list = window.tranManagerList || [];
        var managers = list.filter(function (item) {
            return String(item.companyName || '') === String(companyName || '');
        });

        var title = document.getElementById('transportManagerTitle');
        if (title) {
            title.textContent = companyName + ' 담당자';
        }

        renderTransportManagerList(managers);
    };

    function renderTransportManagerList(managers) {
        var box = document.getElementById('transportManagerList');
        if (!box) return;

        if (!managers || managers.length === 0) {
            box.innerHTML = '<div class="contract-modal-empty">소속 운송담당자가 없습니다.</div>';
            return;
        }

        var html = '';

        managers.forEach(function (manager) {
            html += ''
                + '<button type="button" class="contract-manager-pick-item"'
                + ' onclick="selectTransportManagerFinal('
                + '\'' + escapeContractJs(manager.tmNo) + '\','
                + '\'' + escapeContractJs(manager.companyName) + '\','
                + '\'' + escapeContractJs(manager.managerName) + '\','
                + '\'' + escapeContractJs(manager.companyTelNo) + '\''
                + ')">'
                + '  <div class="contract-manager-name">' + escapeHtml(manager.managerName || '-') + '</div>'
                /*
                + '  <div class="contract-manager-meta">' + escapeHtml(manager.telNo || '-') + '</div>'
                + '  <div class="contract-manager-email">' + escapeHtml(manager.email || '-') + '</div>'
                 */
                + '</button>';
        });

        box.innerHTML = html;
    }

    window.selectTransportManagerFinal = function (tmNo, companyName, managerName, companyTelNo) {
        var hidden = document.getElementById('trcTmNo');
        var input = document.getElementById('selectedForwarderInput');

        if (hidden) {
            hidden.value = tmNo;
        }

        if (input) {
            input.value = companyName + ' · ' + managerName + ' · ' + companyTelNo;
        }

        closeTransportManagerModal();
    };

    function resetTransportManagerList() {
        var title = document.getElementById('transportManagerTitle');
        var box = document.getElementById('transportManagerList');

        if (title) {
            title.textContent = '운송담당자';
        }

        if (box) {
            box.innerHTML = '<div class="contract-modal-empty">먼저 운송업체를 선택하세요.</div>';
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('transportContractForm');

        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var trcTmNo = document.getElementById('trcTmNo');

            if (!trcTmNo || !trcTmNo.value) {
                alert('운송담당자를 선택해주세요.');
                return;
            }

            var fileInput = document.getElementById('contractDocFile');
            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                alert('첨부 문서를 선택해주세요.');
                return;
            }

            var formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData
            })
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    if (data.result === 'OK') {
                        alert(data.message || '운송의뢰 등록이 완료되었습니다.');

                        if (data.redirectUrl) {
                            location.href = data.redirectUrl;
                        }

                        return;
                    }

                    alert(data.message || '운송의뢰 등록에 실패했습니다.');
                })
                .catch(function () {
                    alert('운송의뢰 등록 중 오류가 발생했습니다.');
                });
        });
    });

    function containsIgnoreCase(value, keyword) {
        return String(value || '').toLowerCase().indexOf(keyword) > -1;
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function escapeContractJs(str) {
        return String(str || '')
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'");
    }
})();