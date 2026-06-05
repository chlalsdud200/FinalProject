package kr.or.tacs.broker.clients.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.tacs.vo.broker.clients.ClientFileVO;
import kr.or.tacs.vo.broker.clients.ClientSearchVO;
import kr.or.tacs.vo.broker.clients.ClientVO;

@Mapper
public interface IClientsMapper {

    int selectClientCount(ClientSearchVO searchVO);

    List<ClientVO> selectClientList(ClientSearchVO searchVO);

    ClientVO selectClientDetail(ClientSearchVO searchVO);

    List<ClientFileVO> selectClientFileList(Long tfgNo);

    ClientFileVO selectClientFile(Long fileNo);
    
    int updateClientAccept(ClientSearchVO searchVO);
    
    int insertSuppRqst(ClientSearchVO searchVO);
    int updateClientSuppStatus(ClientSearchVO searchVO);

    int insertRejectMng(ClientSearchVO searchVO);
    int updateClientRejectStatus(ClientSearchVO searchVO);
}