package kr.or.tacs.warehouse.outbound.service;

import java.util.List;

import kr.or.tacs.dto.warehouse.WarehouseOutboundDocDTO;
import kr.or.tacs.dto.warehouse.WarehouseOutboundProcessDTO;

public interface OutboundService {

	public List<WarehouseOutboundDocDTO> selectOutboundDocList(String wmId);

	public List<WarehouseOutboundProcessDTO> selectOutboundProcessList(String wmId);

	public int insertOutboundSupplementRequest(String crrNo, String wmId, String reason);

	public int approveOutbound(String crrNo, String wmId);

	public int selectOutboundProcessCount(WarehouseOutboundProcessDTO searchDTO, String wmId);

	public List<WarehouseOutboundProcessDTO> selectOutboundProcessPagingList(WarehouseOutboundProcessDTO searchDTO,
			String wmId);
	// 반출요청번호 기준 물품별 상세 목록 조회
	// 반출 상세 모달에서 대표 1줄이 아니라 실제 물품 개수만큼 보여주기 위한 메서드
	public List<WarehouseOutboundProcessDTO> selectOutboundGoodsListByCrrNo(String crrNo, String wmId);

	

}
