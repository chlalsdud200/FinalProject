package kr.or.tacs.vo.systemadmin.hsknowledge;

import lombok.Data;

@Data
public class HsRefDocSearchResultVO {

    private Long hsRefDocNo;
    private Long hsRefChunkNo;
    private Integer chunkIndex;
    private String parentDocumentId;
    private String content;
    private Double score;
    private String fileOrgNm;
}
