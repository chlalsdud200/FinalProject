package kr.or.tacs.vo.systemadmin.hsknowledge;

import lombok.Data;

@Data
public class HsRefDocVO {

    private Long hsRefDocNo;
    private Long tfgNo;
    private String hsParentDocumentId;
    private Integer hsTotalChunks;
    private String hsMilvusCollection;
    private String hsEmbeddingModel;
    private String hsEmbedStatusCd;
    private String hsUseYn;
    private String hsRegistDt;
    private String hsUpdtDt;

    private String fileOrgNm;
    private Long fileNo;
    private Long fileSize;
}
