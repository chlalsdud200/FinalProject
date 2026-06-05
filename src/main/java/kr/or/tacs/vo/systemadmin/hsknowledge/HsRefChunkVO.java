package kr.or.tacs.vo.systemadmin.hsknowledge;

import lombok.Data;

@Data
public class HsRefChunkVO {

    private Long hsRefChunkNo;
    private Long hsRefDocNo;
    private String hsDocId;
    private String hsParentDocumentId;
    private Integer hsChunkIndex;
    private String hsCode;
    private String hsRegistDt;
}
