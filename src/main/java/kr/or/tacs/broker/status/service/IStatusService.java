package kr.or.tacs.broker.status.service;

import java.util.List;
import java.util.Map;
import kr.or.tacs.dto.PageDTO;
import kr.or.tacs.vo.broker.status.StatusCertVO;

public interface IStatusService {

	int selectImportDeclareCount(String brokerId, PageDTO pageDTO);

	List<Map<String, Object>> selectImportDeclareList(String brokerId, PageDTO pageDTO);

    Map<String, Object> selectImportDeclareDetail(String idIrNo, String brokerId);

    List<Map<String, Object>> selectImportDeclareItemList(String idIrNo);

    List<Map<String, Object>> selectImportDeclareMdlspecList(String idIrNo);
    
    Map<String, Object> selectSupplementItem(String idIrNo, Integer idiSn, String brokerId);

    List<Map<String, Object>> selectSupplementMdlspecList(String idIrNo, Integer idiSn);

    void submitSupplementItem(
            String idIrNo,
            Integer idiSn,
            String brokerId,
            String idiHsCd,
            String idiDclrGdsnm,
            String idiTrdngGdsnm,
            String idiTrdmkNm,
            String idiQty,
            String idiQtyUnitCd,
            String idiNetWt,
            String idiTaxtPrcKrw,
            String idiOrgnCntryCd,
            String[] idimMdlspecNo,
            String[] idimMdlspecNm,
            String[] idimQty1,
            String[] idimQty1UnitCd,
            String[] idimUnitPrc,
            String[] idimAmt
    );
    
    List<Map<String, Object>> selectTaxList(String brokerId, PageDTO pageDTO);

    List<Map<String, Object>> selectCertList(String brokerId, PageDTO pageDTO);
    
    List<Map<String, Object>> selectTaxChargeList(String brokerId, PageDTO pageDTO);

    void createBrokerCharge(String irNo, Long ctNo, String brokerId);
    
    void confirmBrokerChargeDone(String irNo, String brokerId);
    

    StatusCertVO selectCertDetail(String brokerId, String ciNo);

    StatusCertVO selectCertFile(String brokerId, String ciNo);
    
}