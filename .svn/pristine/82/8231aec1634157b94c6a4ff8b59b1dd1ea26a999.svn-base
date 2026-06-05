package kr.or.tacs.common.faq.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.common.faq.service.IFaqService;
import kr.or.tacs.dto.FaqRequest;
import kr.or.tacs.vo.FaqSearchVO;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/admin/faqs")
@RequiredArgsConstructor
public class FaqAdminController {

    private final IFaqService faqService;

    @GetMapping("/manage.do")
    public String retrieveFaqManage() {
        return "admin/faq";
    }

    @GetMapping("/list.do")
    @ResponseBody
    public ResponseEntity<?> retrieveFaqAdminList(FaqSearchVO search) {
        return ResponseEntity.ok(faqService.retrieveFaqAdminList(search));
    }

    @GetMapping("/{faqNo}")
    @ResponseBody
    public ResponseEntity<?> retrieveFaqForAdmin(@PathVariable Long faqNo) {
        return ResponseEntity.ok(faqService.retrieveFaqForAdmin(faqNo));
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<?> registFaq(
            @RequestBody FaqRequest request,
            @AuthenticationPrincipal CustomUser loginUser
    ) {
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long faqNo = faqService.registFaq(request, loginUser);
        return ResponseEntity.ok(Map.of("success", true, "faqNo", faqNo));
    }

    @PutMapping("/{faqNo}")
    @ResponseBody
    public ResponseEntity<?> modifyFaq(
            @PathVariable Long faqNo,
            @RequestBody FaqRequest request
    ) {
        faqService.modifyFaq(faqNo, request);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{faqNo}")
    @ResponseBody
    public ResponseEntity<?> deleteFaq(@PathVariable Long faqNo) {
        faqService.deleteFaq(faqNo);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
