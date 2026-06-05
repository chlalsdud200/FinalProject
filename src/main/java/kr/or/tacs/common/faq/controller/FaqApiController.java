package kr.or.tacs.common.faq.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.common.faq.service.IFaqService;
import kr.or.tacs.vo.FaqSearchVO;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/faq/api")
@RequiredArgsConstructor
public class FaqApiController {

    private final IFaqService faqService;

    @GetMapping("/list.do")
    @ResponseBody
    public ResponseEntity<?> retrieveFaqList(
            FaqSearchVO search,
            @AuthenticationPrincipal CustomUser loginUser
    ) {
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(faqService.retrieveFaqList(search, loginUser));
    }

    @GetMapping("/{faqNo}.do")
    @ResponseBody
    public ResponseEntity<?> retrieveFaq(
            @PathVariable Long faqNo,
            @AuthenticationPrincipal CustomUser loginUser
    ) {
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(faqService.retrieveFaq(faqNo, true, loginUser));
    }
}
