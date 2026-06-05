package kr.or.tacs.cmmenums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TacsSuppSt {

    REQ("REQ", "보완요청"),
    SUB("SUB", "보완제출");

    private final String code;
    private final String label;
}
