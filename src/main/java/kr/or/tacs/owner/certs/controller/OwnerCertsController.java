package kr.or.tacs.owner.certs.controller;

import kr.or.tacs.dto.owner.OwnerCertDTO;
import kr.or.tacs.owner.certs.service.IOwnerCertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/owner/certs")
public class OwnerCertsController {

    @Autowired
    private IOwnerCertService certService;

    @GetMapping("/list.do")
    public String certList(Authentication authentication, Model model) {

        String owrId = authentication.getName();

        List<OwnerCertDTO> certList = certService.retrieveOwnerCertList(owrId);

        model.addAttribute("certList", certList);

        return "owner/customs/certs";
    }
}
