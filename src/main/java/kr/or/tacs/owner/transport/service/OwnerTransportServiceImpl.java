package kr.or.tacs.owner.transport.service;

import kr.or.tacs.dto.owner.OwnerForwarderDetailDTO;
import kr.or.tacs.owner.transport.mapper.IOwnerTransportMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OwnerTransportServiceImpl implements IOwnerTransportService{

    @Autowired
    private IOwnerTransportMapper transportMapper;

    @Override
    public OwnerForwarderDetailDTO retrieveForwarder(String owrId, Long trcTmNo) {

        return transportMapper.selectForwarder(owrId, trcTmNo);
    }
}
