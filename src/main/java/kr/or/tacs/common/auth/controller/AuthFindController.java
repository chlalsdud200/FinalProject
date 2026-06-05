package kr.or.tacs.common.auth.controller;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import kr.or.tacs.common.auth.service.AuthFindService;

@Controller
public class AuthFindController {

    private static final Logger logger = LoggerFactory.getLogger(AuthFindController.class);

    @Autowired
    private AuthFindService authFindService;

    @GetMapping("/find-password.do")
    public String findPassword(HttpServletRequest request, Model model) {
        addCsrfToken(request, model);
        return "findPassword";
    }

    @PostMapping("/find-password/send-code.do")
    public String sendPasswordFindCode(
            @RequestParam("loginId") String loginId,
            @RequestParam("phoneNo") String phoneNo,
            HttpServletRequest request,
            Model model) {

        // 1. 로직 처리
        boolean codeSent = false;
        String successMessage = null;
        String errorMessage = null;
        try {
            authFindService.registSmsAuthForPasswordFind(loginId, phoneNo);
            codeSent = true;
            successMessage = "가입된 휴대폰 번호로 인증번호를 발송했습니다.";
        } catch (IllegalArgumentException e) {
            errorMessage = e.getMessage();
        } catch (Exception e) {
            logger.error("인증번호 발송 중 예외 발생:", e);
            errorMessage = "인증번호 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }

        // 2. 자료 반환
        addCsrfToken(request, model);
        model.addAttribute("loginId", loginId);
        model.addAttribute("phoneNo", phoneNo);
        model.addAttribute("codeSent", codeSent);
        if (successMessage != null) {
            model.addAttribute("successMessage", successMessage);
        }
        if (errorMessage != null) {
            model.addAttribute("errorMessage", errorMessage);
        }

        return "findPassword";
    }

    @PostMapping("/find-password/verify-code.do")
    public String verifyPasswordFindCode(
            @RequestParam("loginId") String loginId,
            @RequestParam("phoneNo") String phoneNo,
            @RequestParam("authCode") String authCode,
            HttpServletRequest request,
            Model model) {

        // 1. 로직 처리
        boolean verified = false;
        String successMessage = null;
        String errorMessage = null;
        try {
            authFindService.verifySmsAuthForPasswordFind(loginId, phoneNo, authCode);
            verified = true;
            successMessage = "휴대폰 인증이 완료되었습니다. 새 비밀번호를 입력해주세요.";
        } catch (IllegalArgumentException e) {
            errorMessage = e.getMessage();
        } catch (Exception e) {
            logger.error("인증번호 검증 중 예외 발생:", e);
            errorMessage = "인증번호 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }

        // 2. 자료 반환
        addCsrfToken(request, model);
        model.addAttribute("loginId", loginId);
        model.addAttribute("phoneNo", phoneNo);
        model.addAttribute("authCode", authCode);
        model.addAttribute("codeSent", true);
        model.addAttribute("verified", verified);
        if (successMessage != null) {
            model.addAttribute("successMessage", successMessage);
        }
        if (errorMessage != null) {
            model.addAttribute("errorMessage", errorMessage);
        }

        return "findPassword";
    }

    @PostMapping("/find-password/change.do")
    public String changePassword(
            @RequestParam("loginId") String loginId,
            @RequestParam("phoneNo") String phoneNo,
            @RequestParam("newPassword") String newPassword,
            HttpServletRequest request,
            RedirectAttributes redirectAttributes,
            Model model) {

        // 1. 로직 처리
        boolean changed = false;
        String errorMessage = null;
        try {
            authFindService.modifyPasswordAfterAuth(loginId, phoneNo, newPassword);
            changed = true;
        } catch (IllegalArgumentException e) {
            errorMessage = e.getMessage();
        } catch (Exception e) {
            logger.error("비밀번호 변경 중 예외 발생:", e);
            errorMessage = "비밀번호 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }

        // 2. 자료 반환
        if (changed) {
            redirectAttributes.addFlashAttribute("successMessage", "비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 로그인해주세요.");
            return "redirect:/login.do";
        }

        addCsrfToken(request, model);
        model.addAttribute("errorMessage", errorMessage);
        model.addAttribute("loginId", loginId);
        model.addAttribute("phoneNo", phoneNo);
        model.addAttribute("verified", true);
        model.addAttribute("codeSent", true);
        return "findPassword";
    }

    private void addCsrfToken(HttpServletRequest request, Model model) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            model.addAttribute("_csrf", csrfToken);
        }
    }
}