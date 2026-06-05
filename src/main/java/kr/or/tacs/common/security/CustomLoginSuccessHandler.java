package kr.or.tacs.common.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import kr.or.tacs.vo.common.CustomUser;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        CustomUser user = (CustomUser) authentication.getPrincipal();

        clearAuthenticationAttribute(request);

        String targetUrl = getDefaultUrl(user);

        log.info("## Login Success - id: {}, role: {}, target: {}",
                user.getLoginId(), user.getRoleCd(), targetUrl);

        response.sendRedirect(targetUrl);
    }


    // jsp 페이지 설정 로그인하면 이동할 경로
    private String getDefaultUrl(CustomUser user) {
        String roleCd = user.getRoleCd();
        if ("OFFICER".equals(roleCd) && "FIELD_OFFICER".equals(user.getOfficerTyCd())) {
            return "/fieldofficer/dashboard.do";
        }
        return switch (roleCd) {
            case "OWNER" -> "/owner/dashboard/list.do";
            case "BROKER" -> "/broker/dashboard.do";
            case "OFFICER" -> "/officer/dashboard.do";
            // 현장공무원은 로그인 roleCd가 OFFICER로 통합된다.
            // OFFICER_TY_CD 기반 현장공무원 별도 라우팅은 후속 단계에서 분리한다.
            case "TRANSPORT_MANAGER" -> "/transport/dashboard.do";
            case "WAREHOUSE_MANAGER" -> "/warehouse/dashboard.do";
            case "SYSTEM_ADMIN" -> "/systemadmin/dashboard.do";
            default -> "/login.do";
        };
    }

    private void clearAuthenticationAttribute(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return;
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }
}
