package kr.or.tacs.common.file.service;

import org.springframework.web.multipart.MultipartFile;

import kr.or.tacs.dto.FileInfoDTO;

import java.util.List;
import java.util.Map;

public interface IFileService {

    Long uploadFiles(String expRqst, List<MultipartFile> docFiles, String erOwrId, String actorType) throws Exception;

    Long uploadFiles(String bizSeCd, Map<String, MultipartFile> filesByDocTyCd, String actorId, String actorType) throws Exception;

    // 수정 처리용 메소드
    void uploadFilesToGroup(Long irTfgNo, String name, List<MultipartFile> docFiles, String irOwrId, String name1) throws Exception;

    // 서버에서 생성한 파일(byte[])을 공통 파일 업로드 모듈로 업로드
    // 예: 검역 합격 증명서 PDF처럼 사용자가 첨부한 파일이 아니라 서버에서 만든 파일

    Long uploadGeneratedFile(
            String bizSeCd,
            byte[] fileBytes,
            String originalFileName,
            String mimeType,
            String docTyCd,
            String actorId,
            String actorType
    ) throws Exception;

    List<FileInfoDTO> getFileList(Long tfgNo);
    //미리보기·다운로드용

    FileInfoDTO getFileInfo(Long fileNo);

    void deleteFile(Long dfiFileNo);
}
