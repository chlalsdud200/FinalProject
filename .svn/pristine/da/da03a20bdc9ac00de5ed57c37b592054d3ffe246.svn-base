<%@ page pageEncoding="UTF-8" %>
<%@ page import="org.springframework.security.core.Authentication" %>
<%@ page import="org.springframework.security.core.context.SecurityContextHolder" %>
<%@ page import="kr.or.tacs.vo.common.CustomUser" %>
<%
    String fieldHeaderName = "검역공무원";
    String fieldHeaderRole = "검역공무원";
    String fieldHeaderInitial = "검";

    Authentication fieldHeaderAuth = SecurityContextHolder.getContext().getAuthentication();
    if (fieldHeaderAuth != null && fieldHeaderAuth.getPrincipal() instanceof CustomUser) {
        CustomUser fieldHeaderUser = (CustomUser) fieldHeaderAuth.getPrincipal();
        if (fieldHeaderUser.getLoginNm() != null && fieldHeaderUser.getLoginNm().trim().length() > 0) {
            fieldHeaderName = fieldHeaderUser.getLoginNm().trim();
            fieldHeaderInitial = fieldHeaderName.substring(0, 1);
        }
        if (fieldHeaderUser.getRoleNm() != null && fieldHeaderUser.getRoleNm().trim().length() > 0) {
            fieldHeaderRole = fieldHeaderUser.getRoleNm().trim();
        }
    }
%>
<header class="topbar">
<div class="tb-left">
<span class="tb-brand">TACS</span>
</div>
<div class="tb-right">
<% if (request.isUserInRole("SYSTEM_ADMIN")) { %>
<button class="tb-btn" title="액터 목록" onclick="location.href='${ctx}/systemadmin/dashboard.do'">
<span class="material-symbols-outlined">list</span>
</button>
<% } %>
<jsp:include page="/WEB-INF/views/common/notification_bell.jsp" />
<div class="tb-sep"></div>
<div class="tb-user">
<div class="tb-user-info">
<div class="name"><%= fieldHeaderName %></div>
<div class="role"><%= fieldHeaderRole %></div>
</div>
<div class="tb-avatar" onclick="if(confirm('로그아웃 하시겠습니까?')) document.getElementById('logoutForm').submit();" style="cursor:pointer"><%= fieldHeaderInitial %></div>
</div>
</div>
</header>
