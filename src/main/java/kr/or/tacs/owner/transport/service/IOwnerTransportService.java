package kr.or.tacs.owner.transport.service;

import kr.or.tacs.dto.owner.OwnerForwarderDetailDTO;

public interface IOwnerTransportService {

    OwnerForwarderDetailDTO retrieveForwarder(String owrId, Long trcTmNo);

}
