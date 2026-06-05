package kr.or.tacs.systemadmin.notification.service;

import java.util.List;

import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationPolicyRequestVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationPolicySearchVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationPolicyVO;

public interface IAdminNotificationPolicyService {

    PaginationInfoVO<AdminNotificationPolicyVO> retrievePolicyList(AdminNotificationPolicySearchVO search);

    AdminNotificationPolicyVO retrievePolicy(String eventCd);

    void registPolicy(AdminNotificationPolicyRequestVO request);

    void modifyPolicy(String eventCd, AdminNotificationPolicyRequestVO request);

    void modifyPolicyUseYn(String eventCd, String useYn);
}
