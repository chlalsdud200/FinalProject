package kr.or.tacs.common.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import kr.or.tacs.cmmenums.ServiceResult;
import kr.or.tacs.common.auth.service.AuthService;
import kr.or.tacs.common.auth.service.JoinVerificationService;
import kr.or.tacs.vo.OwnerVO;

@Controller
public class LoginController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JoinVerificationService joinVerificationService;

    @GetMapping("/")
    public String root() {
        return "redirect:/login.do";
    }

    @GetMapping("/login.do")
    public String login(HttpServletRequest request, HttpServletResponse response, Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAuthenticated(authentication)) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
            return "redirect:/login.do";
        }

        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            model.addAttribute("_csrf", csrfToken);
        }
        return "login";   // → /WEB-INF/views/login.jsp 찾음
    }

    @GetMapping("/accessError")
    public String accessError(HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        return "accessError";
    }

    @GetMapping("/join.do")
    public String join(HttpServletRequest request, Model model) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            model.addAttribute("_csrf", csrfToken);
        }
        return "register";
    }

    @PostMapping("/joinProc.do")
    public String registOwner(
            @ModelAttribute OwnerVO ownerVO,
            @RequestParam("authCode") String authCode,
            RedirectAttributes redirectAttributes) {

        // 1. 로직 처리
        boolean joined = false;
        String errorMessage = null;
        try {
            joinVerificationService.verifyJoinAuthForSignup(ownerVO.getOwrTelno(), authCode);
            ServiceResult result = authService.registOwner(ownerVO);
            if (result == ServiceResult.OK) {
                joined = true;
            } else {
                errorMessage = result == ServiceResult.EXIST
                        ? "이미 사용 중인 아이디입니다."
                        : "회원가입 처리 중 오류가 발생했습니다.";
            }
        } catch (IllegalArgumentException e) {
            errorMessage = e.getMessage();
        } catch (Exception e) {
            errorMessage = "회원가입 처리 중 오류가 발생했습니다.";
        }

        // 2. 자료 반환
        if (joined) {
            redirectAttributes.addFlashAttribute("successMessage", "회원가입이 완료되었습니다. 로그인해 주세요.");
            return "redirect:/login.do";
        }

        redirectAttributes.addFlashAttribute("errorMessage", errorMessage);
        return "redirect:/join.do";
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }
}
