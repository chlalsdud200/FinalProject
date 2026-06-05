package kr.or.tacs.officer.basicscreen.service;

import kr.or.tacs.dto.officer.BasicScreenSearchDTO;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.dto.officer.BasicScreenListDTO;

public interface IScreenListService {

    /**
     * 기본심사목록 페이징 조회.
     * @return PaginationInfoVO (totalRecord, dataList, 페이지 계산값 포함)
     */
    PaginationInfoVO<BasicScreenListDTO> selectBasicList(String loginOfficerId,
                                                         BasicScreenSearchDTO search);
}