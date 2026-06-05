package kr.or.tacs.common.file.service;

import kr.or.tacs.common.file.mapper.IFileMapper;
import kr.or.tacs.common.file.support.ByteArrayMultipartFile;
import kr.or.tacs.common.util.FileUploadUtil;
import kr.or.tacs.dto.FileGroupDTO;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.dto.FileMapDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements IFileService {

    private final IFileMapper fileMapper;
    private final DriveUploadAsyncService driveUploadAsyncService;

    // ================================================================== Public API

    /**
     * 파일 목록 업로드
     * 문서유형 구분 없음
     */
    @Override
    @Transactional
    public Long uploadFiles(String bizSeCd,
                            List<MultipartFile> files,
                            String actorId,
                            String actorType) throws Exception {

        if (hasNoFile(files)) {
            return null;
        }

        FileUploadContext ctx = prepareUpload(bizSeCd, actorId, actorType);

        for (MultipartFile file : files) {
            if (isEmpty(file)) {
                continue;
            }

            uploadSingleFile(ctx, file, null);
        }

        return ctx.tfgNo();
    }

    /**
     * 문서유형 코드별 파일 업로드
     */
    @Override
    @Transactional
    public Long uploadFiles(String bizSeCd,
                            Map<String, MultipartFile> filesByDocTyCd,
                            String actorId,
                            String actorType) throws Exception {

        if (hasNoFile(filesByDocTyCd)) {
            return null;
        }

        FileUploadContext ctx = prepareUpload(bizSeCd, actorId, actorType);

        for (Map.Entry<String, MultipartFile> entry : filesByDocTyCd.entrySet()) {
            MultipartFile file = entry.getValue();

            if (isEmpty(file)) {
                continue;
            }

            uploadSingleFile(ctx, file, entry.getKey());
        }

        return ctx.tfgNo();
    }

    /*
    수정 처리용 메서드
    기존 파일그룹(tfgNo)에 새 파일만 추가
    */
    @Override
    @Transactional
    public void uploadFilesToGroup(Long tfgNo,
                                   String bizSeCd,
                                   List<MultipartFile> files,
                                   String actorId,
                                   String actorType) throws Exception {

        if (tfgNo == null) {
            throw new IllegalArgumentException("파일그룹번호가 없습니다.");
        }

        if (hasNoFile(files)) {
            return;
        }

        String savePath = FileUploadUtil.makeDriveLogicalPath(bizSeCd, actorType);

        FileUploadContext ctx = new FileUploadContext(
                tfgNo,
                actorId,
                actorType,
                bizSeCd,
                savePath
        );

        for (MultipartFile file : files) {
            if (isEmpty(file)) {
                continue;
            }

            uploadSingleFile(ctx, file, null);
        }
    }

    // ================================================================== 조회

    @Override
    public List<FileInfoDTO> getFileList(Long tfgNo) {
        return fileMapper.selectFileList(tfgNo);
    }

    @Override
    public FileInfoDTO getFileInfo(Long fileNo) {
        return fileMapper.selectFileInfo(fileNo);
    }

    @Override
    public void deleteFile(Long dfiFileNo) {
        fileMapper.deleteFile(dfiFileNo);
    }

    // ================================================================== 공통 내부 로직

    /**
     * 파일그룹 생성 + Drive 논리 경로 생성
     *
     * 주의:
     * 여기서는 Google Drive 폴더 생성/조회 안 함.
     * 실제 Drive 작업은 DB commit 이후 비동기에서 처리함.
     */
    private FileUploadContext prepareUpload(String bizSeCd,
                                            String actorId,
                                            String actorType) {

        Long tfgNo = fileMapper.selectTfgNo();

        FileGroupDTO groupDTO = new FileGroupDTO();
        groupDTO.setTfgNo(tfgNo);
        groupDTO.setTfgBizSeCd(bizSeCd);

        fileMapper.insertFileGroup(groupDTO);

        String savePath = FileUploadUtil.makeDriveLogicalPath(bizSeCd, actorType);

        return new FileUploadContext(
                tfgNo,
                actorId,
                actorType,
                bizSeCd,
                savePath
        );
    }

    /**
     * 파일 1개 DB 등록 후 commit 이후 Drive 업로드 예약
     */
    private void uploadSingleFile(FileUploadContext ctx,
                                  MultipartFile file,
                                  String docTyCd) throws Exception {

        // 1. 저장 파일명 생성
        String saveName = FileUploadUtil.makeSaveName(file.getOriginalFilename());

        // 2. DB 저장용 파일정보 DTO 생성
        FileInfoDTO fileInfo = FileUploadUtil.buildFileInfo(
                file,
                ctx.actorId(),
                ctx.actorType(),
                ctx.bizSeCd(),
                saveName,
                ctx.savePath()
        );

        // 3. 아직 Drive 업로드 전 상태
        Long dfiNo = fileMapper.selectDfiNo();
        fileInfo.setDfiFileNo(dfiNo);
        fileInfo.setDfiDriveFileId(null);
        fileInfo.setDfiUploadSttsCd("UPLOADING");

        // 4. docs_file_data insert
        fileMapper.insertFileInfo(fileInfo);

        // 5. tacs_file_map insert
        FileMapDTO mapDTO = new FileMapDTO();
        mapDTO.setTfmNo(fileMapper.selectTfmNo());
        mapDTO.setTfmTfgNo(ctx.tfgNo());
        mapDTO.setTfmDfiNo(dfiNo);
        mapDTO.setTfmDocTyCd(docTyCd);

        fileMapper.insertFileMap(mapDTO);

        // 6. MultipartFile은 요청 종료 후 사라질 수 있으므로 byte[]로 복사
        byte[] fileBytes = file.getBytes();
        String contentType = file.getContentType();

        DriveUploadAsyncService.DriveUploadCommand command =
                new DriveUploadAsyncService.DriveUploadCommand(
                        dfiNo,
                        fileBytes,
                        saveName,
                        contentType,
                        ctx.savePath()
                );

        // 7. DB commit 성공 후에만 Google Drive 업로드 시작
        registerAfterCommitUpload(command);

        log.debug("파일 DB 등록 완료. Drive 업로드 대기: dfiNo={}, fileName={}", dfiNo, saveName);
    }

    /**
     * 트랜잭션 commit 이후 비동기 업로드 실행
     */
    private void registerAfterCommitUpload(DriveUploadAsyncService.DriveUploadCommand command) {

        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            driveUploadAsyncService.uploadAsync(command);
                        }
                    }
            );
        } else {
            // 혹시 트랜잭션 밖에서 호출될 경우 바로 비동기 실행
            driveUploadAsyncService.uploadAsync(command);
        }
    }

    // ================================================================== 검증 유틸

    private boolean hasNoFile(List<MultipartFile> files) {
        return files == null
                || files.stream().noneMatch(file -> file != null && !file.isEmpty());
    }

    private boolean hasNoFile(Map<String, MultipartFile> fileMap) {
        return fileMap == null
                || fileMap.values().stream().noneMatch(file -> file != null && !file.isEmpty());
    }

    private boolean isEmpty(MultipartFile file) {
        return file == null || file.isEmpty();
    }

    // ================================================================== 내부 컨텍스트

    private record FileUploadContext(
            Long tfgNo,
            String actorId,
            String actorType,
            String bizSeCd,
            String savePath
    ) {
    }

	@Override
	@Transactional
	public Long uploadGeneratedFile(String bizSeCd, byte[] fileBytes, String originalFileName, String mimeType,
			String docTyCd, String actorId, String actorType) throws Exception {
		
		// 서버에서 생성된 파일이 없으면 업로드하지 않음
		if (fileBytes == null || fileBytes.length == 0) {
			return null;
		}
		
		// 서버에 생성한 byte[] 파일을 MultipartFile처럼 감싸기
		ByteArrayMultipartFile file = new ByteArrayMultipartFile("file", originalFileName, mimeType, fileBytes);
		
		// 기존 공통 업로드 메서드가 Map<String, MultipartFile> 구조를 받으므로 맞춰줌
		Map<String, MultipartFile> filesByDocTyCd = new LinkedHashMap<>();
		filesByDocTyCd.put(docTyCd, file);
		
		// 기존 uploadFiles() 재사용
		// 여기서 DOCS_FILE_DATA, TACS_FILE_MAP 저장 후
		// commit 이후 DriveUploadAsyncService기 Google Drive에 업로드 함
		return uploadFiles(bizSeCd, filesByDocTyCd, actorId, actorType);
	}
}