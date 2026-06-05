package kr.or.tacs.systemadmin.menu.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.systemadmin.menu.service.IAdminMenuService;
import kr.or.tacs.vo.systemadmin.menu.MenuVO;
import kr.or.tacs.vo.systemadmin.menu.RoleMenuVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tacs/admin/menus")
public class AdminMenuController {

    private final IAdminMenuService adminMenuService;

    @GetMapping
    public List<MenuVO> retrieveMenus(@RequestParam(required = false) String roleCd) {
        return adminMenuService.getAllMenus(roleCd);
    }

    @GetMapping("/tree")
    public List<MenuVO> retrieveMenuTree(@RequestParam(required = false) String roleCd) {
        return adminMenuService.getAllMenuTree(roleCd);
    }

    @GetMapping("/role/{roleCd}")
    public List<RoleMenuVO> retrieveRoleMenus(@PathVariable String roleCd) {
        return adminMenuService.getMenuPermissionsByRole(roleCd);
    }

    @PostMapping("/role/{roleCd}")
    public Map<String, Object> saveRoleMenus(
            @PathVariable String roleCd,
            @RequestBody List<RoleMenuVO> permissions
    ) {
        adminMenuService.saveMenuPermissionsByRole(roleCd, permissions);
        return Map.of(
                "success", true,
                "message", "저장되었습니다."
        );
    }
}
