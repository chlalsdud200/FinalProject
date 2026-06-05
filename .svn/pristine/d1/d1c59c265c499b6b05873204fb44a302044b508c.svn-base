package kr.or.tacs.common.mypage.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.or.tacs.common.mypage.service.MyPageService;
import kr.or.tacs.dto.common.mypage.MyPagePasswordChangeDTO;
import kr.or.tacs.dto.common.mypage.MyPagePasswordCheckDTO;
import kr.or.tacs.dto.common.mypage.MyPageProfileModifyDTO;
import kr.or.tacs.dto.common.mypage.MyPageResponseDTO;
import kr.or.tacs.dto.common.mypage.MyPageSmsVerifyDTO;
import kr.or.tacs.vo.common.CustomUser;

@Controller
public class MyPageController {

    private final MyPageService myPageService;

    public MyPageController(MyPageService myPageService) {
        this.myPageService = myPageService;
    }

    @GetMapping({
            "/owner/mypage.do",
            "/broker/mypage.do",
            "/officer/mypage.do",
            "/systemadmin/mypage.do"
    })
    public String retriveMyPage(
            @RequestParam(value = "tab", required = false, defaultValue = "profile") String tab,
            HttpServletRequest request,
            Model model
    ) {
        String actorPath = retriveActorPath(request);
        String normalizedTab = normalizeTab(tab);

        model.addAttribute("mypageActorPath", actorPath);
        model.addAttribute("mypageTab", normalizedTab);
        model.addAttribute("activeMenu", "mypage");
        model.addAttribute("activeGroup", "mypage");
        model.addAttribute("activeSub", normalizedTab);
        model.addAttribute("menuKey", "mypage");

        return retriveViewName(actorPath);
    }

    @GetMapping({
            "/owner/mypage/profile/edit.do",
            "/broker/mypage/profile/edit.do",
            "/officer/mypage/profile/edit.do",
            "/fieldofficer/mypage/profile/edit.do",
            "/transport/mypage/profile/edit.do",
            "/warehouse/mypage/profile/edit.do",
            "/systemadmin/mypage/profile/edit.do"
    })
    @ResponseBody
    public MyPageResponseDTO retriveProfileEdit(
            @AuthenticationPrincipal CustomUser user,
            HttpServletRequest request,
            HttpSession session
    ) {
        String actorPath = retriveActorPath(request);
        return myPageService.retriveProfile(actorPath, user, session);
    }

    @PostMapping({
            "/owner/mypage/profile/password-check.do",
            "/broker/mypage/profile/password-check.do",
            "/officer/mypage/profile/password-check.do",
            "/fieldofficer/mypage/profile/password-check.do",
            "/transport/mypage/profile/password-check.do",
            "/warehouse/mypage/profile/password-check.do",
            "/systemadmin/mypage/profile/password-check.do"
    })
    @ResponseBody
    public MyPageResponseDTO modifyPasswordCheck(
            @ModelAttribute MyPagePasswordCheckDTO passwordCheckDTO,
            @AuthenticationPrincipal CustomUser user,
            HttpServletRequest request,
            HttpSession session
    ) {
        String actorPath = retriveActorPath(request);
        return myPageService.modifyPasswordCheck(actorPath, passwordCheckDTO, user, session);
    }

    @PostMapping({
            "/owner/mypage/profile/modify.do",
            "/broker/mypage/profile/modify.do",
            "/officer/mypage/profile/modify.do",
            "/fieldofficer/mypage/profile/modify.do",
            "/transport/mypage/profile/modify.do",
            "/warehouse/mypage/profile/modify.do",
            "/systemadmin/mypage/profile/modify.do"
    })
    @ResponseBody
    public MyPageResponseDTO modifyProfile(
            @ModelAttribute MyPageProfileModifyDTO profileModifyDTO,
            @AuthenticationPrincipal CustomUser user,
            HttpServletRequest request,
            HttpSession session
    ) {
        String actorPath = retriveActorPath(request);
        return myPageService.modifyProfile(actorPath, profileModifyDTO, user, session);
    }

    @PostMapping({
            "/owner/mypage/profile/password/sms-send.do",
            "/broker/mypage/profile/password/sms-send.do",
            "/officer/mypage/profile/password/sms-send.do",
            "/fieldofficer/mypage/profile/password/sms-send.do",
            "/transport/mypage/profile/password/sms-send.do",
            "/warehouse/mypage/profile/password/sms-send.do",
            "/systemadmin/mypage/profile/password/sms-send.do"
    })
    @ResponseBody
    public MyPageResponseDTO registPasswordSms(
            @AuthenticationPrincipal CustomUser user,
            HttpServletRequest request,
            HttpSession session
    ) {
        String actorPath = retriveActorPath(request);
        return myPageService.registPasswordSms(actorPath, user, session);
    }

    @PostMapping({
            "/owner/mypage/profile/password/sms-verify.do",
            "/broker/mypage/profile/password/sms-verify.do",
            "/officer/mypage/profile/password/sms-verify.do",
            "/fieldofficer/mypage/profile/password/sms-verify.do",
            "/transport/mypage/profile/password/sms-verify.do",
            "/warehouse/mypage/profile/password/sms-verify.do",
            "/systemadmin/mypage/profile/password/sms-verify.do"
    })
    @ResponseBody
    public MyPageResponseDTO modifyPasswordSmsVerify(
            @ModelAttribute MyPageSmsVerifyDTO smsVerifyDTO,
            @AuthenticationPrincipal CustomUser user,
            HttpServletRequest request,
            HttpSession session
    ) {
        String actorPath = retriveActorPath(request);
        return myPageService.modifyPasswordSmsVerify(actorPath, smsVerifyDTO, user, session);
    }

    @PostMapping({
            "/owner/mypage/profile/password/modify.do",
            "/broker/mypage/profile/password/modify.do",
            "/officer/mypage/profile/password/modify.do",
            "/fieldofficer/mypage/profile/password/modify.do",
            "/transport/mypage/profile/password/modify.do",
            "/warehouse/mypage/profile/password/modify.do",
            "/systemadmin/mypage/profile/password/modify.do"
    })
    @ResponseBody
    public MyPageResponseDTO modifyPassword(
            @ModelAttribute MyPagePasswordChangeDTO passwordChangeDTO,
            @AuthenticationPrincipal CustomUser user,
            HttpServletRequest request,
            HttpSession session
    ) {
        String actorPath = retriveActorPath(request);
        return myPageService.modifyPassword(actorPath, passwordChangeDTO, user, session);
    }

    private String retriveActorPath(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String contextPath = request.getContextPath();

        if (contextPath != null && !contextPath.isEmpty() && uri.startsWith(contextPath)) {
            uri = uri.substring(contextPath.length());
        }

        String[] parts = uri.split("/");
        return parts.length > 1 ? parts[1] : "owner";
    }

    private String normalizeTab(String tab) {
        if ("alarm".equals(tab) || "notify".equals(tab)) {
            return "alarm";
        }
        return "profile";
    }

    private String retriveViewName(String actorPath) {
        return switch (actorPath) {
            case "broker" -> "broker/pages/mypage";
            case "officer" -> "officer/mypage";
            case "fieldofficer" -> "fieldofficer/mypage";
            case "transport" -> "transport/pages/mypage";
            case "warehouse" -> "warehouse/mypage";
            case "systemadmin" -> "systemadmin/mypage";
            default -> "owner/mypage/info";
        };
    }
}
