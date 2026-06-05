package kr.or.tacs.cmmenums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TacsPayRcTy {

    FREIGHT("FREIGHT", "운임비"),
    BROKER_CHARGE("BROKER_CHARGE", "관세사 청구");

    private final String code;
    private final String label;
}
