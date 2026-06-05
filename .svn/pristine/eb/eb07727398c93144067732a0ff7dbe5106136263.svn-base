package kr.or.tacs.common.notification.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.common.notification.NotificationPolicyVO;
import kr.or.tacs.vo.common.notification.NotificationVO;

@Mapper
public interface INotificationMapper {

    NotificationPolicyVO selectNotificationPolicy(@Param("eventCd") String eventCd);

    String selectOwnerIdByIrNo(@Param("irNo") String irNo);

    String selectBrokerIdByIrNo(@Param("irNo") String irNo);

    String selectBrokerIdByErNo(@Param("erNo") String erNo);

    String selectOfficerIdByIrNo(@Param("irNo") String irNo);

    // 검역신청번호로 배정된 현장공무원(검역관) id 조회
    String selectFieldOfficerIdByReqNo(@Param("reqNo") String reqNo);

    String selectWarehouseManagerIdByIrNo(@Param("irNo") String irNo);

    String selectTransportManagerIdByIrNo(@Param("irNo") String irNo);

    String selectOwnerIdByWirNo(@Param("wirNo") String wirNo);

    String selectOwnerIdByTrcNo(@Param("trcNo") String trcNo);

    String selectOwnerIdByErNo(@Param("erNo") String erNo);

    String selectTransportManagerIdByWirNo(@Param("wirNo") String wirNo);

    String selectTransportManagerIdByCrrNo(@Param("crrNo") String crrNo);

    String selectTransportManagerIdByTrcNo(@Param("trcNo") String trcNo);

    // 알림 딥링크용: 입고/반출 번호로 운송의뢰번호(trcNo) 조회
    String selectTrcNoByWirNo(@Param("wirNo") String wirNo);

    String selectTrcNoByCrrNo(@Param("crrNo") String crrNo);

    String selectWarehouseManagerIdByWirNo(@Param("wirNo") String wirNo);

    String selectWarehouseManagerIdByCrrNo(@Param("crrNo") String crrNo);

    int insertNotification(NotificationVO vo);

    /**
     * 사용자별 알림 수신 설정값. 행이 없으면 null(=기본 수신), 'N'이면 수신 거부.
     */
    String selectUserNotiUseYn(@Param("userId") String userId, @Param("eventCd") String eventCd);
}
