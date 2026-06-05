package kr.or.tacs.systemadmin.hsknowledge.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.systemadmin.hsknowledge.service.IHsKeywordService;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsKeywordRequestVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsKeywordSearchVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsKeywordVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsUseYnRequestVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tacs/admin/hs/keywords")
public class AdminHsKeywordController {

    private final IHsKeywordService hsKeywordService;

    @GetMapping
    public PaginationInfoVO<HsKeywordVO> retriveHsKeywordList(@ModelAttribute HsKeywordSearchVO search) {
        return hsKeywordService.retriveHsKeywordList(search);
    }

    @PostMapping
    public Map<String, Object> registHsKeyword(@RequestBody HsKeywordRequestVO request) {
        Long keywordNo = hsKeywordService.registHsKeyword(request);
        return Map.of("success", true, "hsKeywordNo", keywordNo);
    }

    @PutMapping("/{keywordNo}")
    public Map<String, Object> modifyHsKeyword(@PathVariable Long keywordNo, @RequestBody HsKeywordRequestVO request) {
        hsKeywordService.modifyHsKeyword(keywordNo, request);
        return Map.of("success", true);
    }

    @PatchMapping("/{keywordNo}/use-yn")
    public Map<String, Object> modifyHsKeywordUseYn(@PathVariable Long keywordNo, @RequestBody HsUseYnRequestVO request) {
        hsKeywordService.modifyHsKeywordUseYn(keywordNo, request == null ? null : request.getUseYn());
        return Map.of("success", true);
    }
}
