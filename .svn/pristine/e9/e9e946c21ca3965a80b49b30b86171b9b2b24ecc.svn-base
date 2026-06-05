package kr.or.tacs.broker.clients.controller;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.Principal;

import kr.or.tacs.common.file.service.GoogleDriveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.tacs.broker.clients.service.IClientsService;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.broker.clients.ClientFileVO;
import kr.or.tacs.vo.broker.clients.ClientSearchVO;
import kr.or.tacs.vo.broker.clients.ClientVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequestMapping("/broker")
@RequiredArgsConstructor
public class ClientsController {
	

    @Autowired
    private IClientsService clientsService;

    @Autowired
    private GoogleDriveService googleDriveService;

    ClientsController(GoogleDriveService googleDriveService) {
        this.googleDriveService = googleDriveService;
    }

    @GetMapping("/clients.do")
    public String clients(
            @ModelAttribute ClientSearchVO searchVO,
            Model model,
            Principal principal
    ) {
        searchVO.setBrokerId(principal.getName());

        if (searchVO.getPage() <= 0) {
            searchVO.setPage(1);
        }

        PaginationInfoVO<ClientVO> pagingVO = clientsService.selectClientPage(searchVO);

        model.addAttribute("activeMenu", "clients");
        model.addAttribute("searchVO", searchVO);
        model.addAttribute("pagingVO", pagingVO);
        model.addAttribute("clientList", pagingVO.getDataList());
        model.addAttribute("clientCount", pagingVO.getTotalRecord());

        return "broker/pages/clients";
    }

    @GetMapping("/clients/detail.do")
    public String clientDetail(
            @ModelAttribute ClientSearchVO searchVO,
            Principal principal,
            Model model
    ) {
        // 🔥 이거 없으면 무조건 조회 안됨
        searchVO.setBrokerId(principal.getName());

        ClientVO client = clientsService.selectClientDetail(searchVO);

        model.addAttribute("client", client);

        return "broker/pages/clientsDetail";
    }

    @GetMapping("/clients/file/download.do")
    public ResponseEntity<byte[]> downloadClientFile(@RequestParam("fileNo") Long fileNo) throws IOException {

        ClientFileVO fileVO = clientsService.selectClientFile(fileNo);

        if (fileVO == null) {
            return ResponseEntity.notFound().build();
        }

        System.out.println("[clients 파일 다운로드] fileNo=" + fileNo);
        System.out.println("[clients 파일 다운로드] orgName=" + fileVO.getOrgName());
        System.out.println("[clients 파일 다운로드] driveFileId=" + fileVO.getDriveFileId());
        System.out.println("[clients 파일 다운로드] filePath=" + fileVO.getFilePath());
        System.out.println("[clients 파일 다운로드] saveName=" + fileVO.getSaveName());

        byte[] fileBytes;

        /*
         * Google Drive 저장 파일이면 Drive API로 다운로드한다.
         */
        if (fileVO.getDriveFileId() != null && !fileVO.getDriveFileId().trim().isEmpty()) {
            try {
                fileBytes = googleDriveService.downloadFile(fileVO.getDriveFileId());
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.notFound().build();
            }
        } else {
            /*
             * driveFileId가 없는 기존 로컬 파일은 fallback으로 처리한다.
             */
            File file = new File(fileVO.getFilePath(), fileVO.getSaveName());

            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.notFound().build();
            }

            fileBytes = Files.readAllBytes(file.toPath());
        }

        String orgName = fileVO.getOrgName();
        if (orgName == null || orgName.trim().isEmpty()) {
            orgName = "download";
        }

        String encodedName = URLEncoder
                .encode(orgName, StandardCharsets.UTF_8)
                .replaceAll("\\+", "%20");

        String contentType = fileVO.getMimeType();
        if (contentType == null || contentType.trim().isEmpty()) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(fileBytes.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedName)
                .body(fileBytes);
    }
    
    
    
    @PostMapping("/clients/accept.do")
    public String acceptClientRequest(
            @ModelAttribute ClientSearchVO searchVO,
            Principal principal
    ) {
        searchVO.setBrokerId(principal.getName());
        clientsService.acceptClientRequest(searchVO);

        return "redirect:/broker/clients/detail.do?reqNo="
                + searchVO.getReqNo()
                + "&reqType="
                + searchVO.getReqType();
    }

    @PostMapping("/clients/supplement.do")
    public String requestSupplement(
            @ModelAttribute ClientSearchVO searchVO,
            Principal principal
    ) {
        searchVO.setBrokerId(principal.getName());
        clientsService.requestSupplement(searchVO);

        return "redirect:/broker/clients/detail.do?reqNo="
                + searchVO.getReqNo()
                + "&reqType="
                + searchVO.getReqType();
    }

    @PostMapping("/clients/reject.do")
    public String rejectClientRequest(
            @ModelAttribute ClientSearchVO searchVO,
            Principal principal
    ) {
        searchVO.setBrokerId(principal.getName());

        if (searchVO.getRejectCn() == null || searchVO.getRejectCn().isBlank()) {
            searchVO.setRejectCn("관세사 반려 처리");
        }

        clientsService.rejectClientRequest(searchVO);

        return "redirect:/broker/clients/detail.do?reqNo="
                + searchVO.getReqNo()
                + "&reqType="
                + searchVO.getReqType();
    }
}