package kr.or.tacs.systemadmin.notification.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.systemadmin.notification.AdminNotificationPolicySearchVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationPolicyVO;

@Mapper
public interface IAdminNotificationPolicyMapper {

    List<AdminNotificationPolicyVO> selectPolicyList(AdminNotificationPolicySearchVO search);

    long countPolicies(AdminNotificationPolicySearchVO search);

    AdminNotificationPolicyVO selectPolicy(@Param("eventCd") String eventCd);

    int countPolicy(@Param("eventCd") String eventCd);

    int insertPolicy(AdminNotificationPolicyVO policy);

    int updatePolicy(AdminNotificationPolicyVO policy);

    int updatePolicyUseYn(@Param("eventCd") String eventCd, @Param("useYn") String useYn);
}
