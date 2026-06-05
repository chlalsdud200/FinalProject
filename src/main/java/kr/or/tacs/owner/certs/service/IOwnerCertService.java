package kr.or.tacs.owner.certs.service;

import kr.or.tacs.dto.owner.OwnerCertDTO;

import java.util.List;

public interface IOwnerCertService {

    List<OwnerCertDTO> retrieveOwnerCertList(String owrId);
}
