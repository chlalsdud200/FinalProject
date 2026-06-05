package kr.or.tacs.owner.transport.service;

import kr.or.tacs.cmmenums.ServiceResult;
import kr.or.tacs.dto.owner.OwnerTranRequestDTO;
import kr.or.tacs.dto.owner.OwnerTranSearchDTO;
import kr.or.tacs.vo.OwnerVO;
import kr.or.tacs.vo.transport.TransportManagerVO;

import java.util.List;

public interface ITransportContractService {

    ServiceResult registTranReq(OwnerTranRequestDTO tranDTO) throws Exception;

    List<TransportManagerVO> retriveTranManagerList();

    int retriveContractCount(OwnerTranSearchDTO searchDTO);

    List<OwnerTranRequestDTO> retrieveContractList(OwnerTranSearchDTO searchDTO);

    OwnerVO retrieveOwnerInfo(String owrId);
}
