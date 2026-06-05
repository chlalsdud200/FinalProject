<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head><title>TACS 홈</title></head>
<body>
    <h2>환영합니다, ${userId}님!</h2>
    <p>JWT 토큰으로 인증되었습니다.</p>
    <a href="/admin">관리자 페이지 (ADMIN만 가능)</a><br><br>
    <form action="${pageContext.request.contextPath}/logout" method="post">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
        <button type="submit">로그아웃</button>
    </form>
</body>
</html>
