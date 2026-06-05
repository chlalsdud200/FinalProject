package kr.or.tacs.owner.importp.service;

import kr.or.tacs.cmmenums.ServiceResult;
import kr.or.tacs.dto.owner.OwnerExportRequestDTO;
import kr.or.tacs.dto.owner.OwnerImportRequestDTO;
import kr.or.tacs.dto.owner.OwnerImportSearchDTO;
import kr.or.tacs.vo.BrokerVO;
import kr.or.tacs.vo.OwnerVO;
import kr.or.tacs.vo.transport.PortVO;

import java.util.List;

public interface IImportService {

    public List<BrokerVO> retriveBrokerList();

    public OwnerVO retriveOwnerInfo(String owrId);

    public List<OwnerImportRequestDTO> retriveImpList(OwnerImportSearchDTO searchDTO);

    public ServiceResult registImp(OwnerImportRequestDTO impDTO) throws Exception;

    public List<PortVO> retrivePortList();

    public OwnerImportRequestDTO retriveImp(String irNo);

    public int retriveImpCount(OwnerImportSearchDTO searchDTO);

    public ServiceResult modifyImp(OwnerImportRequestDTO impDTO) throws Exception;

    public OwnerImportRequestDTO retriveSupp(String irNo);
}
