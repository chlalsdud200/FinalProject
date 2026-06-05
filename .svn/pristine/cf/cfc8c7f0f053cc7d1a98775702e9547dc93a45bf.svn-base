package kr.or.tacs.owner.trace.mapper;

import kr.or.tacs.dto.owner.AisPortAliasDTO;
import kr.or.tacs.dto.owner.AisVslLatestDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface IAisMapper {

    /**
     * AIS 항구 별칭 목록 조회
     */
    List<AisPortAliasDTO> selectPortAliasList();

    /**
     * MMSI로 SHIP_NO 조회
     */
    Long selectShipNoByMmsi(String mmsi);

    /**
     * AIS 최신 위치 MERGE
     */
    int mergeAisVslLatest(AisVslLatestDTO aisDTO);

    /**
     * 한국 입항 대상 선박 목록
     */
    List<AisVslLatestDTO> selectIncomingVesselList();

    /**
     * 특정 MMSI 선박 최신 위치
     */
    AisVslLatestDTO selectVesselLatest(String mmsi);

    List<AisVslLatestDTO> selectRecentVesselList();
}