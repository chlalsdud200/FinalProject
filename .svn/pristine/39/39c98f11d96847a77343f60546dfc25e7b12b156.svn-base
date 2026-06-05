package kr.or.tacs.common.notice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.tacs.common.notice.service.INoticeService;
import kr.or.tacs.vo.common.notice.NoticeSearchVO;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/notice/api")
@RequiredArgsConstructor
public class NoticeApiController {

    private final INoticeService noticeService;

    @GetMapping("/list.do")
    @ResponseBody
    public ResponseEntity<?> retriveNoticeList(NoticeSearchVO search) {
        return ResponseEntity.ok(noticeService.retriveNoticeList(search));
    }

    @GetMapping("/{noticeNo}.do")
    @ResponseBody
    public ResponseEntity<?> retriveNotice(@PathVariable Long noticeNo) {
        return ResponseEntity.ok(noticeService.retriveNotice(noticeNo, true));
    }
}
