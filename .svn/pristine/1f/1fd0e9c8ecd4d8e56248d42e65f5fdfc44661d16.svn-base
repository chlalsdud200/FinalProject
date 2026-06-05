package kr.or.tacs.officer.basicscreen.controller;

import java.nio.charset.StandardCharsets;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.tacs.officer.basicscreen.service.CertificatePdfService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/officer/certificate")
public class CertificateTempDownloadController {

    private final CertificatePdfService certificatePdfService;

    @GetMapping("/tempDownload.do")
    public ResponseEntity<byte[]> tempDownload(@RequestParam("reqNo") String reqNo) throws Exception {

        byte[] pdfBytes = certificatePdfService.createCertificatePdf(reqNo);

        String fileName = "신고필증_" + reqNo + ".pdf";

        ContentDisposition contentDisposition = ContentDisposition.attachment()
                .filename(fileName, StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfBytes.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(pdfBytes);
    }
}