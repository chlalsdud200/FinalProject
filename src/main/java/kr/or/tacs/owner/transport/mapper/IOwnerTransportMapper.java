package kr.or.tacs.owner.transport.mapper;

import kr.or.tacs.dto.owner.OwnerForwarderDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface IOwnerTransportMapper {

    OwnerForwarderDetailDTO selectForwarder(@Param("owrId")String owrId, @Param("trcTmNo")Long trcTmNo);

}
