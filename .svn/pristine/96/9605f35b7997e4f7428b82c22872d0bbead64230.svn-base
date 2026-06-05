package kr.or.tacs.transport.importp.service;

import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.common.notification.service.INotificationService;
import kr.or.tacs.transport.importp.mapper.ImportTransportMapper;
import kr.or.tacs.vo.transport.TransportRequestVO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ImportTransportServiceImplTest {

    @Mock
    private ImportTransportMapper importTransportMapper;

    @Mock
    private IFileService fileService;

    @Mock
    private INotificationService notificationService;

    @InjectMocks
    private ImportTransportServiceImpl importTransportService;

    @Test
    void retriveImpManifestCompareList_ShouldAttachDetailedGoodsByGroup() {
        TransportRequestVO firstManifest = manifest(100024);
        TransportRequestVO secondManifest = manifest(100024);
        List<TransportRequestVO> goodsList = List.of(goods("THAI MILLED RICE"), goods("THAI NOODLE"));

        when(importTransportMapper.retriveImpManifestCompareList(null))
                .thenReturn(List.of(firstManifest, secondManifest));
        when(importTransportMapper.retriveImpUnloadingInGoodsList(100024))
                .thenReturn(goodsList);

        List<TransportRequestVO> result = importTransportService.retriveImpManifestCompareList();

        assertSame(goodsList, result.get(0).getGoodsList());
        assertSame(goodsList, result.get(1).getGoodsList());
        verify(importTransportMapper, times(1)).retriveImpUnloadingInGoodsList(100024);
    }

    private TransportRequestVO manifest(Integer ggNo) {
        TransportRequestVO manifest = new TransportRequestVO();
        manifest.setGgNo(ggNo);
        return manifest;
    }

    private TransportRequestVO goods(String goodsName) {
        TransportRequestVO goods = new TransportRequestVO();
        goods.setGoodsName(goodsName);
        return goods;
    }
}
