package kr.or.tacs.warehouse.inbound.service;

import java.util.List;
import java.util.Map;


import kr.or.tacs.dto.warehouse.WarehouseGoodsDTO;
import kr.or.tacs.dto.warehouse.WarehouseWhInRptDTO;
import kr.or.tacs.dto.warehouse.WarehouseZoneDTO;

public interface IInboundService {

  
    public List<WarehouseWhInRptDTO> selectInbound(String wmId);

    public List<WarehouseGoodsDTO> selectInboundGoodsList(String wirNo, String wmId);

    public int selectInboundCount(WarehouseWhInRptDTO searchDTO, String wmId);
    
    public List<WarehouseWhInRptDTO> selectInboundList(WarehouseWhInRptDTO searchDTO, String wmId);
    
    public List<Map<String, Object>> selectEmptyLocations(String zone, String wmId);

    public int approveInbound(WarehouseWhInRptDTO whInRptDTO, String wmId);

    public List<WarehouseZoneDTO> selectMyWarehouseZones(String wmId);

	public int insertSupplementRequest(String wirNo, String reason, String wmId, String sriTyCd);

}