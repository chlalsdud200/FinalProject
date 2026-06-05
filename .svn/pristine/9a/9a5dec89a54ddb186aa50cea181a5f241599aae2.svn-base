package kr.or.tacs.vo.broker.quarantine;

import lombok.Data;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.tacs.dto.FileInfoDTO;

@Data
public class QuarantineVO {
    // IMP_INS_REQ
    private String iirReqNo;
    private String iirReqOfficerId;
    private String iirQrtnOfficerId;
    private String iirAplyNo;
    // 파일그룹번호
    private Long iirTfgNo;
    private String iirJrsdRgnAgCd;
    private String iirQrtnInstCd;
    private String iirRsnCn;
    private String iirStatusCd;
    private String iirStatusNm;
    private String iirDt;
    private String iirAssignDt;
    private String iirRplyDdlineDt;
    private String iirCmplDt;
    
    // =========================
    // IMP_INS_REQ 추가 컬럼
    // 수입검역신청 화면 입력값
    // =========================

    // 수출자 또는 공급자 이름
    private String iirExporterNm;

    // 수출자 회사명
    private String iirExporterCompanyNm;

    // 수출자 주소
    private String iirExporterAdres;

    // 수출국 코드
    private String iirExportCountryCd;

    // 원산지 코드
    private String iirOriginCountryCd;

    // 식물검역증명서 번호
    private String iirPhytoCertNo;

    // 식물검역증명서 발급일
    private String iirPhytoCertIssueDt;

    // 운송수단 구분
    private String iirTransportTypeCd;

    // 운송수단명
    private String iirTransportNm;

    // 선적항
    private String iirLoadPortCd;

    // 선적일
    private String iirShipDt;

    // 도착항
    private String iirArrvPortCd;

    // 도착일
    private String iirArrvDt;

    // 대표 검역대상 물품명
    private String iirMainGoodsNm;

    // 대표 HS코드
    private String iirMainHsCd;

    // 전체 포장 개수
    private String iirTotalPkgCnt;

    // 포장 단위
    private String iirPkgUnitCd;

    // 전체 총중량
    private String iirTotalWeight;

    // 포장 재질
    private String iirPkgMaterial;

    // 목재포장재 사용 여부
    private String iirWoodPkgYn;

    // 목재포장재 표시번호
    private String iirWoodPkgMarkNo;

    // 검역 대상 품목 목록
    private List<QuarantineItemVO> itemList;

    // 첨부파일 업로드용
    private MultipartFile[] attachFiles;
    
    // 보완서류 재제출 파일
    private MultipartFile[] supplementFiles;

    // 상세조회 첨부문서 표시용
    private List<FileInfoDTO> attachFileList;

    // IMP_INS_LOC
    private String iilNo;
    private String iilReqNo;
    private String iilWilNo;
    private String iilTyCd;
    private String iilNm;
    private String iilZip;
    private String iilAdres;
    private String iilDetailAdres;
    private String iilPlanDt;

    // IMP_INS_RESULT
    private String iirNo;
    private String iirImpInsReqNo;
    private String iirRsltOfficerId;
    private String iirResultStatusCd;
    private String iirResultStatusNm;
    private String iirResultCd;
    private String iirResultNm;
    private String iirResultFollowupCd;
    private String iirResultCn;
    private String iirResultDt;
    // 검역 결과 등록 담당자명
    private String iirRsltOfficerNm;

    // IMP_INS_HIS
    private String iihNo;
    private String iihEvtCd;
    private String iihBfStatusCd;
    private String iihAfStatusCd;
    private String iihCn;
    private String iihOccrDt;

    // IMP_RQST
    private String irNo;
    private String irOwrId;
    private String irBrokerId;
    private String irArrvPortCd;
    private String irStatusCd;
    private String irCstmIdfNo;
    private String irCorpRegNo;
    private String irArrvSchdYmd;
    private String irBlAwbNo;
    private String irDclrCurrCd;
    private Long irInvcAmt;
    private String irCn;
    private String irDt;
    private String impCgNo;
    private String irComment;

    // IMP_DCLR
    private String idIrNo;
    private String idStatusCd;
    private String idImprNm;
    private String idOvrssNm;
    private String idOvrssCd;
    private String idOvrssCntryCd;
    private String idTotPkgCnt;
    private String idTotWt;
    private String idCgoMngNo;
    private String idInspPlceCd;
    private String idArvlYmd;
    private String idShipoutCntryCd;
    private String idMblNo;
    private String idTrnspMnCd;

    // first item summary from IMP_DCLR_ITEM
    private String idiSn;
    private String idiHsCd;
    private String idiDclrGdsnm;
    private String idiTrdngGdsnm;
    private String idiQty;
    private String idiQtyUnitCd;
    private String idiNetWt;
    private String idiOrgnCntryCd;

    // aggregate item info
    private Integer itemCount;
    private String itemSummary;

    // broker info
    private String brokerNm;
    private String brokerOfficeNm;
    private String brokerTelno;
    private String brokerEmail;

    // search condition
    private String searchApplyNo;
    private String searchImporter;
    private String searchProductName;
    private String searchHsCode;
    private String searchResult;
    private String searchFromDate;
    private String searchToDate;

    // current login
    private String loginBrokerId;
    
    
    private String importerNm;
    private String importerCompanyNm;
    private String importerTelno;
    private String importerEmail;
    private String importerAdres;
    private String importerDetailAdres;
    
	 // =========================
	 // SUPP_RQST 보완요청/보완제출 정보
	 // =========================
	
	 // 보완요청번호
	 private String srNo;
	
	 // 관련 업무구분 코드
	 // 예: IMP_INS_REQ
	 private String srRefBizCd;
	
	 // 관련 업무번호
	 // 예: 검역요청번호
	 private String srRefNo;
	
	 // 발신자 ID
	 // 보완요청을 보낸 현장공무원 ID
	 private String senderId;
	
	 // 발신자 유형
	 // 현장공무원은 OFFICER
	 private String senderTyCd;
	
	 // 수신자 ID
	 // 보완요청을 받은 관세사 ID
	 private String receiverId;
	
	 // 수신자 유형
	 // 관세사는 BROKER
	 private String receiverTyCd;
	
	 // 보완요청 상태
	 // REQ: 보완요청, SUB: 보완제출완료, APR: 보완확인완료
	 private String srStatusCd;
	
	 // 화면 표시용 보완요청 상태명
	 private String srStatusNm;
	
	 // 보완요청일시
	 private String srReqDt;
	
	 // 보완제출일시
	 private String srSubmitDt;
	
	 // 보완확인일시
	 private String srApprDt;
	
	 // 검역기관이 작성한 보완요청 내용
	 private String srReqCn;
	
	 // 관세사가 작성한 보완제출 내용
	 private String srSubmitCn;
	 
	// =========================
	// 현장공무원 선택 목록 표시용
	// =========================

	// 현장공무원 ID
	private String officerId;

	// 기관명 또는 검역소명
	private String officerName;

	// 현장공무원명
	private String officerNm;

	// 소속기관 코드
	private String officerInstCd;

	// 부서 코드
	private String officerDeptCd;

}
