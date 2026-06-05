package kr.or.tacs.owner.transport.controller;

import kr.or.tacs.dto.owner.OwnerForwarderDetailDTO;
import kr.or.tacs.dto.owner.OwnerTranRequestDTO;
import kr.or.tacs.dto.owner.OwnerTranSearchDTO;
import kr.or.tacs.owner.transport.service.IOwnerTransportService;
import kr.or.tacs.owner.transport.service.ITransportContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/owner/transport/forwarder")
public class TransportForwarderController {

    @Autowired
    private ITransportContractService contractService;

    @Autowired
    private IOwnerTransportService transportService;

    @GetMapping("/list.do")
    public String retrieveForwarderList(OwnerTranSearchDTO searchDTO, Authentication authentication, Model model) {

        String owrId = authentication.getName();
        searchDTO.setOwrId(owrId);

        int totalCount = contractService.retriveContractCount(searchDTO);
        searchDTO.setTotalCount(totalCount);

        List<OwnerTranRequestDTO> contractList = contractService.retrieveContractList(searchDTO);

        model.addAttribute("searchDTO", searchDTO);
        model.addAttribute("contractList", contractList);

        return "owner/transport/forwarderList";
    }

    @GetMapping("/detail.do/{trcTmNo}")
    public String retrieveForwarderDetail(@PathVariable Long trcTmNo, Authentication authentication, Model model) {

        String owrId = authentication.getName();

        OwnerForwarderDetailDTO forwarder = transportService.retrieveForwarder(owrId, trcTmNo);

        model.addAttribute("forwarder", forwarder);

        return "owner/transport/forwarderDetail";
    }
}
