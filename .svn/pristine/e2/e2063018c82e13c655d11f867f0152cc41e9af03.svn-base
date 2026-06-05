package kr.or.tacs.common.notice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import kr.or.tacs.common.notice.mapper.INoticeMapper;
import kr.or.tacs.vo.common.notice.NoticeSearchVO;
import kr.or.tacs.vo.common.notice.NoticeVO;
import kr.or.tacs.vo.common.PaginationInfoVO;

class NoticeServiceImplTest {

    @Test
    void retriveNoticeListCalculatesPaginationAndReturnsDataList() {
        INoticeMapper mapper = Mockito.mock(INoticeMapper.class);
        NoticeServiceImpl service = new NoticeServiceImpl(mapper);
        NoticeSearchVO search = new NoticeSearchVO();
        search.setPage(2);
        search.setSize(10);
        search.setType("urgent");
        search.setKeyword(" tariff ");

        NoticeVO notice = new NoticeVO();
        notice.setNoticeNo(11L);
        notice.setNoticeType("URGENT");
        notice.setNoticeTitle("긴급 공지");

        when(mapper.selectNoticeCount(search)).thenReturn(23);
        when(mapper.retriveNoticeList(search)).thenReturn(List.of(notice));

        PaginationInfoVO<NoticeVO> result = service.retriveNoticeList(search);

        assertThat(result.getCurrentPage()).isEqualTo(2);
        assertThat(result.getScreenSize()).isEqualTo(10);
        assertThat(result.getStartRow()).isEqualTo(11);
        assertThat(result.getEndRow()).isEqualTo(20);
        assertThat(result.getTotalRecord()).isEqualTo(23);
        assertThat(result.getTotalPage()).isEqualTo(3);
        assertThat(result.getDataList()).containsExactly(notice);
        assertThat(search.getType()).isEqualTo("URGENT");
        assertThat(search.getKeyword()).isEqualTo("tariff");
        verify(mapper).selectNoticeCount(search);
        verify(mapper).retriveNoticeList(search);
    }
}
