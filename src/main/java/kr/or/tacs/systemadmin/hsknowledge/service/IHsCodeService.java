package kr.or.tacs.systemadmin.hsknowledge.service;

import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsCodeRequestVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsCodeSearchVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsCodeVO;

public interface IHsCodeService {

    PaginationInfoVO<HsCodeVO> retriveHsCodeList(HsCodeSearchVO search);

    HsCodeVO retriveHsCode(String hsCode);

    void modifyHsCode(String hsCode, HsCodeRequestVO request);

    void modifyHsCodeUseYn(String hsCode, String useYn);
}
