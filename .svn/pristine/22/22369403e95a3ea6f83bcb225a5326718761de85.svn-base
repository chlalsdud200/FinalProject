package kr.or.tacs.systemadmin.support.service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import kr.or.tacs.common.faq.service.IFaqService;
import kr.or.tacs.common.file.service.GoogleDriveService;
import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.common.notice.service.INoticeService;
import kr.or.tacs.dto.FaqRequest;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.dto.common.notice.NoticeRequest;
import kr.or.tacs.systemadmin.support.mapper.IAdminSupportContentMapper;
import kr.or.tacs.vo.FaqSearchVO;
import kr.or.tacs.vo.FaqVO;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.common.notice.NoticeSearchVO;
import kr.or.tacs.vo.common.notice.NoticeVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportCodeVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportFaqRequestVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportFaqVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportNoticeRequestVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportNoticeVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportResourceSearchVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportResourceVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminSupportContentServiceImpl implements IAdminSupportContentService {

    private static final Set<String> TARGET_ROLE_CODES = Set.of(
            "ALL",
            "OWNER",
            "BROKER",
            "OFFICER",
            "FIELD_OFFICER",
            "TRANSPORT_MANAGER",
            "WAREHOUSE_MANAGER",
            "SYSTEM_ADMIN"
    );

    private static final List<AdminSupportCodeVO> DEFAULT_TARGET_ROLES = List.of(
            code("ALL", "전체", 1),
            code("OWNER", "화주", 2),
            code("BROKER", "관세사", 3),
            code("OFFICER", "공무원", 4),
            code("FIELD_OFFICER", "현장공무원", 5),
            code("TRANSPORT_MANAGER", "운송담당자", 6),
            code("WAREHOUSE_MANAGER", "창고관리자", 7),
            code("SYSTEM_ADMIN", "시스템관리자", 8)
    );

    private static final List<AdminSupportCodeVO> DEFAULT_FAQ_CATEGORIES = List.of(
            code("ACCOUNT", "계정", 1),
            code("IMPORT", "수입", 2),
            code("EXPORT", "수출", 3),
            code("DOC", "서류", 4),
            code("PAYMENT", "결제", 5),
            code("TRANSPORT", "운송", 6),
            code("WAREHOUSE", "창고", 7),
            code("SYSTEM", "시스템", 8),
            code("ETC", "기타", 9)
    );

    private final INoticeService noticeService;
    private final IFaqService faqService;
    private final IFileService fileService;
    private final GoogleDriveService googleDriveService;
    private final IAdminSupportContentMapper supportMapper;

    @Override
    public PaginationInfoVO<AdminSupportNoticeVO> retrieveNoticeList(String keyword, String noticeType, String pinnedYn,
                                                                     String useYn, String fromDate, String toDate,
                                                                     int currentPage, int screenSize) {
        NoticeSearchVO search = new NoticeSearchVO();
        search.setKeyword(trim(keyword));
        search.setType(defaultAll(noticeType));
        search.setPinnedYn(defaultAll(pinnedYn));
        search.setUseYn(defaultAll(useYn));
        search.setFromDate(trim(fromDate));
        search.setToDate(trim(toDate));
        search.setCurrentPage(currentPage);
        search.setScreenSize(normalizeScreenSize(screenSize));

        PaginationInfoVO<NoticeVO> page = noticeService.retriveNoticeList(search);
        PaginationInfoVO<AdminSupportNoticeVO> response = copyPage(page);
        response.setDataList(page.getDataList().stream()
                .map(this::toNoticeResponse)
                .toList());
        return response;
    }

    @Override
    public AdminSupportNoticeVO retrieveNotice(Long noticeNo) {
        return toNoticeResponse(noticeService.retriveNotice(noticeNo, false));
    }

    @Override
    public Long registNotice(AdminSupportNoticeRequestVO request, CustomUser loginUser) {
        return noticeService.registNotice(toNoticeRequest(request), loginUser == null ? null : loginUser.getLoginId());
    }

    @Override
    public void modifyNotice(Long noticeNo, AdminSupportNoticeRequestVO request) {
        noticeService.modifyNotice(noticeNo, toNoticeRequest(request));
    }

    @Override
    public void modifyNoticePinYn(Long noticeNo, String pinnedYn) {
        noticeService.modifyNoticePinYn(noticeNo, pinnedYn);
    }

    @Override
    public void modifyNoticeUseYn(Long noticeNo, String useYn) {
        noticeService.modifyNoticeUseYn(noticeNo, useYn);
    }

    @Override
    public void deleteNotice(Long noticeNo) {
        noticeService.deleteNotice(noticeNo);
    }

    @Override
    public PaginationInfoVO<AdminSupportFaqVO> retrieveFaqList(String keyword, String categoryCd, String targetRoleCd,
                                                               String useYn, int currentPage, int screenSize) {
        FaqSearchVO search = new FaqSearchVO();
        search.setKeyword(trim(keyword));
        search.setCtgryCd(defaultAll(categoryCd));
        search.setRoleCd(defaultAll(targetRoleCd));
        search.setUseYn(defaultAll(useYn));
        search.setCurrentPage(currentPage);
        search.setScreenSize(normalizeScreenSize(screenSize));

        PaginationInfoVO<FaqVO> page = faqService.retrieveFaqAdminList(search);
        PaginationInfoVO<AdminSupportFaqVO> response = copyPage(page);
        response.setDataList(page.getDataList().stream()
                .map(this::toFaqResponse)
                .toList());
        return response;
    }

    @Override
    public AdminSupportFaqVO retrieveFaq(Long faqNo) {
        return toFaqResponse(faqService.retrieveFaqForAdmin(faqNo));
    }

    @Override
    public Long registFaq(AdminSupportFaqRequestVO request, CustomUser loginUser) {
        return faqService.registFaq(toFaqRequest(request), loginUser);
    }

    @Override
    public void modifyFaq(Long faqNo, AdminSupportFaqRequestVO request) {
        faqService.modifyFaq(faqNo, toFaqRequest(request));
    }

    @Override
    public void deleteFaq(Long faqNo) {
        faqService.deleteFaq(faqNo);
    }

    @Override
    public List<AdminSupportResourceVO> retrieveResourceList(AdminSupportResourceSearchVO search) {
        normalizeResourceSearch(search);
        List<AdminSupportResourceVO> resources = supportMapper.selectResourceList(search);
        resources.forEach(resource -> resource.setSelectedTargetRoles(supportMapper.selectResourceTargetRoles(resource.getResourceNo())));
        return resources;
    }

    @Override
    public AdminSupportResourceVO retrieveResource(Long resourceNo) {
        AdminSupportResourceVO resource = getResource(resourceNo);
        resource.setSelectedTargetRoles(supportMapper.selectResourceTargetRoles(resourceNo));
        return resource;
    }

    @Override
    @Transactional
    public Long registResource(String title, String description, List<String> selectedTargetRoles,
                               MultipartFile file, CustomUser loginUser) throws Exception {
        validateAdmin(loginUser);
        String cleanTitle = requireText(title, "제목을 입력해 주세요.");
        List<String> roles = normalizeTargetRoles(selectedTargetRoles);
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("첨부파일을 선택해 주세요.");
        }

        Long fileGroupNo = fileService.uploadFiles(
                "RES",
                Map.of("MANUAL", file),
                loginUser.getLoginId(),
                "SYSTEM_ADMIN"
        );
        Long resourceNo = supportMapper.selectNextResourceNo();
        supportMapper.insertResource(resourceNo, fileGroupNo, cleanTitle, trim(description));
        supportMapper.insertResourceAuths(resourceNo, roles);
        return resourceNo;
    }

    @Override
    @Transactional
    public void modifyResource(Long resourceNo, String title, String description, List<String> selectedTargetRoles,
                               MultipartFile file, CustomUser loginUser) throws Exception {
        validateAdmin(loginUser);
        AdminSupportResourceVO current = getResource(resourceNo);
        int updated = supportMapper.updateResource(resourceNo, requireText(title, "제목을 입력해 주세요."), trim(description));
        if (updated == 0) {
            throw new IllegalArgumentException("자료실 글이 존재하지 않습니다.");
        }

        supportMapper.deleteResourceAuths(resourceNo);
        supportMapper.insertResourceAuths(resourceNo, normalizeTargetRoles(selectedTargetRoles));

        if (file != null && !file.isEmpty()) {
            supportMapper.markResourceFilesDeleted(current.getFileGroupNo());
            fileService.uploadFilesToGroup(
                    current.getFileGroupNo(),
                    "RES",
                    List.of(file),
                    loginUser.getLoginId(),
                    "SYSTEM_ADMIN"
            );
        }
    }

    @Override
    @Transactional
    public void deleteResource(Long resourceNo) {
        AdminSupportResourceVO resource = getResource(resourceNo);
        supportMapper.markResourceFilesDeleted(resource.getFileGroupNo());
    }

    @Override
    public ResponseEntity<byte[]> downloadResource(Long resourceNo) {
        AdminSupportResourceVO resource = getResource(resourceNo);
        if (!"Y".equals(resource.getUseYn())) {
            throw new IllegalStateException("사용 중인 파일이 아닙니다.");
        }
        FileInfoDTO fileInfo = fileService.getFileInfo(resource.getFileNo());
        if (fileInfo == null) {
            throw new IllegalArgumentException("파일 정보가 존재하지 않습니다.");
        }
        if (!StringUtils.hasText(fileInfo.getDfiDriveFileId())) {
            throw new IllegalStateException("Google Drive 파일 ID가 없습니다.");
        }
        if (!"DONE".equals(fileInfo.getDfiUploadSttsCd())) {
            throw new IllegalStateException("파일 업로드가 아직 완료되지 않았습니다.");
        }

        byte[] fileBytes = googleDriveService.downloadFile(fileInfo.getDfiDriveFileId());
        String fileName = StringUtils.hasText(fileInfo.getDfiOrgNm()) ? fileInfo.getDfiOrgNm() : "download";
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (StringUtils.hasText(fileInfo.getDfiMimeTy())) {
            try {
                mediaType = MediaType.parseMediaType(fileInfo.getDfiMimeTy());
            } catch (Exception ignored) {
                mediaType = MediaType.APPLICATION_OCTET_STREAM;
            }
        }

        ContentDisposition contentDisposition = ContentDisposition.attachment()
                .filename(fileName, StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(fileBytes.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(fileBytes);
    }

    @Override
    public List<AdminSupportCodeVO> retrieveFaqCategories() {
        List<AdminSupportCodeVO> codes = supportMapper.selectCodes("FAQ_CTGRY");
        return codes == null || codes.isEmpty() ? DEFAULT_FAQ_CATEGORIES : codes;
    }

    @Override
    public List<AdminSupportCodeVO> retrieveTargetRoles() {
        List<AdminSupportCodeVO> codes = supportMapper.selectCodes("BOARD_TARGET_ROLE");
        return codes == null || codes.isEmpty() ? DEFAULT_TARGET_ROLES : codes;
    }

    private NoticeRequest toNoticeRequest(AdminSupportNoticeRequestVO request) {
        if (request == null) {
            throw new IllegalArgumentException("요청 데이터가 없습니다.");
        }
        NoticeRequest noticeRequest = new NoticeRequest();
        noticeRequest.setNoticeTitle(requireText(request.getTitle(), "제목을 입력해 주세요."));
        noticeRequest.setNoticeContent(requireText(request.getContent(), "내용을 입력해 주세요."));
        noticeRequest.setNoticeType(request.getNoticeType());
        noticeRequest.setNoticePinYn(request.getPinnedYn());
        noticeRequest.setNoticeUseYn(request.getUseYn());
        return noticeRequest;
    }

    private FaqRequest toFaqRequest(AdminSupportFaqRequestVO request) {
        if (request == null) {
            throw new IllegalArgumentException("요청 데이터가 없습니다.");
        }
        FaqRequest faqRequest = new FaqRequest();
        faqRequest.setFaqCtgryCd(request.getCategoryCd());
        faqRequest.setFaqQstnCn(request.getQuestion());
        faqRequest.setFaqAnsCn(request.getAnswer());
        faqRequest.setFaqSortSn(request.getSortOrder());
        faqRequest.setFaqUseYn(request.getUseYn());
        faqRequest.setTargetRoleCds(normalizeTargetRoles(resolveTargetRoles(request)));
        return faqRequest;
    }

    private AdminSupportNoticeVO toNoticeResponse(NoticeVO notice) {
        AdminSupportNoticeVO response = new AdminSupportNoticeVO();
        response.setNoticeNo(notice.getNoticeNo());
        response.setTitle(notice.getNoticeTitle());
        response.setContent(notice.getNoticeContent());
        response.setNoticeType(notice.getNoticeType());
        response.setPinnedYn(notice.getNoticePinYn());
        response.setUseYn(notice.getNoticeUseYn());
        response.setCreatedAt(notice.getNoticeAdddate());
        response.setUpdatedAt(notice.getNoticeUpddate());
        response.setViewCount(notice.getNoticeCnt());
        response.setAdminId(notice.getNoticeAdminId());
        return response;
    }

    private AdminSupportFaqVO toFaqResponse(FaqVO faq) {
        AdminSupportFaqVO response = new AdminSupportFaqVO();
        response.setFaqNo(faq.getFaqNo());
        response.setQuestion(faq.getFaqQstnCn());
        response.setAnswer(faq.getFaqAnsCn());
        response.setCategoryCd(faq.getFaqCtgryCd());
        response.setCategoryName(faq.getFaqCtgryNm());
        response.setSortOrder(faq.getFaqSortSn());
        response.setHit(faq.getFaqHit());
        response.setUseYn(faq.getFaqUseYn());
        response.setAdminId(faq.getFaqAdminId());
        response.setCreatedAt(faq.getFaqRegistDt());
        response.setUpdatedAt(faq.getFaqUpdtDt());
        response.setSelectedTargetRoles(faq.getTargetRoleCds() == null
                ? parseTargetRoleText(faq.getTargetRoleText())
                : faq.getTargetRoleCds());
        response.setTargetRoleText(faq.getTargetRoleText());
        return response;
    }

    private <T, R> PaginationInfoVO<R> copyPage(PaginationInfoVO<T> source) {
        PaginationInfoVO<R> target = new PaginationInfoVO<>();
        target.setCurrentPage(source.getCurrentPage());
        target.setScreenSize(source.getScreenSize());
        target.setTotalRecord(source.getTotalRecord());
        return target;
    }

    private AdminSupportResourceVO getResource(Long resourceNo) {
        if (resourceNo == null) {
            throw new IllegalArgumentException("자료실 번호가 필요합니다.");
        }
        AdminSupportResourceVO resource = supportMapper.selectResource(resourceNo);
        if (resource == null) {
            throw new IllegalArgumentException("자료실 글이 존재하지 않습니다.");
        }
        return resource;
    }

    private List<String> resolveTargetRoles(AdminSupportFaqRequestVO request) {
        if (request.getSelectedTargetRoles() != null) {
            return request.getSelectedTargetRoles();
        }
        return request.getTargetRoleCds();
    }

    private List<String> normalizeTargetRoles(List<String> roles) {
        if (roles == null || roles.isEmpty()) {
            throw new IllegalArgumentException("노출대상을 1개 이상 선택해 주세요.");
        }

        List<String> normalized = new ArrayList<>();
        for (String role : roles) {
            String value = trim(role);
            if (StringUtils.hasText(value) && !normalized.contains(value)) {
                normalized.add(value);
            }
        }

        if (normalized.isEmpty()) {
            throw new IllegalArgumentException("노출대상을 1개 이상 선택해 주세요.");
        }
        if (!TARGET_ROLE_CODES.containsAll(normalized)) {
            throw new IllegalArgumentException("허용되지 않은 노출대상이 포함되어 있습니다.");
        }
        if (normalized.contains("ALL") && normalized.size() > 1) {
            return List.of("ALL");
        }
        return normalized;
    }

    private List<String> parseTargetRoleText(String targetRoleText) {
        if (!StringUtils.hasText(targetRoleText)) {
            return List.of();
        }
        List<String> roles = new ArrayList<>();
        for (String role : targetRoleText.split(",")) {
            String value = trim(role);
            if (StringUtils.hasText(value)) {
                roles.add(value);
            }
        }
        return roles;
    }

    private void normalizeResourceSearch(AdminSupportResourceSearchVO search) {
        if (search == null) {
            return;
        }
        search.setKeyword(trim(search.getKeyword()));
        search.setTargetRoleCd(defaultAll(search.getTargetRoleCd()));
        search.setUseYn(defaultAll(search.getUseYn()));
    }

    private void validateAdmin(CustomUser loginUser) {
        if (loginUser == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
        if (!"SYSTEM_ADMIN".equals(loginUser.getRoleCd())) {
            throw new IllegalArgumentException("시스템 관리자만 접근 가능합니다.");
        }
    }

    private int normalizeScreenSize(int screenSize) {
        return Math.min(Math.max(screenSize, 1), 100);
    }

    private String defaultAll(String value) {
        String trimmed = trim(value);
        return trimmed == null ? "all" : trimmed;
    }

    private String requireText(String value, String message) {
        String trimmed = trim(value);
        if (!StringUtils.hasText(trimmed)) {
            throw new IllegalArgumentException(message);
        }
        return trimmed;
    }

    private String trim(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static AdminSupportCodeVO code(String code, String name, int sortOrder) {
        AdminSupportCodeVO vo = new AdminSupportCodeVO();
        vo.setCode(code);
        vo.setName(name);
        vo.setSortOrder(sortOrder);
        return vo;
    }
}
