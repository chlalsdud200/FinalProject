package kr.or.tacs.common.docs.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.dto.common.docs.DocsFolderDTO;
import kr.or.tacs.dto.common.docs.DocsItemDTO;
import kr.or.tacs.dto.common.docs.DocsStorageDTO;
import kr.or.tacs.dto.common.docs.DocsTrashItemDTO;
import kr.or.tacs.vo.common.PaginationInfoVO;

@Mapper
public interface DocsMapper {

    Long selectDocsFolderNo();

    Long selectDocsFileNo();

    Long selectDocsBoxFileNo();

    Long selectRootFolderNo(
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void insertRootFolder(
            @Param("folderNo") Long folderNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    int countFolderOwner(
            @Param("folderNo") Long folderNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    List<DocsItemDTO> selectFolderItems(
            @Param("folderNo") Long folderNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    List<DocsItemDTO> selectFileItems(
            @Param("folderNo") Long folderNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    List<DocsFolderDTO> selectBreadcrumb(
            @Param("folderNo") Long folderNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    DocsStorageDTO selectStorage(
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void insertStorage(
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void updateStorageUsed(
            @Param("actorId") String actorId,
            @Param("actorType") String actorType,
            @Param("size") Long size
    );

    void insertFolder(
            @Param("folderNo") Long folderNo,
            @Param("parentNo") Long parentNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType,
            @Param("name") String name
    );

    void insertFileData(FileInfoDTO fileInfo);

    void insertBoxFile(
            @Param("dbfNo") Long dbfNo,
            @Param("folderNo") Long folderNo,
            @Param("dfiNo") Long dfiNo,
            @Param("displayName") String displayName
    );

    void updateFileTrash(
            @Param("dbfNo") Long dbfNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void updateFolderTrash(
            @Param("folderNo") Long folderNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void updateFileName(
            @Param("dbfNo") Long dbfNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType,
            @Param("name") String name
    );

    void updateFolderName(
            @Param("folderNo") Long folderNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType,
            @Param("name") String name
    );

    FileInfoDTO selectDownloadFile(
            @Param("dbfNo") Long dbfNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    int countTrashItems(
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    List<DocsTrashItemDTO> selectTrashItems(
            @Param("pagingVO") PaginationInfoVO<DocsTrashItemDTO> pagingVO,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void deleteTrashFileDataPerm(
            @Param("dbfNo") Long dbfNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void deleteTrashFilePerm(
            @Param("dbfNo") Long dbfNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void deleteTrashFolderFileDataPerm(
            @Param("folderNo") Long folderNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void deleteTrashFolderFilesPerm(
            @Param("folderNo") Long folderNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void deleteTrashFolderPerm(
            @Param("folderNo") Long folderNo,
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void emptyTrashFileData(
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void emptyTrashFiles(
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void emptyTrashFolderFileData(
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void emptyTrashFolderFiles(
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );

    void emptyTrashFolders(
            @Param("actorId") String actorId,
            @Param("actorType") String actorType
    );
}
