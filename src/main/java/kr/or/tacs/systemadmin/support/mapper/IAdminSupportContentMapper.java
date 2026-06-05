package kr.or.tacs.systemadmin.support.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.systemadmin.support.AdminSupportCodeVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportResourceSearchVO;
import kr.or.tacs.vo.systemadmin.support.AdminSupportResourceVO;

@Mapper
public interface IAdminSupportContentMapper {

    List<AdminSupportCodeVO> selectCodes(@Param("groupId") String groupId);

    List<AdminSupportResourceVO> selectResourceList(AdminSupportResourceSearchVO search);

    AdminSupportResourceVO selectResource(@Param("resourceNo") Long resourceNo);

    List<String> selectResourceTargetRoles(@Param("resourceNo") Long resourceNo);

    Long selectNextResourceNo();

    int insertResource(@Param("resourceNo") Long resourceNo,
                       @Param("fileGroupNo") Long fileGroupNo,
                       @Param("title") String title,
                       @Param("description") String description);

    int updateResource(@Param("resourceNo") Long resourceNo,
                       @Param("title") String title,
                       @Param("description") String description);

    int deleteResourceAuths(@Param("resourceNo") Long resourceNo);

    int insertResourceAuths(@Param("resourceNo") Long resourceNo,
                            @Param("targetRoles") List<String> targetRoles);

    int markResourceFilesDeleted(@Param("fileGroupNo") Long fileGroupNo);
}
