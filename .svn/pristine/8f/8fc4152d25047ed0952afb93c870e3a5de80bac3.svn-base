package kr.or.tacs.common.notice.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.common.notice.NoticeSearchVO;
import kr.or.tacs.vo.common.notice.NoticeVO;

@Mapper
public interface INoticeMapper {

    List<NoticeVO> retriveNoticeList(NoticeSearchVO search);

    int selectNoticeCount(NoticeSearchVO search);

    NoticeVO selectNotice(@Param("noticeNo") Long noticeNo);

    int updateNoticeCount(@Param("noticeNo") Long noticeNo);

    int insertNotice(NoticeVO notice);

    int updateNotice(NoticeVO notice);

    int updateNoticePinYn(@Param("noticeNo") Long noticeNo, @Param("noticePinYn") String noticePinYn);

    int updateNoticeUseYn(@Param("noticeNo") Long noticeNo, @Param("noticeUseYn") String noticeUseYn);

    int deleteNotice(@Param("noticeNo") Long noticeNo);
}
