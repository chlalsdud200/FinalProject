package kr.or.tacs.owner.transport.controller;

import kr.or.tacs.dto.owner.OwnerFreightCertCompareResultDTO;
import kr.or.tacs.dto.owner.OwnerFreightDTO;
import kr.or.tacs.owner.transport.service.IFreightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/owner/transport/freight")
public class TransportFreightController {

    @Autowired
    private IFreightService freightService;

    @GetMapping("/list.do")
    public String retrieveFreightList(Authentication authentication, Model model) {

        List<OwnerFreightDTO> freightDTO = freightService.retrieveFreightList(authentication.getName());

        model.addAttribute("freightList", freightDTO);

        return "owner/transport/freightList";
    }

    @GetMapping("/detail.do/{tcsNo}")
    public String retrieveFreight(@PathVariable String tcsNo, Authentication authentication, Model model) {

        OwnerFreightDTO freightDTO = freightService.retrieveFreight(tcsNo, authentication.getName());

        // 본인 소유가 아닌 정산건 직접 접근 시 목록으로 복귀
        if (freightDTO == null) {
            return "redirect:/owner/transport/freight/list.do";
        }

        model.addAttribute("freight", freightDTO);

        return "owner/transport/freightDetail";
    }

    @PostMapping("/cert/compare.do")
    @ResponseBody
    public Map<String, Object> compareFreightCertificate(
            @RequestParam("tcsNo") String tcsNo,
            @RequestParam("trcNo") String trcNo,
            @RequestParam("certFile") MultipartFile certFile,
            Authentication authentication
    ) {
        String owrId = authentication.getName();

        try {
            OwnerFreightCertCompareResultDTO result =
                    freightService.compareFreightCertificate(tcsNo, trcNo, certFile, owrId);

            return Map.of(
                    "result", "OK",
                    "matchYn", result.getMatchYn(),
                    "matchMethodCd", result.getMatchMethodCd(),
                    "matchedBlNo", result.getMatchedBlNo(),
                    "message", result.getMessage()
            );
        } catch (IllegalArgumentException e) {
            return Map.of(
                    "result", "FAIL",
                    "message", e.getMessage()
            );
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of(
                    "result", "FAIL",
                    "message", "신고필증 대조 중 오류가 발생했습니다."
            );
        }
    }

    @PostMapping("/cert/upload.do")
    public String uploadFreightCertificate(
            @RequestParam("tcsNo") String tcsNo,
            @RequestParam("trcNo") String trcNo,
            @RequestParam("certFile") MultipartFile certFile,
            Authentication authentication,
            RedirectAttributes ra
    ) {
        String owrId = authentication.getName();

        try {
            freightService.uploadFreightCertificate(tcsNo, trcNo, certFile, owrId);

            ra.addFlashAttribute("message", "신고필증이 운송업체에게 전달되었습니다.");
        } catch (IllegalArgumentException e) {
            ra.addFlashAttribute("message", e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            ra.addFlashAttribute("message", "신고필증 전달 중 오류가 발생했습니다.");
        }

        return "redirect:/owner/transport/freight/detail.do/" + tcsNo;
    }
}