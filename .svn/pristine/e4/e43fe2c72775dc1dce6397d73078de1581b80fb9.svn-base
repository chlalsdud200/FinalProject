package kr.or.tacs.systemadmin.auth.controller;

import java.time.Duration;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import kr.or.tacs.common.util.TokenProvider;
import kr.or.tacs.vo.common.CustomUser;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/auth")
public class AdminAuthApiController {

    private final TokenProvider tokenProvider;

    /**
     * React 관리자 앱이 Spring JSP 로그인 세션을 기준으로 JWT를 발급받는 API.
     *
     * 핵심 원칙:
     * - 이 API는 기존 JWT Authorization 헤더로 인증하지 않는다.
     * - 브라우저의 JSESSIONID 쿠키로 유지되는 Spring Security 세션을 확인한다.
     * - 세션 사용자가 SYSTEM_ADMIN이면 2시간짜리 관리자 JWT를 새로 발급한다.
     */
    @PostMapping("/token")
    public ResponseEntity<?> issueAdminToken(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof CustomUser customUser)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "유효하지 않은 로그인 정보입니다."));
        }

        if (!"SYSTEM_ADMIN".equals(customUser.getRoleCd())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "시스템 관리자만 접근 가능합니다."));
        }

        String token = tokenProvider.generateToken(
                customUser.getAuthUser(),
                Duration.ofHours(2)
        );

        return ResponseEntity.ok(Map.of(
                "token", token,
                "tokenType", "Bearer",
                "loginId", customUser.getLoginId(),
                "loginNm", customUser.getLoginNm(),
                "roleCd", customUser.getRoleCd()
        ));
    }

    /**
     * React 관리자 앱 로그아웃 API.
     * React의 sessionStorage만 비우면 Spring 세션은 살아 있으므로,
     * 관리자 화면에 다시 들어갈 때 JWT가 재발급될 수 있다.
     * 따라서 Spring 세션까지 함께 종료한다.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logoutAdminSession(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        SecurityContextHolder.clearContext();

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        Cookie sessionCookie = new Cookie("JSESSIONID", "");
        sessionCookie.setPath("/");
        sessionCookie.setHttpOnly(true);
        sessionCookie.setMaxAge(0);
        response.addCookie(sessionCookie);

        return ResponseEntity.ok(Map.of("message", "로그아웃되었습니다."));
    }
}
