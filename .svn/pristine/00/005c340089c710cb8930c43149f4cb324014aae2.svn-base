package kr.or.tacs.transport.request.service;

import java.util.List;

import kr.or.tacs.vo.transport.TransportInboundRequestVO;
import kr.or.tacs.vo.transport.TransportRequestVO;

public interface TransportRequestService {

    List<TransportRequestVO> retriveExpTransportReqList();

    List<TransportRequestVO> retriveImpTransportReqList();

    List<TransportInboundRequestVO> retriveExpInboundReqList();

    boolean modifyExpTransportReqStatus(String trcNo, String statusCd, String rejectType, String rejectMemo);

    boolean modifyImpTransportReqStatus(String trcNo, String statusCd, String rejectType, String rejectMemo);

}
