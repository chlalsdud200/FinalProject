package kr.or.tacs.owner.certs.mapper;

import kr.or.tacs.dto.owner.OwnerCertDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface IOwnerCertMapper {

    List<OwnerCertDTO> selectOwnerCertList(String owrId);

}

