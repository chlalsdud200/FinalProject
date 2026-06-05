package kr.or.tacs.dto.officer.api;

import lombok.Data;

@Data
public class HsNavigationApiDTO {
    private String hsCode;
    private String chapter;
    private String heading;
    private String subHeading;
    private String itemName;
}