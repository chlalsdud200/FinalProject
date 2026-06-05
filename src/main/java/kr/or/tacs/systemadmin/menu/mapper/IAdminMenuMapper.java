package kr.or.tacs.systemadmin.menu.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.systemadmin.menu.MenuVO;
import kr.or.tacs.vo.systemadmin.menu.RoleMenuVO;

@Mapper
public interface IAdminMenuMapper {

    List<MenuVO> selectAllMenus(@Param("roleCd") String roleCd);

    List<RoleMenuVO> selectRoleMenuList(@Param("roleCd") String roleCd);

    List<Long> selectMenuIdsByRoleCd(@Param("roleCd") String roleCd);

    int deleteRoleMenuByRoleCd(@Param("roleCd") String roleCd);

    int insertRoleMenu(RoleMenuVO roleMenu);
}
