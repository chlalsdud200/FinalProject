package kr.or.tacs.common.auth.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.common.auth.service.JoinVerificationService;

@RestController
public class JoinVerificationController {

    @Autowired
    private JoinVerificationService joinVerificationService;

    @PostMapping("/join/send-code.do")
    public ResponseEntity<Map<String, Object>> sendCode(@RequestParam("phoneNo") String phoneNo) {
        try {
            joinVerificationService.sendJoinAuthCode(phoneNo);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "인증번호를 발송했습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "인증번호 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."));
        }
    }

    @PostMapping("/join/verify-code.do")
    public ResponseEntity<Map<String, Object>> verifyCode(
            @RequestParam("phoneNo") String phoneNo,
            @RequestParam("authCode") String authCode) {
        try {
            joinVerificationService.verifyJoinAuthCode(phoneNo, authCode);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "휴대폰 인증이 완료되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "인증번호 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."));
        }
    }
}
