package kr.or.tacs.systemadmin.notification.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.systemadmin.notification.service.IAdminNotificationHistoryService;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationEventOptionVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationHistorySearchVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationHistoryVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tacs/admin/notifications")
public class AdminNotificationHistoryController {

    private final IAdminNotificationHistoryService historyService;

    @GetMapping("/history")
    public PaginationInfoVO<AdminNotificationHistoryVO> retrieveHistoryList(@ModelAttribute AdminNotificationHistorySearchVO search) {
        return historyService.retrieveHistoryList(search);
    }

    @GetMapping("/history/{notiNo}")
    public ResponseEntity<AdminNotificationHistoryVO> retrieveHistory(@PathVariable Long notiNo) {
        AdminNotificationHistoryVO vo = historyService.retrieveHistory(notiNo);
        if (vo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(vo);
    }

    @GetMapping("/event-options")
    public List<AdminNotificationEventOptionVO> retrieveEventOptions() {
        return historyService.retrieveEventOptionList();
    }
}
