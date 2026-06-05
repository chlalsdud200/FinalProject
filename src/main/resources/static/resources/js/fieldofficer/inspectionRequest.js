// =========================================================
// TACS 현장공무원 검역 요청 조회 - TOAST UI Grid 화면 스크립트
// =========================================================

$(function() {
	console.log('inspectionRequest.js 파일 로드됨');
	console.log('inspectionRequest.js 실행됨');
    console.log('contextPath = ', contextPath);
    console.log('TacsGrid = ', TacsGrid);


    /*
     * 검역 요청 조회 Grid 생성
     *
     * 공통 모듈:
     * - /resources/js/common/toast-grid.js
     *
     * 이 화면에서는 컬럼, 조회 URL, 행 클릭 이동만 설정한다.
     */
    var inspectionRequestGrid = TacsGrid.create({
        el: 'inspectionRequestGrid',
        perPage: 10,
        bodyHeight: 420,

        columns: [
            {
                header: '검역요청번호',
                name: 'iirReqNo',
                align: 'center',
                width: 150,
				sortable: true
            },
            {
                header: '수입통관의뢰번호',
                name: 'iirAplyNo',
                align: 'center',
                width: 170,
				sortable: true
            },
            {
                header: '대표품목명',
                name: 'iirMainGoodsNm',
                minWidth: 180,
				sortable: true
            },
            {
                header: '대표 HS코드',
                name: 'iirMainHsCd',
                align: 'center',
                width: 130,
				sortable: true
            },
            {
                header: '검역장소',
                name: 'iilNm',
                minWidth: 180,
				sortable: true
            },
			{
			    header: '요청상태',
			    name: 'iirStatusNm',
			    align: 'center',
			    width: 110,
			    sortable: true
			},
			{
			    header: '판정상태',
			    name: 'iirResultStatusNm',
			    align: 'center',
			    width: 130,
			    sortable: true
			},
            {
                header: '회신기한',
                name: 'iirRplyDdlineDt',
                align: 'center',
                width: 120,
				sortable: true
            },
			{
			    header: '상세',
			    name: 'detailBtn',
			    align: 'center',
			    width: 90,
			    formatter: function() {
			        return '<button type="button" class="grid-detail-btn">상세</button>';
			    }
			}
        ]       
    });
	
	inspectionRequestGrid.on('click', function(ev) {
	    console.log('Grid 직접 클릭 이벤트:', ev);

	    // 상세 버튼 컬럼이 아니면 이동하지 않음
	    if (ev.columnName !== 'detailBtn') {
	        return;
	    }

	    if (ev.rowKey === null || ev.rowKey === undefined) {
	        return;
	    }

	    var rowData = inspectionRequestGrid.getRow(ev.rowKey);
	    console.log('상세 이동 rowData:', rowData);

	    if (!rowData || !rowData.iirReqNo) {
	        alert('검역요청번호가 없습니다.');
	        return;
	    }

	    location.href = window.contextPath
	        + '/fieldofficer/inspectionRequest/detail.do?reqNo='
	        + encodeURIComponent(rowData.iirReqNo);
	});
	
	/*
	 * 토스트 경고 표시
	 */
	function showTacsToast(message) {
	    $('.tacs-toast').remove();

	    var toast = $('<div>')
	        .addClass('tacs-toast')
	        .text(message);

	    $('body').append(toast);

	    setTimeout(function() {
	        toast.addClass('show');
	    }, 10);

	    setTimeout(function() {
	        toast.removeClass('show');

	        setTimeout(function() {
	            toast.remove();
	        }, 250);
	    }, 2500);
	}

	/*
	 * 회신기한 시작일 / 종료일 검증
	 */
	function validateReplyDeadlineRange() {
	    var startDt = $('#rplyDdlineStartDt').val();
	    var endDt = $('#rplyDdlineEndDt').val();

	    if (startDt && endDt && endDt < startDt) {
	        $('#rplyDdlineEndDt').val('');
	        $('#rplyDdlineEndDt').focus();

	        showTacsToast('회신기한 종료일은 시작일보다 빠를 수 없습니다.');

	        return false;
	    }

	    return true;
	}

    /*
     * 검역 요청 목록 조회
     */
    function loadInspectionRequestGrid() {
		console.log("gridData.do 호출 시작");
		
        var params = $('#receiptSearchForm').serialize();

        TacsGrid.load(
            inspectionRequestGrid,
            window.contextPath + '/fieldofficer/inspectionRequest/gridData.do',
            params
        );
    }
	
	/*
	 * 회신기한 날짜 변경 시 검증
	 */
	$('#rplyDdlineStartDt, #rplyDdlineEndDt').on('change', function() {
	    validateReplyDeadlineRange();
	});
	

    /*
     * 조회 버튼 클릭
     */
	$('#inspectionSearchBtn').on('click', function() {
	    if (!validateReplyDeadlineRange()) {
	        return;
	    }

	    loadInspectionRequestGrid();
	});

    /*
     * 검색 form submit 방지
     * - Enter 입력 시 페이지 새로고침 방지
     * - AJAX Grid 조회 실행
     */
	$('#receiptSearchForm').on('submit', function(e) {
	    e.preventDefault();

	    if (!validateReplyDeadlineRange()) {
	        return;
	    }

	    loadInspectionRequestGrid();
	});

    /*
     * 초기화 버튼 클릭
     */
    $('#inspectionResetBtn').on('click', function() {
        $('#receiptSearchForm')[0].reset();
        loadInspectionRequestGrid();
    });
	
	/*
	 * 엑셀 다운로드 버튼 클릭
	 */
	$('#inspectionExcelBtn').on('click', function() {
	    if (!validateReplyDeadlineRange()) {
	        return;
	    }

	    var params = $('#receiptSearchForm').serialize();

	    location.href = window.contextPath
	        + '/fieldofficer/inspectionRequest/excelDownload.do?'
	        + params;
	});

    /*
     * 화면 최초 진입 시 Grid 조회
     */
    loadInspectionRequestGrid();

});