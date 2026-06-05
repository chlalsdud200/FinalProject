package kr.or.tacs.common.file.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Google Drive 연동 서비스
 *
 * <pre>
 * 주요 기능:
 *   1. refresh_token → access_token 발급 (만료 전 캐싱)
 *   2. 논리 경로(/CSTM_REQ/OWNER/2026/05/13) → Drive 폴더 자동 생성·조회
 *   3. 파일 업로드 / 다운로드
 * </pre>
 */
@Slf4j
@Service
public class GoogleDriveService {

    // ------------------------------------------------------------------ 상수
    private static final String ROOT_FOLDER_NAME   = "TACS_UPLOAD";
    private static final String TOKEN_URL          = "https://oauth2.googleapis.com/token";
    private static final String DRIVE_FILES_URL    = "https://www.googleapis.com/drive/v3/files";
    private static final String DRIVE_UPLOAD_URL   = "https://www.googleapis.com/upload/drive/v3/files"
            + "?uploadType=multipart&fields=id,name,mimeType,size,parents";
    private static final String FOLDER_MIME        = "application/vnd.google-apps.folder";

    /** access_token 만료 여유 시간 (30초 앞당겨 갱신) */
    private static final long TOKEN_EXPIRY_MARGIN_SEC = 30;

    // ------------------------------------------------------------------ 설정
    @Value("${google.drive.client-id}")
    private String clientId;

    @Value("${google.drive.client-secret}")
    private String clientSecret;

    @Value("${google.drive.refresh-token}")
    private String refreshToken;

    // ------------------------------------------------------------------ 인프라
    private final RestTemplate restTemplate;
    private final HttpClient   httpClient;       // 재사용 (매 요청마다 생성 X)
    private final ObjectMapper objectMapper;

    // ------------------------------------------------------------------ 토큰 캐시
    private volatile String  cachedAccessToken;
    private volatile Instant tokenExpiresAt = Instant.EPOCH;

    public GoogleDriveService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper  = objectMapper;
        this.httpClient    = HttpClient.newHttpClient();
    }

    // ================================================================== Public API

    /**
     * 논리 경로에 해당하는 Drive 폴더를 생성/조회하고 최종 폴더 ID 반환
     *
     * <pre>
     * 논리 경로 예:  /CSTM_REQ/OWNER/2026/05/13
     * Drive 구조:   TACS_UPLOAD / CSTM_REQ / OWNER / 2026 / 05 / 13
     * </pre>
     *
     * @param logicalPath 슬래시(/) 구분 경로
     * @return 최종 폴더 ID
     */
    public String getOrCreateFolderPath(String logicalPath) throws Exception {
        String accessToken   = getAccessToken();
        String currentParent = getOrCreateFolder(accessToken, ROOT_FOLDER_NAME, null);

        for (String part : logicalPath.split("/")) {
            if (part == null || part.isBlank()) continue;
            currentParent = getOrCreateFolder(accessToken, part, currentParent);
        }

        return currentParent;
    }

    /**
     * Google Drive 파일 업로드
     *
     * @param multipartFile    업로드할 파일
     * @param driveFileName    Drive 에 저장될 파일명
     * @param parentFolderId   부모 폴더 ID
     * @return Drive 응답 (id, name, mimeType, size, parents)
     */
    public Map<String, Object> uploadFile(MultipartFile multipartFile,
                                          String driveFileName,
                                          String parentFolderId) throws Exception {

        return uploadBytes(
                multipartFile.getBytes(),
                driveFileName,
                resolveContentType(multipartFile),
                parentFolderId
        );
    }

    /**
     * Google Drive 파일 다운로드
     *
     * @param driveFileId Drive 파일 ID
     * @return 파일 바이트 배열
     */
    public byte[] downloadFile(String driveFileId) {
        String accessToken = getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        ResponseEntity<byte[]> response = restTemplate.exchange(
                DRIVE_FILES_URL + "/" + driveFileId + "?alt=media",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                byte[].class
        );

        if (response.getBody() == null) {
            throw new GoogleDriveException("파일 다운로드 실패: 빈 응답 [fileId=" + driveFileId + "]");
        }

        return response.getBody();
    }

    // ================================================================== 토큰 관리

    /**
     * access_token 반환 (만료 임박 시 자동 재발급)
     *
     * <p>멀티스레드 환경에서도 안전하게 단일 갱신을 보장합니다.</p>
     */
    public synchronized String getAccessToken() {
        if (isTokenValid()) {
            return cachedAccessToken;
        }

        log.debug("access_token 갱신 요청");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id",     clientId);
        params.add("client_secret", clientSecret);
        params.add("refresh_token", refreshToken);
        params.add("grant_type",    "refresh_token");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ResponseEntity<Map<String, Object>> response;
        try {
            response = restTemplate.exchange(
                    TOKEN_URL,
                    HttpMethod.POST,
                    new HttpEntity<>(params, headers),
                    new org.springframework.core.ParameterizedTypeReference<>() {}
            );
        } catch (RestClientException e) {
            throw new GoogleDriveException("access_token 발급 실패: " + e.getMessage(), e);
        }

        Map<String, Object> body = response.getBody();

        if (body == null || !body.containsKey("access_token")) {
            throw new GoogleDriveException("access_token 발급 실패: 응답에 access_token 없음");
        }

        cachedAccessToken = String.valueOf(body.get("access_token"));

        // expires_in(초) 기반으로 만료 시각 계산
        int expiresIn = body.containsKey("expires_in")
                ? ((Number) body.get("expires_in")).intValue()
                : 3600; // 기본 1시간

        tokenExpiresAt = Instant.now().plusSeconds(expiresIn - TOKEN_EXPIRY_MARGIN_SEC);

        log.debug("access_token 갱신 완료 (만료: {})", tokenExpiresAt);

        return cachedAccessToken;
    }

    private boolean isTokenValid() {
        return cachedAccessToken != null && Instant.now().isBefore(tokenExpiresAt);
    }

    // ================================================================== 폴더 관리

    private synchronized String getOrCreateFolder(String accessToken,
                                     String folderName,
                                     String parentId) throws Exception {
        String folderId = findFolder(accessToken, folderName, parentId);
        return folderId != null
                ? folderId
                : createFolder(accessToken, folderName, parentId);
    }

    private String findFolder(String accessToken,
                              String folderName,
                              String parentId) throws Exception {

        String query = buildFolderQuery(folderName, parentId);

        URI uri = UriComponentsBuilder
                .fromUriString(DRIVE_FILES_URL)
                .queryParam("q",      query)
                .queryParam("fields", "files(id,name)")
                .build()
                .encode()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                uri,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new org.springframework.core.ParameterizedTypeReference<>() {}
        );

        Map<String, Object> body = response.getBody();

        if (body == null) return null;

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> files = (List<Map<String, Object>>) body.get("files");

        if (files == null || files.isEmpty()) return null;

        return String.valueOf(files.get(0).get("id"));
    }

    private String createFolder(String accessToken,
                                String folderName,
                                String parentId) {

        Map<String, Object> metadata = parentId == null || parentId.isBlank()
                ? Map.of("name", folderName, "mimeType", FOLDER_MIME)
                : Map.of("name", folderName, "mimeType", FOLDER_MIME, "parents", List.of(parentId));

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                DRIVE_FILES_URL + "?fields=id,name",
                HttpMethod.POST,
                new HttpEntity<>(metadata, headers),
                new org.springframework.core.ParameterizedTypeReference<>() {}
        );

        Map<String, Object> body = response.getBody();

        if (body == null || !body.containsKey("id")) {
            throw new GoogleDriveException("폴더 생성 실패: " + folderName);
        }

        log.debug("폴더 생성 완료: {} (parentId={})", folderName, parentId);

        return String.valueOf(body.get("id"));
    }

    // ================================================================== 유틸

    /**
     * Drive Files API 용 검색 쿼리 생성
     */
    private String buildFolderQuery(String folderName, String parentId) {
        StringBuilder query = new StringBuilder();
        query.append("name = '").append(escapeDriveQuery(folderName)).append("'");
        query.append(" and mimeType = '").append(FOLDER_MIME).append("'");
        query.append(" and trashed = false");

        if (parentId != null && !parentId.isBlank()) {
            query.append(" and '").append(parentId).append("' in parents");
        }

        return query.toString();
    }

    /**
     * multipart/related 바디 생성
     */
    private byte[] buildMultipartBody(String boundary,
                                      Map<String, Object> metadata,
                                      byte[] fileBytes,
                                      String contentType) throws IOException {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        String metaJson = objectMapper.writeValueAsString(metadata);
        byte[] CRLF = "\r\n".getBytes(StandardCharsets.UTF_8);

        out.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        out.write("Content-Type: application/json; charset=UTF-8\r\n\r\n".getBytes(StandardCharsets.UTF_8));
        out.write(metaJson.getBytes(StandardCharsets.UTF_8));
        out.write(CRLF);

        out.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        out.write(("Content-Type: " + contentType + "\r\n\r\n").getBytes(StandardCharsets.UTF_8));
        out.write(fileBytes);
        out.write(CRLF);

        // -- 종료
        out.write(("--" + boundary + "--").getBytes(StandardCharsets.UTF_8));

        return out.toByteArray();
    }

    private String resolveContentType(MultipartFile file) {
        String ct = file.getContentType();
        return (ct == null || ct.isBlank()) ? MediaType.APPLICATION_OCTET_STREAM_VALUE : ct;
    }

    private String escapeDriveQuery(String value) {
        return value.replace("\\", "\\\\").replace("'", "\\'");
    }

    // ================================================================== 예외

    public static class GoogleDriveException extends RuntimeException {
        public GoogleDriveException(String message) { super(message); }
        public GoogleDriveException(String message, Throwable cause) { super(message, cause); }
    }

    /**
     * @author 김아영
     * 서버에서 생성한 byte[] 파일 Google Drive 업로드
     *
     * 예:
     * - 검역 합격 증명서 PDF
     * - 시스템에서 자동 생성한 문서
     *
     * @param fileBytes      업로드할 파일 바이트
     * @param driveFileName  Google Drive에 저장될 파일명
     * @param contentType    MIME 타입
     * @param parentFolderId 부모 폴더 ID
     * @return Drive 응답(id, name, mimeType, size, parents)
     */
    public Map<String, Object> uploadBytes(byte[] fileBytes, String driveFileName, String contentType, String parentFolderId) throws Exception {

    	String accessToken = getAccessToken();
    	String boundary = "tacs_boundary_" + UUID.randomUUID();

    	if(contentType == null || contentType.isBlank()) {
    		contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
    	}

    	Map<String, Object> metadata = Map.of(
    			"name", driveFileName,
    			"mimeType", contentType,
    			"parents", List.of(parentFolderId)
    	);

    	byte[] body = buildMultipartBody(boundary, metadata, fileBytes, contentType);

    	HttpRequest request = HttpRequest.newBuilder()
    			.uri(URI.create(DRIVE_UPLOAD_URL))
    			.header("Authorization", "Bearer " + accessToken)
    			.header("Content-Type", "multipart/related; boundary=" + boundary)
    			.POST(HttpRequest.BodyPublishers.ofByteArray(body))
    			.build();

    	HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

    	if(response.statusCode() < 200 || response.statusCode() >= 300) {
    		throw new GoogleDriveException("byte[] 파일 업로드 실패 [status=" + response.statusCode() + "]: " + response.body());
    	}

    	return objectMapper.readValue(response.body(), new TypeReference<>() {});
    }
}