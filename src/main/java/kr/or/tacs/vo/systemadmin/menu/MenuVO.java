package kr.or.tacs.vo.systemadmin.menu;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class MenuVO {

    private Long menuId;
    private String menuNm;
    private String menuUrl;
    private Long parentMenuId;
    private int sortOrder;
    private String menuIcon;
    private String useYn;

    private List<MenuVO> children = new ArrayList<>();
}
