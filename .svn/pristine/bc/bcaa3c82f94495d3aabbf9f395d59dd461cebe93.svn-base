package kr.or.tacs.systemadmin.hsknowledge.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.tacs.systemadmin.hsknowledge.service.IHsRefDocService;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefChunkVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefDocSearchQueryVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefDocSearchResultVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefDocSearchVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefDocVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsUseYnRequestVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tacs/admin/hs/ref-docs")
public class AdminHsRefDocController {

    private final IHsRefDocService hsRefDocService;

    @GetMapping
    public PaginationInfoVO<HsRefDocVO> retriveHsRefDocList(@ModelAttribute HsRefDocSearchVO search) {
        return hsRefDocService.retriveHsRefDocList(search);
    }

    @GetMapping("/{hsRefDocNo}")
    public HsRefDocVO retriveHsRefDoc(@PathVariable Long hsRefDocNo) {
        return hsRefDocService.retriveHsRefDoc(hsRefDocNo);
    }

    @GetMapping("/{hsRefDocNo}/chunks")
    public List<HsRefChunkVO> retriveHsRefChunkList(@PathVariable Long hsRefDocNo) {
        return hsRefDocService.retriveHsRefChunkList(hsRefDocNo);
    }

    @GetMapping("/{hsRefDocNo}/download")
    public ResponseEntity<byte[]> retriveHsRefDocDownload(@PathVariable Long hsRefDocNo) {
        return hsRefDocService.retriveHsRefDocDownload(hsRefDocNo);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> registHsRefDoc(
            @RequestParam(required = false) String hsParentDocumentId,
            @RequestParam(required = false) String hsMilvusCollection,
            @RequestParam(required = false) String hsEmbeddingModel,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal CustomUser loginUser
    ) throws Exception {
        Long hsRefDocNo = hsRefDocService.registHsRefDoc(hsParentDocumentId, hsMilvusCollection, hsEmbeddingModel, file, loginUser);
        return Map.of("success", true, "hsRefDocNo", hsRefDocNo);
    }

    @PutMapping("/{hsRefDocNo}")
    public Map<String, Object> modifyHsRefDoc(@PathVariable Long hsRefDocNo, @RequestBody HsRefDocVO request) {
        hsRefDocService.modifyHsRefDoc(
                hsRefDocNo,
                request.getHsParentDocumentId(),
                request.getHsMilvusCollection(),
                request.getHsEmbeddingModel(),
                request.getHsEmbedStatusCd(),
                request.getHsUseYn()
        );
        return Map.of("success", true);
    }

    @PatchMapping("/{hsRefDocNo}/use-yn")
    public Map<String, Object> modifyHsRefDocUseYn(@PathVariable Long hsRefDocNo, @RequestBody HsUseYnRequestVO request) {
        hsRefDocService.modifyHsRefDocUseYn(hsRefDocNo, request == null ? null : request.getUseYn());
        return Map.of("success", true);
    }

    @DeleteMapping("/{hsRefDocNo}")
    public Map<String, Object> removeHsRefDoc(@PathVariable Long hsRefDocNo) {
        hsRefDocService.removeHsRefDoc(hsRefDocNo);
        return Map.of("success", true);
    }

    @PostMapping("/{hsRefDocNo}/embed")
    public Map<String, Object> registHsRefDocEmbedding(@PathVariable Long hsRefDocNo) {
        hsRefDocService.registHsRefDocEmbedding(hsRefDocNo);
        return Map.of("success", true);
    }

    @PostMapping("/{hsRefDocNo}/reembed")
    public Map<String, Object> registHsRefDocReembedding(@PathVariable Long hsRefDocNo) {
        hsRefDocService.registHsRefDocReembedding(hsRefDocNo);
        return Map.of("success", true);
    }

    @PostMapping("/search")
    public List<HsRefDocSearchResultVO> retriveHsRefDocSearch(@RequestBody HsRefDocSearchQueryVO request) {
        return hsRefDocService.retriveHsRefDocSearch(request);
    }
}
