package kr.or.tacs.common.notice.service;

import kr.or.tacs.dto.common.notice.NoticeRequest;
import kr.or.tacs.vo.common.notice.NoticeSearchVO;
import kr.or.tacs.vo.common.notice.NoticeVO;
import kr.or.tacs.vo.common.PaginationInfoVO;

public interface INoticeService {

    PaginationInfoVO<NoticeVO> retriveNoticeList(NoticeSearchVO search);

    NoticeVO retriveNotice(Long noticeNo, boolean increaseCount);

    Long registNotice(NoticeRequest request, String adminId);

    void modifyNotice(Long noticeNo, NoticeRequest request);

    void modifyNoticePinYn(Long noticeNo, String noticePinYn);

    void modifyNoticeUseYn(Long noticeNo, String noticeUseYn);

    void deleteNotice(Long noticeNo);
}
