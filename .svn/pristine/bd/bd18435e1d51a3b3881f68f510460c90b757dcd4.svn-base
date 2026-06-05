package kr.or.tacs.owner.export.service;

import kr.or.tacs.cmmenums.ServiceResult;
import kr.or.tacs.dto.owner.OwnerExportRequestDTO;
import kr.or.tacs.dto.owner.OwnerExportSearchDTO;
import kr.or.tacs.vo.BrokerVO;
import kr.or.tacs.vo.OwnerVO;

import java.util.List;

public interface IExportService {

    public ServiceResult registExp(OwnerExportRequestDTO expDTO) throws Exception;

    public OwnerVO retriveOwnerInfo(String owrId);

    public List<BrokerVO> retriveBrokerList();

    public List<OwnerExportRequestDTO> retriveExpList(OwnerExportSearchDTO searchDTO);

    public OwnerExportRequestDTO retriveExp(String erNo);

    public int retriveExpCount(OwnerExportSearchDTO searchDTO);

    public ServiceResult modifyExp(OwnerExportRequestDTO expDTO) throws Exception;

    public OwnerExportRequestDTO retriveSupp(String erNo);
}
