package kr.or.tacs.broker.clients.service;

import java.util.List;

import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.broker.clients.ClientFileVO;
import kr.or.tacs.vo.broker.clients.ClientSearchVO;
import kr.or.tacs.vo.broker.clients.ClientVO;

public interface IClientsService {

    List<ClientVO> selectClientList(ClientSearchVO searchVO);

    PaginationInfoVO<ClientVO> selectClientPage(ClientSearchVO searchVO);

    ClientVO selectClientDetail(ClientSearchVO searchVO);

    ClientFileVO selectClientFile(Long fileNo);
    
    int acceptClientRequest(ClientSearchVO searchVO);

    int requestSupplement(ClientSearchVO searchVO);

    int rejectClientRequest(ClientSearchVO searchVO);
}