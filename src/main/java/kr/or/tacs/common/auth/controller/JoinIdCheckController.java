package kr.or.tacs.common.auth.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.common.auth.service.AuthService;

@RestController
public class JoinIdCheckController {

    @Autowired
    private AuthService authService;

    @PostMapping("/checkId.do")
    public ResponseEntity<Map<String, Object>> checkId(@RequestParam("loginId") String loginId) {
        String trimmedLoginId = loginId == null ? null : loginId.trim();

        if (!StringUtils.hasText(trimmedLoginId)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "available", false,
                    "message", "아이디를 입력해주세요."));
        }

        int count = authService.countLoginId(trimmedLoginId);
        boolean available = count == 0;

        return ResponseEntity.ok(Map.of(
                "success", true,
                "available", available,
                "message", available ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다."));
    }
}
