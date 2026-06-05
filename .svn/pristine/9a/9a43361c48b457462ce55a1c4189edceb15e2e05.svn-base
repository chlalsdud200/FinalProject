package kr.or.tacs.warehouse.mypage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/warehouse")
@Slf4j
public class WarehouseMyPageController {

    @GetMapping({"/mypage.do", "/page/mypage"})
    public String warehouseMyPage(
            @RequestParam(value = "tab", required = false, defaultValue = "profile") String tab,
            Model model
    ) {
        String normalizedTab = ("alarm".equals(tab) || "notify".equals(tab)) ? "alarm" : "profile";

        model.addAttribute("activeMenu", "mypage");
        model.addAttribute("activeGroup", "mypage");
        model.addAttribute("activeSub", normalizedTab);
        model.addAttribute("mypageActorPath", "warehouse");
        model.addAttribute("mypageTab", normalizedTab);

        return "warehouse/mypage";
    }


    @GetMapping("/docs.do")
    public String warehouseDocs(Model model) {
        model.addAttribute("activeSub", "myDocs");
        return "warehouse/docs";
    }

    @GetMapping("/docs/trash.do")
    public String warehouseTrash(Model model) {
        model.addAttribute("activeSub", "trash");
        return "warehouse/docs";
    }

    @GetMapping("/customs.do")
    public String warehouseCustoms() {
        return "warehouse/customs";
    }

    @GetMapping("/community.do")
    public String warehouseCommunity() {
        return "warehouse/community";
    }

    @GetMapping("/settlement.do")
    public String warehouseSettlement() {
        return "warehouse/settlement";
    }
}
