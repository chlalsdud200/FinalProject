<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.springframework.security.core.Authentication" %>
<%@ page import="org.springframework.security.core.context.SecurityContextHolder" %>
<%@ page import="kr.or.tacs.vo.common.CustomUser" %>
<%
    String ownerHeaderName = "화주";
    String ownerHeaderRole = "화주";
    String ownerHeaderInitial = "화";

    Authentication ownerHeaderAuth = SecurityContextHolder.getContext().getAuthentication();
    if (ownerHeaderAuth != null && ownerHeaderAuth.getPrincipal() instanceof CustomUser) {
        CustomUser ownerHeaderUser = (CustomUser) ownerHeaderAuth.getPrincipal();
        if (ownerHeaderUser.getLoginNm() != null && ownerHeaderUser.getLoginNm().trim().length() > 0) {
            ownerHeaderName = ownerHeaderUser.getLoginNm().trim();
            ownerHeaderInitial = ownerHeaderName.substring(0, 1);
        }
        if (ownerHeaderUser.getRoleNm() != null && ownerHeaderUser.getRoleNm().trim().length() > 0) {
            ownerHeaderRole = ownerHeaderUser.getRoleNm().trim();
        }
    }
%>

<header class="topbar">
<div class="tb-left">
<span class="tb-brand">TACS</span>
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
<div class="name"><%= ownerHeaderName %></div>
<div class="role"><%= ownerHeaderRole %></div>
</div>
<div class="tb-avatar" onclick="if(confirm('로그아웃 하시겠습니까?')) document.getElementById('logoutForm').submit();" style="cursor:pointer"><%= ownerHeaderInitial %></div>
</div>
</div>
</header>
