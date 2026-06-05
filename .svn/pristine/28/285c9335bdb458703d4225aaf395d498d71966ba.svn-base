package kr.or.tacs.owner.certs.service;

import kr.or.tacs.dto.owner.OwnerCertDTO;
import kr.or.tacs.owner.certs.mapper.IOwnerCertMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnerCertServiceImpl implements IOwnerCertService{

    @Autowired
    private IOwnerCertMapper certMapper;

    @Override
    public List<OwnerCertDTO> retrieveOwnerCertList(String owrId) {
        return certMapper.selectOwnerCertList(owrId);
    }
}
