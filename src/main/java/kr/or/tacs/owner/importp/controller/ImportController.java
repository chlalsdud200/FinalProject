package kr.or.tacs.owner.importp.controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.or.tacs.cmmenums.ServiceResult;
import kr.or.tacs.cmmenums.TacsCstmSt;
import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.dto.owner.OwnerExportRequestDTO;
import kr.or.tacs.dto.owner.OwnerImportRequestDTO;
import kr.or.tacs.dto.owner.OwnerImportSearchDTO;
import kr.or.tacs.owner.importp.service.IImportService;
import kr.or.tacs.vo.BrokerVO;
import kr.or.tacs.vo.OwnerVO;
import kr.or.tacs.vo.transport.PortVO;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("/owner/import")
public class ImportController {

    @Autowired
    private IImportService impService;

    @Autowired
    private IFileService fileService;

    @GetMapping("/list.do")
    public String list(OwnerImportSearchDTO searchDTO, Authentication authentication, Model model){

        String owrId = authentication.getName();
        searchDTO.setOwrId(owrId);

        int totalCount = impService.retriveImpCount(searchDTO);
        searchDTO.setTotalCount(totalCount);

        List<OwnerImportRequestDTO> importList = impService.retriveImpList(searchDTO);

        model.addAttribute("searchDTO", searchDTO);
        model.addAttribute("importList", importList);

        return "owner/importRequest";
    }

    @GetMapping("/form.do")
    public String form(Authentication authentication, Model model){
        String owrId = authentication.getName();

        List<BrokerVO> brokerVO = impService.retriveBrokerList();
        OwnerVO ownerVO = impService.retriveOwnerInfo(owrId);

        List<PortVO> portVO = impService.retrivePortList();
        model.addAttribute("portVO", portVO);
        model.addAttribute("ownerVO", ownerVO);
        model.addAttribute("brokerList", brokerVO);

        return "owner/import/form";
    }

    @PostMapping("/form.do")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> insert(OwnerImportRequestDTO impDTO, Authentication authentication, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();
        try {
            String owrId = authentication.getName();
            impDTO.setIrOwrId(owrId);

            ServiceResult result = impService.registImp(impDTO);
            String irNo = impDTO.getIrNo();

            if (result == ServiceResult.OK){
                resultMap.put("result", "OK");
                resultMap.put("message", "수입통관의뢰가 등록되었습니다");
                resultMap.put("redirectUrl", request.getContextPath() + "/owner/import/detail.do/" + irNo);
                return ResponseEntity.ok(resultMap);
            }

            resultMap.put("result", "FAIL");
            resultMap.put("message", "수입통관의뢰 동록에 실패했습니다");
            return ResponseEntity.ok(resultMap);

        } catch (Exception e) {
            e.printStackTrace();

            resultMap.put("result", "FAIL");
            resultMap.put("message", "수입통관의뢰 등록 중 오류가 발생했습니다");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resultMap);
        }
    }

    @GetMapping("/detail.do/{irNo}")
    public String detail(@PathVariable String irNo, Model model){

        OwnerImportRequestDTO impDTO = impService.retriveImp(irNo);

        String owrId = impDTO.getIrOwrId();
        OwnerVO ownerVO = impService.retriveOwnerInfo(owrId);

        Long tfgNo = impDTO.getIrTfgNo();

        List<FileInfoDTO> fileList = fileService.getFileList(tfgNo);
        List<PortVO> portVO = impService.retrivePortList();


        if(impDTO.getIrStatusCd().equals(TacsCstmSt.CSTM_SUPP.getCode()) || impDTO.getIrStatusCd().equals(TacsCstmSt.CSTM_SUPP_SUB.getCode())){
            OwnerImportRequestDTO supp = impService.retriveSupp(irNo);

            model.addAttribute("supp", supp);
        }

        model.addAttribute("portVO", portVO);
        model.addAttribute("fileList", fileList);
        model.addAttribute("impDTO", impDTO);
        model.addAttribute("ownerVO", ownerVO);

        return "owner/import/detail";
    }

    @PostMapping("/update.do")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> update(OwnerImportRequestDTO impDTO, Authentication authentication) {
        Map<String, Object> resultMap = new HashMap<>();

        try {
            String owrId = authentication.getName();
            impDTO.setIrOwrId(owrId);

            ServiceResult result = impService.modifyImp(impDTO);

            if (result == ServiceResult.OK) {
                resultMap.put("result", "OK");

                if ("SUPP_SUBMIT".equals(impDTO.getSubmitType())) {
                    resultMap.put("message", "보완요청에 대한 대응 및 답변이 제출되었습니다");
                } else {
                    resultMap.put("message", "수입통관 의뢰 정보가 수정되었습니다");
                }

                resultMap.put("irNo", impDTO.getIrNo());
                return ResponseEntity.ok(resultMap);
            }

            resultMap.put("result", "FAIL");
            resultMap.put("message", "수정 가능한 상태가 아니거나 대상 의뢰가 없습니다");
            return ResponseEntity.ok(resultMap);

        } catch (Exception e) {
            e.printStackTrace();

            resultMap.put("result", "FAIL");
            resultMap.put("message", "처리 중 오류가 발생했습니다");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resultMap);
        }
    }
}
