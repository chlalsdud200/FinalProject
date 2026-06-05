package kr.or.tacs.dto.common.docs;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocsListResponseDTO {
    // 현재 폴더의 폴더 + 파일 목록
    private List<DocsItemDTO> items;

    // 현재 위치 경로
    private List<DocsFolderDTO> breadcrumb;

    // 저장공간 정보
    private DocsStorageDTO storage;
}
