package kr.or.tacs.common.file.service;

import kr.or.tacs.common.file.mapper.IFileMapper;
import kr.or.tacs.dto.FileInfoDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DriveUploadAsyncService {

    private final GoogleDriveService googleDriveService;
    private final IFileMapper fileMapper;

    /**
     * DB 커밋 이후 백그라운드에서 Google Drive 업로드 수행
     */
    @Async("fileUploadExecutor")
    public void uploadAsync(DriveUploadCommand command) {

        try {
            // 1. Drive 폴더 생성 또는 조회
            String folderId = googleDriveService.getOrCreateFolderPath(command.savePath());

            // 2. Google Drive 업로드
            Map<String, Object> driveResult = googleDriveService.uploadBytes(
                    command.fileBytes(),
                    command.saveName(),
                    command.contentType(),
                    folderId
            );

            String driveFileId = String.valueOf(driveResult.get("id"));

            // 3. DB 성공 업데이트
            FileInfoDTO updateDTO = new FileInfoDTO();
            updateDTO.setDfiFileNo(command.dfiFileNo());
            updateDTO.setDfiDriveFileId(driveFileId);

            fileMapper.updateDriveUploadSuccess(updateDTO);

            log.debug("Google Drive 비동기 업로드 완료: dfiFileNo={}, driveFileId={}",
                    command.dfiFileNo(), driveFileId);

        } catch (Exception e) {
            // 4. DB 실패 업데이트
            log.error("Google Drive 비동기 업로드 실패: dfiFileNo={}", command.dfiFileNo(), e);

            try {
                fileMapper.updateDriveUploadFail(command.dfiFileNo());
            } catch (Exception updateEx) {
                log.error("Google Drive 업로드 실패 상태 업데이트 실패: dfiFileNo={}",
                        command.dfiFileNo(), updateEx);
            }
        }
    }

    /**
     * 비동기 업로드에 필요한 데이터 묶음
     *
     * MultipartFile 자체를 비동기로 넘기면 요청 종료 후 임시파일이 사라질 수 있으므로
     * byte[]로 복사해서 넘긴다.
     */
    public record DriveUploadCommand(
            Long dfiFileNo,
            byte[] fileBytes,
            String saveName,
            String contentType,
            String savePath
    ) {
    }
}