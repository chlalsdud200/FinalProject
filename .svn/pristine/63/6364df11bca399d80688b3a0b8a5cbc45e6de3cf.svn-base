package kr.or.tacs.common.security;

import java.io.IOException;
import java.net.URLEncoder;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomLoginFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse res, AuthenticationException e) throws IOException, ServletException {
        log.info("## 로그인 실패: {}", e.getMessage());

// 사용자에게 보여줄 에러 메시지를 세션 또는 쿼리스트링으로 전달
        String msg;
        if (e instanceof BadCredentialsException) {
            msg = "아이디 또는 비밀번호가 일치하지 않습니다.";
        } else if (e instanceof DisabledException) {
            msg = "비활성화된 계정입니다.";
        } else {
            msg = "로그인에 실패했습니다.";
        }

        res.sendRedirect("/login.do?error=" + URLEncoder.encode(msg, "UTF-8"));
    }


}
