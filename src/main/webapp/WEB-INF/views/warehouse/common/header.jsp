<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.springframework.security.core.Authentication" %>
<%@ page import="org.springframework.security.core.context.SecurityContextHolder" %>
<%@ page import="kr.or.tacs.vo.common.CustomUser" %>

<%
    /*
     * 현재 로그인한 사용자 정보 표시용
     *
     * CustomUser에는 AuthUserVO가 들어 있고,
     * getLoginNm()으로 로그인 사용자명을 꺼낼 수 있다.
     *
     * 여기서 DB를 다시 조회하지 않는 이유:
     * 로그인할 때 CustomUserDetailsService가 이미 AuthUserVO를 principal에 담아두기 때문.
     */
    String loginUserName = "창고관리자";
    String loginUserRoleName = "창고관리자";
    String loginUserInitial = "창";

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth != null && auth.getPrincipal() instanceof CustomUser) {
        CustomUser loginUser = (CustomUser) auth.getPrincipal();

        if (loginUser.getLoginNm() != null && loginUser.getLoginNm().trim().length() > 0) {
            loginUserName = loginUser.getLoginNm();
            loginUserInitial = loginUserName.substring(0, 1);
        }

        if (loginUser.getRoleNm() != null && loginUser.getRoleNm().trim().length() > 0) {
            loginUserRoleName = loginUser.getRoleNm();
        }
    }
%>

<!-- ── Topbar ── -->
<header class="topbar">
    <div class="tb-left">
        <!-- TACS 클릭 시 창고관리자 대시보드로 이동 -->
        <a class="tb-brand"
           href="${pageContext.request.contextPath}/warehouse/dashboard.do"
           style="text-decoration:none; color:inherit; cursor:pointer;">
            TACS
        </a>
    </div>

    <div class="tb-right">
        <% if (request.isUserInRole("SYSTEM_ADMIN")) { %>
        <button class="tb-btn" title="액터 목록" onclick="location.href='${pageContext.request.contextPath}/systemadmin/dashboard.do'">
            <span class="material-symbols-outlined">list</span>
        </button>
        <% } %>

        <jsp:include page="/WEB-INF/views/common/notification_bell.jsp" />

        <div class="tb-sep"></div>

        <div class="tb-user">
            <div class="tb-user-info">
                <div class="name"><%= loginUserName %> <%= loginUserRoleName %></div>
                <div class="role">TACS 창고관리 포털 · DEMO</div>
            </div>

            <div class="tb-avatar"
                 onclick="if(confirm('로그아웃 하시겠습니까?')) document.getElementById('logoutForm').submit();"
                 style="cursor:pointer">
                <%= loginUserInitial %>
            </div>
        </div>
    </div>
</header>