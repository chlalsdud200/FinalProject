package kr.or.tacs.dto.owner;

import kr.or.tacs.dto.PageDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class OwnerImportSearchDTO extends PageDTO {

    private String owrId;

    // 검색조건
    private String irNo;        // 의뢰번호
    private String statusCd;    // 상태
    private String startDate;   // 요청일 시작
    private String endDate;     // 요청일 종료
    private String blAwbNo;     // B/L 또는 AWB 번호
    private String brokerNm;    // 관세사명
    private String keyword;     // 품목/내용
}