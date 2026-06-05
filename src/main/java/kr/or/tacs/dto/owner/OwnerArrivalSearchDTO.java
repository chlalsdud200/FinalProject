package kr.or.tacs.dto.owner;

import kr.or.tacs.dto.PageDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class OwnerArrivalSearchDTO extends PageDTO {

    private String owrId;        // 로그인 화주
    private String sendSttsCd;   // 발송상태 필터 (TRC_NTC_NSENT / TRC_NTC_SENT)

    // keyword(PageDTO): 통지서번호 · 운송의뢰번호 · 현재위치 통합검색
}
