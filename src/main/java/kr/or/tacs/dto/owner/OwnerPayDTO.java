package kr.or.tacs.dto.owner;

import lombok.Data;

@Data
public class OwnerPayDTO {

    public String claimNo;      // TCS_NO 또는 BC_NO
    public String recordTy;     // FREIGHT 또는 BROKER
}
