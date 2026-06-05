package kr.or.tacs.owner.payment.mapper;

import kr.or.tacs.dto.owner.OwnerPayRecordDTO;
import kr.or.tacs.dto.owner.OwnerPaymentTargetDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface IOwnerPaymentMapper {
    OwnerPaymentTargetDTO selectFreightPaymentTarget(@Param("claimNo") String claimNo,@Param("owrId") String owrId);

    OwnerPaymentTargetDTO selectBrokerPaymentTarget(@Param("claimNo") String claimNo, @Param("owrId") String owrId);

    void insertPayReady(OwnerPayRecordDTO payRecord);

    OwnerPayRecordDTO selectPayRecordByPaymentId(String orderId);

    void updatePayDone(OwnerPayRecordDTO updateRecord);

    void updateFreightPaid(OwnerPayRecordDTO payRecord);

    void updateBrokerPaid(OwnerPayRecordDTO payRecord);

    void updatePayFail(OwnerPayRecordDTO payRecord);

    void insertPayFailed(Map<String, Object> failMap);

    String selectIrNoByClaimNo(@Param("claimNo") String claimNo, @Param("recordTy") String recordTy);

    /** 운임정산번호(TCS_NO)로 운송의뢰번호(TRC_NO) 조회 — 정산완료 알림 refKey용 */
    String selectTrcNoByTcsNo(@Param("claimNo") String claimNo);

    OwnerPayRecordDTO selectPaymentReceipt(Map<String, Object> paramMap);

    void updateImportTaxPaid(OwnerPayRecordDTO payRecord);

    void updateBrokerPayFail(OwnerPayRecordDTO payRecord);

    void updateCustomsTax(OwnerPayRecordDTO payRecord);
}
