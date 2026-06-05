package kr.or.tacs.officer.basicscreen.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.dto.officer.BasicScreenListDTO;
import kr.or.tacs.dto.officer.BasicScreenSearchDTO;

@Mapper
public interface IScreenListMapper {

    /** 기본심사목록 페이징 조회 */
    List<BasicScreenListDTO> selectBasicList(@Param("loginOfficerId") String loginOfficerId,
                                             @Param("search") BasicScreenSearchDTO search);

    /** 기본심사목록 전체 건수 */
    int selectBasicCount(@Param("loginOfficerId") String loginOfficerId,
                         @Param("search") BasicScreenSearchDTO search);
}