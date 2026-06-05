package kr.or.tacs.dto.owner;

import lombok.Data;

import java.util.Date;

@Data
public class OwnerTranDetailDTO {

    // TRAN_RCP
    private String trcNo;
    private Long trcTmNo;
    private String trcOwrId;
    private String trcShipNo;
    private String trcPortCd;
    private String trcDeptPortCd;
    private Long trcTfgNo;
    private String trcArvlPortCd;
    private String trcTrdrNm;
    private String trcTranMnCd;
    private String trcTranTyCd;
    private String trcIncoTermsCd;
    private String trcRqstCn;
    private String trcReviewRsltCn;
    private String trcRjctRsn;
    private Date trcRceptDt;
    private String trcSeCd;
    private String trcStatusCd;
    private Date trcRqstDt;
    private String trcRejType;
    private String trcRejMemo;
    private String trcOwrPicNm;
    private Date trcDlvyReqDt;
    private String trcItemCtgryNm;
    private String trcTrdrCountryCd;
    private Long trcBiNo;

    // 코드명/표시명 - COM_CODE 조인
    private String trcSeNm;
    private String trcStatusNm;
    private String trcTranMnNm;
    private String trcTranTyNm;
    private String trcIncoTermsNm;

    // PORT / COUNTRY 조인
    private String portNm;
    private String deptPortNm;
    private String arvlPortNm;
    private String trdrCountryNm;

    // TRANSPORT_MANAGER
    private Long tmNo;
    private String tmId;
    private String tmCpNm;
    private String tmCpTelno;
    private String tmMnCd;
    private String tmName;

    // DISPATCH
    private Long dispatchNo;
    private String dispatchTreId;
    private String dispatchOwrId;
    private Long dispatchCarNo;
    private String dispatchDrvNm;
    private String dispatchLoadgAdres;
    private String dispatchDrvTelno;
    private Date dispatchPickupDt;
    private String dispatchStatusCd;
    private String dispatchStatusNm;

    // IMP_ARRV_NTC
    private String ianNo;
    private String ianOwrId;
    private String ianSendSttsCd;
    private String ianSendSttsNm;
    private Date ianSendDt;
    private Date ianRegistDt;
    private String ianCurrLoc;
    private String ianArrvStatusCd;
    private String ianTrcNo;
    private String ianArrvStatusNm;
    private Date ianArrvDt;

    // BL_ISSU
    private String doStatusCd;
    private Long biNo;
    private String biTreId;
    private String biOwrId;
    private Long biTmNo;
    private Long biGgNo;
    private String biMblNo;
    private String biHblNo;
    private String biStatusCd;
    private String biStatusNm;
    private String biOwrMsg;
    private String biStlStatusCd;
    private String biStlStatusNm;
    private Long biXprotFee;
    private Long biWhFee;
    private Long biTtlAmt;
    private String biExpln;

    // TRAN_COST_STL - 정산을 여기서 볼 경우
    private String tcsNo;
    private String tcsTrcNo;
    private String tcsOwrId;
    private Long tcsGgNo;
    private String tcsMblNo;
    private String tcsHblNo;
    private String tcsBlStatusCd;
    private String tcsBlStatusNm;
    private String tcsOwrMsgCn;
    private String tcsStlStatusCd;
    private String tcsStlStatusNm;
    private Long tcsFrgtAmt;
    private Long tcsWhAmt;
    private Long tcsTotBillAmt;
    private String tcsStlExpln;
}