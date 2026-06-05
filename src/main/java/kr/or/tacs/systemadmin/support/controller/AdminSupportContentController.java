package kr.or.tacs.systemadmin.support.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.tacs.systemadmin.support.service.IAdminSupportContentService;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportCodeVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportFaqRequestVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportFaqVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportNoticeRequestVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportNoticeVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportResourceSearchVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportResourceVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tacs/admin/support")
public class AdminSupportContentController {

    private final IAdminSupportContentService supportContentService;

    @GetMapping("/notices")
    public PaginationInfoVO<AdminSupportNoticeVO> retrieveNotices(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "all") String noticeType,
            @RequestParam(required = false, defaultValue = "all") String pinnedYn,
            @RequestParam(required = false, defaultValue = "all") String useYn,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false, defaultValue = "1") int currentPage,
            @RequestParam(required = false, defaultValue = "10") int screenSize
    ) {
        return supportContentService.retrieveNoticeList(keyword, noticeType, pinnedYn, useYn, fromDate, toDate, currentPage, screenSize);
    }

    @GetMapping("/notices/{noticeNo}")
    public AdminSupportNoticeVO retrieveNotice(@PathVariable Long noticeNo) {
        return supportContentService.retrieveNotice(noticeNo);
    }

    @PostMapping("/notices")
    public Map<String, Object> registNotice(
            @RequestBody AdminSupportNoticeRequestVO request,
            @AuthenticationPrincipal CustomUser loginUser
    ) {
        Long noticeNo = supportContentService.registNotice(request, loginUser);
        return Map.of("success", true, "noticeNo", noticeNo);
    }

    @PutMapping("/notices/{noticeNo}")
    public Map<String, Object> modifyNotice(@PathVariable Long noticeNo, @RequestBody AdminSupportNoticeRequestVO request) {
        supportContentService.modifyNotice(noticeNo, request);
        return Map.of("success", true);
    }

    @PutMapping("/notices/{noticeNo}/pin")
    public Map<String, Object> modifyNoticePinYn(
            @PathVariable Long noticeNo,
            @RequestBody Map<String, String> request
    ) {
        supportContentService.modifyNoticePinYn(noticeNo, request.get("pinnedYn"));
        return Map.of("success", true);
    }

    @PutMapping("/notices/{noticeNo}/use-yn")
    public Map<String, Object> modifyNoticeUseYn(
            @PathVariable Long noticeNo,
            @RequestBody Map<String, String> request
    ) {
        supportContentService.modifyNoticeUseYn(noticeNo, request.get("useYn"));
        return Map.of("success", true);
    }

    @DeleteMapping("/notices/{noticeNo}")
    public Map<String, Object> deleteNotice(@PathVariable Long noticeNo) {
        supportContentService.deleteNotice(noticeNo);
        return Map.of("success", true);
    }

    @GetMapping("/faqs")
    public PaginationInfoVO<AdminSupportFaqVO> retrieveFaqs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "all") String categoryCd,
            @RequestParam(required = false, defaultValue = "all") String targetRoleCd,
            @RequestParam(required = false, defaultValue = "all") String useYn,
            @RequestParam(required = false, defaultValue = "1") int currentPage,
            @RequestParam(required = false, defaultValue = "10") int screenSize
    ) {
        return supportContentService.retrieveFaqList(keyword, categoryCd, targetRoleCd, useYn, currentPage, screenSize);
    }

    @GetMapping("/faqs/{faqNo}")
    public AdminSupportFaqVO retrieveFaq(@PathVariable Long faqNo) {
        return supportContentService.retrieveFaq(faqNo);
    }

    @PostMapping("/faqs")
    public Map<String, Object> registFaq(
            @RequestBody AdminSupportFaqRequestVO request,
            @AuthenticationPrincipal CustomUser loginUser
    ) {
        Long faqNo = supportContentService.registFaq(request, loginUser);
        return Map.of("success", true, "faqNo", faqNo);
    }

    @PutMapping("/faqs/{faqNo}")
    public Map<String, Object> modifyFaq(@PathVariable Long faqNo, @RequestBody AdminSupportFaqRequestVO request) {
        supportContentService.modifyFaq(faqNo, request);
        return Map.of("success", true);
    }

    @DeleteMapping("/faqs/{faqNo}")
    public Map<String, Object> deleteFaq(@PathVariable Long faqNo) {
        supportContentService.deleteFaq(faqNo);
        return Map.of("success", true);
    }

    @GetMapping("/resources")
    public List<AdminSupportResourceVO> retrieveResources(@ModelAttribute AdminSupportResourceSearchVO search) {
        return supportContentService.retrieveResourceList(search);
    }

    @GetMapping("/resources/{resourceNo}")
    public AdminSupportResourceVO retrieveResource(@PathVariable Long resourceNo) {
        return supportContentService.retrieveResource(resourceNo);
    }

    @PostMapping(value = "/resources", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> registResource(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam("selectedTargetRoles") List<String> selectedTargetRoles,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal CustomUser loginUser
    ) throws Exception {
        Long resourceNo = supportContentService.registResource(title, description, selectedTargetRoles, file, loginUser);
        return Map.of("success", true, "resourceNo", resourceNo);
    }

    @PutMapping(value = "/resources/{resourceNo}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> modifyResource(
            @PathVariable Long resourceNo,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam("selectedTargetRoles") List<String> selectedTargetRoles,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal CustomUser loginUser
    ) throws Exception {
        supportContentService.modifyResource(resourceNo, title, description, selectedTargetRoles, file, loginUser);
        return Map.of("success", true);
    }

    @DeleteMapping("/resources/{resourceNo}")
    public Map<String, Object> deleteResource(@PathVariable Long resourceNo) {
        supportContentService.deleteResource(resourceNo);
        return Map.of("success", true);
    }

    @GetMapping("/resources/{resourceNo}/download")
    public ResponseEntity<byte[]> downloadResource(@PathVariable Long resourceNo) {
        return supportContentService.downloadResource(resourceNo);
    }

    @GetMapping("/codes/faq-categories")
    public List<AdminSupportCodeVO> retrieveFaqCategories() {
        return supportContentService.retrieveFaqCategories();
    }

    @GetMapping("/codes/target-roles")
    public List<AdminSupportCodeVO> retrieveTargetRoles() {
        return supportContentService.retrieveTargetRoles();
    }
}
