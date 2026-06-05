package kr.or.tacs.systemadmin.hsknowledge.service;

import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsKeywordRequestVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsKeywordSearchVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsKeywordVO;

public interface IHsKeywordService {

    PaginationInfoVO<HsKeywordVO> retriveHsKeywordList(HsKeywordSearchVO search);

    HsKeywordVO retriveHsKeyword(Long hsKeywordNo);

    Long registHsKeyword(HsKeywordRequestVO request);

    void modifyHsKeyword(Long hsKeywordNo, HsKeywordRequestVO request);

    void modifyHsKeywordUseYn(Long hsKeywordNo, String useYn);
}
