package kr.or.tacs.common.file.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.asm.TypeReference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
public class GoogleDriveOAuthController {

    private final ObjectMapper objectMapper;

    @Value("${google.drive.client-id}")
    private String clientId;

    @Value("${google.drive.client-secret}")
    private String clientSecret;

    @Value("${google.drive.redirect-uri}")
    private String redirectUri;

    @Value("${google.drive.scope}")
    private String scope;

    @Value("${google.drive.refresh-token:}")
    private String refreshToken;

    GoogleDriveOAuthController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * 1차: 구글 OAuth 동의 화면으로 이동
     */
    @GetMapping("/google/drive/auth")
    public String googleDriveAuth() {

        String authUrl = UriComponentsBuilder
                .fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", scope)
                .queryParam("access_type", "offline")
                .queryParam("prompt", "consent")
                .build()
                .toUriString();

        return "redirect:" + authUrl;
    }

    /**
     * 2차: 구글 인증 후 code를 받아서 token으로 교환
     */
    @GetMapping("/google/drive/callback")
    @ResponseBody
    public ResponseEntity<?> googleDriveCallback(@RequestParam("code") String code) {

        String tokenUrl = "https://oauth2.googleapis.com/token";

        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                tokenUrl,
                request,
                Map.class
        );

        return ResponseEntity.ok(response.getBody());
    }
    
}





