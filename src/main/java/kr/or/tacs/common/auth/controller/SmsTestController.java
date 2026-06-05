package kr.or.tacs.common.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.common.auth.service.SmsService;

@RestController
public class SmsTestController {

    @Autowired
    private SmsService smsService;

    /*
     * SOLAPI 문자 발송 테스트용.
     * 테스트가 끝나면 반드시 제거하거나 관리자 권한으로 제한해야 한다.
     */
    @GetMapping("/test/sms")
    public String testSms(
            @RequestParam("to") String to,
            @RequestParam(value = "code", defaultValue = "123456") String code
    ) {
        smsService.sendAuthCode(to, code);
        return "SMS 발송 요청 완료";
    }
}
