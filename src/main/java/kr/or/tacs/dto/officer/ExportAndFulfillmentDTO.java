package kr.or.tacs.dto.officer;

/**
 * 행정공무원 - 반출 및 이행 관리 화면 DTO
 *
 * 실제 DB 테이블을 화면용으로 합쳐서 보여주기 위한 DTO입니다.
 * - 수입 반출: IMP_DCLR / IMP_RQST / WH_IN_RPT / WAREHOUSE 계열
 * - 수출 적재이행: EXP_DCLR / EXP_RQST / EXP_CARGO_MANIFEST / BL_ISSU 계열
 */
public class ExportAndFulfillmentDTO {

    private String workType;       // IMP_REL / IMM_REL / EXP_LOAD
    private String workTypeNm;     // 수입 반출 / 즉시반출 / 수출 적재이행
    private String detailType;     // import-release / immediate-release / export-loading

    private String reqNo;          // 신고번호
    private String declareType;    // IMPORT / EXPORT
    private String declareTypeNm;  // 수입 / 수출

    private String ownerId;        // 화주 ID
    private String ownerName;      // 화주명/업체명
    private String goodsName;      // 대표품명

    private String cargoMngNo;     // 화물관리번호
    private String goodsGroupNo;   // 물품그룹번호
    private String blNo;           // 대표 B/L 번호
    private String mblNo;          // MBL 번호
    private String hblNo;          // HBL 번호

    private String placeName;      // 창고/구역 또는 선적 관련 정보
    private String whName;         // 창고명
    private String zoneName;       // 창고구역명
    private String loadPort;       // 선적항
    private String arrivalPort;    // 도착항

    private String baseDate;       // 기준일
    private String declareDate;    // 신고일
    private String approveDate;    // 수리일
    private String requestDate;    // 반출요청/적재제출일

    private String statusCd;       // 원본 상태코드
    private String statusNm;       // 화면 표시 상태명
    private String statusClass;    // badge-progress / badge-done / badge-wait / badge-fail

    private String totalQty;       // 총수량
    private String totalWeight;    // 총중량
    private String memo;           // 비고/요청내용

    public String getWorkType() { return workType; }
    public void setWorkType(String workType) { this.workType = workType; }

    public String getWorkTypeNm() { return workTypeNm; }
    public void setWorkTypeNm(String workTypeNm) { this.workTypeNm = workTypeNm; }

    public String getDetailType() { return detailType; }
    public void setDetailType(String detailType) { this.detailType = detailType; }

    public String getReqNo() { return reqNo; }
    public void setReqNo(String reqNo) { this.reqNo = reqNo; }

    public String getDeclareType() { return declareType; }
    public void setDeclareType(String declareType) { this.declareType = declareType; }

    public String getDeclareTypeNm() { return declareTypeNm; }
    public void setDeclareTypeNm(String declareTypeNm) { this.declareTypeNm = declareTypeNm; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getGoodsName() { return goodsName; }
    public void setGoodsName(String goodsName) { this.goodsName = goodsName; }

    public String getCargoMngNo() { return cargoMngNo; }
    public void setCargoMngNo(String cargoMngNo) { this.cargoMngNo = cargoMngNo; }

    public String getGoodsGroupNo() { return goodsGroupNo; }
    public void setGoodsGroupNo(String goodsGroupNo) { this.goodsGroupNo = goodsGroupNo; }

    public String getBlNo() { return blNo; }
    public void setBlNo(String blNo) { this.blNo = blNo; }

    public String getMblNo() { return mblNo; }
    public void setMblNo(String mblNo) { this.mblNo = mblNo; }

    public String getHblNo() { return hblNo; }
    public void setHblNo(String hblNo) { this.hblNo = hblNo; }

    public String getPlaceName() { return placeName; }
    public void setPlaceName(String placeName) { this.placeName = placeName; }

    public String getWhName() { return whName; }
    public void setWhName(String whName) { this.whName = whName; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public String getLoadPort() { return loadPort; }
    public void setLoadPort(String loadPort) { this.loadPort = loadPort; }

    public String getArrivalPort() { return arrivalPort; }
    public void setArrivalPort(String arrivalPort) { this.arrivalPort = arrivalPort; }

    public String getBaseDate() { return baseDate; }
    public void setBaseDate(String baseDate) { this.baseDate = baseDate; }

    public String getDeclareDate() { return declareDate; }
    public void setDeclareDate(String declareDate) { this.declareDate = declareDate; }

    public String getApproveDate() { return approveDate; }
    public void setApproveDate(String approveDate) { this.approveDate = approveDate; }

    public String getRequestDate() { return requestDate; }
    public void setRequestDate(String requestDate) { this.requestDate = requestDate; }

    public String getStatusCd() { return statusCd; }
    public void setStatusCd(String statusCd) { this.statusCd = statusCd; }

    public String getStatusNm() { return statusNm; }
    public void setStatusNm(String statusNm) { this.statusNm = statusNm; }

    public String getStatusClass() { return statusClass; }
    public void setStatusClass(String statusClass) { this.statusClass = statusClass; }

    public String getTotalQty() { return totalQty; }
    public void setTotalQty(String totalQty) { this.totalQty = totalQty; }

    public String getTotalWeight() { return totalWeight; }
    public void setTotalWeight(String totalWeight) { this.totalWeight = totalWeight; }

    public String getMemo() { return memo; }
    public void setMemo(String memo) { this.memo = memo; }
}
