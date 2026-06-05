package kr.or.tacs.common.mypage.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.dto.common.mypage.MyPageProfileModifyDTO;
import kr.or.tacs.vo.common.SmsAuthVO;
import kr.or.tacs.vo.common.mypage.MyPageLoginContactVO;
import kr.or.tacs.vo.common.mypage.MyPageProfileVO;

@Mapper
public interface MyPageMapper {

    String selectLoginPasswordHash(@Param("loginId") String loginId, @Param("roleCd") String roleCd);

    MyPageLoginContactVO selectLoginContact(@Param("loginId") String loginId, @Param("roleCd") String roleCd);

    MyPageProfileVO selectOwnerProfile(@Param("loginId") String loginId);

    MyPageProfileVO selectBrokerProfile(@Param("loginId") String loginId);

    MyPageProfileVO selectOfficerProfile(@Param("loginId") String loginId);

    MyPageProfileVO selectTransportProfile(@Param("loginId") String loginId);

    MyPageProfileVO selectWarehouseProfile(@Param("loginId") String loginId);

    MyPageProfileVO selectSystemAdminProfile(@Param("loginId") String loginId);

    int updateOwnerProfile(MyPageProfileModifyDTO profileModifyDTO);

    int updateBrokerProfile(MyPageProfileModifyDTO profileModifyDTO);

    int updateOfficerProfile(MyPageProfileModifyDTO profileModifyDTO);

    int updateTransportProfile(MyPageProfileModifyDTO profileModifyDTO);

    int updateWarehouseProfile(MyPageProfileModifyDTO profileModifyDTO);

    int updateSystemAdminProfile(MyPageProfileModifyDTO profileModifyDTO);

    int insertMyPageSmsAuth(SmsAuthVO smsAuthVO);

    SmsAuthVO selectLatestMyPageSmsAuth(
            @Param("purposeCd") String purposeCd,
            @Param("targetId") String targetId,
            @Param("phoneNo") String phoneNo);

    int updateMyPageSmsAuthSuccess(@Param("saNo") Long saNo);

    int updateMyPageSmsAuthFailCnt(@Param("saNo") Long saNo);

    int updateOwnerPassword(@Param("loginId") String loginId, @Param("encodedPassword") String encodedPassword);

    int updateBrokerPassword(@Param("loginId") String loginId, @Param("encodedPassword") String encodedPassword);

    int updateOfficerPassword(@Param("loginId") String loginId, @Param("encodedPassword") String encodedPassword);

    int updateTransportPassword(@Param("loginId") String loginId, @Param("encodedPassword") String encodedPassword);

    int updateWarehousePassword(@Param("loginId") String loginId, @Param("encodedPassword") String encodedPassword);

    int updateSystemAdminPassword(@Param("loginId") String loginId, @Param("encodedPassword") String encodedPassword);
}
