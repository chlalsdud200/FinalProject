package kr.or.tacs.owner.transport.controller;

import kr.or.tacs.cmmenums.TacsBizCd;
import kr.or.tacs.dto.owner.OwnerTranDetailDTO;
import kr.or.tacs.dto.owner.OwnerTranSearchDTO;
import kr.or.tacs.dto.owner.OwnerTransportProgressDTO;
import kr.or.tacs.owner.transport.service.ITransportProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/owner/transport/import")
public class TransportImportController {

    @Autowired
    private ITransportProgressService progressService;

    @GetMapping("/list.do")
    public String retrieveImportTransportList(OwnerTranSearchDTO searchDTO, Authentication authentication, Model model) {

        String owrId = authentication.getName();
        searchDTO.setOwrId(owrId);
        searchDTO.setTradeSeCd(TacsBizCd.IMPORT.getCode());

        int totalCount = progressService.retrieveTrcProgressCount(searchDTO);
        searchDTO.setTotalCount(totalCount);

        List<OwnerTransportProgressDTO> impTrcProgressList = progressService.retrieveImpTrcProgressList(searchDTO);

        model.addAttribute("impTrcProgressList", impTrcProgressList);
        model.addAttribute("searchDTO", searchDTO);

        return "owner/transport/importTransportList";
    }

    @GetMapping("/detail.do/{trcNo}")
    public String retrieveTransportDetail(@PathVariable String trcNo,
                                          Model model) {

        OwnerTranDetailDTO detail = progressService.retrieveImpTrc(trcNo);

        model.addAttribute("detail", detail);

        model.addAttribute("activeSub", "import-trans");

        model.addAttribute("returnUrl", "/owner/transport/import/list.do");

        return "owner/transport/transportDetail";
    }
}
