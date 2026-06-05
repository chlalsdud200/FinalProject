package kr.or.tacs.transport.request.service;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.or.tacs.transport.export.service.ExportTransportService;
import kr.or.tacs.transport.importp.service.ImportTransportService;
import kr.or.tacs.vo.transport.TransportInboundRequestVO;
import kr.or.tacs.vo.transport.TransportRequestVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransportRequestServiceImpl implements TransportRequestService {

    private final ExportTransportService exportTransportService;
    private final ImportTransportService importTransportService;

    @Override
    public List<TransportRequestVO> retriveExpTransportReqList() {
        return exportTransportService.retriveExpTransportReqList();
    }

    @Override
    public List<TransportRequestVO> retriveImpTransportReqList() {
        return importTransportService.retriveImpTransportReqList();
    }

    @Override
    public List<TransportInboundRequestVO> retriveExpInboundReqList() {
        return exportTransportService.retriveExpInboundReqList();
    }

    @Override
    public boolean modifyExpTransportReqStatus(String trcNo, String statusCd, String rejectType, String rejectMemo) {
        return exportTransportService.modifyExpTransportReqStatus(trcNo, statusCd, rejectType, rejectMemo);
    }

    @Override
    public boolean modifyImpTransportReqStatus(String trcNo, String statusCd, String rejectType, String rejectMemo) {
        return importTransportService.modifyImpTransportReqStatus(trcNo, statusCd, rejectType, rejectMemo, null);
    }
}
