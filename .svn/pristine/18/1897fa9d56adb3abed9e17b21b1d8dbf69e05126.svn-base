package kr.or.tacs.common.resource.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.common.resource.service.IResourceArchiveService;
import kr.or.tacs.vo.common.ResourceArchiveUploadVO;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/admin/resources")
@RequiredArgsConstructor
public class ResourceArchiveAdminController {

    private final IResourceArchiveService resourceArchiveService;

    @GetMapping("/manage.do")
    public String retriveResourceArchiveManage() {
        return "admin/resourceArchive";
    }

    @PostMapping("/upload.do")
    public String registResourceArchive(
            @ModelAttribute ResourceArchiveUploadVO uploadVO,
            @AuthenticationPrincipal CustomUser loginUser,
            RedirectAttributes redirectAttributes
    ) {
        // 1. 로직 처리
        String message = null;
        String errorMessage = null;
        try {
            resourceArchiveService.registResourceArchive(uploadVO, loginUser);
            message = "자료실 글이 등록되었습니다.";
        } catch (IllegalArgumentException e) {
            errorMessage = e.getMessage();
        } catch (Exception e) {
            errorMessage = "자료실 등록 중 오류가 발생했습니다.";
        }

        // 2. 자료 반환
        if (errorMessage != null) {
            redirectAttributes.addFlashAttribute("error", errorMessage);
        } else {
            redirectAttributes.addFlashAttribute("message", message);
        }

        return "redirect:/admin/resources/manage.do";
    }
}
