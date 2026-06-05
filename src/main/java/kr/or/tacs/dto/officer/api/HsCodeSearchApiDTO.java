package kr.or.tacs.dto.officer.api;

import lombok.Data;

@Data
public class HsCodeSearchApiDTO {
    private String hsCode;
    private String koreanName;
    private String englishName;
    private String startDate;
    private String endDate;
}