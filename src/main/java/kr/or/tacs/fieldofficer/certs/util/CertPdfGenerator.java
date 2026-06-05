package kr.or.tacs.fieldofficer.certs.util;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import kr.or.tacs.dto.fieldofficer.certs.CertPdfIssueResultDTO;
import kr.or.tacs.dto.fieldofficer.certs.CertsDTO;

/**
 * 현장공무원(검역기관) - 검역 합격 증명서 PDF 생성기
 * 
 * 역할:
 * 1. DB에서 조회한 검역/증명서 정보를 PDF 문서로 변환
 * 2. 생성된 PDF를 byte[]로 반환
 * 3. Controller에서는 이 Byte[]를 브라우저 다운로드 응답으로 내려줌
 * 4. Service에서는 이 byte[]를 Google Drive 업로드에도 재사용 가능
 */
@Component
public class CertPdfGenerator {
	
	/*
	 * 한글 출력을 위한 폰트 경로
	 * 
	 * application.properties에 따로 설정 가능:
	 * tacs.cert.pdf.font-path=C:/Windows/Fonts/malgun.ttf
	 */
	@Value("${tacs.cert.pdf.font-path:C:/Windows/Fonts/malgun.ttf}")
	private String fontPath;
	
	/**
	 * 검역 합격 증명서 PDF 생성
	 * 
	 * @param cert 검역 합격 증명서 상세 정보
	 * @return 파일명 + PDF byte[]
	 */
	public CertPdfIssueResultDTO generate(CertsDTO cert) throws Exception {
		
		String certNo = safe(cert.getCertIssueNo());
		String reqNo = safe(cert.getReqNo());
		
		if(certNo.isBlank()) {
			certNo = "TEMP-" + reqNo;
		}
		
		String fileName = "검역합격증명서_" + certNo + ".pdf";
		
		try(
			PDDocument document = new PDDocument();
			ByteArrayOutputStream out = new ByteArrayOutputStream()	
		) {
			PDPage page = new PDPage(PDRectangle.A4);
			document.addPage(page);
			
			PDType0Font font = PDType0Font.load(document, new File(fontPath));
			
			try (PDPageContentStream cs = new PDPageContentStream(document, page)) {

			    float pageWidth = page.getMediaBox().getWidth();
			    float pageHeight = page.getMediaBox().getHeight();

			    float margin = 32;
			    float left = 48;
			    float right = pageWidth - 48;
			    float y = pageHeight - 42;

			    // 전체 배경
			    drawCertificateBackground(cs, font, pageWidth, pageHeight);

			    // 바깥 테두리
			    cs.setStrokingColor(Color.DARK_GRAY);
			    cs.setLineWidth(1.2f);
			    drawBox(cs, margin, pageHeight - 28, pageWidth - (margin * 2), pageHeight - 56);

			    // 안쪽 테두리
			    cs.setLineWidth(0.5f);
			    drawBox(cs, margin + 6, pageHeight - 34, pageWidth - ((margin + 6) * 2), pageHeight - 68);

			    // 상단 기관명
			    cs.setNonStrokingColor(Color.DARK_GRAY);
			    writeCenteredText(cs, font, 9, pageWidth / 2, y, "TACS 검역기관 전자문서 발급 시스템");
			    y -= 16;
			    writeCenteredText(cs, font, 8, pageWidth / 2, y, "TACS Animal and Plant Quarantine Certificate Issuing System");
			    y -= 26;

			    // 제목
			    cs.setNonStrokingColor(Color.BLACK);
			    writeCenteredText(cs, font, 19, pageWidth / 2, y, "검 역 합 격 증 명 서");
			    y -= 16;
			    writeCenteredText(cs, font, 11, pageWidth / 2, y, "QUARANTINE INSPECTION CERTIFICATE");
			    y -= 18;

			    // 증명서 번호 라인
			    drawLine(cs, left, y, right, y);
			    y -= 18;

			    writeText(cs, font, 9, left, y, "증명서 번호 Certificate No.");
			    writeText(cs, font, 9, left + 145, y, ": " + certNo);

			    writeText(cs, font, 9, left + 310, y, "발급일자 Issue Date");
			    writeText(cs, font, 9, left + 420, y, ": " + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
			    y -= 15;

			    writeText(cs, font, 9, left, y, "검역요청번호 Request No.");
			    writeText(cs, font, 9, left + 145, y, ": " + reqNo);

			    writeText(cs, font, 9, left + 310, y, "수입신청번호 Import No.");
			    writeText(cs, font, 9, left + 420, y, ": " + safe(cert.getAplyNo()));
			    y -= 20;

			    // 신청인 정보
			    drawBlueTitleBar(cs, font, left, y, right - left, "신청인 정보  APPLICANT INFORMATION");
			    y -= 18;

			    y = drawInfoRow(cs, font, left, y, "업체명 Company", safe(cert.getBizNm()));
			    y = drawInfoRow(cs, font, left, y, "사업자등록번호 Business No.", safe(cert.getBizNo()));
			    y = drawInfoRow(cs, font, left, y, "신청인명 Applicant", safe(cert.getApplicantName()));
			    y = drawInfoRow(cs, font, left, y, "연락처 Tel.", safe(cert.getApplicantTel()));
			    y -= 6;

			    // 검역 정보
			    drawBlueTitleBar(cs, font, left, y, right - left, "검역 정보  INSPECTION INFORMATION");
			    y -= 18;

			    y = drawInfoRow(cs, font, left, y, "대표 품목명 Product", safe(cert.getItemNm()));
			    y = drawInfoRow(cs, font, left, y, "HS CODE", safe(cert.getHsCode()));
			    y = drawInfoRow(cs, font, left, y, "판정 결과 Result", safe(cert.getIirResultCd()));

			    // 검역 결과 내용은 길 수 있어서 별도 높이
			    float memoTop = y;
			    drawBox(cs, left, memoTop + 5, right - left, 42);
			    writeText(cs, font, 8.5f, left + 8, memoTop - 10, "검역 결과 내용 Inspection result");
			    writeWrappedText(cs, font, 8.5f, left + 145, memoTop - 10, 340, ": " + safe(cert.getIirResultCn()), 12);
			    y -= 45;

			    y -= 6;

			    // 검역 장소
			    drawBlueTitleBar(cs, font, left, y, right - left, "검역 장소  INSPECTION PLACE");
			    y -= 18;

			    y = drawInfoRow(cs, font, left, y, "장소명 Place", safe(cert.getLocNm()));

			    float addrTop = y;
			    drawBox(cs, left, addrTop + 5, right - left, 32);
			    writeText(cs, font, 8.5f, left + 8, addrTop - 10, "주소 Address");
			    writeWrappedText(
			            cs,
			            font,
			            8.5f,
			            left + 145,
			            addrTop - 10,
			            340,
			            ": " + safe(cert.getLocAdres()) + " " + safe(cert.getLocDetailAdres()),
			            12
			    );
			    y -= 36;

			    y -= 14;

			    // 중앙 워터마크 도장 느낌
			    drawCenterSeal(cs, font, pageWidth / 2, 310);

			    // 증명 문구
			    drawLine(cs, left, y, right, y);
			    y -= 28;

			    writeCenteredText(cs, font, 10, pageWidth / 2, y, "위 물품은 검역 결과 합격 처리되었음을 증명합니다.");
			    y -= 14;
			    writeCenteredText(cs, font, 8.5f, pageWidth / 2, y,
			            "This is to certify that the goods described above have passed quarantine inspection.");
			    y -= 34;

			    // 추가 선언
			    drawBlueTitleBar(cs, font, left, y, right - left, "추가사항  ADDITIONAL DECLARATION");
			    y -= 18;
			    y = drawInfoRow(cs, font, left, y, "비고 Remarks", "NIL");
			    y -= 10;

			    // 하단 발급 정보
			    drawLine(cs, left, y, right, y);
			    y -= 20;

			    writeText(cs, font, 8.5f, left, y, "발급지 Place of issue");
			    writeText(cs, font, 8.5f, left + 120, y, ": TACS QUARANTINE OFFICE");

			    writeText(cs, font, 8.5f, left + 310, y, "발급 담당자 Officer");
			    writeText(cs, font, 8.5f, left + 420, y, ": " + safeName(cert));
			    y -= 15;

			    writeText(cs, font, 8.5f, left, y, "발급일자 Date");
			    writeText(cs, font, 8.5f, left + 120, y, ": " + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));

			    writeText(cs, font, 8.5f, left + 310, y, "문서형태 Type");
			    writeText(cs, font, 8.5f, left + 420, y, ": Electronic Document");

			    // 전자발급 도장
			    drawSmallStamp(cs, font, left + 60, 85);

			    cs.setNonStrokingColor(Color.BLACK);
			}
            document.save(out);

            return new CertPdfIssueResultDTO(fileName, out.toByteArray());
			}
		}
	
	/**
	 * PDF에 텍스트 출력
	 */
	private void writeText(PDPageContentStream cs, PDType0Font font, int fontSize, float x, float y, String text) throws Exception {
	
		cs.beginText();
		cs.setFont(font, fontSize);
		cs.newLineAtOffset(x, y);
		cs.showText(text == null ? "" : text);
		cs.endText();
	}	
	
	private void writeText(PDPageContentStream cs, PDType0Font font, float fontSize, float x, float y, String text) throws Exception {

	    cs.beginText();
	    cs.setFont(font, fontSize);
	    cs.newLineAtOffset(x, y);
	    cs.showText(text == null ? "" : text);
	    cs.endText();
	}

	private void writeCenteredText(PDPageContentStream cs, PDType0Font font, float fontSize, float centerX, float y, String text) throws Exception {

	    String value = text == null ? "" : text;
	    float textWidth = font.getStringWidth(value) / 1000 * fontSize;
	    float startX = centerX - (textWidth / 2);

	    writeText(cs, font, fontSize, startX, y, value);
	}

	private void drawSectionTitle(PDPageContentStream cs, PDType0Font font, float fontSize, float x, float y, String title) throws Exception {

	    writeText(cs, font, fontSize, x, y, "[ " + title + " ]");
	}

	private void drawLine(PDPageContentStream cs, float startX, float startY, float endX, float endY) throws Exception {

	    cs.moveTo(startX, startY);
	    cs.lineTo(endX, endY);
	    cs.stroke();
	}

	private void drawBox(PDPageContentStream cs, float x, float topY, float width, float height) throws Exception {

	    cs.addRect(x, topY - height, width, height);
	    cs.stroke();
	}
	
	private void drawCertificateBackground(PDPageContentStream cs,
            PDType0Font font,
            float pageWidth,
            float pageHeight) throws Exception {

	// 연한 하늘색 배경
	cs.setNonStrokingColor(new Color(235, 249, 253));
	cs.addRect(0, 0, pageWidth, pageHeight);
	cs.fill();
	
	// 반복 워터마크 문자
	cs.setNonStrokingColor(new Color(205, 232, 240));
	
	for (float yy = 40; yy < pageHeight; yy += 28) {
	for (float xx = 25; xx < pageWidth; xx += 165) {
	writeText(cs, font, 7, xx, yy, "TACS QUARANTINE CERTIFICATE");
	}
	}
	
	cs.setNonStrokingColor(Color.BLACK);
	}
	
	private void drawBlueTitleBar(PDPageContentStream cs,
	   PDType0Font font,
	   float x,
	   float y,
	   float width,
	   String title) throws Exception {
	
	cs.setNonStrokingColor(new Color(210, 238, 246));
	cs.addRect(x, y - 14, width, 16);
	cs.fill();
	
	cs.setStrokingColor(Color.GRAY);
	cs.setLineWidth(0.4f);
	cs.addRect(x, y - 14, width, 16);
	cs.stroke();
	
	cs.setNonStrokingColor(Color.BLACK);
	writeText(cs, font, 8.5f, x + 6, y - 10, title);
	}
	
	private float drawInfoRow(PDPageContentStream cs,
	PDType0Font font,
	float x,
	float y,
	String label,
	String value) throws Exception {
	
	float width = 500;
	float height = 18;
	float labelWidth = 138;
	
	cs.setStrokingColor(Color.GRAY);
	cs.setLineWidth(0.35f);
	drawBox(cs, x, y + 5, width, height);
	
	writeText(cs, font, 8.5f, x + 8, y - 8, label);
	writeText(cs, font, 8.5f, x + labelWidth, y - 8, ": " + safe(value));
	
	return y - height;
	}
	
	private void drawCenterSeal(PDPageContentStream cs,
	 PDType0Font font,
	 float centerX,
	 float centerY) throws Exception {
	
	cs.setStrokingColor(new Color(120, 205, 185));
	cs.setNonStrokingColor(new Color(120, 205, 185));
	cs.setLineWidth(0.8f);
	
	drawCircle(cs, centerX, centerY, 48);
	drawCircle(cs, centerX, centerY, 37);
	
	writeCenteredText(cs, font, 18, centerX, centerY + 5, "TACS");
	writeCenteredText(cs, font, 9, centerX, centerY - 13, "전자 검역 증명");
	
	cs.setNonStrokingColor(Color.BLACK);
	cs.setStrokingColor(Color.BLACK);
	}
	
	private void drawSmallStamp(PDPageContentStream cs,
	 PDType0Font font,
	 float centerX,
	 float centerY) throws Exception {
	
	cs.setStrokingColor(new Color(80, 150, 210));
	cs.setNonStrokingColor(new Color(80, 150, 210));
	cs.setLineWidth(0.7f);
	
	drawCircle(cs, centerX, centerY, 34);
	drawCircle(cs, centerX, centerY, 24);
	
	writeCenteredText(cs, font, 9, centerX, centerY + 4, "TACS");
	writeCenteredText(cs, font, 6.5f, centerX, centerY - 9, "전자발급");
	
	cs.setNonStrokingColor(Color.BLACK);
	cs.setStrokingColor(Color.BLACK);
	}
	
	private void drawCircle(PDPageContentStream cs,
	float centerX,
	float centerY,
	float radius) throws Exception {
	
	float k = 0.552284749831f;
	float c = radius * k;
	
	cs.moveTo(centerX + radius, centerY);
	cs.curveTo(centerX + radius, centerY + c, centerX + c, centerY + radius, centerX, centerY + radius);
	cs.curveTo(centerX - c, centerY + radius, centerX - radius, centerY + c, centerX - radius, centerY);
	cs.curveTo(centerX - radius, centerY - c, centerX - c, centerY - radius, centerX, centerY - radius);
	cs.curveTo(centerX + c, centerY - radius, centerX + radius, centerY - c, centerX + radius, centerY);
	cs.stroke();
	}

	private void writeWrappedText(PDPageContentStream cs,
	                              PDType0Font font,
	                              float fontSize,
	                              float x,
	                              float y,
	                              float maxWidth,
	                              String text,
	                              float lineHeight) throws Exception {

	    String value = text == null ? "" : text;

	    StringBuilder line = new StringBuilder();
	    float currentY = y;

	    for (int i = 0; i < value.length(); i++) {
	        String ch = String.valueOf(value.charAt(i));
	        String testLine = line + ch;

	        float width = font.getStringWidth(testLine) / 1000 * fontSize;

	        if (width > maxWidth) {
	            writeText(cs, font, fontSize, x, currentY, line.toString());
	            line = new StringBuilder(ch);
	            currentY -= lineHeight;
	        } else {
	            line.append(ch);
	        }
	    }

	    if (line.length() > 0) {
	        writeText(cs, font, fontSize, x, currentY, line.toString());
	    }
	}
	
	/**
	 * null 방지용 문자열 처리
	 */
	private String safe(String value) {
		return value == null ? "" : value.replace("\r", " ").replace("\n", " ").replace("\t", " ");
	}
	
	private String safeName(CertsDTO cert) {
	    if (cert == null) {
	        return "";
	    }

	    if (cert.getOfficerNm() != null && !cert.getOfficerNm().isBlank()) {
	        return cert.getOfficerNm();
	    }

	    return safe(cert.getOfficerId());
	}
	
}













