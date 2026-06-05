package kr.or.tacs.owner.export.controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.or.tacs.cmmenums.ServiceResult;
import kr.or.tacs.cmmenums.TacsCstmSt;
import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.dto.owner.OwnerExportRequestDTO;
import kr.or.tacs.dto.owner.OwnerExportSearchDTO;
import kr.or.tacs.owner.export.service.IExportService;
import kr.or.tacs.vo.BrokerVO;
import kr.or.tacs.vo.OwnerVO;
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
@RequestMapping("/owner/export")
public class ExportController {

    @Autowired
    private IExportService expService;

    @Autowired
    private IFileService fileService;

    @GetMapping("/list.do")
    public String list(OwnerExportSearchDTO searchDTO, Authentication authentication, Model model){
        String owrId = authentication.getName();
        searchDTO.setOwrId(owrId);

        int totalCount = expService.retriveExpCount(searchDTO);
        searchDTO.setTotalCount(totalCount);

        List<OwnerExportRequestDTO> exportList = expService.retriveExpList(searchDTO);

        model.addAttribute("searchDTO", searchDTO);
        model.addAttribute("exportList", exportList);

        return "owner/exportRequest";
    }

    @GetMapping("/form.do")
    public String form(Authentication authentication, Model model){
        String owrId = authentication.getName();

        List<BrokerVO> brokerVO = expService.retriveBrokerList();
        OwnerVO ownerVO = expService.retriveOwnerInfo(owrId);
        model.addAttribute("ownerVO", ownerVO);
        model.addAttribute("brokerList", brokerVO);

        return "owner/export/form";
    }

    /*
    @PostMapping("/form.do")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> insert(OwnerExportRequestDTO expDTO,
                                                      Authentication authentication,
                                                      HttpServletRequest request) {
        try {
            String owrId = authentication.getName();
            expDTO.setErOwrId(owrId);

            expService.registExp(expDTO);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "수출신고의뢰가 등록되었습니다. 첨부파일은 백그라운드에서 업로드됩니다.",
                    "redirectUrl", request.getContextPath() + "/owner/export/list.do"
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "수출신고의뢰 등록 중 오류가 발생했습니다."
            ));
        }
    }*/

    @PostMapping("/form.do")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> insert(OwnerExportRequestDTO expDTO, Authentication authentication, HttpServletRequest request) {

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String owrId = authentication.getName();
            expDTO.setErOwrId(owrId);

            ServiceResult result = expService.registExp(expDTO);
            String erNo = expDTO.getErNo();

            if(result == ServiceResult.OK){
                resultMap.put("result","OK");
                resultMap.put("message", "수출통관의뢰가 등록되었습니다");
                resultMap.put("redirectUrl", request.getContextPath() + "/owner/export/detail.do/" + erNo);
                return ResponseEntity.ok(resultMap);
            }

            resultMap.put("result", "FAIL");
            resultMap.put("message", "수출통관의뢰 등록에 실패했습니다");
            return ResponseEntity.ok(resultMap);

        } catch (Exception e) {
            e.printStackTrace();

            resultMap.put("result", "FAIL");
            resultMap.put("message", "수출통관의뢰 등록중 오류가 발생했습니다");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resultMap);
        }
    }

    @GetMapping("/detail.do/{erNo}")
    public String detail(@PathVariable String erNo, Model model){

        OwnerExportRequestDTO expDTO = expService.retriveExp(erNo);

        String owrId = expDTO.getErOwrId();
        OwnerVO ownerVO = expService.retriveOwnerInfo(owrId);

        Long tfgNo = expDTO.getErTfgNo();

        List<FileInfoDTO> fileList = fileService.getFileList(tfgNo);

        if(expDTO.getErStatusCd().equals(TacsCstmSt.CSTM_SUPP.getCode()) || expDTO.getErStatusCd().equals(TacsCstmSt.CSTM_SUPP_SUB.getCode())){
            OwnerExportRequestDTO supp = expService.retriveSupp(erNo);
            model.addAttribute("supp", supp);
        }

        model.addAttribute("fileList", fileList);
        model.addAttribute("ownerVO", ownerVO);
        model.addAttribute("expDTO", expDTO);

        return "owner/export/detail";
    }

    @PostMapping("/update.do")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> update(OwnerExportRequestDTO expDTO, Authentication authentication) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();

        String owrId = authentication.getName();
        expDTO.setErOwrId(owrId);

        ServiceResult result = expService.modifyExp(expDTO);

        try {
            if(result == ServiceResult.OK){
                resultMap.put("result", "OK");

                if("SUPP_SUBMIT".equals(expDTO.getSubmitType())){
                    resultMap.put("message", "보완요청에 대한 대응 및 답변이 제출되었습니다");
                }else {
                    resultMap.put("message", "수출통관 의뢰 정보가 수정되었습니다");
                }

                resultMap.put("erNo" , expDTO.getErNo());

                return ResponseEntity.ok(resultMap);
            }

            resultMap.put("result", "FAIL");
            resultMap.put("message", "수정 가능한 상태가 아니거나 대상 의뢰가 없습니다");

            return ResponseEntity.ok(resultMap);

        }catch (Exception e){
            e.printStackTrace();

            resultMap.put("result", "FAIL");
            resultMap.put("message", "수정 처리 중 오류가 발생했습니다");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resultMap);
        }

    }

}
