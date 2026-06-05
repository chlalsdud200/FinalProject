package kr.or.tacs.owner.arrival.mapper;

import kr.or.tacs.dto.owner.OwnerArrivalNoticeDTO;
import kr.or.tacs.dto.owner.OwnerArrivalSearchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface IArrivalMapper {

    List<OwnerArrivalNoticeDTO> selectArrivalNoticeList(OwnerArrivalSearchDTO searchDTO);

    int selectArrivalNoticeCount(OwnerArrivalSearchDTO searchDTO);

    Map<String, Object> selectArrivalNoticeStats(@Param("owrId") String owrId);

    OwnerArrivalNoticeDTO selectArrivalNoticeDetail(@Param("ianNo") String ianNo,@Param("owrId") String owrId);

    OwnerArrivalNoticeDTO selectArrivalNoticeDetailByTrcNo(@Param("trcNo") String trcNo, @Param("owrId") String owrId);
}
