package kr.or.tacs.systemadmin.notification.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.tacs.systemadmin.notification.mapper.IAdminNotificationHistoryMapper;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationEventOptionVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationHistorySearchVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationHistoryVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminNotificationHistoryServiceImpl implements IAdminNotificationHistoryService {

    private final IAdminNotificationHistoryMapper historyMapper;

    @Override
    public PaginationInfoVO<AdminNotificationHistoryVO> retrieveHistoryList(AdminNotificationHistorySearchVO search) {
        AdminNotificationHistorySearchVO normalized = search == null ? new AdminNotificationHistorySearchVO() : search;
        normalized.setCurrentPage(clampPage(normalized.getCurrentPage()));
        normalized.setScreenSize(clampSize(normalized.getScreenSize()));

        List<AdminNotificationHistoryVO> items = historyMapper.selectHistoryList(normalized);
        long totalCount = historyMapper.countHistory(normalized);

        PaginationInfoVO<AdminNotificationHistoryVO> pagingVO = new PaginationInfoVO<>(normalized.getScreenSize(), 5);
        pagingVO.setCurrentPage(normalized.getCurrentPage());
        pagingVO.setTotalRecord((int) totalCount);
        pagingVO.setDataList(items);

        return pagingVO;
    }

    @Override
    public AdminNotificationHistoryVO retrieveHistory(Long notiNo) {
        return historyMapper.selectHistory(notiNo);
    }

    @Override
    public List<AdminNotificationEventOptionVO> retrieveEventOptionList() {
        return historyMapper.selectEventOptionList();
    }

    private int clampPage(Integer page) {
        return page == null || page < 1 ? 1 : page;
    }

    private int clampSize(Integer size) {
        if (size == null || size < 1) {
            return 20;
        }
        return Math.min(size, 100);
    }
}
