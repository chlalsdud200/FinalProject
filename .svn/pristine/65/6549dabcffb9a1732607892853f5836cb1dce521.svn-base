package kr.or.tacs.common.notification.inbox.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.common.notification.inbox.service.INotificationInboxService;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.notification.inbox.NotificationInboxItemVO;
import kr.or.tacs.vo.common.notification.inbox.NotificationUnreadCountVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationInboxController {

    private final INotificationInboxService inboxService;

    @GetMapping("/unread-count")
    public ResponseEntity<NotificationUnreadCountVO> retrieveUnreadSummary() {
        String loginId = getLoginId();
        if (loginId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(inboxService.retrieveUnreadSummary(loginId));
    }

    @GetMapping
    public ResponseEntity<List<NotificationInboxItemVO>> retrieveInboxList(
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false, defaultValue = "0") int offset
    ) {
        String loginId = getLoginId();
        if (loginId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(inboxService.retrieveInboxList(loginId, limit, offset));
    }

    @PutMapping("/{notiNo}/read")
    public ResponseEntity<Map<String, Object>> modifyRead(@PathVariable Long notiNo) {
        String loginId = getLoginId();
        if (loginId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        inboxService.modifyRead(notiNo, loginId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> modifyReadAll() {
        String loginId = getLoginId();
        if (loginId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        int updated = inboxService.modifyReadAll(loginId);
        return ResponseEntity.ok(Map.of("success", true, "updated", updated));
    }

    @DeleteMapping("/{notiNo}")
    public ResponseEntity<Map<String, Object>> remove(@PathVariable Long notiNo) {
        String loginId = getLoginId();
        if (loginId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        int deleted = inboxService.remove(notiNo, loginId);
        return ResponseEntity.ok(Map.of("success", true, "deleted", deleted));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> removeAll() {
        String loginId = getLoginId();
        if (loginId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        int deleted = inboxService.removeAll(loginId);
        return ResponseEntity.ok(Map.of("success", true, "deleted", deleted));
    }

    private String getLoginId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUser)) {
            return null;
        }
        return ((CustomUser) auth.getPrincipal()).getLoginId();
    }
}
