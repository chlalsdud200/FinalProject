package kr.or.tacs.common.notice.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.dto.common.notice.NoticeRequest;
import kr.or.tacs.common.notice.service.INoticeService;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/admin/notices")
@RequiredArgsConstructor
public class NoticeAdminController {

    private final INoticeService noticeService;

    @GetMapping("/manage.do")
    public String retriveNoticeManage() {
        return "admin/notice";
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<?> registNotice(@RequestBody NoticeRequest request) {
        Long noticeNo = noticeService.registNotice(request, getLoginId());
        return ResponseEntity.ok(Map.of("success", true, "noticeNo", noticeNo));
    }

    @PutMapping("/{noticeNo}")
    @ResponseBody
    public ResponseEntity<?> modifyNotice(@PathVariable Long noticeNo, @RequestBody NoticeRequest request) {
        noticeService.modifyNotice(noticeNo, request);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{noticeNo}")
    @ResponseBody
    public ResponseEntity<?> deleteNotice(@PathVariable Long noticeNo) {
        noticeService.deleteNotice(noticeNo);
        return ResponseEntity.ok(Map.of("success", true));
    }

    private String getLoginId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUser user) {
            return user.getLoginId();
        }
        return null;
    }
}
