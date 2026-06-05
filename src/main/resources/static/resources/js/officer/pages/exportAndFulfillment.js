(function () {
    function valueOrDash(value) {
        if (value === undefined || value === null || String(value).trim() === '') {
            return '-';
        }
        return String(value);
    }

    function getMemoKey(reqNo) {
        return 'exportAndFulfillmentMemo:' + valueOrDash(reqNo);
    }

    function escapeHtml(value) {
        return valueOrDash(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function loadItemRows(reqNo, declareType) {
        var body = document.getElementById('fulfillmentItemBody');
        if (!body) return;

        if (!reqNo || reqNo === '-') {
            body.innerHTML = '<tr><td colspan="3" class="empty-cell">품목 내역을 조회할 신고번호가 없습니다.</td></tr>';
            return;
        }

        body.innerHTML = '<tr><td colspan="3" class="empty-cell">품목 내역 조회 중...</td></tr>';

        var url = 'exportAndFulfillmentItems.do?reqNo=' + encodeURIComponent(reqNo);
        if (declareType) {
            url += '&declareType=' + encodeURIComponent(declareType);
        }

        fetch(url, { headers: { 'Accept': 'application/json' } })
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function (items) {
                if (!items || !items.length) {
                    body.innerHTML = '<tr><td colspan="3" class="empty-cell">조회된 품목 내역이 없습니다.</td></tr>';
                    return;
                }

                body.innerHTML = items.map(function (item) {
                    return '<tr>'
                        + '<td>' + escapeHtml(item.goodsName) + '</td>'
                        + '<td>' + escapeHtml(item.totalQty) + '</td>'
                        + '<td>' + escapeHtml(item.totalWeight) + '</td>'
                        + '</tr>';
                }).join('');
            })
            .catch(function () {
                body.innerHTML = '<tr><td colspan="3" class="empty-cell">품목 내역을 불러오지 못했습니다.</td></tr>';
            });
    }


    function fillDetail(row) {
        var panel = document.getElementById('fulfillmentDetailPanel');
        if (!panel || !row) return;

        var map = {
            workTypeNm: row.cells[1] ? row.cells[1].innerText.trim() : row.dataset.workType,
            declareTypeNm: row.dataset.declareTypeNm,
            reqNo: row.dataset.reqNo,
            declareType: row.dataset.declareType,
            statusNm: row.dataset.statusNm,
            ownerName: row.dataset.ownerName,
            goodsName: row.dataset.goodsName,
            totalQty: row.dataset.totalQty,
            totalWeight: row.dataset.totalWeight,
            cargoMngNo: row.dataset.cargoMngNo,
            blNo: row.dataset.blNo,
            mblNo: row.dataset.mblNo,
            arrivalPort: row.dataset.arrivalPort,
            declareDate: row.dataset.declareDate,
            approveDate: row.dataset.approveDate,
            baseDate: row.dataset.baseDate,
            memo: row.dataset.memo
        };

        Object.keys(map).forEach(function (key) {
            var target = panel.querySelector('[data-detail="' + key + '"]');
            if (!target) return;

            if (target.tagName && target.tagName.toLowerCase() === 'textarea') {
                var savedMemo = localStorage.getItem(getMemoKey(map.reqNo));
                target.value = savedMemo !== null ? savedMemo : (map[key] && map[key] !== '-' ? map[key] : '');
                target.setAttribute('data-memo-key', getMemoKey(map.reqNo));
            } else {
                target.textContent = valueOrDash(map[key]);
            }
        });

        loadItemRows(map.reqNo, map.declareType);

        var saved = document.getElementById('fulfillmentMemoSavedText');
        if (saved) saved.textContent = '';

        var title = document.getElementById('detailTitle');
        var subTitle = document.getElementById('detailSubTitle');
        if (title) title.textContent = valueOrDash(map.workTypeNm) + ' 상세정보';
        if (subTitle) subTitle.textContent = valueOrDash(map.reqNo) + ' · ' + valueOrDash(map.ownerName);

        var existing = document.getElementById('fulfillmentDetailInlineRow');
        if (existing) existing.parentNode.removeChild(existing);

        var colCount = row.closest('table').querySelectorAll('thead th').length;
        var tr = document.createElement('tr');
        tr.id = 'fulfillmentDetailInlineRow';
        tr.className = 'fulfillment-detail-inline-row';
        var td = document.createElement('td');
        td.colSpan = colCount;
        td.className = 'fulfillment-detail-inline-cell';
        panel.style.display = 'block';
        td.appendChild(panel);
        tr.appendChild(td);
        row.parentNode.insertBefore(tr, row.nextSibling);
    }

    function closeDetail() {
        var panel = document.getElementById('fulfillmentDetailPanel');
        var inlineRow = document.getElementById('fulfillmentDetailInlineRow');

        if (panel) {
            panel.style.display = 'none';
            document.body.appendChild(panel);
        }

        if (inlineRow && inlineRow.parentNode) {
            inlineRow.parentNode.removeChild(inlineRow);
        }

        document.querySelectorAll('.fulfillment-row.is-open').forEach(function (row) {
            row.classList.remove('is-open');
        });
    }

    function openDetailByRow(row) {
        if (!row) return;

        var existingRow = document.getElementById('fulfillmentDetailInlineRow');
        var isSameOpen = existingRow && existingRow.previousSibling === row && row.classList.contains('is-open');

        if (isSameOpen) {
            closeDetail();
            return;
        }

        closeDetail();
        row.classList.add('is-open');
        fillDetail(row);
    }

    function bindRows() {
        document.addEventListener('click', function (e) {
            var detailBtn = e.target && e.target.closest ? e.target.closest('.btn-detail-toggle') : null;
            var row = detailBtn ? detailBtn.closest('.fulfillment-row') : (e.target && e.target.closest ? e.target.closest('.fulfillment-row') : null);

            if (!row) return;
            if (!detailBtn && e.target.closest('a, input, select, textarea, label, button')) return;

            e.preventDefault();
            e.stopPropagation();
            openDetailByRow(row);
        }, true);
    }

    function bindSearchButtons() {
        var resetBtn = document.getElementById('btnResetFulfillment');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                window.location.href = window.location.pathname;
            });
        }

        var recentBtn = document.getElementById('btnRecentWeek');
        if (recentBtn) {
            recentBtn.addEventListener('click', function () {
                var form = recentBtn.closest('form');
                if (!form) return;

                var end = new Date();
                var start = new Date();
                start.setDate(end.getDate() - 7);

                var startInput = form.querySelector('input[name="startDate"]');
                var endInput = form.querySelector('input[name="endDate"]');
                if (startInput) startInput.value = toDateValue(start);
                if (endInput) endInput.value = toDateValue(end);
            });
        }

        var saveMemoBtn = document.getElementById('btnSaveFulfillmentMemo');
        if (saveMemoBtn) {
            saveMemoBtn.addEventListener('click', function () {
                var memo = document.getElementById('fulfillmentMemo');
                var saved = document.getElementById('fulfillmentMemoSavedText');
                if (!memo) return;

                var key = memo.getAttribute('data-memo-key');
                if (!key) return;

                localStorage.setItem(key, memo.value || '');
                if (saved) {
                    saved.textContent = '메모가 저장되었습니다.';
                    setTimeout(function () { saved.textContent = ''; }, 1800);
                }
            });
        }

    }

    function toDateValue(date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    document.addEventListener('DOMContentLoaded', function () {
        bindRows();
        bindSearchButtons();
    });
})();