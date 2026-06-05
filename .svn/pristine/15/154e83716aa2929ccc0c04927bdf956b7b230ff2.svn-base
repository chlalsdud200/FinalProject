package kr.or.tacs.officer.basicscreen.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.tacs.dto.officer.BasicScreenListDTO;
import kr.or.tacs.dto.officer.BasicScreenSearchDTO;
import kr.or.tacs.officer.basicscreen.mapper.IScreenListMapper;
import kr.or.tacs.vo.common.PaginationInfoVO;

@Service
public class ScreenListImpl implements IScreenListService {

    @Autowired
    private IScreenListMapper mapper;

    @Override
    public PaginationInfoVO<BasicScreenListDTO> selectBasicList(String loginOfficerId,
                                                                BasicScreenSearchDTO search) {
        if (search == null) {
            search = new BasicScreenSearchDTO();
        }

        int totalCount = mapper.selectBasicCount(loginOfficerId, search);
        search.setTotalRecord(totalCount);

        List<BasicScreenListDTO> list = mapper.selectBasicList(loginOfficerId, search);

        search.setDataList(list);
        return search;
    }
}
