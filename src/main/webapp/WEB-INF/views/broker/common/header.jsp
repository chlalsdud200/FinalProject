<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.springframework.security.core.Authentication" %>
<%@ page import="org.springframework.security.core.context.SecurityContextHolder" %>
<%@ page import="kr.or.tacs.vo.common.CustomUser" %>
<%
    String brokerHeaderName = "관세사";
    String brokerHeaderRole = "관세사";
    String brokerHeaderInitial = "관";

    Authentication brokerHeaderAuth = SecurityContextHolder.getContext().getAuthentication();
    if (brokerHeaderAuth != null && brokerHeaderAuth.getPrincipal() instanceof CustomUser) {
        CustomUser brokerHeaderUser = (CustomUser) brokerHeaderAuth.getPrincipal();
        if (brokerHeaderUser.getLoginNm() != null && brokerHeaderUser.getLoginNm().trim().length() > 0) {
            brokerHeaderName = brokerHeaderUser.getLoginNm().trim();
            brokerHeaderInitial = brokerHeaderName.substring(0, 1);
        }
        if (brokerHeaderUser.getRoleNm() != null && brokerHeaderUser.getRoleNm().trim().length() > 0) {
            brokerHeaderRole = brokerHeaderUser.getRoleNm().trim();
        }
    }
%>
<header class="topbar">
      <div class="tb-left">
        <a href="${ctx}/broker/dash.do"  class="tb-brand">TACS</a>
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
            <div class="name"><%= brokerHeaderName %></div>
            <div class="role"><%= brokerHeaderRole %></div>
          </div>
          <div class="tb-avatar" onclick="if(confirm('로그아웃 하시겠습니까?')) document.getElementById('logoutForm').submit();" style="cursor:pointer"><%= brokerHeaderInitial %></div>
        </div>
      </div>
</header>
