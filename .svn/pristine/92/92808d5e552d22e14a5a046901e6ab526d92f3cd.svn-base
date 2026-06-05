package kr.or.tacs.common.mypage.service;

import jakarta.servlet.http.HttpSession;
import kr.or.tacs.dto.common.mypage.MyPagePasswordChangeDTO;
import kr.or.tacs.dto.common.mypage.MyPagePasswordCheckDTO;
import kr.or.tacs.dto.common.mypage.MyPageProfileModifyDTO;
import kr.or.tacs.dto.common.mypage.MyPageResponseDTO;
import kr.or.tacs.dto.common.mypage.MyPageSmsVerifyDTO;
import kr.or.tacs.vo.common.CustomUser;

public interface MyPageService {

    MyPageResponseDTO modifyPasswordCheck(String actorPath, MyPagePasswordCheckDTO passwordCheckDTO, CustomUser user, HttpSession session);

    MyPageResponseDTO retriveProfile(String actorPath, CustomUser user, HttpSession session);

    MyPageResponseDTO modifyProfile(String actorPath, MyPageProfileModifyDTO profileModifyDTO, CustomUser user, HttpSession session);

    MyPageResponseDTO registPasswordSms(String actorPath, CustomUser user, HttpSession session);

    MyPageResponseDTO modifyPasswordSmsVerify(String actorPath, MyPageSmsVerifyDTO smsVerifyDTO, CustomUser user, HttpSession session);

    MyPageResponseDTO modifyPassword(String actorPath, MyPagePasswordChangeDTO passwordChangeDTO, CustomUser user, HttpSession session);
}
