package kr.or.tacs.common.resource.service;

import java.util.List;

import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.ResourceArchiveSearchVO;
import kr.or.tacs.vo.common.ResourceArchiveUploadVO;
import kr.or.tacs.vo.common.ResourceArchiveVO;

public interface IResourceArchiveService {

    List<ResourceArchiveVO> selectArchiveList(ResourceArchiveSearchVO search);

    ResourceArchiveVO selectArchiveFileForDownload(Long resNo, Long fileNo, String roleCd);

    Long registResourceArchive(ResourceArchiveUploadVO uploadVO, CustomUser loginUser);
}
