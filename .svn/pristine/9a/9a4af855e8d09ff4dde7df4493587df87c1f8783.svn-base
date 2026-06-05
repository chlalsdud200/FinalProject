package kr.or.tacs.officer.basicscreen.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.dto.officer.ReceiptListDTO;

@Mapper
public interface IBasicMapper {

	List<ReceiptListDTO> selectReceiptList(ReceiptListDTO search);

    // 수입 접수: IMP_DCLR 상태 CSTM_REQ -> CSTM_ACPT + 담당자 저장
    int updateImportReceiptAccept(@Param("reqNo") String reqNo,
                                  @Param("officerId") String officerId);

    // 수입 담당자만 저장
    int updateImportOfficer(@Param("reqNo") String reqNo,
                            @Param("officerId") String officerId);

    // 수출 접수: EXP_DCLR 상태 CSTM_REQ -> CSTM_ACPT + 담당자 저장
    int updateExportReceiptAccept(@Param("reqNo") String reqNo,
                                  @Param("officerId") String officerId);

    // 수출 담당자만 저장
    int updateExportOfficer(@Param("reqNo") String reqNo,
                            @Param("officerId") String officerId);

    // 수입 반려: IMP_DCLR 상태 DCLR_REJ + 반려사유 저장
    int updateImportReject(@Param("reqNo") String reqNo,
                           @Param("rejectReason") String rejectReason,
                           @Param("officerId") String officerId);

    // 수출 반려: EXP_DCLR 상태 DCLR_REJ
    int updateExportReject(@Param("reqNo") String reqNo,
                           @Param("officerId") String officerId);

    // 반려사유 공통 저장: RJCT_MNG
    int insertRejectMng(@Param("refBizCd") String refBizCd,
                        @Param("refNo") String refNo,
                        @Param("rejectReason") String rejectReason,
                        @Param("rejecterId") String rejecterId,
                        @Param("targetId") String targetId);

    String selectImportOwnerId(@Param("reqNo") String reqNo);

    String selectExportOwnerId(@Param("reqNo") String reqNo);

    ReceiptListDTO selectRejectReason(@Param("reqNo") String reqNo);
}