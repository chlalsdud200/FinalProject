<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
    request.setAttribute("activeMenu", "settings");
    request.setAttribute("activeGroup", "");
    request.setAttribute("activeSub", "");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="ctx-path" content="${pageContext.request.contextPath}">
  <title>TACS 설정</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/owner.css">
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/owner/sidebar.jsp" %>

  <div class="main-wrap">
    <%@ include file="/WEB-INF/views/common/header.jsp" %>

    <main class="content">
<div class="page active" id="pg-settings">
<div class="page-title-row">
<h2>설정</h2>
<button class="btn btn-primary" onclick="saveSettings()">변경사항 저장</button>
</div>
<!-- 알림 설정 -->
<div class="settings-section">
<div class="settings-section-title"><span class="material-symbols-outlined">notifications</span> 알림 설정</div>
<div class="settings-body">
<div class="settings-row">
<div class="settings-row-left">
<div class="s-title">수출 서류 요청 알림</div>
<div class="s-desc">관세사 또는 세관으로부터 보완 요청이 올 때 알림을 받습니다.</div>
</div>
<div class="settings-row-right"><label class="toggle"><input checked="" type="checkbox"/></label></div>
</div>
<div class="settings-row">
<div class="settings-row-left">
<div class="s-title">수입 세액 계산 완료 알림</div>
<div class="s-desc">AI 세액 계산이 완료되면 즉시 알림을 받습니다.</div>
</div>
<div class="settings-row-right"><label class="toggle"><input checked="" type="checkbox"/></label></div>
</div>
<div class="settings-row">
<div class="settings-row-left">
<div class="s-title">ETA 변경 알림</div>
<div class="s-desc">운송 중인 화물의 도착예정일이 변경되면 알림을 받습니다.</div>
</div>
<div class="settings-row-right"><label class="toggle"><input type="checkbox"/></label></div>
</div>
</div>
</div>
<!-- 기본 관세사 -->
<div class="settings-section">
<div class="settings-section-title"><span class="material-symbols-outlined">person</span> 기본 담당 관세사</div>
<div class="settings-body">
<div class="settings-row">
<div class="settings-row-left">
<div class="s-title">수출 기본 관세사</div>
<div class="s-desc">신규 수출 의뢰 등록 시 자동 선택될 관세사를 지정합니다.</div>
</div>
<div class="settings-row-right">
<select>
<option>삼일관세법인 / 김관세 관세사</option>
<option>에이스관세사무소 / 박수출 관세사</option>
<option>한빛관세법인 / 최통관 관세사</option>
</select>
</div>
</div>
<div class="settings-row">
<div class="settings-row-left">
<div class="s-title">수입 기본 관세사</div>
<div class="s-desc">신규 수입 의뢰 등록 시 자동 선택될 관세사를 지정합니다.</div>
</div>
<div class="settings-row-right">
<select>
<option>삼일관세법인 / 이수입 관세사</option>
<option>국제통상관세 / 정세액 관세사</option>
</select>
</div>
</div>
</div>
</div>
<!-- 문서 업로드 설정 -->
<div class="settings-section">
<div class="settings-section-title"><span class="material-symbols-outlined">folder</span> 문서 업로드 설정</div>
<div class="settings-body">
<div class="settings-row">
<div class="settings-row-left">
<div class="s-title">기본 업로드 문서 형식</div>
<div class="s-desc">파일 업로드 시 허용할 기본 형식을 선택합니다.</div>
</div>
<div class="settings-row-right">
<select>
<option>PDF, XLSX, JPG, PNG</option>
<option>PDF만</option>
<option>모든 형식</option>
</select>
</div>
</div>
<div class="settings-row">
<div class="settings-row-left">
<div class="s-title">최대 파일 크기</div>
<div class="s-desc">단일 파일 업로드 최대 허용 크기입니다.</div>
</div>
<div class="settings-row-right">
<select>
<option>20 MB</option>
<option>10 MB</option>
<option>50 MB</option>
</select>
</div>
</div>
</div>
</div>
<div class="btn-row">
<button class="btn btn-primary">변경사항 저장</button>
<button class="btn btn-outline">초기화</button>
</div>
</div>
    </main>

    <%@ include file="/WEB-INF/views/common/ownerModals.jsp" %>
    <%@ include file="/WEB-INF/views/common/footer.jsp" %>
  </div>
</div>

<%@ include file="/WEB-INF/views/common/ownerScripts.jsp" %>

</body>
</html>
