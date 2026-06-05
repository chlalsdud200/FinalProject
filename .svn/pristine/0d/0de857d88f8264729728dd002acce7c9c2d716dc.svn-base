package kr.or.tacs.transport.export.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.or.tacs.transport.export.service.ExportTransportService;
import kr.or.tacs.vo.transport.TransportInboundRequestVO;
import kr.or.tacs.vo.transport.TransportRequestVO;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/transport")
@RequiredArgsConstructor
public class ExportTransportController {

    private final ExportTransportService exportTransportService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/export.do")
    public String retriveExportPage(Model model) {
        List<TransportRequestVO> exportRequestList = exportTransportService.retriveExpTransportReqList();
        List<TransportInboundRequestVO> exportInboundRequestList = exportTransportService.retriveExpInboundReqList();

        model.addAttribute("exportRequestList", exportRequestList);
        model.addAttribute("exportRequestJson", toJson(exportRequestList));
        model.addAttribute("exportInboundRequestList", exportInboundRequestList);
        model.addAttribute("exportInboundRequestJson", toJson(exportInboundRequestList));

        return "transport/pages/export";
    }

    @GetMapping("/export/request/list.do")
    @ResponseBody
    public List<TransportRequestVO> retriveExpTransportReqList() {
        return exportTransportService.retriveExpTransportReqList();
    }

    @GetMapping({"/export/manifest/list", "/export/manifest/list.do"})
    @ResponseBody
    public List<TransportRequestVO> retriveExpManifestList() {
        return exportTransportService.retriveExpManifestList();
    }

    @PostMapping({"/export/manifest/submit", "/export/manifest/submit.do"})
    @ResponseBody
    public Map<String, Object> registExpCargoManifest(
            TransportRequestVO vo,
            @RequestParam(required = false) MultipartFile invoicePdfFile,
            @RequestParam(required = false) MultipartFile packingListPdfFile,
            @RequestParam(required = false) MultipartFile manifestPdfFile,
            Authentication authentication
    ) {
        int result;
        try {
            result = exportTransportService.registExpCargoManifest(
                    vo,
                    resolveActorId(authentication, vo),
                    invoicePdfFile,
                    packingListPdfFile,
                    manifestPdfFile
            );
        } catch (IllegalArgumentException | IllegalStateException e) {
            return Map.of("success", false, "message", e.getMessage());
        }

        return Map.of(
                "success", result > 0,
                "message", result > 0 ? "수출 적하목록이 제출되었습니다." : "수출 적하목록 제출에 실패했습니다."
        );
    }

    @PostMapping({"/export/manifest/supplement-submit", "/export/manifest/supplement-submit.do"})
    @ResponseBody
    public Map<String, Object> modifyExpCargoManifestSupplement(
            TransportRequestVO vo,
            @RequestParam(required = false) MultipartFile invoicePdfFile,
            @RequestParam(required = false) MultipartFile packingListPdfFile,
            @RequestParam(required = false) MultipartFile manifestPdfFile,
            Authentication authentication
    ) {
        int result;
        try {
            result = exportTransportService.modifyExpCargoManifestSupplement(
                    vo,
                    resolveActorId(authentication, vo),
                    invoicePdfFile,
                    packingListPdfFile,
                    manifestPdfFile
            );
        } catch (IllegalArgumentException | IllegalStateException e) {
            return Map.of("success", false, "message", e.getMessage());
        }

        return Map.of(
                "success", result > 0,
                "message", result > 0 ? "수출 적하목록 보완제출이 완료되었습니다." : "보완제출 대상이 없습니다."
        );
    }

    @PostMapping("/export/request/status.do")
    @ResponseBody
    public Map<String, Object> modifyExpTransportReqStatus(
            @RequestParam String trcNo,
            @RequestParam String statusCd,
            @RequestParam(required = false) String rejectType,
            @RequestParam(required = false) String rejectMemo
    ) {
        boolean success = exportTransportService.modifyExpTransportReqStatus(trcNo, statusCd, rejectType, rejectMemo);
        return Map.of("success", success);
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }

    private String resolveActorId(Authentication authentication, TransportRequestVO vo) {
        if (authentication != null && authentication.getName() != null && !authentication.getName().isBlank()) {
            return authentication.getName();
        }
        return vo.getOwnerId();
    }
}
