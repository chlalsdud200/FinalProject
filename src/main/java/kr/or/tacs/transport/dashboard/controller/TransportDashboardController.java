package kr.or.tacs.transport.dashboard.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.tacs.transport.export.service.ExportTransportService;
import kr.or.tacs.transport.importp.service.ImportTransportService;
import kr.or.tacs.vo.transport.TransportRequestVO;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/transport")
@RequiredArgsConstructor
public class TransportDashboardController {

    private final ExportTransportService exportTransportService;
    private final ImportTransportService importTransportService;

    @GetMapping("/dashboard.do")
    public String retriveDashboard(Model model) {
        List<TransportRequestVO> exportRequestList = exportTransportService.retriveExpTransportReqList();
        List<TransportRequestVO> importRequestList = importTransportService.retriveImpTransportReqList();
        List<TransportRequestVO> importManifestList = importTransportService.retriveImpManifestList();
        List<TransportRequestVO> importInlandDispatchList = importTransportService.retriveImpInlandDispatchList();

        model.addAttribute("exportRequestList", exportRequestList);
        model.addAttribute("importRequestList", importRequestList);
        model.addAttribute("importManifestList", importManifestList);
        model.addAttribute("importInlandDispatchList", importInlandDispatchList);
        model.addAttribute("exportDashboardCount", exportRequestList.size());
        model.addAttribute("importDashboardCount", importRequestList.size());
        model.addAttribute("importManifestDashboardCount", importManifestList.size());
        model.addAttribute("importInlandDashboardCount", importInlandDispatchList.size());
        return "transport/dashboard";
    }
}
