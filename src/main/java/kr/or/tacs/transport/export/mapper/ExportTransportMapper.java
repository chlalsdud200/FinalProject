package kr.or.tacs.transport.export.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.transport.TransportInboundRequestVO;
import kr.or.tacs.vo.transport.TransportRequestVO;

@Mapper
public interface ExportTransportMapper {

    List<TransportRequestVO> retriveExpTransportReqList(@Param("tmId") String tmId);

    List<TransportInboundRequestVO> retriveExpInboundReqList(@Param("tmId") String tmId);

    List<TransportRequestVO> retriveExpManifestList(@Param("tmId") String tmId);

    int insertExpCargoManifest(TransportRequestVO vo);

    int updateExpCargoManifestSupplement(TransportRequestVO vo);

    int updateExpManifestSupplementSubmitted(TransportRequestVO vo);

    int updateExpManifestSupplementItemSubmitted(TransportRequestVO vo);

    int updateExpTransportReqStatus(@Param("trcNo") String trcNo,
                                           @Param("statusCd") String statusCd,
                                           @Param("rejectType") String rejectType,
                                           @Param("rejectMemo") String rejectMemo,
                                           @Param("rejectReason") String rejectReason);


    int insertExpInboundReq(@Param("trcNo") String trcNo,
                            @Param("wirNo") String wirNo,
                            @Param("wmId") String wmId,
                            @Param("wzNo") String wzNo,
                            @Param("inPlanDt") String inPlanDt,
                            @Param("cargoMgmtNo") String cargoMgmtNo,
                            @Param("invoiceNo") String invoiceNo,
                            @Param("incoTermsCd") String incoTermsCd,
                            @Param("remark") String remark);

    int updateExpInboundReq(@Param("trcNo") String trcNo,
                            @Param("wmId") String wmId,
                            @Param("wzNo") String wzNo,
                            @Param("inPlanDt") String inPlanDt,
                            @Param("cargoMgmtNo") String cargoMgmtNo,
                            @Param("invoiceNo") String invoiceNo,
                            @Param("incoTermsCd") String incoTermsCd,
                            @Param("remark") String remark);

    int countExpInboundReqByTrcNo(@Param("trcNo") String trcNo);

}
