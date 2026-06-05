package kr.or.tacs.owner.arrival.service;

import kr.or.tacs.dto.owner.OwnerArrivalNoticeDTO;
import kr.or.tacs.dto.owner.OwnerArrivalSearchDTO;

import java.util.List;
import java.util.Map;

public interface IArrivalService {

    List<OwnerArrivalNoticeDTO> retrieveArrivalNoticeList(OwnerArrivalSearchDTO searchDTO);

    int retrieveArrivalNoticeCount(OwnerArrivalSearchDTO searchDTO);

    Map<String, Object> retrieveArrivalNoticeStats(String owrId);

    OwnerArrivalNoticeDTO retrieveArrivalNoticeDetail(String ianNo, String owrId);

    OwnerArrivalNoticeDTO retrieveArrivalNoticeDetailByTrcNo(String trcNo, String owrId);
}
