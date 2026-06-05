package kr.or.tacs.fieldofficer.mypage.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.OfficerVO;

@Mapper
public interface IMypageMapper {

	//마이페이지 공무원 정보 조회
	public OfficerVO selectOfficer(@Param("officerId") String officerId);

	// 마이페이지 개인정보 수정
	public int updateOfficer(OfficerVO officerVO);
}
