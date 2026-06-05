package kr.or.tacs.common.file.controller;

import kr.or.tacs.common.file.service.FileAccessAuthorizer;
import kr.or.tacs.common.file.service.GoogleDriveService;
import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.vo.common.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;

@Controller
@RequiredArgsConstructor
public class FileDownloadController {

    private static final int DRIVE_UPLOAD_WAIT_RETRY_COUNT = 24;
    private static final long DRIVE_UPLOAD_WAIT_INTERVAL_MS = 250L;

    private final IFileService fileService;
    private final GoogleDriveService googleDriveService;
    private final FileAccessAuthorizer fileAccessAuthorizer;

    /**
     * Google Drive 파일 공통 다운로드
     *
     * 예:
     * /common/file/download.do?fileNo=93
     */
    @GetMapping("/common/file/download.do")
    public ResponseEntity<byte[]> download(@RequestParam("fileNo") Long fileNo,
                                           @AuthenticationPrincipal CustomUser user) {

        // 1. DB 파일 정보 조회 및 접근 권한 검증
        FileInfoDTO fileInfo = getDownloadableFile(fileNo, user);
        fileInfo = waitUntilDriveUploadReady(fileInfo, user);

        // 2. Google Drive에서 파일 다운로드
        byte[] fileBytes = googleDriveService.downloadFile(fileInfo.getDfiDriveFileId());

        // 3. 원본 파일명
        String originalFileName = fileInfo.getDfiOrgNm();
        if (originalFileName == null || originalFileName.isBlank()) {
            originalFileName = "download";
        }

        // 4. MIME 타입
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (fileInfo.getDfiMimeTy() != null && !fileInfo.getDfiMimeTy().isBlank()) {
            try {
                mediaType = MediaType.parseMediaType(fileInfo.getDfiMimeTy());
            } catch (Exception ignored) {
                mediaType = MediaType.APPLICATION_OCTET_STREAM;
            }
        }

        // 5. 한글 파일명 대응
        ContentDisposition contentDisposition = ContentDisposition.attachment()
                .filename(originalFileName, StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(fileBytes.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(fileBytes);
    }

        /**
         * Google Drive PDF 파일 공통 미리보기
         *
         * 다운로드와 달리 Content-Disposition을 inline으로 내려서
         * 브라우저/iframe에서 PDF를 바로 열 수 있게 한다.
         *
         * 예:
         * /common/file/preview.do?fileNo=93
         */
        @GetMapping("/common/file/preview.do")
        public ResponseEntity<byte[]> preview(@RequestParam("fileNo") Long fileNo,
                                              @AuthenticationPrincipal CustomUser user) {
            FileInfoDTO fileInfo = getDownloadableFile(fileNo, user);
            fileInfo = waitUntilDriveUploadReady(fileInfo, user);

            byte[] fileBytes = googleDriveService.downloadFile(fileInfo.getDfiDriveFileId());

            String originalFileName = fileInfo.getDfiOrgNm();
            if (originalFileName == null || originalFileName.isBlank()) {
                originalFileName = "preview.pdf";
            }

            ContentDisposition contentDisposition = ContentDisposition.inline()
                    .filename(originalFileName, StandardCharsets.UTF_8)
                    .build();

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(fileBytes.length)
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                    .body(fileBytes);
        }

        /**
         * 파일 존재 여부와 현재 사용자의 접근 권한을 함께 검증한다.
         *
         * <p>파일 번호를 직접 대입하여 다른 사용자의 파일 존재 여부를 추측할 수 없도록
         * 실제로 파일이 없는 경우와 접근 권한이 없는 경우를 모두 404로 응답한다.</p>
         *
         * @param fileNo 조회할 파일 번호
         * @param user 현재 로그인 사용자
         * @return 접근 권한이 확인된 파일 정보
         */
        private FileInfoDTO getDownloadableFile(Long fileNo, CustomUser user) {
            FileInfoDTO fileInfo = fileService.getFileInfo(fileNo);

            if (fileInfo == null) {
                throw fileNotFound();
            }

            try {
                fileAccessAuthorizer.checkDownloadable(fileInfo, user);
            } catch (AccessDeniedException e) {
                throw fileNotFound();
            }

            return fileInfo;
        }

        /**
         * 파일 미존재와 권한 부족에 공통으로 사용하는 404 예외를 생성한다.
         *
         * @return 파일 존재 여부를 노출하지 않는 404 예외
         */
        private ResponseStatusException fileNotFound() {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "파일을 찾을 수 없습니다.");
        }

        private FileInfoDTO waitUntilDriveUploadReady(FileInfoDTO fileInfo, CustomUser user) {
            for (int i = 0; i < DRIVE_UPLOAD_WAIT_RETRY_COUNT; i += 1) {
                if (isDriveUploadReady(fileInfo)) {
                    return fileInfo;
                }
                if ("FAIL".equals(fileInfo.getDfiUploadSttsCd())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "파일 업로드에 실패했습니다.");
                }
                sleepBeforeRetry();
                fileInfo = getDownloadableFile(fileInfo.getDfiFileNo(), user);
            }

            throw new ResponseStatusException(HttpStatus.CONFLICT, "파일 업로드가 아직 완료되지 않았습니다.");
        }

        private boolean isDriveUploadReady(FileInfoDTO fileInfo) {
            return fileInfo != null
                    && "DONE".equals(fileInfo.getDfiUploadSttsCd())
                    && fileInfo.getDfiDriveFileId() != null
                    && !fileInfo.getDfiDriveFileId().isBlank();
        }

        private void sleepBeforeRetry() {
            try {
                Thread.sleep(DRIVE_UPLOAD_WAIT_INTERVAL_MS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new ResponseStatusException(HttpStatus.CONFLICT, "파일 업로드 완료 대기 중 중단되었습니다.");
            }
        }
}
