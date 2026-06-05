<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>접근 권한 없음</title>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: "Noto Sans KR", Arial, sans-serif;
            color: #1f2937;
            background: #f3f6fb;
        }

        .access-error-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px 20px;
        }

        .access-error-card {
            width: min(100%, 460px);
            padding: 36px 32px;
            border: 1px solid #d8e0ec;
            border-radius: 8px;
            background: #ffffff;
            box-shadow: 0 12px 30px rgba(31, 41, 55, 0.08);
            text-align: center;
        }

        .access-error-code {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            margin-bottom: 20px;
            border-radius: 50%;
            background: #eef4ff;
            color: #1d4ed8;
            font-size: 20px;
            font-weight: 700;
        }

        h1 {
            margin: 0 0 12px;
            font-size: 24px;
            line-height: 1.35;
        }

        p {
            margin: 0 0 28px;
            color: #5b6472;
            font-size: 15px;
            line-height: 1.6;
        }

        .access-error-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
        }

        .access-error-actions a,
        .access-error-actions button {
            min-width: 116px;
            height: 42px;
            padding: 0 18px;
            border-radius: 6px;
            font: inherit;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }

        .access-error-actions a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            background: #2563eb;
            border: 1px solid #2563eb;
            text-decoration: none;
        }

        .access-error-actions button {
            color: #374151;
            background: #ffffff;
            border: 1px solid #cbd5e1;
        }
    </style>
</head>
<body>
<main class="access-error-page">
    <section class="access-error-card" aria-labelledby="accessErrorTitle">
        <div class="access-error-code">403</div>
        <h1 id="accessErrorTitle">접근 권한이 없습니다.</h1>
        <p>현재 계정에 이 화면을 사용할 권한이 없거나 메뉴 권한이 비활성화되어 있습니다.</p>
        <div class="access-error-actions">
            <a href="${pageContext.request.contextPath}/login.do">로그인 화면</a>
            <button type="button" onclick="history.back()">이전 화면</button>
        </div>
    </section>
</main>
</body>
</html>
