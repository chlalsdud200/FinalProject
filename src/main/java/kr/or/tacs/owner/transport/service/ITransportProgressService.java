package kr.or.tacs.owner.transport.service;

import kr.or.tacs.dto.owner.OwnerTranDetailDTO;
import kr.or.tacs.dto.owner.OwnerTranSearchDTO;
import kr.or.tacs.dto.owner.OwnerTransportProgressDTO;

import java.util.List;

public interface ITransportProgressService {

    List<OwnerTransportProgressDTO> retrieveImpTrcProgressList(OwnerTranSearchDTO searchDTO);

    int retrieveTrcProgressCount(OwnerTranSearchDTO searchDTO);

    OwnerTranDetailDTO retrieveImpTrc(String trcNo);
}
