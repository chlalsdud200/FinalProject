package kr.or.tacs.dto;

import lombok.Data;

@Data
public class FileInfoDTO {

    private Long dfiFileNo;

    private String dfiActorId;
    private String dfiActorType;

    private String dfiOrgNm;
    private String dfiStrNm;
    private Long dfiSize;
    private String dfiPath;

    private String dfiExt;
    private String dfiMimeTy;

    private String dfiDelYn;
    private String dfiBizTyCd;
    private String dfiDriveFileId;
    private String dfiUploadSttsCd;
}
