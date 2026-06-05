package kr.or.tacs.systemadmin.hsknowledge.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.systemadmin.hsknowledge.HsKeywordSearchVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsKeywordVO;

@Mapper
public interface IHsKeywordMapper {

    List<HsKeywordVO> selectHsKeywordList(HsKeywordSearchVO search);

    int selectHsKeywordTotalRecord(HsKeywordSearchVO search);

    HsKeywordVO selectHsKeyword(@Param("hsKeywordNo") Long hsKeywordNo);

    int countActiveHsKeyword(@Param("hsCode") String hsCode,
                             @Param("keyword") String keyword,
                             @Param("hsKeywordNo") Long hsKeywordNo);

    int countHsCode(@Param("hsCode") String hsCode);

    int insertHsKeyword(HsKeywordVO keyword);

    int updateHsKeyword(HsKeywordVO keyword);

    int updateHsKeywordUseYn(@Param("hsKeywordNo") Long hsKeywordNo, @Param("useYn") String useYn);
}
