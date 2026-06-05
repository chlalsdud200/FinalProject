package kr.or.tacs.systemadmin.menu.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import kr.or.tacs.systemadmin.menu.mapper.IAdminMenuMapper;
import kr.or.tacs.vo.systemadmin.menu.MenuVO;
import kr.or.tacs.vo.systemadmin.menu.RoleMenuVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminMenuServiceImpl implements IAdminMenuService {

    private static final Set<String> ROLE_CODES = Set.of(
            "OWNER",
            "BROKER",
            "OFFICER",
            "TRANSPORT_MANAGER",
            "WAREHOUSE_MANAGER",
            "SYSTEM_ADMIN"
    );

    private final IAdminMenuMapper adminMenuMapper;

    @Override
    public List<MenuVO> getAllMenus(String roleCd) {
        return adminMenuMapper.selectAllMenus(normalizeOptionalRoleCd(roleCd));
    }

    @Override
    public List<MenuVO> getAllMenuTree(String roleCd) {
        List<MenuVO> menus = adminMenuMapper.selectAllMenus(normalizeOptionalRoleCd(roleCd));
        Map<Long, MenuVO> menuMap = new LinkedHashMap<>();
        List<MenuVO> roots = new ArrayList<>();

        for (MenuVO menu : menus) {
            menu.getChildren().clear();
            menuMap.put(menu.getMenuId(), menu);
        }

        for (MenuVO menu : menus) {
            Long parentMenuId = menu.getParentMenuId();
            if (parentMenuId == null) {
                roots.add(menu);
                continue;
            }

            MenuVO parent = menuMap.get(parentMenuId);
            if (parent == null) {
                roots.add(menu);
            } else {
                parent.getChildren().add(menu);
            }
        }

        return roots;
    }

    @Override
    public List<RoleMenuVO> getMenuPermissionsByRole(String roleCd) {
        return adminMenuMapper.selectRoleMenuList(normalizeRoleCd(roleCd));
    }

    @Override
    @Transactional
    public void saveMenuPermissionsByRole(String roleCd, List<RoleMenuVO> permissions) {
        String normalizedRoleCd = normalizeRoleCd(roleCd);
        if ("SYSTEM_ADMIN".equals(normalizedRoleCd)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "시스템관리자 권한은 이 화면에서 관리할 수 없습니다.");
        }
        if (permissions == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "메뉴 권한 목록이 필요합니다.");
        }

        // ROLE_MENU에 이미 있는 ID가 아니라, 전체 MENU 테이블에 존재하는 ID인지 확인해야 함
        List<MenuVO> allMenus = adminMenuMapper.selectAllMenus(null);
        Set<Long> validMenuIds = new HashSet<>();
        for (MenuVO m : allMenus) {
            validMenuIds.add(m.getMenuId());
        }

        for (RoleMenuVO permission : permissions) {
            if (permission == null || permission.getMenuId() == null || !validMenuIds.contains(permission.getMenuId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 메뉴가 포함되어 있습니다.");
            }
        }

        adminMenuMapper.deleteRoleMenuByRoleCd(normalizedRoleCd);
        for (RoleMenuVO permission : permissions) {
            RoleMenuVO normalized = normalizePermission(normalizedRoleCd, permission);
            adminMenuMapper.insertRoleMenu(normalized);
        }
    }

    private RoleMenuVO normalizePermission(String roleCd, RoleMenuVO permission) {
        if (permission == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "메뉴 권한 항목이 비어 있습니다.");
        }
        if (permission.getMenuId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "메뉴 ID가 필요합니다.");
        }

        RoleMenuVO normalized = new RoleMenuVO();
        normalized.setRoleCd(roleCd);
        normalized.setMenuId(permission.getMenuId());
        normalized.setReadYn(normalizeYn(defaultValue(permission.getReadYn(), "N"), "읽기 권한은 Y 또는 N만 가능합니다."));
        normalized.setWriteYn(normalizeYn(defaultValue(permission.getWriteYn(), "N"), "쓰기 권한은 Y 또는 N만 가능합니다."));
        normalized.setDeleteYn(normalizeYn(defaultValue(permission.getDeleteYn(), "N"), "삭제 권한은 Y 또는 N만 가능합니다."));
        return normalized;
    }

    private String normalizeRoleCd(String roleCd) {
        String normalized = trim(roleCd);
        if (!StringUtils.hasText(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "역할 코드가 필요합니다.");
        }
        normalized = normalized.toUpperCase(Locale.ROOT);
        if (!ROLE_CODES.contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않은 역할 코드입니다.");
        }
        return normalized;
    }

    private String normalizeOptionalRoleCd(String roleCd) {
        String normalized = trim(roleCd);
        return StringUtils.hasText(normalized) ? normalizeRoleCd(normalized) : null;
    }

    private String normalizeYn(String value, String message) {
        String normalized = trim(value);
        if (!StringUtils.hasText(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        normalized = normalized.toUpperCase(Locale.ROOT);
        if (!"Y".equals(normalized) && !"N".equals(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return normalized;
    }

    private String defaultValue(String value, String defaultValue) {
        String trimmed = trim(value);
        return StringUtils.hasText(trimmed) ? trimmed : defaultValue;
    }

    private String trim(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
