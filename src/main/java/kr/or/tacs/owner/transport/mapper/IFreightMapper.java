package kr.or.tacs.owner.transport.mapper;

import kr.or.tacs.dto.owner.OwnerFreightDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IFreightMapper {

    List<OwnerFreightDTO> selectFreightList(@Param("owrId") String owrId);

    OwnerFreightDTO selectFreight(@Param("tcsNo") String tcsNo, @Param("owrId") String owrId);

    void updateFreightCertificate(@Param("trcNo") String trcNo, @Param("owrId") String owrId, @Param("certTfgNo") Long certTfgNo);
}
