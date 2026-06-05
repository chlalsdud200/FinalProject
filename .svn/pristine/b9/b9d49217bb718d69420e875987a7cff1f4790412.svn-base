package kr.or.tacs.common.docs.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.dto.common.docs.DocsListResponseDTO;
import kr.or.tacs.vo.common.CustomUser;

import kr.or.tacs.dto.common.docs.DocsTrashItemDTO;
import kr.or.tacs.vo.common.PaginationInfoVO;

public interface DocsService {

    DocsListResponseDTO retriveDocsList(String folderId, CustomUser user);

    void registFolder(String name, String parentId, CustomUser user);

    void registFiles(List<MultipartFile> files, String folderId, CustomUser user) throws Exception;

    void modifyName(String id, String name, CustomUser user);

    void deleteDocsItems(List<String> ids, CustomUser user);

    FileInfoDTO retriveDownloadFile(String id, CustomUser user);

    PaginationInfoVO<DocsTrashItemDTO> retriveTrashList(int page, CustomUser user);

    void deleteTrashItemsPerm(List<String> ids, CustomUser user);

    void emptyTrashAll(CustomUser user);
}
