package kr.or.tacs.owner.export.mapper;

import kr.or.tacs.dto.owner.OwnerExportRequestDTO;
import kr.or.tacs.dto.owner.OwnerExportSearchDTO;
import kr.or.tacs.vo.BrokerVO;
import kr.or.tacs.vo.OwnerVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface IExportMapper {

    public int insertExp(OwnerExportRequestDTO expDTO);
    public Long selectExpRqstSeq();
    public OwnerVO selectOwnerInfo(String erOwrId);
    public List<BrokerVO> selectBrokerList();
    public List<OwnerExportRequestDTO> selectExpList(OwnerExportSearchDTO searchDTO);

    public OwnerExportRequestDTO selectExp(String erNo);

    public int selectExpCount(OwnerExportSearchDTO searchDTO);

    public int update(OwnerExportRequestDTO expDTO);

    public int updateExpSupp(OwnerExportRequestDTO expDTO);

    public int updateExpStatus(OwnerExportRequestDTO expDTO);

    public OwnerExportRequestDTO selectSupp(String erNo);
}
