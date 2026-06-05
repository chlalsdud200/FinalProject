package kr.or.tacs.systemadmin.hsknowledge.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.systemadmin.hsknowledge.HsCodeSearchVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsCodeVO;

@Mapper
public interface IHsCodeMapper {

    List<HsCodeVO> selectHsCodeList(HsCodeSearchVO search);

    int selectHsCodeTotalRecord(HsCodeSearchVO search);

    HsCodeVO selectHsCode(@Param("hsCode") String hsCode);

    int updateHsCode(HsCodeVO hsCode);

    int updateHsClass(HsCodeVO hsCode);

    int updateHsClassUseYn(@Param("hsCode") String hsCode, @Param("useYn") String useYn);
}
