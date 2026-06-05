package kr.or.tacs.common.auth.service;

public interface AuthFindService {

    // (기존) 임시 보존, 필요시 삭제
    void sendPasswordFindAuthCode(String loginId, String phoneNo);

    // (기존) 임시 보존, 필요시 삭제
    void verifyPasswordFindAuthCode(String loginId, String phoneNo, String authCode);

    // (신규) SMS_AUTH 테이블 적용버전
    void registSmsAuthForPasswordFind(String loginId, String phoneNo);

    void verifySmsAuthForPasswordFind(String loginId, String phoneNo, String authCode);

    void modifyPasswordAfterAuth(String loginId, String phoneNo, String newPassword);
}