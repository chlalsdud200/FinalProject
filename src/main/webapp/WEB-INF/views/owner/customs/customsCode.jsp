<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
    request.setAttribute("activeMenu", "customsCode");
    request.setAttribute("activeGroup", "");
    request.setAttribute("activeSub", "");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="ctx-path" content="${pageContext.request.contextPath}">
  <title>TACS 통관고유부호</title>
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
<div class="page active" id="pg-customs-code">
<div class="customs-page-wrapper" style="background-color: #f6f9ff; font-family: 'Inter', sans-serif;">
<div style="margin-bottom: 32px;">
<h2 style="font-size: 24px; font-weight: 800; color: #1a202c; letter-spacing: -0.5px;">통관고유부호 </h2>
<p style="font-size: 15px; color: #718096; margin-top: 6px;">수출입 의뢰를 위한 필수 식별 번호를 조회하거나 신규로 발급받을 수 있습니다.</p>
</div>
<div style="display: grid; grid-template-columns: 380px 1fr; gap: 24px; align-items: start;">
<div style="display: flex; flex-direction: column; gap: 20px;">
<div style="background: #e2e8f0; padding: 6px; border-radius: 14px; display: flex; gap: 4px;">
<button id="tab-search" onclick="switchTrack('search')" style="flex: 1; padding: 12px; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.3s; background: #fff; color: #4f46e5; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">기존 통관고유부호 조회</button>
<button id="tab-issue" onclick="switchTrack('issue')" style="flex: 1; padding: 12px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.3s; background: transparent; color: #718096;">신규 통관고유부호 발급</button>
</div>
<div class="card" style="background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #edf2f7;">
<h3 id="track-title" style="font-size: 18px; font-weight: 700; margin-bottom: 24px; color: #2d3748; display: flex; align-items: center; gap: 8px;">
<span class="material-symbols-outlined" style="font-size: 20px; color: #4f46e5;">edit_note</span>
            정보 입력
        </h3>
<div style="display: flex; flex-direction: column; gap: 20px;">
<div>
<label style="display: block; font-size: 13px; font-weight: 700; color: #4a5568; margin-bottom: 8px;">성명 (또는 상호)</label>
<input id="name" placeholder="실명을 입력하세요" style="width: 100%; padding: 14px; border: 2px solid #f1f5f9; border-radius: 10px; font-size: 14px; outline: none; transition: 0.2s;" type="text"/>
</div>
<div>
<label style="display: block; font-size: 13px; font-weight: 700; color: #4a5568; margin-bottom: 8px;">전화번호</label>
<input id="phone" placeholder="010-0000-0000" style="width: 100%; padding: 14px; border: 2px solid #f1f5f9; border-radius: 10px; font-size: 14px;" type="tel"/>
</div>
<div>
<label style="display: block; font-size: 13px; font-weight: 700; color: #4a5568; margin-bottom: 8px;">주민등록 번호/사업자 번호</label>
<input id="idNo" placeholder="'-' 없이 숫자만" style="width: 100%; padding: 14px; border: 2px solid #f1f5f9; border-radius: 10px; font-size: 14px;" type="password"/>
</div>
<button id="main-btn" onclick="executeProcess()" style="width: 100%; padding: 18px; background: #4f46e5; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; margin-top: 10px; font-size: 16px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35); transition: 0.2s;">조회</button>
</div>
</div>
</div>
<div id="res-display" style="background: #fff; border-radius: 20px; min-height: 520px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border: 1px solid #edf2f7; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
<div id="res-init" style="text-align: center;">
<div style="width: 100px; height: 100px; background: #f8fafc; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
<span class="material-symbols-outlined" style="font-size: 48px; color: #cbd5e1;">manage_search</span>
</div>
<h4 style="font-size: 20px; font-weight: 700; color: #334155;">준비 완료</h4>
<p style="color: #64748b; font-size: 15px; margin-top: 12px; line-height: 1.6;">좌측에서 정보를 입력하시면<br/>시스템 DB에서 즉시 대조를 시작합니다.</p>
</div>
<div id="res-loading" style="display: none; text-align: center;">
<div class="spinner" style="border: 5px solid #f3f3f3; border-top: 5px solid #4f46e5; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; margin: 0 auto 24px;"></div>
<p style="font-weight: 700; color: #4f46e5; font-size: 18px; letter-spacing: -0.5px;">데이터 분석 중...</p>
</div>
<div id="res-exist" style="display: none; text-align: center; width: 100%; max-width: 400px;">
<div style="background: #f0fdf4; color: #16a34a; padding: 12px 20px; border-radius: 30px; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; margin-bottom: 24px;">
<span class="material-symbols-outlined" style="font-size: 18px;">check_circle</span> 인증 완료
        </div>
<h4 style="font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 12px;">등록된 부호를 찾았습니다!</h4>
<p style="color: #64748b; margin-bottom: 30px;">수출입 신고 의뢰에 즉시 사용 가능합니다.</p>
<div style="background: #f8fafc; border: 2px solid #e2e8f0; padding: 30px; border-radius: 16px; margin-bottom: 24px;">
<span id="code-val" style="font-size: 32px; font-weight: 900; color: #4f46e5; letter-spacing: 3px; font-family: 'Courier New', monospace;">P123456789012</span>
</div>
<button onclick="go('export')" style="width: 100%; padding: 16px; background: #1e293b; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">의뢰서 작성하러 가기</button>
</div>
<div id="res-none" style="display: none; text-align: center; width: 100%; max-width: 400px;">
<div style="background: #fff1f2; color: #e11d48; padding: 12px 20px; border-radius: 30px; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; margin-bottom: 24px;">
<span class="material-symbols-outlined" style="font-size: 18px;">warning</span> 데이터 없음
        </div>
<h4 style="font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 12px;">등록된 정보가 없습니다</h4>
<p style="color: #64748b; margin-bottom: 30px;">TACS 통합 포털에서 즉시 발급이 가능합니다.<br/>지금 바로 신규 번호를 생성하시겠습니까?</p>
<button onclick="switchTrack('issue')" style="width: 100%; padding: 18px; background: #e11d48; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(225, 29, 72, 0.3);">신규 발급 절차 시작</button>
</div>
</div>
</div>
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
