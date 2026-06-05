package kr.or.tacs.common.util;

import kr.or.tacs.dto.FileInfoDTO;
import org.springframework.web.multipart.MultipartFile;

import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.UUID;

public class FileUploadUtil {

    /**
     * Google Drive에 저장할 파일명 생성
     * ex) UUID_상업송장.pdf
     */
    public static String makeSaveName(String originalFilename) {

        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("원본 파일명이 없습니다.");
        }

        return UUID.randomUUID() + "_" + originalFilename;
    }

    /**
     * Google Drive 논리 경로 생성
     *
     * ex)
     * tfgBizSeCd = CSTM_REQ
     * actorType = OWNER
     *
     * return /CSTM_REQ/OWNER/2026/05/13
     */
    public static String makeDriveLogicalPath(String tfgBizSeCd,
                                              String actorType) {

        if (tfgBizSeCd == null || tfgBizSeCd.isBlank()) {
            throw new IllegalArgumentException("파일그룹 업무구분코드가 없습니다.");
        }

        if (actorType == null || actorType.isBlank()) {
            throw new IllegalArgumentException("파일 등록자 액터 타입이 없습니다.");
        }

        Calendar cal = Calendar.getInstance();

        String year = String.valueOf(cal.get(Calendar.YEAR));
        String month = new DecimalFormat("00").format(cal.get(Calendar.MONTH) + 1);
        String day = new DecimalFormat("00").format(cal.get(Calendar.DATE));

        return "/" + tfgBizSeCd + "/" + actorType + "/" + year + "/" + month + "/" + day;
    }

    /**
     * DB 저장용 FileInfoDTO 생성
     *
     * 실제 파일 저장은 하지 않음.
     * Google Drive 업로드 후 받은 driveFileId는 서비스에서 따로 set 해야 함.
     */
    public static FileInfoDTO buildFileInfo(MultipartFile file,
                                            String actorId,
                                            String actorType,
                                            String bizTyCd,
                                            String saveName,
                                            String savePath) throws Exception {

        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("원본 파일명이 없습니다.");
        }

        FileInfoDTO fileInfo = new FileInfoDTO();

        fileInfo.setDfiActorId(actorId);
        fileInfo.setDfiActorType(actorType);
        fileInfo.setDfiBizTyCd(bizTyCd);
        fileInfo.setDfiDelYn("N");

        fileInfo.setDfiOrgNm(originalFilename);
        fileInfo.setDfiStrNm(saveName);
        fileInfo.setDfiPath(savePath);
        fileInfo.setDfiExt(getExtension(originalFilename));
        fileInfo.setDfiMimeTy(normalizeMimeType(file.getContentType(), originalFilename));
        fileInfo.setDfiSize(file.getSize());

        return fileInfo;
    }

    /**
     * 확장자 추출
     * ex) 상업송장.pdf -> pdf
     */
    private static String getExtension(String originalFilename) {

        if (originalFilename == null || originalFilename.isBlank()) {
            return "";
        }

        int dotIndex = originalFilename.lastIndexOf(".");

        if (dotIndex == -1 || dotIndex == originalFilename.length() - 1) {
            return "";
        }

        return originalFilename.substring(dotIndex + 1).toLowerCase();
    }

    /**
     * MIME 타입 정리
     *
     * 현재 DB 컬럼 길이가 짧으면 긴 MIME 타입 때문에 insert 오류가 날 수 있으므로
     * 기존 로직처럼 20자 제한 대응 유지.
     */
    private static String normalizeMimeType(String mimeType, String originalFilename) {

        if (mimeType == null || mimeType.isBlank()) {
            return null;
        }

        if (mimeType.length() <= 20) {
            return mimeType;
        }

        String extension = getExtension(originalFilename);

        if (!extension.isBlank()) {
            String shortMimeType = "application/" + extension;

            if (shortMimeType.length() <= 20) {
                return shortMimeType;
            }
        }

        return mimeType.substring(0, 20);
    }
}