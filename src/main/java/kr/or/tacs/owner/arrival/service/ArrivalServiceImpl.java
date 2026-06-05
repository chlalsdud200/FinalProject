package kr.or.tacs.owner.arrival.service;

import kr.or.tacs.dto.owner.OwnerArrivalNoticeDTO;
import kr.or.tacs.dto.owner.OwnerArrivalSearchDTO;
import kr.or.tacs.owner.arrival.mapper.IArrivalMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ArrivalServiceImpl implements IArrivalService{

    @Autowired
    private IArrivalMapper arrivalMapper;

    @Override
    public List<OwnerArrivalNoticeDTO> retrieveArrivalNoticeList(OwnerArrivalSearchDTO searchDTO) {
        return arrivalMapper.selectArrivalNoticeList(searchDTO);
    }

    @Override
    public int retrieveArrivalNoticeCount(OwnerArrivalSearchDTO searchDTO) {
        return arrivalMapper.selectArrivalNoticeCount(searchDTO);
    }

    @Override
    public Map<String, Object> retrieveArrivalNoticeStats(String owrId) {
        return arrivalMapper.selectArrivalNoticeStats(owrId);
    }

    @Override
    public OwnerArrivalNoticeDTO retrieveArrivalNoticeDetail(String ianNo, String owrId) {
        return arrivalMapper.selectArrivalNoticeDetail(ianNo, owrId);
    }

    @Override
    public OwnerArrivalNoticeDTO retrieveArrivalNoticeDetailByTrcNo(String trcNo, String owrId) {
        return arrivalMapper.selectArrivalNoticeDetailByTrcNo(trcNo, owrId);
    }
}
