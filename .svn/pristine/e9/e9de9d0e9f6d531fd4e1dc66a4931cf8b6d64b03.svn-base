package kr.or.tacs.common.resource.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.common.resource.mapper.IResourceArchiveMapper;
import kr.or.tacs.vo.common.ResourceArchiveSearchVO;
import kr.or.tacs.vo.common.ResourceArchiveUploadVO;
import kr.or.tacs.vo.common.ResourceArchiveVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResourceArchiveServiceImpl implements IResourceArchiveService {

    private static final String RESOURCE_DOC_TYPE_CD = "ETC";

    private static final Set<String> ALLOWED_TARGET_ROLES = Set.of(
            "ALL", "OWNER", "BROKER", "OFFICER", "FIELD_OFFICER",
            "TRANSPORT_MANAGER", "WAREHOUSE_MANAGER", "SYSTEM_ADMIN"
    );

    private final IResourceArchiveMapper mapper;
    private final IFileService fileService;

    @Override
    public List<ResourceArchiveVO> selectArchiveList(ResourceArchiveSearchVO search) {
        return mapper.selectArchiveList(search);
    }

    @Override
    public ResourceArchiveVO selectArchiveFileForDownload(Long resNo, Long fileNo, String roleCd) {
        return mapper.selectArchiveFileForDownload(resNo, fileNo, roleCd);
    }

    @Override
    @Transactional
    public Long registResourceArchive(ResourceArchiveUploadVO uploadVO, CustomUser loginUser) {
        validateUpload(uploadVO, loginUser);
        uploadVO.setDocTyCd(RESOURCE_DOC_TYPE_CD);

        try {
            Long fileGroupNo = fileService.uploadFiles(
                    "RES",
                    Map.of(uploadVO.getDocTyCd(), uploadVO.getFile()),
                    loginUser.getLoginId(),
                    "SYSTEM_ADMIN"
            );
            uploadVO.setResFgNo(fileGroupNo);
            mapper.insertResource(uploadVO);
            mapper.insertResourceAuths(uploadVO.getResNo(), uploadVO.getTargetRoleCds());
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException("자료실 파일 업로드 중 오류가 발생했습니다.", e);
        }

        return uploadVO.getResNo();
    }

    private void validateUpload(ResourceArchiveUploadVO uploadVO, CustomUser loginUser) {
        if (loginUser == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
        if (uploadVO == null) {
            throw new IllegalArgumentException("등록할 자료가 없습니다.");
        }
        if (!StringUtils.hasText(uploadVO.getResTtl())) {
            throw new IllegalArgumentException("자료명을 입력해 주세요.");
        }
        if (uploadVO.getTargetRoleCds() == null || uploadVO.getTargetRoleCds().isEmpty()) {
            throw new IllegalArgumentException("노출 대상을 1개 이상 선택해 주세요.");
        }
        if (!ALLOWED_TARGET_ROLES.containsAll(uploadVO.getTargetRoleCds())) {
            throw new IllegalArgumentException("허용되지 않은 노출 대상이 포함되어 있습니다.");
        }
        if (uploadVO.getFile() == null || uploadVO.getFile().isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일을 선택해 주세요.");
        }
    }
}
