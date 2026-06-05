package kr.or.tacs.cmmenums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TacsBizCd {
	// 디비에 있는데 왜 이렇게 관리를 하냐
    IMPORT("IMPORT", "수입통관"),
    EXPORT("EXPORT", "수출통관");

    private final String code;
    private final String label;
    
}
