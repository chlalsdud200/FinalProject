package kr.or.tacs.transport.dashboard.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 운송담당자 공통 화면 Controller.
 *
 * 대시보드는 TransportDashboardController,
 * 수출/수입 업무는 각각 export/importp 패키지 Controller에서 처리한다.
 */
@Controller
@RequestMapping("/transport")
public class TransportController {

    @GetMapping("/docs.do")
    public String retriveDocs(Model model) {
        model.addAttribute("transportInitialGroup", "docs");
        model.addAttribute("transportInitialItem", "TACS-DC-001");
        return "transport/pages/docs";
    }

    @GetMapping("/docs/trash.do")
    public String trash(Model model) {
        model.addAttribute("transportInitialGroup", "docs");
        model.addAttribute("transportInitialItem", "TACS-DC-002");
        return "transport/pages/docs";
    }

    @GetMapping("/community.do")
    public String retriveCommunity(
            @RequestParam(value = "tab", required = false) String tab,
            @RequestParam(value = "page", required = false) String page,
            @RequestParam Map<String, String> params,
            Model model
    ) {
        String legacyTab = legacyCommunityPageToTab(page);

        // 예전 주소(/transport/community.do?page=TACS-CM-...)로 들어오면
        // 검색조건(type/keyword/fromDate/toDate/noticePage/noticeSize 등)은 유지하고 page만 tab으로 바꾼다.
        if (legacyTab != null) {
            return buildCommunityRedirect(legacyTab, params);
        }

        String normalizedTab = normalizeCommunityTab(tab);

        model.addAttribute("transportInitialGroup", "community");
        model.addAttribute("transportInitialItem", communityTabToItem(normalizedTab));
        model.addAttribute("communityTab", normalizedTab);

        return "transport/pages/community";
    }

    @GetMapping("/mypage.do")
    public String retriveMypage(
            @RequestParam(value = "tab", required = false, defaultValue = "profile") String tab,
            Model model
    ) {
        String normalizedTab = ("alarm".equals(tab) || "notify".equals(tab)) ? "alarm" : "profile";

        model.addAttribute("transportInitialGroup", "mypage");
        model.addAttribute("transportInitialItem", "alarm".equals(normalizedTab) ? "TACS-MY-002" : "TACS-MY-001");
        model.addAttribute("mypageActorPath", "transport");
        model.addAttribute("mypageTab", normalizedTab);

        return "transport/pages/mypage";
    }

    private String normalizeCommunityTab(String tab) {
        if ("data".equals(tab)) {
            return "data";
        }
        if ("cs".equals(tab) || "center".equals(tab) || "customer".equals(tab) || "faq".equals(tab)) {
            return "cs";
        }
        return "notice";
    }

    private String communityTabToItem(String tab) {
        if ("data".equals(tab)) {
            return "TACS-CM-003";
        }
        if ("cs".equals(tab)) {
            return "TACS-CM-004";
        }
        return "TACS-CM-001";
    }

    private String legacyCommunityPageToTab(String page) {
        if ("TACS-CM-003".equals(page)) {
            return "data";
        }
        if ("TACS-CM-004".equals(page) || "TACS-CM-002".equals(page)) {
            return "cs";
        }
        if ("TACS-CM-001".equals(page)) {
            return "notice";
        }
        return null;
    }

    private String buildCommunityRedirect(String tab, Map<String, String> params) {
        StringBuilder sb = new StringBuilder("redirect:/transport/community.do?tab=")
                .append(encode(tab));

        if (params != null) {
            for (Map.Entry<String, String> entry : params.entrySet()) {
                String key = entry.getKey();
                if ("page".equals(key) || "tab".equals(key)) {
                    continue;
                }
                sb.append('&')
                  .append(encode(key))
                  .append('=')
                  .append(encode(entry.getValue()));
            }
        }

        return sb.toString();
    }

    private String encode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }
}
