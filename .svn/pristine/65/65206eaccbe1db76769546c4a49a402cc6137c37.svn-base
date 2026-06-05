package kr.or.tacs.officer.basicscreen.service;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import kr.or.tacs.dto.officer.BasicScreenDetailDTO;
import kr.or.tacs.officer.basicscreen.mapper.IScreenDetailMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CertificatePdfService {

    private final IScreenDetailMapper mapper;

    public byte[] createCertificatePdf(String reqNo) throws Exception {
        if (reqNo == null || reqNo.trim().isEmpty()) {
            throw new IllegalArgumentException("신고번호가 없습니다.");
        }

        boolean isImport = reqNo.startsWith("IMP");

        BasicScreenDetailDTO detail = isImport
                ? mapper.selectImportDetail(reqNo)
                : mapper.selectExportDetail(reqNo);

        List<BasicScreenDetailDTO> items = isImport
                ? mapper.selectImportItems(reqNo)
                : mapper.selectExportItems(reqNo);

        if (detail == null) {
            throw new IllegalArgumentException("신고 상세정보가 없습니다. reqNo=" + reqNo);
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(document, baos);
        document.open();

        BaseFont baseFont = BaseFont.createFont(
                "C:/Windows/Fonts/malgun.ttf",
                BaseFont.IDENTITY_H,
                BaseFont.EMBEDDED
        );

        Font titleFont = new Font(baseFont, 18, Font.BOLD);
        Font subTitleFont = new Font(baseFont, 11, Font.NORMAL);
        Font headFont = new Font(baseFont, 9, Font.BOLD);
        Font bodyFont = new Font(baseFont, 9, Font.NORMAL);
        Font smallFont = new Font(baseFont, 8, Font.NORMAL);

        String title = isImport ? "수 입 신 고 필 증" : "수 출 신 고 필 증";
        String subTitle = isImport ? "(IMPORT DECLARATION)" : "(EXPORT DECLARATION)";

        Paragraph titleP = new Paragraph(title, titleFont);
        titleP.setAlignment(Element.ALIGN_CENTER);
        document.add(titleP);

        Paragraph subP = new Paragraph(subTitle, subTitleFont);
        subP.setAlignment(Element.ALIGN_CENTER);
        subP.setSpacingAfter(15);
        document.add(subP);

        PdfPTable topTable = new PdfPTable(4);
        topTable.setWidthPercentage(100);
        topTable.setWidths(new float[] { 18, 32, 18, 32 });

        addCell(topTable, "신고번호", headFont);
        addCell(topTable, safe(detail.getReqNo()), bodyFont);
        addCell(topTable, "신고일자", headFont);
        addCell(topTable, safe(detail.getRequestDate()), bodyFont);

        addCell(topTable, "신고구분", headFont);
        addCell(topTable, isImport ? "수입신고" : "수출신고", bodyFont);
        addCell(topTable, "수리일자", headFont);
        addCell(topTable, nowText(), bodyFont);

        addCell(topTable, isImport ? "수입자" : "수출화주", headFont);
        addCell(topTable, safe(detail.getCompanyName()), bodyFont);
        addCell(topTable, "관세사", headFont);
        addCell(topTable, safe(detail.getBrokerName()), bodyFont);

        addCell(topTable, "통관고유번호", headFont);
        addCell(topTable, safe(detail.getCustomsIdNo()), bodyFont);
        addCell(topTable, "법인등록번호", headFont);
        addCell(topTable, safe(detail.getCorpRegNo()), bodyFont);

        document.add(topTable);

        document.add(sectionTitle("물류 및 금액 정보", headFont));

        PdfPTable infoTable = new PdfPTable(4);
        infoTable.setWidthPercentage(100);
        infoTable.setWidths(new float[] { 18, 32, 18, 32 });

        addCell(infoTable, isImport ? "B/L·AWB 번호" : "운송정보", headFont);
        addCell(infoTable, safe(detail.getBlNo()), bodyFont);
        addCell(infoTable, isImport ? "입항항" : "적재항", headFont);
        addCell(infoTable, safe(detail.getArrivalPort()), bodyFont);

        addCell(infoTable, "통화코드", headFont);
        addCell(infoTable, safe(detail.getCurrencyCode()), bodyFont);
        addCell(infoTable, "신고금액", headFont);
        addCell(infoTable, safe(detail.getAmount()), bodyFont);

        addCell(infoTable, "원산지", headFont);
        addCell(infoTable, safe(detail.getOrigin()), bodyFont);
        addCell(infoTable, "담당공무원", headFont);
        addCell(infoTable, safe(detail.getOfficerName()), bodyFont);

        document.add(infoTable);

        document.add(sectionTitle("란 별 상 세 내 역 (ITEM DETAILS)", headFont));

        PdfPTable itemTable = new PdfPTable(6);
        itemTable.setWidthPercentage(100);
        itemTable.setWidths(new float[] { 8, 18, 34, 12, 12, 16 });

        addCell(itemTable, "란번호", headFont);
        addCell(itemTable, "HS 부호", headFont);
        addCell(itemTable, "품명 및 규격", headFont);
        addCell(itemTable, "원산지", headFont);
        addCell(itemTable, "수량", headFont);
        addCell(itemTable, isImport ? "과세가격" : "신고가격", headFont);

        if (items != null && !items.isEmpty()) {
            for (BasicScreenDetailDTO item : items) {
                addCell(itemTable, String.format("%02d", item.getItemNo()), bodyFont);
                addCell(itemTable, safe(item.getHsCode()), bodyFont);
                addCell(itemTable, safe(item.getItemName()) + "\n" + safe(item.getTradeItemName()), bodyFont);
                addCell(itemTable, safe(item.getOrigin()), bodyFont);
                addCell(itemTable, safe(item.getQty()), bodyFont);
                addCell(itemTable, safe(item.getAmount()), bodyFont);
            }
        } else {
            PdfPCell empty = new PdfPCell(new Phrase("품목 정보가 없습니다.", bodyFont));
            empty.setColspan(6);
            empty.setPadding(6);
            itemTable.addCell(empty);
        }

        document.add(itemTable);

        document.add(sectionTitle(isImport ? "세액 계산 및 총계" : "총량 및 세관 기재사항", headFont));

        PdfPTable bottomTable = new PdfPTable(2);
        bottomTable.setWidthPercentage(100);
        bottomTable.setWidths(new float[] { 25, 75 });

        if (isImport) {
            addCell(bottomTable, "세액 내역", headFont);
            addCell(bottomTable, buildImportTaxText(items), bodyFont);
        } else {
            addCell(bottomTable, "수출요건확인", headFont);
            addCell(bottomTable, "본 물품은 관세법 및 관련 법령에 의하여 적법하게 수출신고 되었으므로 수출신고필증을 발급합니다.", bodyFont);
        }

        addCell(bottomTable, "세관기재사항", headFont);
        addCell(bottomTable, isImport
                ? "위 물품은 관세법 및 관련 법령에 의하여 적법하게 수입신고 되었으므로 수입신고필증을 발급합니다."
                : "수리일로부터 정해진 기간 내 적재하여야 하며, 미적재 시 수출신고 수리가 취소될 수 있습니다.",
                bodyFont);

        document.add(bottomTable);

        Paragraph footer = new Paragraph("\n관세청 관세행정시스템 출력본", smallFont);
        footer.setAlignment(Element.ALIGN_RIGHT);
        document.add(footer);

        document.close();

        return baos.toByteArray();
    }

    private Paragraph sectionTitle(String text, Font font) {
        Paragraph p = new Paragraph("\n" + text, font);
        p.setSpacingBefore(8);
        p.setSpacingAfter(6);
        return p;
    }

    private void addCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(safe(text), font));
        cell.setPadding(5);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.addCell(cell);
    }

    private String buildImportTaxText(List<BasicScreenDetailDTO> items) {
        long taxTotal = 0L;
        long vatTotal = 0L;

        if (items != null) {
            for (BasicScreenDetailDTO item : items) {
                taxTotal += parseMoney(item.getTaxAmt());
                vatTotal += parseMoney(item.getVatAmount());
            }
        }

        long total = taxTotal + vatTotal;

        return "관세: " + formatMoney(taxTotal) + " 원\n"
             + "부가세: " + formatMoney(vatTotal) + " 원\n"
             + "세액 합계: " + formatMoney(total) + " 원";
    }

    private long parseMoney(String value) {
        if (value == null) return 0L;
        try {
            return Long.parseLong(value.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 0L;
        }
    }

    private String formatMoney(long value) {
        return String.format("%,d", value);
    }

    private String safe(String value) {
        return value == null || value.trim().isEmpty() ? "-" : value;
    }

    private String nowText() {
        return java.time.LocalDate.now().toString();
    }
}