<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TACS 관리자 액터 선택</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, "Noto Sans KR", Arial, sans-serif; background: #f4f7fb; color: #14212f; }
    .topbar { height: 64px; border-bottom: 2px solid #111827; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; }
    .brand { font-weight: 900; font-size: 22px; letter-spacing: .02em; }
    .right { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #64748b; }
    .logout-form { margin: 0; }
    .logout { border: 1px solid #cbd5e1; background: #fff; color: #334155; height: 32px; padding: 0 12px; font-weight: 800; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }
    main { max-width: 1120px; margin: 0 auto; padding: 38px 24px 56px; }
    .title-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 22px; }
    h1 { margin: 0; font-size: 28px; font-weight: 900; }
    .desc { margin: 8px 0 0; color: #64748b; font-size: 13px; line-height: 1.6; }
    .admin-link { border: 1px solid #1f2937; background: #1f2937; color: #fff; height: 36px; padding: 0 14px; font-size: 12px; font-weight: 900; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .card { background: #fff; border: 1px solid #d7e0ec; padding: 20px; text-decoration: none; color: inherit; min-height: 154px; display: flex; flex-direction: column; justify-content: space-between; }
    .card:hover { border-color: #111827; box-shadow: 0 12px 26px rgba(15, 23, 42, .08); }
    .icon { width: 38px; height: 38px; border: 1px solid #d7e0ec; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #1f2937; }
    .name { margin-top: 14px; font-size: 18px; font-weight: 900; }
    .meta { margin-top: 6px; font-size: 12px; color: #64748b; line-height: 1.5; }
    .go { margin-top: 18px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 900; color: #1f2937; }
    @media (max-width: 860px) { .grid { grid-template-columns: 1fr; } .title-row { align-items: flex-start; flex-direction: column; } }
  </style>
</head>
<body>
<header class="topbar">
  <div class="brand">TACS</div>
  <div class="right">
    <span>시스템관리자 전용 임시 전환 화면</span>
    <form class="logout-form" action="${pageContext.request.contextPath}/logout" method="post">
      <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
      <button class="logout" type="submit">로그아웃</button>
    </form>
  </div>
</header>
<main>
  <div class="title-row">
    <div>
      <h1>액터 대시보드 선택</h1>
      <p class="desc">개발 중 관리자 계정으로 각 액터 화면을 빠르게 확인하기 위한 임시 화면입니다.</p>
    </div>

    </div>
  </div>

  <section class="grid">
    <a class="card" href="${pageContext.request.contextPath}/owner/dashboard/list.do">
      <div><div class="icon"><span class="material-symbols-outlined">person</span></div><div class="name">화주</div><div class="meta">수입/수출 요청, 문서함, 운송, 커뮤니티 화면 확인</div></div>
      <div class="go"><span>대시보드로 이동</span><span class="material-symbols-outlined">arrow_forward</span></div>
    </a>
    <a class="card" href="${pageContext.request.contextPath}/broker/dashboard.do">
      <div><div class="icon"><span class="material-symbols-outlined">badge</span></div><div class="name">관세사</div><div class="meta">신고서 작성, 처리현황, 자료/고객 화면 확인</div></div>
      <div class="go"><span>대시보드로 이동</span><span class="material-symbols-outlined">arrow_forward</span></div>
    </a>
    <a class="card" href="${pageContext.request.contextPath}/officer/dashboard.do">
      <div><div class="icon"><span class="material-symbols-outlined">account_balance</span></div><div class="name">세관공무원</div><div class="meta">심사, 세액, 검사/검역, 통관 처리 화면 확인</div></div>
      <div class="go"><span>대시보드로 이동</span><span class="material-symbols-outlined">arrow_forward</span></div>
    </a>
    <a class="card" href="${pageContext.request.contextPath}/fieldofficer/dashboard.do">
      <div><div class="icon"><span class="material-symbols-outlined">fact_check</span></div><div class="name">현장공무원</div><div class="meta">검사요청, 검사결과, 증명서, 커뮤니티 화면 확인</div></div>
      <div class="go"><span>대시보드로 이동</span><span class="material-symbols-outlined">arrow_forward</span></div>
    </a>
    <a class="card" href="${pageContext.request.contextPath}/transport/dashboard.do">
      <div><div class="icon"><span class="material-symbols-outlined">local_shipping</span></div><div class="name">운송담당자</div><div class="meta">수입/수출 운송, 문서함, 커뮤니티 화면 확인</div></div>
      <div class="go"><span>대시보드로 이동</span><span class="material-symbols-outlined">arrow_forward</span></div>
    </a>
    <a class="card" href="${pageContext.request.contextPath}/warehouse/dashboard.do">
      <div><div class="icon"><span class="material-symbols-outlined">warehouse</span></div><div class="name">창고관리자</div><div class="meta">입고, 반출, 재고, 서류, 정산 화면 확인</div></div>
      <div class="go"><span>대시보드로 이동</span><span class="material-symbols-outlined">arrow_forward</span></div>
    </a>

   <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
       <a href="${pageContext.request.contextPath}/admin/notices">공지 관리</a>
       <a href="${pageContext.request.contextPath}/admin/faqs">FAQ 관리</a>
       <a href="${pageContext.request.contextPath}/systemadmin/mypage.do">마이페이지</a>

       <a href="http://localhost:5173/admin-react/dashboard"
          target="_blank"
          style="
              display:inline-flex;
              align-items:center;
              justify-content:center;
              padding:10px 14px;
              border-radius:10px;
              background:#111827;
              color:#ffffff;
              text-decoration:none;
              font-weight:700;
              font-size:14px;
          ">
           React 관리자 페이지 진입
       </a>
   </div>
  </section>
</main>
</body>
</html>
