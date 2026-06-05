<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<c:set var="mp" value="${requestScope.menuPermissions}" />

<c:if test="${menuPermissionEnabled eq true}">
    <style>
        <c:if test="${mp['/transport/dashboard.do'].readYn ne 'Y'}">#sideNav a[data-url$="/transport/dashboard.do"]{display:none!important;}</c:if>

        <c:if test="${mp['/transport/export.do?tab=request'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-FW-001"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/export.do?tab=manifest'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-FW-011"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/export.do?tab=request'].readYn ne 'Y' and mp['/transport/export.do?tab=manifest'].readYn ne 'Y'}">#sideNav [data-group-wrap="export"]{display:none!important;}</c:if>

        <c:if test="${mp['/transport/import.do?tab=request'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-FW-015"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/import.do?tab=arrival'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-FW-020"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/import.do?tab=manifest'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-FW-023"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/import.do?tab=inbound'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-FW-025"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/import.do?tab=do'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-FW-030"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/import.do?tab=release'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-FW-033"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/import.do?tab=inland'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-FW-035"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/import.do?tab=request'].readYn ne 'Y' and mp['/transport/import.do?tab=arrival'].readYn ne 'Y' and mp['/transport/import.do?tab=manifest'].readYn ne 'Y' and mp['/transport/import.do?tab=inbound'].readYn ne 'Y' and mp['/transport/import.do?tab=do'].readYn ne 'Y' and mp['/transport/import.do?tab=release'].readYn ne 'Y' and mp['/transport/import.do?tab=inland'].readYn ne 'Y'}">#sideNav [data-group-wrap="import"]{display:none!important;}</c:if>

        <c:if test="${mp['/transport/docs.do'].readYn ne 'Y'}">#sideNav a[data-url$="/transport/docs.do"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/docs/trash.do'].readYn ne 'Y'}">#sideNav a[data-url$="/transport/docs/trash.do"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/docs.do'].readYn ne 'Y' and mp['/transport/docs/trash.do'].readYn ne 'Y'}">#sideNav [data-group-wrap="docs"]{display:none!important;}</c:if>

        <c:if test="${mp['/transport/community.do?tab=notice'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-CM-001"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/community.do?tab=data'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-CM-003"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/community.do?tab=cs'].readYn ne 'Y'}">#sideNav a[data-item-id="TACS-CM-004"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/community.do?tab=notice'].readYn ne 'Y' and mp['/transport/community.do?tab=data'].readYn ne 'Y' and mp['/transport/community.do?tab=cs'].readYn ne 'Y'}">#sideNav [data-group-wrap="community"]{display:none!important;}</c:if>

        <c:if test="${mp['/transport/mypage.do?tab=profile'].readYn ne 'Y'}">#sideNav a[data-url*="/transport/mypage.do?tab=profile"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/mypage.do?tab=alarm'].readYn ne 'Y'}">#sideNav a[data-url*="/transport/mypage.do?tab=alarm"]{display:none!important;}</c:if>
        <c:if test="${mp['/transport/mypage.do?tab=profile'].readYn ne 'Y' and mp['/transport/mypage.do?tab=alarm'].readYn ne 'Y'}">#sideNav [data-group-wrap="mypage"]{display:none!important;}</c:if>
    </style>
</c:if>

<%
    String transportActiveGroup = (String) request.getAttribute("transportInitialGroup");
    String transportActiveItem = (String) request.getAttribute("transportInitialItem");
    String transportUri = request.getRequestURI();

    if (transportActiveGroup == null || transportActiveGroup.trim().isEmpty()) {
        if (transportUri != null && transportUri.contains("/transport/export.do")) {
            transportActiveGroup = "export";
        } else if (transportUri != null && transportUri.contains("/transport/import.do")) {
            transportActiveGroup = "import";
        } else if (transportUri != null && transportUri.contains("/transport/docs.do")) {
            transportActiveGroup = "docs";
        } else if (transportUri != null && transportUri.contains("/transport/community.do")) {
            transportActiveGroup = "community";
        } else if (transportUri != null && transportUri.contains("/transport/mypage.do")) {
            transportActiveGroup = "mypage";
        } else {
            transportActiveGroup = "dashboard";
        }
    }

    if (transportActiveItem == null || transportActiveItem.trim().isEmpty()) {
        String pageParam = request.getParameter("page");
        String tabParam = request.getParameter("tab");
        if (pageParam != null && !pageParam.trim().isEmpty()) {
            transportActiveItem = pageParam;
        } else if (tabParam != null && !tabParam.trim().isEmpty()) {
            if ("request".equals(tabParam)) {
                transportActiveItem = "TACS-FW-001";
                if ("import".equals(transportActiveGroup)) {
                    transportActiveItem = "TACS-FW-015";
                }
            } else if ("arrival".equals(tabParam)) {
                transportActiveItem = "TACS-FW-020";
            } else if ("manifest".equals(tabParam)) {
                transportActiveItem = "TACS-FW-011";
                if ("import".equals(transportActiveGroup)) {
                    transportActiveItem = "TACS-FW-023";
                }
            } else if ("inbound".equals(tabParam)) {
                transportActiveItem = "TACS-FW-025";
            } else if ("do".equals(tabParam)) {
                transportActiveItem = "TACS-FW-030";
            } else if ("release".equals(tabParam)) {
                transportActiveItem = "TACS-FW-033";
            } else if ("inland".equals(tabParam)) {
                transportActiveItem = "TACS-FW-035";
            } else if ("notice".equals(tabParam)) {
                transportActiveItem = "TACS-CM-001";
            } else if ("data".equals(tabParam)) {
                transportActiveItem = "TACS-CM-003";
            } else if ("cs".equals(tabParam)) {
                transportActiveItem = "TACS-CM-004";
            }
        } else if ("export".equals(transportActiveGroup)) {
            transportActiveItem = "TACS-FW-001";
        } else if ("import".equals(transportActiveGroup)) {
            transportActiveItem = "TACS-FW-015";
        } else if ("docs".equals(transportActiveGroup)) {
            transportActiveItem = "TACS-DC-001";
        } else if ("community".equals(transportActiveGroup)) {
            transportActiveItem = "TACS-CM-001";
        } else if ("mypage".equals(transportActiveGroup)) {
            transportActiveItem = "TACS-MY-001";
        } else {
            transportActiveItem = "";
        }
    }

    request.setAttribute("transportInitialGroup", transportActiveGroup);
    request.setAttribute("transportInitialItem", transportActiveItem);
%>

<aside class="fixed left-0 top-0 h-full w-72 bg-slate-100 flex flex-col z-50">
    <div class="px-6 py-6 flex-shrink-0 border-b border-slate-200">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-primary flex items-center justify-center">
                <span class="material-symbols-outlined text-on-primary text-xl">local_shipping</span>
            </div>
            <div>
                <h1 class="text-lg font-bold text-slate-900 leading-tight">&#50868;&#49569;&#45812;&#45817;&#51088;</h1>
                <p class="text-[10px] text-on-surface-variant font-medium tracking-widest uppercase">TACS TRANSPORT MANAGER</p>
            </div>
        </div>
    </div>

    <nav id="sideNav" class="flex-1 sidebar-scroll py-3" data-static-sidebar="true">
        <div class="mb-1">
            <a href="#" data-url="${pageContext.request.contextPath}/transport/dashboard.do" class="menu-item menu-dashboard flex items-center justify-between px-6 py-3 text-sm text-slate-700 <%= "dashboard".equals(transportActiveGroup) ? "active" : "" %>" data-group="dashboard">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-lg">dashboard</span>
                    <span>&#45824;&#49884;&#48372;&#46300;</span>
                </div>
            </a>
        </div>

        <div class="mb-1 menu-group" data-group-wrap="export">
            <div class="menu-row flex items-center" data-group-row="export">
                <a href="#" data-url="${pageContext.request.contextPath}/transport/export.do?tab=request" class="menu-item flex-1 flex items-center px-6 py-3 text-sm text-slate-700 <%= "export".equals(transportActiveGroup) ? "active" : "" %>" data-group="export">
                    <span class="material-symbols-outlined text-lg">local_shipping</span>
                    <span>&#49688;&#52636;&#50868;&#49569;</span>
                </a>
                <button type="button" class="menu-toggle px-4 py-3 text-slate-700" data-group="export" aria-label="export menu toggle">
                    <span class="material-symbols-outlined menu-arrow <%= "export".equals(transportActiveGroup) ? "rotated" : "" %>">chevron_right</span>
                </button>
            </div>
            <div class="menu-children <%= "export".equals(transportActiveGroup) ? "open" : "" %>">
                <a href="#" data-url="${pageContext.request.contextPath}/transport/export.do?tab=request" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "export".equals(transportActiveGroup) && "TACS-FW-001".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="export" data-item-id="TACS-FW-001">&#50868;&#49569;&#51032;&#47280;</a>
                <a href="#" data-url="${pageContext.request.contextPath}/transport/export.do?tab=manifest" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "export".equals(transportActiveGroup) && "TACS-FW-011".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="export" data-item-id="TACS-FW-011">&#51201;&#54616;&#47785;&#47197; &#51089;&#49457; &#48143; &#51228;&#52636;</a>
            </div>
        </div>

        <div class="mb-1 menu-group" data-group-wrap="import">
            <div class="menu-row flex items-center" data-group-row="import">
                <a href="#" data-url="${pageContext.request.contextPath}/transport/import.do?tab=request" class="menu-item flex-1 flex items-center px-6 py-3 text-sm text-slate-700 <%= "import".equals(transportActiveGroup) ? "active" : "" %>" data-group="import">
                    <span class="material-symbols-outlined text-lg">inventory_2</span>
                    <span>&#49688;&#51077;&#50868;&#49569;</span>
                </a>
                <button type="button" class="menu-toggle px-4 py-3 text-slate-700" data-group="import" aria-label="import menu toggle">
                    <span class="material-symbols-outlined menu-arrow <%= "import".equals(transportActiveGroup) ? "rotated" : "" %>">chevron_right</span>
                </button>
            </div>
            <div class="menu-children <%= "import".equals(transportActiveGroup) ? "open" : "" %>">
                <a href="#" data-url="${pageContext.request.contextPath}/transport/import.do?tab=request" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "import".equals(transportActiveGroup) && "TACS-FW-015".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="import" data-item-id="TACS-FW-015">운송의뢰</a>
                <a href="#" data-url="${pageContext.request.contextPath}/transport/import.do?tab=arrival" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "import".equals(transportActiveGroup) && "TACS-FW-020".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="import" data-item-id="TACS-FW-020">도착예정 및 입항추적</a>
                <a href="#" data-url="${pageContext.request.contextPath}/transport/import.do?tab=manifest" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "import".equals(transportActiveGroup) && "TACS-FW-023".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="import" data-item-id="TACS-FW-023">적하목록 조회</a>
                <a href="#" data-url="${pageContext.request.contextPath}/transport/import.do?tab=inbound" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "import".equals(transportActiveGroup) && "TACS-FW-025".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="import" data-item-id="TACS-FW-025">보세구역 입고관리</a>
                <a href="#" data-url="${pageContext.request.contextPath}/transport/import.do?tab=do" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "import".equals(transportActiveGroup) && "TACS-FW-030".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="import" data-item-id="TACS-FW-030">D/O 관리</a>
                <a href="#" data-url="${pageContext.request.contextPath}/transport/import.do?tab=release" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "import".equals(transportActiveGroup) && "TACS-FW-033".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="import" data-item-id="TACS-FW-033">보세구역 반출관리</a>
                <a href="#" data-url="${pageContext.request.contextPath}/transport/import.do?tab=inland" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "import".equals(transportActiveGroup) && "TACS-FW-035".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="import" data-item-id="TACS-FW-035">내륙운송 배차처리</a>
            </div>
        </div>

        <div class="mb-1 menu-group" data-group-wrap="docs">
            <div class="menu-row flex items-center" data-group-row="docs">
                <a href="#" data-url="${pageContext.request.contextPath}/transport/docs.do" class="menu-item flex-1 flex items-center px-6 py-3 text-sm text-slate-700 <%= "docs".equals(transportActiveGroup) ? "active" : "" %>" data-group="docs">
                    <span class="material-symbols-outlined text-lg">folder</span>
                    <span>&#47928;&#49436;&#54632;</span>
                </a>
                <button type="button" class="menu-toggle px-4 py-3 text-slate-700" data-group="docs" aria-label="docs menu toggle">
                    <span class="material-symbols-outlined menu-arrow <%= "docs".equals(transportActiveGroup) ? "rotated" : "" %>">chevron_right</span>
                </button>
            </div>
            <div class="menu-children <%= "docs".equals(transportActiveGroup) ? "open" : "" %>">
                <a href="#" data-url="${pageContext.request.contextPath}/transport/docs.do" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "docs".equals(transportActiveGroup) && ("TACS-DC-001".equals(transportActiveItem) || transportActiveItem == null) ? "active-sub" : "" %>" data-group="docs" data-item-id="TACS-DC-001">내문서</a>
                <a href="#" data-url="${pageContext.request.contextPath}/transport/docs/trash.do" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "docs".equals(transportActiveGroup) && "TACS-DC-002".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="docs" data-item-id="TACS-DC-002">휴지통</a>
            </div>
        </div>

        <div class="mb-1 menu-group" data-group-wrap="community">
            <div class="menu-row flex items-center" data-group-row="community">
                <a href="#" data-url="${pageContext.request.contextPath}/transport/community.do?tab=notice" class="menu-item flex-1 flex items-center px-6 py-3 text-sm text-slate-700 <%= "community".equals(transportActiveGroup) ? "active" : "" %>" data-group="community">
                    <span class="material-symbols-outlined text-lg">forum</span>
                    <span>&#52964;&#48036;&#45768;&#54000;</span>
                </a>
                <button type="button" class="menu-toggle px-4 py-3 text-slate-700" data-group="community" aria-label="community menu toggle">
                    <span class="material-symbols-outlined menu-arrow <%= "community".equals(transportActiveGroup) ? "rotated" : "" %>">chevron_right</span>
                </button>
            </div>
            <div class="menu-children <%= "community".equals(transportActiveGroup) ? "open" : "" %>">
                <a href="#" data-url="${pageContext.request.contextPath}/transport/community.do?tab=notice" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "community".equals(transportActiveGroup) && "TACS-CM-001".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="community" data-item-id="TACS-CM-001">공지사항</a>
                <a href="#" data-url="${pageContext.request.contextPath}/transport/community.do?tab=data" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "community".equals(transportActiveGroup) && "TACS-CM-003".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="community" data-item-id="TACS-CM-003">자료실</a>
                <a href="#" data-url="${pageContext.request.contextPath}/transport/community.do?tab=cs" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "community".equals(transportActiveGroup) && "TACS-CM-004".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="community" data-item-id="TACS-CM-004">고객센터</a>
            </div>
        </div>

        <div class="mb-1 menu-group" data-group-wrap="mypage">
            <div class="menu-row flex items-center" data-group-row="mypage">
                <a href="#" data-url="${pageContext.request.contextPath}/transport/mypage.do" class="menu-item flex-1 flex items-center px-6 py-3 text-sm text-slate-700 <%= "mypage".equals(transportActiveGroup) ? "active" : "" %>" data-group="mypage">
                    <span class="material-symbols-outlined text-lg">person</span>
                    <span>&#47560;&#51060;&#54168;&#51060;&#51648;</span>
                </a>
                <button type="button" class="menu-toggle px-4 py-3 text-slate-700" data-group="mypage" aria-label="mypage menu toggle">
                    <span class="material-symbols-outlined menu-arrow <%= "mypage".equals(transportActiveGroup) ? "rotated" : "" %>">chevron_right</span>
                </button>
            </div>
            <div class="menu-children <%= "mypage".equals(transportActiveGroup) ? "open" : "" %>">
                <a href="#" data-url="${pageContext.request.contextPath}/transport/mypage.do?tab=profile" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "mypage".equals(transportActiveGroup) && ("TACS-MY-001".equals(transportActiveItem) || transportActiveItem == null) ? "active-sub" : "" %>" data-group="mypage" data-item-id="TACS-MY-001">회원정보 수정</a>
                <a href="#" data-url="${pageContext.request.contextPath}/transport/mypage.do?tab=alarm" class="sub-item block pl-16 pr-6 py-2 text-sm text-slate-600 <%= "mypage".equals(transportActiveGroup) && "TACS-MY-002".equals(transportActiveItem) ? "active-sub" : "" %>" data-group="mypage" data-item-id="TACS-MY-002">알림 수신 설정</a>
            </div>
        </div>
    </nav>

    <div class="px-6 py-4 border-t border-slate-200">
        <form action="${pageContext.request.contextPath}/logout" method="post" id="logoutForm" style="display:none;">
            <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
        </form>
        <a href="javascript:void(0)" onclick="document.getElementById('logoutForm').submit();" class="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 transition-colors rounded-lg">
            <span class="material-symbols-outlined text-lg">logout</span>
            <span>로그아웃</span>
        </a>
    </div>
</aside>
