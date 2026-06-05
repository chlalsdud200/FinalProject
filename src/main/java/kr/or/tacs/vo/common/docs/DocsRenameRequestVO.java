package kr.or.tacs.vo.common.docs;

import lombok.Data;

@Data
public class DocsRenameRequestVO {

    /*
     * 수정할 대상 ID
     * 파일이면 file-1
     * 폴더면 folder-1
     */
    private String id;

    /*
     * 변경할 이름
     */
    private String name;
}