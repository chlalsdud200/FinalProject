package kr.or.tacs.systemadmin.support.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportCodeVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportFaqRequestVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportFaqVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportNoticeRequestVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportNoticeVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportResourceSearchVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportResourceVO;

public interface IAdminSupportContentService {

    PaginationInfoVO<AdminSupportNoticeVO> retrieveNoticeList(String keyword, String noticeType, String pinnedYn,
                                                              String useYn, String fromDate, String toDate,
                                                              int currentPage, int screenSize);

    AdminSupportNoticeVO retrieveNotice(Long noticeNo);

    Long registNotice(AdminSupportNoticeRequestVO request, CustomUser loginUser);

    void modifyNotice(Long noticeNo, AdminSupportNoticeRequestVO request);

    void modifyNoticePinYn(Long noticeNo, String pinnedYn);

    void modifyNoticeUseYn(Long noticeNo, String useYn);

    void deleteNotice(Long noticeNo);

    PaginationInfoVO<AdminSupportFaqVO> retrieveFaqList(String keyword, String categoryCd, String targetRoleCd,
                                                        String useYn, int currentPage, int screenSize);

    AdminSupportFaqVO retrieveFaq(Long faqNo);

    Long registFaq(AdminSupportFaqRequestVO request, CustomUser loginUser);

    void modifyFaq(Long faqNo, AdminSupportFaqRequestVO request);

    void deleteFaq(Long faqNo);

    List<AdminSupportResourceVO> retrieveResourceList(AdminSupportResourceSearchVO search);

    AdminSupportResourceVO retrieveResource(Long resourceNo);

    Long registResource(String title, String description, List<String> selectedTargetRoles,
                        MultipartFile file, CustomUser loginUser) throws Exception;

    void modifyResource(Long resourceNo, String title, String description, List<String> selectedTargetRoles,
                        MultipartFile file, CustomUser loginUser) throws Exception;

    void deleteResource(Long resourceNo);

    ResponseEntity<byte[]> downloadResource(Long resourceNo);

    List<AdminSupportCodeVO> retrieveFaqCategories();

    List<AdminSupportCodeVO> retrieveTargetRoles();
}
