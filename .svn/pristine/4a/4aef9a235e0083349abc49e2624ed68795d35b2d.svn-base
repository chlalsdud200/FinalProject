package kr.or.tacs.common.notification.pref.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.tacs.common.notification.pref.mapper.INotificationPrefMapper;
import kr.or.tacs.vo.common.notification.NotificationPrefVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationPrefServiceImpl implements INotificationPrefService {

    private final INotificationPrefMapper prefMapper;

    @Override
    public List<NotificationPrefVO> retrievePrefList(String userType, String userId) {
        return prefMapper.selectPrefList(userType, userId);
    }

    @Override
    @Transactional
    public void modifyPref(String userId, String eventCd, boolean on) {
        prefMapper.mergePref(userId, eventCd, on ? "Y" : "N");
    }

    @Override
    @Transactional
    public void modifyAllPref(String userType, String userId, boolean on) {
        prefMapper.mergeAllPref(userId, userType, on ? "Y" : "N");
    }
}
