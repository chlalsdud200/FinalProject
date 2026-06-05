package kr.or.tacs.common.notice.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.tacs.dto.common.notice.NoticeRequest;
import kr.or.tacs.common.notice.mapper.INoticeMapper;
import kr.or.tacs.vo.common.notice.NoticeSearchVO;
import kr.or.tacs.vo.common.notice.NoticeVO;
import kr.or.tacs.vo.common.PaginationInfoVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements INoticeService {

    private static final Set<String> NOTICE_TYPES = Set.of("NOTICE", "URGENT", "UPDATE");

    private final INoticeMapper noticeMapper;

    @Override
    public PaginationInfoVO<NoticeVO> retriveNoticeList(NoticeSearchVO search) {
        if (search == null) {
            search = new NoticeSearchVO();
        }
        normalizeSearch(search);
        int totalCount = noticeMapper.selectNoticeCount(search);
        search.setTotalRecord(totalCount);
        List<NoticeVO> list = noticeMapper.retriveNoticeList(search);
        search.setDataList(list);
        return search;
    }

    @Override
    @Transactional
    public NoticeVO retriveNotice(Long noticeNo, boolean increaseCount) {
        if (noticeNo == null) {
            throw new IllegalArgumentException("noticeNo is required.");
        }
        if (increaseCount) {
            noticeMapper.updateNoticeCount(noticeNo);
        }
        NoticeVO notice = noticeMapper.selectNotice(noticeNo);
        if (notice == null) {
            throw new IllegalArgumentException("Notice not found.");
        }
        return notice;
    }

    @Override
    @Transactional
    public Long registNotice(NoticeRequest request, String adminId) {
        NoticeVO notice = toNotice(request);
        notice.setNoticeAdminId(resolveAdminId(request, adminId));
        noticeMapper.insertNotice(notice);
        return notice.getNoticeNo();
    }

    @Override
    @Transactional
    public void modifyNotice(Long noticeNo, NoticeRequest request) {
        if (noticeNo == null) {
            throw new IllegalArgumentException("noticeNo is required.");
        }
        NoticeVO notice = toNotice(request);
        notice.setNoticeNo(noticeNo);
        int count = noticeMapper.updateNotice(notice);
        if (count == 0) {
            throw new IllegalArgumentException("Notice not found.");
        }
    }

    @Override
    @Transactional
    public void modifyNoticePinYn(Long noticeNo, String noticePinYn) {
        if (noticeNo == null) {
            throw new IllegalArgumentException("noticeNo is required.");
        }
        String pinYn = normalizeYn(noticePinYn, "noticePinYn");
        int count = noticeMapper.updateNoticePinYn(noticeNo, pinYn);
        if (count == 0) {
            throw new IllegalArgumentException("Notice not found.");
        }
    }

    @Override
    @Transactional
    public void modifyNoticeUseYn(Long noticeNo, String noticeUseYn) {
        if (noticeNo == null) {
            throw new IllegalArgumentException("noticeNo is required.");
        }
        String useYn = normalizeYn(noticeUseYn, "noticeUseYn");
        int count = noticeMapper.updateNoticeUseYn(noticeNo, useYn);
        if (count == 0) {
            throw new IllegalArgumentException("Notice not found.");
        }
    }

    @Override
    @Transactional
    public void deleteNotice(Long noticeNo) {
        if (noticeNo == null) {
            throw new IllegalArgumentException("noticeNo is required.");
        }
        int count = noticeMapper.deleteNotice(noticeNo);
        if (count == 0) {
            throw new IllegalArgumentException("Notice not found.");
        }
    }

    private NoticeVO toNotice(NoticeRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("request body is required.");
        }
        String type = normalizeType(request.getNoticeType());
        String title = trim(request.getNoticeTitle());
        String content = trim(request.getNoticeContent());
        if (title == null) {
            throw new IllegalArgumentException("noticeTitle is required.");
        }
        if (content == null) {
            throw new IllegalArgumentException("noticeContent is required.");
        }
        if (title.length() > 64) {
            throw new IllegalArgumentException("noticeTitle is too long.");
        }
        NoticeVO notice = new NoticeVO();
        notice.setNoticeType(type);
        notice.setNoticeTitle(title);
        notice.setNoticeContent(content);
        notice.setNoticePinYn(normalizeYnOrDefault(request.getNoticePinYn(), "N"));
        notice.setNoticeUseYn(normalizeYnOrDefault(request.getNoticeUseYn(), "Y"));
        return notice;
    }

    private void normalizeSearch(NoticeSearchVO search) {
        if (search == null) return;
        String type = trim(search.getType());
        if (type == null || "all".equalsIgnoreCase(type)) {
            search.setType("all");
        } else {
            search.setType(normalizeType(type));
        }
        search.setKeyword(trim(search.getKeyword()));
        search.setFromDate(trim(search.getFromDate()));
        search.setToDate(trim(search.getToDate()));
        search.setPinnedYn(normalizeFilterYn(search.getPinnedYn()));
        search.setUseYn(normalizeFilterYn(search.getUseYn()));
    }

    private String normalizeType(String type) {
        String value = trim(type);
        if (value == null) {
            return "NOTICE";
        }
        value = value.toUpperCase();
        if (!NOTICE_TYPES.contains(value)) {
            throw new IllegalArgumentException("Invalid noticeType: " + type);
        }
        return value;
    }

    private String normalizeYnOrDefault(String value, String defaultValue) {
        String normalized = trim(value);
        if (normalized == null) {
            return defaultValue;
        }
        return normalizeYn(normalized, "yn");
    }

    private String normalizeYn(String value, String fieldName) {
        String normalized = trim(value);
        if (normalized == null) {
            throw new IllegalArgumentException(fieldName + " is required.");
        }
        normalized = normalized.toUpperCase();
        if (!Set.of("Y", "N").contains(normalized)) {
            throw new IllegalArgumentException(fieldName + " must be Y or N.");
        }
        return normalized;
    }

    private String normalizeFilterYn(String value) {
        String normalized = trim(value);
        if (normalized == null || "all".equalsIgnoreCase(normalized)) {
            return "all";
        }
        normalized = normalized.toUpperCase();
        return Set.of("Y", "N").contains(normalized) ? normalized : "all";
    }

    private String resolveAdminId(NoticeRequest request, String adminId) {
        String value = trim(adminId);
        if (value != null) {
            return value;
        }
        value = trim(request.getNoticeAdminId());
        return value == null ? "SYSTEM" : value;
    }

    private String trim(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
