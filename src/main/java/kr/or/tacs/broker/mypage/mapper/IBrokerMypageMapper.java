package kr.or.tacs.broker.mypage.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.tacs.vo.BrokerVO;

@Mapper
public interface IBrokerMypageMapper {

	public BrokerVO profileselect(String brokerId);

}
