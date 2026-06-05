<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/broker/common/meta.jsp" %>
    <link rel="stylesheet" href="${ctx}/resources/css/broker/common.css">
    <link rel="stylesheet" href="${ctx}/resources/css/broker/pages/community.css">
    <title>커뮤니티 | TACS</title>
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/broker/common/sidebar.jsp" %>
    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/broker/common/header.jsp" %>
        <div class="content">
            <div class="page active" id="pg-community">
                <div class="sub-page">
                    <h2><span class="material-symbols-outlined">forum</span> 커뮤니티</h2>
                    
                    <div class="prog-tab-bar" id="tabs-cm">
                        <button class="prog-tab ${activeSub eq 'notice' ? 'active' : ''}" data-community-tab="notice" onclick="switchBrokerCommunityTab('notice')">공지사항</button>
                        <button class="prog-tab ${activeSub eq 'download' ? 'active' : ''}" data-community-tab="download" onclick="switchBrokerCommunityTab('download')">자료실</button>
                        <button class="prog-tab ${activeSub eq 'cs' ? 'active' : ''}" data-community-tab="cs" onclick="switchBrokerCommunityTab('cs')">고객센터</button>
                    </div>

                    <div id="cm-notice" style="display:${activeSub eq 'notice' ? 'block' : 'none'}">
                        <%-- common/notice.js 가 이 영역에 scaffold 를 주입합니다. --%>
                    </div>

                    <div id="cm-download" style="display:${activeSub eq 'download' ? 'block' : 'none'}">
                        <%@ include file="/WEB-INF/views/common/community/resourceArchive.jsp" %>
                    </div>

                    <div id="cm-cs" style="display:${activeSub eq 'cs' ? 'block' : 'none'}">
                        <%@ include file="/WEB-INF/views/common/community/faq.jsp" %>
                    </div>
                </div>
            </div>
        </div>
        <%@ include file="/WEB-INF/views/broker/common/footer.jsp" %>
    </div>
</div>
<%@ include file="/WEB-INF/views/broker/common/modals.jsp" %>
<script>window.contextPath = '${ctx}';</script>
<script src="${ctx}/resources/js/broker/common.js"></script>
<script src="${ctx}/resources/js/common/notice.js"></script>
<script src="${ctx}/resources/js/broker/pages/community.js"></script>
<script src="${ctx}/resources/js/common/faq.js"></script>
</body>
</html>