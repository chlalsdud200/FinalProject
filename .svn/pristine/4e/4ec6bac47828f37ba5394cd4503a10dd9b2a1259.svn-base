package kr.or.tacs.warehouse.mypage.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.tacs.vo.WarehouseManagerVO;
import kr.or.tacs.warehouse.mypage.mapper.IWarehouseMyPageMapper;


@Service
public class WarehouseMyPageServiceImpl implements IWarehouseMyPageService {

	@Autowired
	private IWarehouseMyPageMapper warehouseMapper;

	@Override
	public WarehouseManagerVO selectMypage(String loginId) {
	
		return warehouseMapper.selectMypage(loginId);
	}


	
	

	
}
