package kr.or.tacs.warehouse.inbound.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


import kr.or.tacs.dto.warehouse.WarehouseGoodsDTO;
import kr.or.tacs.dto.warehouse.WarehouseWhInRptDTO;
import kr.or.tacs.dto.warehouse.WarehouseZoneDTO;

@Mapper
public interface IInboundMapper {

   
    public List<WarehouseWhInRptDTO> selectInbound(@Param("wmId") String wmId);

   
    public List<WarehouseGoodsDTO> selectInboundGoodsList(
            @Param("wirNo") String wirNo,
            @Param("wmId") String wmId
    );

    public int selectInboundCount(
            @Param("searchDTO") WarehouseWhInRptDTO searchDTO,
            @Param("wmId") String wmId
    );

    public List<WarehouseWhInRptDTO> selectInboundList(
            @Param("searchDTO") WarehouseWhInRptDTO searchDTO,
            @Param("wmId") String wmId
    );
 
    public List<Map<String, Object>> selectEmptyLocations(
            @Param("zone") String zone,
            @Param("wmId") String wmId
    );

 
    public int updateInboundApproval(
            @Param("whInRptDTO") WarehouseWhInRptDTO whInRptDTO,
            @Param("wmId") String wmId
    );

  
    public int insertWarehouseItemByGoods(
            @Param("whInRptDTO") WarehouseWhInRptDTO whInRptDTO,
            @Param("goods") WarehouseGoodsDTO goods
    );

   
    public int insertWarehouseItemLocationByGoods(
            @Param("whInRptDTO") WarehouseWhInRptDTO whInRptDTO,
            @Param("goods") WarehouseGoodsDTO goods
    );

    public List<WarehouseZoneDTO> selectMyWarehouseZones(@Param("wmId") String wmId);


	public String selectTransportManagerIdByWirNo(String wirNo);


	public int insertSupplementRequestMaster(Map<String, Object> paramMap);
	
	public int updateWhInRptStatusToReqFix(Map<String, Object> paramMap);
	
	public int updateSupplementRequestApprovedByWirNo(@Param("wirNo") String wirNo);
	
	// 입고승인 후 해당 입고건이 사용한 구역들의 사용량/사용률 재계산
	// 로그인한 창고관리자의 담당 입고건 기준으로만 갱신한다.
	public int updateWarehouseZoneUsageByWirNo(
	        @Param("wirNo") String wirNo,
	        @Param("wmId") String wmId
	);
	
	// 입고승인 후 해당 창고 전체 적재가능용량/사용량/사용률 재계산
	// 로그인한 창고관리자의 담당 창고 기준으로만 갱신한다.
	public int updateWarehouseUsageByWirNo(
	        @Param("wirNo") String wirNo,
	        @Param("wmId") String wmId
	);
	
	
	
	
	
	
	
	
	
}