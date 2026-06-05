package kr.or.tacs.common.interceptor;

import java.io.IOException;
import java.util.List;

import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.or.tacs.common.security.MenuPermission;
import kr.or.tacs.common.security.MenuPermissionAction;
import kr.or.tacs.systemadmin.menu.service.IAdminMenuService;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.systemadmin.menu.RoleMenuVO;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ApiMenuPermissionInterceptor implements HandlerInterceptor {

    private final IAdminMenuService adminMenuService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        MenuPermission menuPermission = resolveMenuPermission(handlerMethod);
        if (menuPermission == null) {
            return true;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUser loginUser)) {
            return deny(response);
        }

        if ("SYSTEM_ADMIN".equals(loginUser.getRoleCd())) {
            return true;
        }

        List<RoleMenuVO> permissions = adminMenuService.getMenuPermissionsByRole(loginUser.getRoleCd());
        RoleMenuVO matchedPermission = permissions.stream()
                .filter(permission -> menuPermission.menuUrl().equals(permission.getMenuUrl()))
                .findFirst()
                .orElse(null);

        if (isAllowed(matchedPermission, menuPermission.action())) {
            return true;
        }

        return deny(response);
    }

    private MenuPermission resolveMenuPermission(HandlerMethod handlerMethod) {
        MenuPermission methodPermission = AnnotatedElementUtils.findMergedAnnotation(
                handlerMethod.getMethod(),
                MenuPermission.class
        );
        if (methodPermission != null) {
            return methodPermission;
        }
        return AnnotatedElementUtils.findMergedAnnotation(handlerMethod.getBeanType(), MenuPermission.class);
    }

    private boolean isAllowed(RoleMenuVO permission, MenuPermissionAction action) {
        if (permission == null || !"Y".equalsIgnoreCase(permission.getReadYn())) {
            return false;
        }
        if (action == MenuPermissionAction.READ) {
            return true;
        }
        if (action == MenuPermissionAction.WRITE) {
            return "Y".equalsIgnoreCase(permission.getWriteYn());
        }
        return "Y".equalsIgnoreCase(permission.getDeleteYn());
    }

    private boolean deny(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"message\":\"Forbidden\"}");
        return false;
    }
}
