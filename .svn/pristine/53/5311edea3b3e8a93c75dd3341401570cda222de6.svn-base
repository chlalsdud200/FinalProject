package kr.or.tacs.systemadmin.menu.service;

import java.util.List;

import kr.or.tacs.vo.systemadmin.menu.MenuVO;
import kr.or.tacs.vo.systemadmin.menu.RoleMenuVO;

public interface IAdminMenuService {

    List<MenuVO> getAllMenus(String roleCd);

    List<MenuVO> getAllMenuTree(String roleCd);

    List<RoleMenuVO> getMenuPermissionsByRole(String roleCd);

    void saveMenuPermissionsByRole(String roleCd, List<RoleMenuVO> permissions);
}
