package kr.or.tacs.owner.transport.mapper;

import kr.or.tacs.dto.owner.OwnerTranDetailDTO;
import kr.or.tacs.dto.owner.OwnerTranSearchDTO;
import kr.or.tacs.dto.owner.OwnerTransportProgressDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ITransportProgressMapper {

    List<OwnerTransportProgressDTO> selectImpTrcProgressList(OwnerTranSearchDTO searchDTO);

    int selectTrcProgressCount(OwnerTranSearchDTO searchDTO);

    OwnerTranDetailDTO selectImpTrc(String trcNo);
}
