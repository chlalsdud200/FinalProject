package kr.or.tacs.warehouse.inventory.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.dto.warehouse.WarehouseInventory3DDTO;
import kr.or.tacs.dto.warehouse.WarehouseZoneDTO;

@Mapper
public interface Inventory3DMapper {

	public List<WarehouseInventory3DDTO> selectInventory3DList(@Param("wmId") String wmId);

	public List<WarehouseZoneDTO> selectZoneStatusList(@Param("wmId")String wmId);

	public int selectInventoryCount(@Param("searchDTO") WarehouseInventory3DDTO searchDTO, @Param("wmId") String wmId);

	public List<WarehouseInventory3DDTO> selectInventoryList(@Param("searchDTO") WarehouseInventory3DDTO searchDTO, @Param("wmId") String wmId);

	public List<WarehouseInventory3DDTO> selectInventory3DSearchList(
		    @Param("searchDTO") WarehouseInventory3DDTO searchDTO,
		    @Param("wmId") String wmId
		);
	
	// 로그인한 창고관리자 wmId 기준으로 담당 창고 1개를 조회한다.
	public WarehouseZoneDTO selectMyWarehouse(@Param("wmId") String wmId);

}
