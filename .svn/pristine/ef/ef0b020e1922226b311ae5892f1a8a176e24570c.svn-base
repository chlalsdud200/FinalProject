package kr.or.tacs.common.notification.pref.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.common.notification.NotificationPrefVO;

@Mapper
public interface INotificationPrefMapper {

    /**
     * 해당 사용자 유형이 수신 대상인 활성 알림 정책 + 사용자의 현재 on/off 설정.
     */
    List<NotificationPrefVO> selectPrefList(@Param("userType") String userType,
                                            @Param("userId") String userId);

    int mergePref(@Param("userId") String userId,
                  @Param("eventCd") String eventCd,
                  @Param("useYn") String useYn);

    /**
     * 해당 사용자 유형이 받는 모든 활성 알림을 한 번에 on/off (전체 켜기/끄기).
     */
    int mergeAllPref(@Param("userId") String userId,
                     @Param("userType") String userType,
                     @Param("useYn") String useYn);
}
