package kr.or.tacs.common.auth.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import kr.or.tacs.common.auth.service.AuthService;

@RestController
@RequestMapping("/api/tacs/auth")
public class TacsAuthApiController {

    @Autowired
    private AuthService authService;

    @PostMapping("/checkId")
    public ResponseEntity<String> checkId(@RequestBody Map<String, String> param) {
        int count = authService.countLoginId(param.get("id"));
        return ResponseEntity.ok(count > 0 ? "EXIST" : "NOTEXIST");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> param) {
        String token = authService.signin(param.get("id"), param.get("password"));

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "ID 또는 비밀번호가 일치하지 않습니다."));
        }

        return ResponseEntity.ok(Map.of("token", token));
    }
}