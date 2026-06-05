package kr.or.tacs.fieldofficer.mypage.service;

import kr.or.tacs.vo.OfficerVO;

public interface IMypageService {

	// 마이페이지 공무원 정보 조회
    public OfficerVO selectOfficer(String officerId);

    // 마이페이지 개인정보 수정
    public int updateOfficer(OfficerVO officerVO);

}
