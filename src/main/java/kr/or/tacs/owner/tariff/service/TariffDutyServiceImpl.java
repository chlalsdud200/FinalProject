package kr.or.tacs.owner.tariff.service;

import kr.or.tacs.dto.owner.OwnerBrokerChargeDTO;
import kr.or.tacs.dto.owner.OwnerDutySearchDTO;
import kr.or.tacs.owner.tariff.mapper.ITariffDutyMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TariffDutyServiceImpl implements ITariffDutyService{

    @Autowired
    private ITariffDutyMapper tariffDutyMapper;

    @Override
    public List<OwnerBrokerChargeDTO> retrieveBrokerChargeList(OwnerDutySearchDTO searchDTO) {

        return tariffDutyMapper.selectBrokerChargeList(searchDTO);
    }

    @Override
    public int retrieveBrokerChargeCount(OwnerDutySearchDTO searchDTO) {

        return tariffDutyMapper.selectBrokerChargeCount(searchDTO);
    }

    @Override
    public OwnerBrokerChargeDTO retrieveBrokerChargeDetail(String bcNo, String owrId) {

        return tariffDutyMapper.selectBrokerChargeDetail(bcNo, owrId);
    }
}
