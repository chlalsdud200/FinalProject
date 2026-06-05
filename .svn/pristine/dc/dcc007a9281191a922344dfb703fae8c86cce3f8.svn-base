package kr.or.tacs.broker.clients.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.or.tacs.broker.clients.mapper.IClientsMapper;
import kr.or.tacs.common.notification.service.INotificationService;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.broker.clients.ClientFileVO;
import kr.or.tacs.vo.broker.clients.ClientSearchVO;
import kr.or.tacs.vo.broker.clients.ClientVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientsServiceImpl implements IClientsService {

    private final IClientsMapper clientsMapper;
    private final INotificationService notificationService;

    @Override
    public List<ClientVO> selectClientList(ClientSearchVO searchVO) {
        return clientsMapper.selectClientList(searchVO);
    }

    @Override
    public PaginationInfoVO<ClientVO> selectClientPage(ClientSearchVO searchVO) {

        PaginationInfoVO<ClientVO> pagingVO = new PaginationInfoVO<>(10, 5);

        int currentPage = searchVO.getPage() <= 0 ? 1 : searchVO.getPage();

        pagingVO.setCurrentPage(currentPage);

        searchVO.setStartRow(pagingVO.getStartRow());
        searchVO.setEndRow(pagingVO.getEndRow());

        int totalRecord = clientsMapper.selectClientCount(searchVO);
        pagingVO.setTotalRecord(totalRecord);

        List<ClientVO> dataList = clientsMapper.selectClientList(searchVO);
        pagingVO.setDataList(dataList);

        return pagingVO;
    }

    @Override
    public ClientVO selectClientDetail(ClientSearchVO searchVO) {

        ClientVO client = clientsMapper.selectClientDetail(searchVO);

        if (client != null && client.getTfgNo() != null) {
            client.setFileList(clientsMapper.selectClientFileList(client.getTfgNo()));
        }

        return client;
    }

    @Override
    public ClientFileVO selectClientFile(Long fileNo) {
        return clientsMapper.selectClientFile(fileNo);
    }
    
    @Override
    public int acceptClientRequest(ClientSearchVO searchVO) {
        int updated = clientsMapper.updateClientAccept(searchVO);

        // 관세사가 화주 의뢰를 접수(승낙) → 화주에게 접수 확인 알림.
        if (updated > 0) {
            Map<String, String> bindings = new HashMap<>();
            bindings.put("reqNo", searchVO.getReqNo());
            bindings.put("linkUrl", ownerRequestLink(searchVO));
            notificationService.registNotification(
                    "CSTM_ACCEPTED",
                    searchVO.getReqNo(),
                    searchVO.getBrokerId(),
                    bindings
            );
        }

        return updated;
    }

    @Override
    public int requestSupplement(ClientSearchVO searchVO) {

        if (searchVO.getSuppReqCn() == null || searchVO.getSuppReqCn().isBlank()) {
            searchVO.setSuppReqCn("보완 요청");
        }

        clientsMapper.insertSuppRqst(searchVO);

        int updated = clientsMapper.updateClientSuppStatus(searchVO);

        // 관세사가 화주에게 업무처리 보완요청 → 화주가 보완자료를 제출해야 통관이 진행된다.
        // 상태 전이가 실제로 일어난 경우에만 알림 발송.
        if (updated > 0) {
            Map<String, String> bindings = new HashMap<>();
            bindings.put("reqNo", searchVO.getReqNo());
            bindings.put("linkUrl", ownerRequestLink(searchVO));
            notificationService.registNotification(
                    "CSTM_SUPP_REQUESTED",
                    searchVO.getReqNo(),
                    searchVO.getBrokerId(),
                    bindings
            );
        }

        return updated;
    }

    @Override
    public int rejectClientRequest(ClientSearchVO searchVO) {
        clientsMapper.insertRejectMng(searchVO);
        int updated = clientsMapper.updateClientRejectStatus(searchVO);

        // 관세사가 화주 의뢰를 반려 → 화주가 사유 확인 후 재의뢰해야 함.
        if (updated > 0) {
            Map<String, String> bindings = new HashMap<>();
            bindings.put("reqNo", searchVO.getReqNo());
            bindings.put("rejectCn", searchVO.getRejectCn() == null ? "" : searchVO.getRejectCn());
            bindings.put("linkUrl", ownerRequestLink(searchVO));
            notificationService.registNotification(
                    "CSTM_REJECTED",
                    searchVO.getReqNo(),
                    searchVO.getBrokerId(),
                    bindings
            );
        }

        return updated;
    }

    /**
     * 화주 의뢰 상세 링크 (수입/수출 구분).
     */
    private String ownerRequestLink(ClientSearchVO searchVO) {
        // 알림 클릭 시 해당 의뢰건 상세로 직접 이동
        return "EXPORT".equals(searchVO.getReqType())
                ? "/owner/export/detail.do/" + searchVO.getReqNo()
                : "/owner/import/detail.do/" + searchVO.getReqNo();
    }
}