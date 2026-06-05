package kr.or.tacs.systemadmin.commoncode.service;

import java.util.List;

import kr.or.tacs.vo.systemadmin.commoncode.AdminCommonCodeGroupRequestVO;
import kr.or.tacs.vo.systemadmin.commoncode.AdminCommonCodeGroupSearchVO;
import kr.or.tacs.vo.systemadmin.commoncode.AdminCommonCodeGroupVO;
import kr.or.tacs.vo.systemadmin.commoncode.AdminCommonCodeRequestVO;
import kr.or.tacs.vo.systemadmin.commoncode.AdminCommonCodeSearchVO;
import kr.or.tacs.vo.systemadmin.commoncode.AdminCommonCodeVO;

public interface IAdminCommonCodeService {

    List<AdminCommonCodeGroupVO> retrieveGroupList(AdminCommonCodeGroupSearchVO search);

    AdminCommonCodeGroupVO retrieveGroup(String ccgId);

    void registGroup(AdminCommonCodeGroupRequestVO request);

    void modifyGroup(String ccgId, AdminCommonCodeGroupRequestVO request);

    void modifyGroupUseYn(String ccgId, String useYn);

    List<AdminCommonCodeVO> retrieveCodeList(AdminCommonCodeSearchVO search);

    AdminCommonCodeVO retrieveCode(String ccgId, String ccCd);

    void registCode(AdminCommonCodeRequestVO request);

    void modifyCode(String ccgId, String ccCd, AdminCommonCodeRequestVO request);

    void modifyCodeUseYn(String ccgId, String ccCd, String useYn);
}
