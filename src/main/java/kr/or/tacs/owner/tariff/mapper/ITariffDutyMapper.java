package kr.or.tacs.owner.tariff.mapper;

import kr.or.tacs.dto.owner.OwnerBrokerChargeDTO;
import kr.or.tacs.dto.owner.OwnerDutySearchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ITariffDutyMapper {
    List<OwnerBrokerChargeDTO> selectBrokerChargeList(OwnerDutySearchDTO searchDTO);

    int selectBrokerChargeCount(OwnerDutySearchDTO searchDTO);

    OwnerBrokerChargeDTO selectBrokerChargeDetail(@Param("bcNo") String bcNo, @Param("owrId") String owrId);
}
