package kr.or.tacs.broker.mypage.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.tacs.broker.mypage.mapper.IBrokerMypageMapper;
import kr.or.tacs.vo.BrokerVO;

@Service
public class BrokerMypageServiceimpl implements IBrokerMypageService {

	@Autowired
	private IBrokerMypageMapper mypagemapper;
	
	@Override
	public BrokerVO profileselect(String brokerId) {
		return mypagemapper.profileselect(brokerId);
	}

}
