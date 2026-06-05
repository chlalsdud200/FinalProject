package kr.or.tacs.dto.owner;

import lombok.Data;

import java.util.Date;

@Data
public class AisPortAliasDTO {

    private Long apaNo;
    private String apaPortCd;
    private String apaAliasNm;
    private String apaUseYn;
    private Date apaRegistDt;
}
