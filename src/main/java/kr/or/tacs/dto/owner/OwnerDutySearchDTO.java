package kr.or.tacs.dto.owner;

import kr.or.tacs.dto.PageDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class OwnerDutySearchDTO extends PageDTO {

    // 로그인 화주 ID
    private String owrId;

    // 날짜 검색 기준
    // CHARGE  : 청구일
    // PAY_REQ : 결제요청일
    // PAY_CMPL: 납부완료일
    private String dateType = "CHARGE";
}