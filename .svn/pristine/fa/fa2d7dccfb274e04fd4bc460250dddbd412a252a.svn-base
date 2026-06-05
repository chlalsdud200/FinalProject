package kr.or.tacs.common.auth.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.common.AuthUserVO;
import kr.or.tacs.vo.common.AuthVerificationVO;
import kr.or.tacs.vo.common.SmsAuthVO;
import kr.or.tacs.vo.OwnerVO;

@Mapper
public interface AuthMapper {

    AuthUserVO selectLoginUser(@Param("loginId") String loginId);

    int countLoginId(@Param("loginId") String loginId);

    int insertOwner(OwnerVO ownerVO);

    AuthUserVO findLoginUserByIdAndPhone(
            @Param("loginId") String loginId,
            @Param("telno") String telno);

    int insertVerification(AuthVerificationVO verification);

    AuthVerificationVO selectValidVerification(
            @Param("purposeCd") String purposeCd,
            @Param("targetId") String targetId,
            @Param("phoneNo") String phoneNo);

    AuthVerificationVO selectVerifiedVerification(
            @Param("purposeCd") String purposeCd,
            @Param("targetId") String targetId,
            @Param("phoneNo") String phoneNo,
            @Param("authCode") String authCode);

    int updateVerificationSuccess(@Param("avNo") Long avNo);

    int increaseVerificationFailCnt(@Param("avNo") Long avNo);

    /* SMS_AUTH Table 연동 메서드 */
    int registSmsAuth(SmsAuthVO smsAuthVO);

    SmsAuthVO selectSmsAuth(
            @Param("saAuthPrposCd") String purposeCd,
            @Param("saTargetId") String targetId,
            @Param("saPhoneNo") String phoneNo);

    int modifySmsAuthSuccess(@Param("saNo") Long saNo);

    int modifySmsAuthFailCnt(@Param("saNo") Long saNo);

    int modifyPassword(
            @Param("loginPw") String loginPw,
            @Param("loginId") String loginId,
            @Param("actorTableNm") String actorTableNm);
}
