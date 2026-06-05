package kr.or.tacs.owner.transport.service;

import kr.or.tacs.dto.owner.OwnerTranDetailDTO;
import kr.or.tacs.dto.owner.OwnerTranSearchDTO;
import kr.or.tacs.dto.owner.OwnerTransportProgressDTO;
import kr.or.tacs.owner.transport.mapper.ITransportProgressMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransportProgressServiceImpl implements ITransportProgressService{

    @Autowired
    private ITransportProgressMapper progressMapper;

    @Override
    public List<OwnerTransportProgressDTO> retrieveImpTrcProgressList(OwnerTranSearchDTO searchDTO) {
        return progressMapper.selectImpTrcProgressList(searchDTO);
    }

    @Override
    public int retrieveTrcProgressCount(OwnerTranSearchDTO searchDTO) {
        return progressMapper.selectTrcProgressCount(searchDTO);
    }

    @Override
    public OwnerTranDetailDTO retrieveImpTrc(String trcNo) {
        return progressMapper.selectImpTrc(trcNo);
    }
}
