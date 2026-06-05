package kr.or.tacs.owner.transport.controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.or.tacs.cmmenums.ServiceResult;
import kr.or.tacs.dto.owner.OwnerTranRequestDTO;
import kr.or.tacs.owner.transport.service.ITransportContractService;
import kr.or.tacs.vo.OwnerVO;
import kr.or.tacs.vo.transport.TransportManagerVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/owner/transport/contract")
public class TransportContractController {

    @Autowired
    private ITransportContractService contractService;

    @GetMapping("/form.do")
    public String form(Model model, Authentication authentication) {

        String owrId = authentication.getName();

        OwnerVO ownerVO = contractService.retrieveOwnerInfo(owrId);

        List<TransportManagerVO> tranManagerVO = contractService.retriveTranManagerList();

        model.addAttribute("tranManagerList", tranManagerVO);
        model.addAttribute("ownerVO", ownerVO);

        return "owner/transport/contractForm";
    }

    @PostMapping("/insert.do")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> insert(OwnerTranRequestDTO tranDTO, Authentication authentication, HttpServletRequest request) {

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String owrId = authentication.getName();
            tranDTO.setTrcOwrId(owrId);

            ServiceResult result = contractService.registTranReq(tranDTO);
            String trcNo = tranDTO.getTrcNo();

            // db에 저장할땐 enum type을 쓸 예정이라 대문자로 db에 들어가니, 소문자로 변경함
            String tranType = tranDTO.getTrcSeCd().toLowerCase();

            if(result == ServiceResult.OK){
                resultMap.put("result", "OK");
                resultMap.put("message", "운송의뢰 등록이 완료되었습니다");
                resultMap.put("redirectUrl", request.getContextPath() + "/owner/transport/" + tranType + "/detail.do/" + trcNo);
                return ResponseEntity.ok(resultMap);
            }

            resultMap.put("result", "FAIL");
            resultMap.put("message", "운송의뢰 등록에 실패했습니다");
            return ResponseEntity.ok(resultMap);
        }
        catch (Exception e){
            e.printStackTrace();

            resultMap.put("result", "FAIL");
            resultMap.put("message", "운송의뢰 등록중 오류가 발생했습니다");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resultMap);
        }
    }
}