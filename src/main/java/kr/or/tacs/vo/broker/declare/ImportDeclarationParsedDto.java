package kr.or.tacs.vo.broker.declare;

import java.math.BigDecimal;
import java.util.List;

/**
 * 첨부 PDF 들 (Invoice, Packing List, B/L, Phytosanitary Cert 등) 을
 * Gemini 가 종합 파싱한 결과 DTO.
 *
 *  · Spring AI 의 ChatClient.entity(ImportDeclarationParsedDto.class) 로 자동 매핑
 *  · 각 필드의 출처(우선순위) 는 프롬프트에 명시
 *  · null 허용 — 문서에 없으면 null 그대로
 */
public class ImportDeclarationParsedDto {

    // ===== 수입자(Consignee) — B/L 우선 =====
    private String importerName;
    private String importerAddress;
    private String importerBizNo;
    private String importerCustomsCode;

    // ===== 수출자/해외공급자(Shipper) — B/L 우선 =====
    private String exporterName;
    private String exporterAddress;
    /** ISO 3166-1 alpha-2 (예: KR, CN, US) */
    private String exporterCountryCode;

    // ===== 운송 정보 — B/L only =====
    private String blNumber;
    private String vesselName;
    private String departurePort;
    private String departurePortCode;
    private String arrivalPort;
    private String arrivalPortCode;
    /** YYYY-MM-DD */
    private String arrivalDate;
    /** Sea / Air / Land */
    private String meansOfTransport;
    private String containerType;

    // ===== 거래 조건 — Invoice 우선 =====
    /** FOB / CIF / CFR / EXW */
    private String incoterms;
    /** ISO 4217: USD / KRW / EUR */
    private String paymentCurrency;
    private BigDecimal totalInvoiceAmount;
    private BigDecimal exchangeRate;
    private String invoiceNumber;
    /** YYYY-MM-DD */
    private String invoiceDate;

    // ===== 포장/중량 — Packing List 우선 =====
    private Integer totalPackageCount;
    /** BAGS / BOXES / CTNS / PALLETS 등 */
    private String packageUnit;
    /** KG */
    private BigDecimal totalNetWeight;
    /** KG */
    private BigDecimal totalGrossWeight;

    // ===== 원산지 =====
    private String originCountryCode;
    /** Y / N (원산지증명서 첨부 여부) */
    private String originCertificateYn;

    // ===== 검역 — Phytosanitary Cert only =====
    private String phytoCertRefNo;
    /** YYYY-MM-DD */
    private String phytoIssueDate;

    // ===== 품목 리스트 (Invoice + Packing List + Phyto 융합) =====
    private List<ParsedItemDto> items;

    /** 품목 1행 */
    public static class ParsedItemDto {
        /** Invoice 우선 */
        private String productName;
        /** Phyto Cert (학명) */
        private String botanicalName;
        /** HS코드 (10자리) — Invoice 명시 없으면 AI 추정 가능 */
        private String hsCode;
        /** Packing List 우선 */
        private BigDecimal quantity;
        private String quantityUnit;
        /** Invoice */
        private BigDecimal unitPrice;
        private BigDecimal amount;
        /** Packing List */
        private BigDecimal netWeight;
        /** ISO 2자리 */
        private String originCountryCode;
        /** 상표 (Invoice/Packing) */
        private String brandName;

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getBotanicalName() { return botanicalName; }
        public void setBotanicalName(String botanicalName) { this.botanicalName = botanicalName; }
        public String getHsCode() { return hsCode; }
        public void setHsCode(String hsCode) { this.hsCode = hsCode; }
        public BigDecimal getQuantity() { return quantity; }
        public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
        public String getQuantityUnit() { return quantityUnit; }
        public void setQuantityUnit(String quantityUnit) { this.quantityUnit = quantityUnit; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public BigDecimal getNetWeight() { return netWeight; }
        public void setNetWeight(BigDecimal netWeight) { this.netWeight = netWeight; }
        public String getOriginCountryCode() { return originCountryCode; }
        public void setOriginCountryCode(String originCountryCode) { this.originCountryCode = originCountryCode; }
        public String getBrandName() { return brandName; }
        public void setBrandName(String brandName) { this.brandName = brandName; }
    }

    // ===== getters / setters =====
    public String getImporterName() { return importerName; }
    public void setImporterName(String importerName) { this.importerName = importerName; }
    public String getImporterAddress() { return importerAddress; }
    public void setImporterAddress(String importerAddress) { this.importerAddress = importerAddress; }
    public String getImporterBizNo() { return importerBizNo; }
    public void setImporterBizNo(String importerBizNo) { this.importerBizNo = importerBizNo; }
    public String getImporterCustomsCode() { return importerCustomsCode; }
    public void setImporterCustomsCode(String importerCustomsCode) { this.importerCustomsCode = importerCustomsCode; }
    public String getExporterName() { return exporterName; }
    public void setExporterName(String exporterName) { this.exporterName = exporterName; }
    public String getExporterAddress() { return exporterAddress; }
    public void setExporterAddress(String exporterAddress) { this.exporterAddress = exporterAddress; }
    public String getExporterCountryCode() { return exporterCountryCode; }
    public void setExporterCountryCode(String exporterCountryCode) { this.exporterCountryCode = exporterCountryCode; }
    public String getBlNumber() { return blNumber; }
    public void setBlNumber(String blNumber) { this.blNumber = blNumber; }
    public String getVesselName() { return vesselName; }
    public void setVesselName(String vesselName) { this.vesselName = vesselName; }
    public String getDeparturePort() { return departurePort; }
    public void setDeparturePort(String departurePort) { this.departurePort = departurePort; }
    public String getDeparturePortCode() { return departurePortCode; }
    public void setDeparturePortCode(String departurePortCode) { this.departurePortCode = departurePortCode; }
    public String getArrivalPort() { return arrivalPort; }
    public void setArrivalPort(String arrivalPort) { this.arrivalPort = arrivalPort; }
    public String getArrivalPortCode() { return arrivalPortCode; }
    public void setArrivalPortCode(String arrivalPortCode) { this.arrivalPortCode = arrivalPortCode; }
    public String getArrivalDate() { return arrivalDate; }
    public void setArrivalDate(String arrivalDate) { this.arrivalDate = arrivalDate; }
    public String getMeansOfTransport() { return meansOfTransport; }
    public void setMeansOfTransport(String meansOfTransport) { this.meansOfTransport = meansOfTransport; }
    public String getContainerType() { return containerType; }
    public void setContainerType(String containerType) { this.containerType = containerType; }
    public String getIncoterms() { return incoterms; }
    public void setIncoterms(String incoterms) { this.incoterms = incoterms; }
    public String getPaymentCurrency() { return paymentCurrency; }
    public void setPaymentCurrency(String paymentCurrency) { this.paymentCurrency = paymentCurrency; }
    public BigDecimal getTotalInvoiceAmount() { return totalInvoiceAmount; }
    public void setTotalInvoiceAmount(BigDecimal totalInvoiceAmount) { this.totalInvoiceAmount = totalInvoiceAmount; }
    public BigDecimal getExchangeRate() { return exchangeRate; }
    public void setExchangeRate(BigDecimal exchangeRate) { this.exchangeRate = exchangeRate; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public String getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(String invoiceDate) { this.invoiceDate = invoiceDate; }
    public Integer getTotalPackageCount() { return totalPackageCount; }
    public void setTotalPackageCount(Integer totalPackageCount) { this.totalPackageCount = totalPackageCount; }
    public String getPackageUnit() { return packageUnit; }
    public void setPackageUnit(String packageUnit) { this.packageUnit = packageUnit; }
    public BigDecimal getTotalNetWeight() { return totalNetWeight; }
    public void setTotalNetWeight(BigDecimal totalNetWeight) { this.totalNetWeight = totalNetWeight; }
    public BigDecimal getTotalGrossWeight() { return totalGrossWeight; }
    public void setTotalGrossWeight(BigDecimal totalGrossWeight) { this.totalGrossWeight = totalGrossWeight; }
    public String getOriginCountryCode() { return originCountryCode; }
    public void setOriginCountryCode(String originCountryCode) { this.originCountryCode = originCountryCode; }
    public String getOriginCertificateYn() { return originCertificateYn; }
    public void setOriginCertificateYn(String originCertificateYn) { this.originCertificateYn = originCertificateYn; }
    public String getPhytoCertRefNo() { return phytoCertRefNo; }
    public void setPhytoCertRefNo(String phytoCertRefNo) { this.phytoCertRefNo = phytoCertRefNo; }
    public String getPhytoIssueDate() { return phytoIssueDate; }
    public void setPhytoIssueDate(String phytoIssueDate) { this.phytoIssueDate = phytoIssueDate; }
    public List<ParsedItemDto> getItems() { return items; }
    public void setItems(List<ParsedItemDto> items) { this.items = items; }
}
