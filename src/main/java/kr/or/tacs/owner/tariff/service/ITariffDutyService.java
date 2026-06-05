package kr.or.tacs.owner.tariff.service;

import kr.or.tacs.dto.owner.OwnerBrokerChargeDTO;
import kr.or.tacs.dto.owner.OwnerDutySearchDTO;

import java.util.List;

public interface ITariffDutyService {
    List<OwnerBrokerChargeDTO> retrieveBrokerChargeList(OwnerDutySearchDTO searchDTO);

    int retrieveBrokerChargeCount(OwnerDutySearchDTO searchDTO);

    OwnerBrokerChargeDTO retrieveBrokerChargeDetail(String bcNo, String owrId);
}
