/*
 * TACS 공통 TOAST UI Grid 모듈
 *
 * 역할:
 * 1. TOAST UI Grid 기본 옵션을 공통으로 관리한다.
 * 2. 화면별 JS에서는 컬럼, 조회 URL, 클릭 이벤트만 넘겨서 사용한다.
 * 3. Grid 데이터 조회 AJAX 처리를 공통화한다.
 */
var TacsGrid = {

    /*
     * Grid 생성 함수
     *
     * 사용 예:
     * var grid = TacsGrid.create({
     *     el: 'inspectionRequestGrid',
     *     columns: [...],
     *     onClick: function(rowData) { ... }
     * });
     */
    create: function(options) {

        if (!options || !options.el) {
            console.error('Grid를 생성할 영역 ID가 없습니다.');
            return null;
        }

        var targetEl = document.getElementById(options.el);

        if (!targetEl) {
            console.error('Grid 영역을 찾을 수 없습니다. id = ' + options.el);
            return null;
        }

        var grid = new tui.Grid({
            el: targetEl,

            // 처음에는 빈 데이터로 생성하고, AJAX 조회 후 resetData로 채운다.
            data: [],

            // 화면별 컬럼 설정
            columns: options.columns || [],

            // 공통 Grid 크기
            bodyHeight: options.bodyHeight || 420,
            rowHeight: options.rowHeight || 42,
            minRowHeight: 42,

            // 화면 깨짐 방지용 기본 설정
            scrollX: true,
            scrollY: true,

            // 일단 클라이언트 페이징 사용
            // 나중에 데이터가 많아지면 서버 페이징으로 변경 가능
            pageOptions: {
                useClient: true,
                perPage: options.perPage || 10
            },

            // 행 번호 표시
            rowHeaders: options.rowHeaders || ['rowNum']
        });

        /*
         * 행 클릭 이벤트 공통 처리
         * - 헤더 클릭, 빈 영역 클릭은 무시
         * - 실제 데이터 행 클릭 시 rowData를 화면별 함수로 넘김
         */
        if (options.onClick) {
            grid.on('click', function(ev) {
				console.log('Grid click event:', ev);

                if (ev.rowKey == null) {
                    return;
                }

                var rowData = grid.getRow(ev.rowKey);
				console.log('Grid rowData:', rowData);
				
                if (!rowData) {
                    return;
                }

                options.onClick(rowData.ev);
            });
        }

        return grid;
    },

    /*
     * Grid 데이터 조회 함수
     *
     * 사용 예:
     * TacsGrid.load(grid, '/fieldofficer/inspectionRequest/gridData.do', params);
     */
    load: function(grid, url, params) {

        if (!grid) {
            console.error('Grid 객체가 없습니다.');
            return;
        }

        if (!url) {
            console.error('Grid 조회 URL이 없습니다.');
            return;
        }

        $.ajax({
            url: url,
            type: 'get',
            data: params || {},
            dataType: 'json',

            success: function(res) {
                /*
                 * Controller가 List 형태로 내려주면 그대로 resetData
                 * 예: [{...}, {...}]
                 */
                if ($.isArray(res)) {
                    grid.resetData(res);
                    return;
                }

                /*
                 * 나중에 서버 페이징 구조로 바꿀 경우를 대비
                 * 예: { dataList: [...], totalRecord: 100 }
                 */
                if (res && $.isArray(res.dataList)) {
                    grid.resetData(res.dataList);
                    return;
                }

                console.warn('Grid 응답 데이터 형식이 예상과 다릅니다.', res);
                grid.resetData([]);
            },

            error: function(xhr) {
                console.error('Grid 조회 실패', xhr);
                alert('목록 조회 중 오류가 발생했습니다.');
            }
        });
    }
};