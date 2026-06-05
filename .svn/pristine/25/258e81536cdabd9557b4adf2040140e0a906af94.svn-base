<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.springframework.security.core.Authentication" %>
<%@ page import="org.springframework.security.core.context.SecurityContextHolder" %>
<%@ page import="kr.or.tacs.vo.common.CustomUser" %>
<%
  String transportUserName = "운송담당자";
  String transportUserRole = "운송담당자";
  String transportUserInitial = "운";

  Authentication transportAuth = SecurityContextHolder.getContext().getAuthentication();
  if (transportAuth != null && transportAuth.getPrincipal() instanceof CustomUser) {
      CustomUser transportUser = (CustomUser) transportAuth.getPrincipal();
      if (transportUser.getLoginNm() != null && transportUser.getLoginNm().trim().length() > 0) {
          transportUserName = transportUser.getLoginNm().trim();
          transportUserInitial = transportUserName.substring(0, 1);
      }
      if (transportUser.getRoleNm() != null && transportUser.getRoleNm().trim().length() > 0) {
          transportUserRole = transportUser.getRoleNm().trim();
      }
  }
%>
<header class="fixed top-0 right-0 left-72 h-16 bg-slate-50 border-b-2 border-slate-900 flex justify-between items-center px-6 z-40 glass-header">
  <div class="flex items-center gap-6">
    <a class="text-xl font-black text-slate-900 tracking-tighter" href="${pageContext.request.contextPath}/transport/dashboard.do" style="text-decoration:none; color:inherit; cursor:pointer;">TACS</a>
  </div>
  <div class="flex items-center gap-3">
    <% if (request.isUserInRole("SYSTEM_ADMIN")) { %>
    <button class="p-2 text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center" type="button" onclick="location.href='${pageContext.request.contextPath}/systemadmin/dashboard.do'" aria-label="목록">
      <span class="material-symbols-outlined text-[22px]">list</span>
    </button>
    <% } %>
    <jsp:include page="/WEB-INF/views/common/notification_bell.jsp" />
    <div class="h-8 w-px bg-slate-300 mx-2"></div>
    <div class="flex items-center gap-3">
      <div class="text-right">
        <p class="text-xs font-bold text-slate-900"><%= transportUserName %></p>
        <p class="text-[10px] text-slate-500"><%= transportUserRole %></p>
      </div>
      <div class="w-10 h-10 bg-primary flex items-center justify-center text-on-primary font-bold text-sm cursor-pointer" onclick="if(confirm('로그아웃 하시겠습니까?')) document.getElementById('logoutForm').submit();"><%= transportUserInitial %></div>
    </div>
  </div>
</header>
