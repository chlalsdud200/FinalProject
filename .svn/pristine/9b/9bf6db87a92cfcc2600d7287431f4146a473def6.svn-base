package kr.or.tacs.owner.tariff.controller;

import kr.or.tacs.dto.owner.OwnerBrokerChargeDTO;
import kr.or.tacs.dto.owner.OwnerDutySearchDTO;
import kr.or.tacs.owner.tariff.service.ITariffDutyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/owner/tariff/duty")
public class TariffDutyController {

    @Autowired
    private ITariffDutyService tariffDutyService;

    @GetMapping("/list.do")
    public String dutyList(OwnerDutySearchDTO searchDTO, Authentication authentication, Model model) {

        searchDTO.setOwrId(authentication.getName());

        int totalCount = tariffDutyService.retrieveBrokerChargeCount(searchDTO);

        searchDTO.setTotalCount(totalCount);

        List<OwnerBrokerChargeDTO> chargeList = tariffDutyService.retrieveBrokerChargeList(searchDTO);

        model.addAttribute("searchDTO", searchDTO);
        model.addAttribute("chargeList", chargeList);

        return "owner/customs/duty";
    }

    @GetMapping("/detail.do/{bcNo}")
    public String dutyDetail(@PathVariable String bcNo, Authentication authentication, Model model) {

        String owrId = authentication.getName();

        OwnerBrokerChargeDTO charge = tariffDutyService.retrieveBrokerChargeDetail(bcNo, owrId);

        model.addAttribute("charge", charge);

        return "owner/customs/dutyDetail";
    }
}
