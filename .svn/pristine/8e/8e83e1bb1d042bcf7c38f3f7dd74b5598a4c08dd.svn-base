package kr.or.tacs.owner.importp.mapper;

import kr.or.tacs.dto.owner.OwnerExportRequestDTO;
import kr.or.tacs.dto.owner.OwnerImportRequestDTO;
import kr.or.tacs.dto.owner.OwnerImportSearchDTO;
import kr.or.tacs.vo.BrokerVO;
import kr.or.tacs.vo.OwnerVO;
import kr.or.tacs.vo.transport.PortVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface IImportMapper {

    public List<BrokerVO> selectBrokerList();

    public OwnerVO selectOwnerInfo(String owrId);

    public List<OwnerImportRequestDTO> selectImpList(OwnerImportSearchDTO searchDTO);

    public int selectImpCount(OwnerImportSearchDTO searchDTO);

    public Long selectImpRqstSeq();

    public int insertImp(OwnerImportRequestDTO impDTO);

    public List<PortVO> selectPortList();

    public OwnerImportRequestDTO selectImp(String irNo);

    public int updateImp(OwnerImportRequestDTO impDTO);

    public int updateImpSupp(OwnerImportRequestDTO impDTO);

    public int updateImpStatus(OwnerImportRequestDTO impDTO);

    public OwnerImportRequestDTO selectSupp(String irNo);
}
