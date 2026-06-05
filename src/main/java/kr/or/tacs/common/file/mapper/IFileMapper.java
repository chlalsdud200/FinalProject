package kr.or.tacs.common.file.mapper;

import kr.or.tacs.dto.FileAccessContextDTO;
import kr.or.tacs.dto.FileGroupDTO;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.dto.FileMapDTO;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface IFileMapper {

    Long selectTfgNo();

    void insertFileGroup(FileGroupDTO groupDTO);

    Long selectDfiNo();

    void insertFileInfo(FileInfoDTO fileInfo);

    Long selectTfmNo();

    void insertFileMap(FileMapDTO mapDTO);

	List<FileInfoDTO> selectFileList(Long tfgNo);

	FileInfoDTO selectFileInfo(Long fileNo);

    /**
     * 파일이 속한 수입/수출 신고건의 참여자(소유 화주, 담당 관세사)를 조회한다.
     * 신고건과 연결되지 않은 파일이면 ownerId/brokerId 가 모두 null 로 반환된다.
     */
    FileAccessContextDTO selectFileAccessContext(Long fileNo);

    void updateDriveUploadSuccess(FileInfoDTO fileInfo);

    void updateDriveUploadFail(Long dfiFileNo);

    void deleteFile(Long dfiFileNo);

    /*
     * 수입검역신청 첨부파일 현장공무원 접근 권한 확인
     *
     * fileNo가 연결된 IMP_INS_REQ의 담당 현장공무원이
     * 현재 로그인한 officerId와 일치하는지 확인한다.
     */
	int selectImportInspectionFileAccessCount(@Param("fileNo") Long dfiFileNo, @Param("officerId") String userId);
	
	/*
	 * 검역 합격 증명서 파일 관세사 다운로드 권한 확인
	 *
	 * fileNo가 연결된 IMP_INS_CERT의 검역요청이
	 * 현재 로그인한 관세사의 수입의뢰 건인지 확인한다.
	 */
	int selectQuarantineCertFileAccessCount(@Param("fileNo") Long fileNo,
	                                        @Param("brokerId") String brokerId);
}
