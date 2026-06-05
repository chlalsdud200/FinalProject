package kr.or.tacs.systemadmin.commoncode.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.systemadmin.commoncode.AdminCommonCodeGroupSearchVO;
import kr.or.tacs.vo.systemadmin.commoncode.AdminCommonCodeGroupVO;
import kr.or.tacs.vo.systemadmin.commoncode.AdminCommonCodeSearchVO;
import kr.or.tacs.vo.systemadmin.commoncode.AdminCommonCodeVO;

@Mapper
public interface IAdminCommonCodeMapper {

    List<AdminCommonCodeGroupVO> selectGroupList(AdminCommonCodeGroupSearchVO search);

    AdminCommonCodeGroupVO selectGroup(@Param("ccgId") String ccgId);

    int countGroup(@Param("ccgId") String ccgId);

    int insertGroup(AdminCommonCodeGroupVO group);

    int updateGroup(AdminCommonCodeGroupVO group);

    int updateGroupUseYn(@Param("ccgId") String ccgId, @Param("useYn") String useYn);

    int updateCodeUseYnByGroup(@Param("ccgId") String ccgId, @Param("useYn") String useYn);

    List<AdminCommonCodeVO> selectCodeList(AdminCommonCodeSearchVO search);

    AdminCommonCodeVO selectCode(@Param("ccgId") String ccgId, @Param("ccCd") String ccCd);

    int countCode(@Param("ccgId") String ccgId, @Param("ccCd") String ccCd);

    int insertCode(AdminCommonCodeVO code);

    int updateCode(AdminCommonCodeVO code);

    int updateCodeUseYn(@Param("ccgId") String ccgId, @Param("ccCd") String ccCd, @Param("useYn") String useYn);
}
