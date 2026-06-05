package kr.or.tacs.common.auth.service;

// @Service
public class ConsoleSmsService implements SmsService {

    @Override
    public void sendAuthCode(String phoneNo, String authCode) {
        System.out.println("[개발용 SMS 인증번호]");
        System.out.println("수신번호: " + phoneNo);
        System.out.println("인증번호: " + authCode);
    }
}
