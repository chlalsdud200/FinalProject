package kr.or.tacs.common.resource.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.common.file.service.GoogleDriveService;
import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.common.resource.service.IResourceArchiveService;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.vo.common.ResourceArchiveSearchVO;
import kr.or.tacs.vo.common.ResourceArchiveVO;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/resource/archive")
@RequiredArgsConstructor
public class ResourceArchiveController {

    private final IResourceArchiveService service;
    private final IFileService fileService;
    private final GoogleDriveService googleDriveService;

    @GetMapping("/list.do")
    @ResponseBody
    public ResponseEntity<List<ResourceArchiveVO>> list(
            ResourceArchiveSearchVO search,
            @AuthenticationPrincipal CustomUser loginUser
    ) {
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 화면 파라미터 roleCd는 신뢰하지 않는다. 서버 로그인 권한으로만 필터링한다.
        // FIELD_OFFICER는 ACTOR_TYPE이 아니지만 자료실 노출 대상 코드로는 사용한다.
        search.setRoleCd(resolveBoardTargetRoleCd(loginUser));
        return ResponseEntity.ok(service.selectArchiveList(search));
    }

    @GetMapping("/download.do")
    public ResponseEntity<?> download(
            Long resNo,
            Long fileNo,
            @AuthenticationPrincipal CustomUser loginUser
    ) {
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        ResourceArchiveVO file = service.selectArchiveFileForDownload(resNo, fileNo, resolveBoardTargetRoleCd(loginUser));
        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        FileInfoDTO fileInfo = fileService.getFileInfo(fileNo);
        if (fileInfo != null
                && fileInfo.getDfiDriveFileId() != null
                && !fileInfo.getDfiDriveFileId().isBlank()
                && "DONE".equals(fileInfo.getDfiUploadSttsCd())) {
            byte[] fileBytes = googleDriveService.downloadFile(fileInfo.getDfiDriveFileId());
            String originalFileName = fileInfo.getDfiOrgNm() == null || fileInfo.getDfiOrgNm().isBlank()
                    ? "download"
                    : fileInfo.getDfiOrgNm();

            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            if (fileInfo.getDfiMimeTy() != null && !fileInfo.getDfiMimeTy().isBlank()) {
                try {
                    mediaType = MediaType.parseMediaType(fileInfo.getDfiMimeTy());
                } catch (Exception ignored) {
                    mediaType = MediaType.APPLICATION_OCTET_STREAM;
                }
            }

            ContentDisposition contentDisposition = ContentDisposition.attachment()
                    .filename(originalFileName, StandardCharsets.UTF_8)
                    .build();

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .contentLength(fileBytes.length)
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                    .body(fileBytes);
        }

        Path filePath = Paths.get(file.getFilePath(), file.getStrFileName()).normalize();
        FileSystemResource resource = new FileSystemResource(filePath);
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String encodedName = URLEncoder.encode(file.getOrgFileName(), StandardCharsets.UTF_8)
                .replaceAll("\\+", "%20");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedName)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    private String resolveBoardTargetRoleCd(CustomUser loginUser) {
        if ("OFFICER".equals(loginUser.getRoleCd()) && "FIELD_OFFICER".equals(loginUser.getOfficerTyCd())) {
            return "FIELD_OFFICER";
        }
        return loginUser.getRoleCd();
    }
}
