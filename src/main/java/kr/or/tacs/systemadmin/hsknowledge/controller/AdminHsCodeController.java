package kr.or.tacs.systemadmin.hsknowledge.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.systemadmin.hsknowledge.service.IHsCodeService;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsCodeRequestVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsCodeSearchVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsCodeVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsUseYnRequestVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tacs/admin/hs/codes")
public class AdminHsCodeController {

    private final IHsCodeService hsCodeService;

    @GetMapping
    public PaginationInfoVO<HsCodeVO> retriveHsCodeList(@ModelAttribute HsCodeSearchVO search) {
        return hsCodeService.retriveHsCodeList(search);
    }

    @GetMapping("/{hsCode}")
    public HsCodeVO retriveHsCode(@PathVariable String hsCode) {
        return hsCodeService.retriveHsCode(hsCode);
    }

    @PutMapping("/{hsCode}")
    public Map<String, Object> modifyHsCode(@PathVariable String hsCode, @RequestBody HsCodeRequestVO request) {
        hsCodeService.modifyHsCode(hsCode, request);
        return Map.of("success", true);
    }

    @PatchMapping("/{hsCode}/use-yn")
    public Map<String, Object> modifyHsCodeUseYn(@PathVariable String hsCode, @RequestBody HsUseYnRequestVO request) {
        hsCodeService.modifyHsCodeUseYn(hsCode, request == null ? null : request.getUseYn());
        return Map.of("success", true);
    }
}
