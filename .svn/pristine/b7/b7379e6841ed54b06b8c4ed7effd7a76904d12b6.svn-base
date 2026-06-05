package kr.or.tacs.common.resource.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.common.ResourceArchiveSearchVO;
import kr.or.tacs.vo.common.ResourceArchiveUploadVO;
import kr.or.tacs.vo.common.ResourceArchiveVO;

@Mapper
public interface IResourceArchiveMapper {

    List<ResourceArchiveVO> selectArchiveList(ResourceArchiveSearchVO search);

    ResourceArchiveVO selectArchiveFileForDownload(
            @Param("resNo") Long resNo,
            @Param("fileNo") Long fileNo,
            @Param("roleCd") String roleCd
    );

    int insertFileGroup(ResourceArchiveUploadVO uploadVO);

    int insertDocsFileData(ResourceArchiveUploadVO uploadVO);

    int insertFileMap(ResourceArchiveUploadVO uploadVO);

    int insertResource(ResourceArchiveUploadVO uploadVO);

    int insertResourceAuths(
            @Param("resNo") Long resNo,
            @Param("targetRoleCds") List<String> targetRoleCds
    );
}
