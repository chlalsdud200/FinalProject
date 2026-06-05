package kr.or.tacs.dto.common.docs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocsStorageDTO {
    // 최대 용량
    private Long maxCapa;

    // 사용 중 용량
    private Long usedCapa;

    // 사용률
    private Double usedPct;
}
