package kr.or.tacs.fieldofficer.mypage.service;

import org.springframework.stereotype.Service;

import kr.or.tacs.fieldofficer.mypage.mapper.IMypageMapper;
import kr.or.tacs.vo.OfficerVO;

@Service
public class MypageServiceImpl implements IMypageService {

private final IMypageMapper mypageMapper;

	public MypageServiceImpl(IMypageMapper mypageMapper) {
		this.mypageMapper = mypageMapper;
	}

	@Override
	public OfficerVO selectOfficer(String officerId) {
		return mypageMapper.selectOfficer(officerId);
	}

	@Override
	public int updateOfficer(OfficerVO officerVO) {
		return mypageMapper.updateOfficer(officerVO);
	}
}
