package kr.or.tacs.officer.basicscreen.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import kr.or.tacs.dto.officer.WorkHistoryDTO;
import kr.or.tacs.officer.basicscreen.service.IWorkHistoryService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/officer/workHistory")
@RequiredArgsConstructor
public class WorkHistoryController {

    private final IWorkHistoryService workHistoryService;

    /** 등록: POST /officer/workHistory/save */
    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody WorkHistoryDTO dto,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        dto.setOfficerId(userDetails.getUsername());
        return ResponseEntity.ok(workHistoryService.save(dto));
    }

    /** 해지: POST /officer/workHistory/cancel */
    @PostMapping("/cancel")
    public ResponseEntity<?> cancel(@RequestBody Map<String, String> body) {
        String reqNo    = body.get("reqNo");
        String workType = body.get("workType");
        WorkHistoryDTO result = workHistoryService.cancel(reqNo, workType);
        if (result == null) return ResponseEntity.ok(Map.of("cancelled", false));
        return ResponseEntity.ok(Map.of("cancelled", true));
    }

    /** 이력 조회: GET /officer/workHistory/list?reqNo= */
    @GetMapping("/list")
    public ResponseEntity<List<WorkHistoryDTO>> list(@RequestParam String reqNo) {
        return ResponseEntity.ok(workHistoryService.getList(reqNo));
    }

    /** 활성 건 조회: GET /officer/workHistory/active?reqNo= */
    @GetMapping("/active")
    public ResponseEntity<?> active(@RequestParam String reqNo) {
        WorkHistoryDTO active = workHistoryService.findActive(reqNo);
        if (active == null) return ResponseEntity.ok(Map.of("hasActive", false));
        return ResponseEntity.ok(active);
    }

    /**
     * 보완제출 상세 확인: GET /officer/workHistory/supplement?srNo=
     * 관세사가 제출한 내용(SR_SUBMIT_CN)을 공무원이 조회
     */
    @GetMapping("/supplement")
    public ResponseEntity<?> supplementDetail(@RequestParam String srNo) {
        WorkHistoryDTO detail = workHistoryService.getSupplementDetail(srNo);
        if (detail == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(detail);
    }
}