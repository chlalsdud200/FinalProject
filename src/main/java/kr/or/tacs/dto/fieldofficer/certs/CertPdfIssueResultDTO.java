package kr.or.tacs.dto.fieldofficer.certs;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CertPdfIssueResultDTO {

	// 다운로드 될 파일명
	private String fileName;
	
	// PDF 파일 바이트
	private byte[] pdfBytes;
	
}
