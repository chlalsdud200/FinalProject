package kr.or.tacs.warehouse.outbound.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.dto.warehouse.WarehouseOutboundDocDTO;
import kr.or.tacs.dto.warehouse.WarehouseOutboundProcessDTO;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.warehouse.outbound.service.OutboundService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/warehouse")
public class OutboundController {

	@Autowired
	private OutboundService outboundService;
	
	@Autowired
	private IFileService fileService;
	
	private String getLoginId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CustomUser user = (CustomUser) auth.getPrincipal();
		return user.getLoginId();
	}
	
	/**
	 * 보세 반출 처리 화면 요청
	 */
	@GetMapping("/outbound.do")
	public String outboundPage(Model model) {
	    
	    String wmId = getLoginId();

	    /*
	     * 반출처리 목록
	     * 반출요청/보완요청/반출승인 처리 대상 목록이다.
	     */
	    List<WarehouseOutboundProcessDTO> outboundProcessList =
	            outboundService.selectOutboundProcessList(wmId);
	    
	    model.addAttribute("outboundProcessList", outboundProcessList);
	    
	    log.info("반출처리관리 목록 조회 wmId : {}, list 데이터 확인 : {}", wmId, outboundProcessList);

	    return "warehouse/outbound";
	}
	
	/*
	 * 보세반출 처리 목록 검색 + 페이징 AJAX
	 *
	 * /warehouse/outbound.do
	 * - 화면 진입용
	 *
	 * /warehouse/outbound/search.do
	 * - 목록 검색/페이징용
	 */
	@GetMapping("/outbound/search.do")
	@ResponseBody
	public Map<String, Object> searchOutboundProcess(
	        @RequestParam(required = false, defaultValue = "1") int page,
	        @RequestParam(required = false) String startDate,
	        @RequestParam(required = false) String endDate,
	        @RequestParam(required = false) String keyword,
	        @RequestParam(required = false) String type,
	        @RequestParam(required = false) String status
	) {
	    String wmId = getLoginId();

	    /*
	     * WarehouseOutboundProcessDTO가 PageDTO를 상속했기 때문에
	     * 검색조건 + 페이징 조건을 searchDTO 하나에 담는다.
	     */
	    WarehouseOutboundProcessDTO searchDTO = new WarehouseOutboundProcessDTO();

	    /*
	     * 페이징 조건
	     */
	    searchDTO.setPage(page);

	    /*
	     * 검색 기간
	     * 반출요청일시 기준으로 검색할 예정
	     */
	    searchDTO.setStartDate(startDate);
	    searchDTO.setEndDate(endDate);

	    /*
	     * 검색어
	     * 예: 반출요청번호, 화주명, 물품명, 보관위치 등
	     */
	    searchDTO.setKeyword(keyword);

	    /*
	     * 수입/수출 검색조건
	     * type 값은 DTO의 diTrdeSeCd에 담는다.
	     */
	    searchDTO.setDiTrdeSeCd(type);

	    /*
	     * 반출상태 검색조건
	     * status 값은 DTO의 crStatusCd에 담는다.
	     */
	    searchDTO.setCrStatusCd(status);

	    /*
	     * 전체 건수 조회
	     * totalCount가 세팅되어야 PageDTO가 startRow/endRow/totalPage를 계산한다.
	     */
	    int totalCount = outboundService.selectOutboundProcessCount(searchDTO, wmId);
	    searchDTO.setTotalCount(totalCount);

	    /*
	     * 현재 페이지 목록 조회
	     */
	    List<WarehouseOutboundProcessDTO> dataList =
	            outboundService.selectOutboundProcessPagingList(searchDTO, wmId);

	    Map<String, Object> resultMap = new HashMap<>();

	    resultMap.put("dataList", dataList);
	    resultMap.put("currentPage", searchDTO.getPage());
	    resultMap.put("startPage", searchDTO.getStartPage());
	    resultMap.put("endPage", searchDTO.getEndPage());
	    resultMap.put("totalPage", searchDTO.getTotalPage());
	    resultMap.put("totalCount", searchDTO.getTotalCount());

	    return resultMap;
	}
	
	@GetMapping("/outbound/files.do")
	@ResponseBody
	public List<FileInfoDTO> selectOutboundFileList(@RequestParam("tfgNo") Long tfgNo){
		
		log.info("반출서류 첨부파일 목록 조회 tfgNo: {}", tfgNo);	//tfgNo는 DO_ISSUANCE.DI_TFG_NO 값이다.
		//이 번호가 D/O + 신고필증이 묶인 파일그룹번호다.
		
		return fileService.getFileList(tfgNo);
	}
	
	// 보완요청 등록(창고관리자가 반출요청건에대해 운송업체에게 보완을 요청함)
	@PostMapping("/outbound/supplement.do")
	@ResponseBody
	public Map<String, Object> insertOutboundSupplementRequest(
								@RequestParam("crrNo") String crrNo,
								@RequestParam("reason") String reason){
		
		Map<String,Object> resultMap = new HashMap<>();
		try {
			String wmId = getLoginId();
			
			log.info("반출 보완요청 등록 요청 crrNo : {},  wmId : {}, reason : {}",  crrNo, wmId, reason);
			
			int result = outboundService.insertOutboundSupplementRequest(crrNo,wmId,reason);
			
			if(result > 0) {
				resultMap.put("result", "success");
				resultMap.put("message", "반출 보완요청이 등록되었습니다");
			}else {
				resultMap.put("result", "fail");
				resultMap.put("message", "반출 보완요청 등록에 실패했습니다");
			}
		} catch (Exception e) {
			log.error("반출 보완요청 등록 중 오류 발생",e);
			
			resultMap.put("result", "fail");
			resultMap.put("message", "반출 보완요청 등록 중 오류가 발생했습니다");
		}
		
		return resultMap;
	}
	
	
	/*
	 * 반출승인일때  3D 창고에서 물건이 없어지고 사용량/사용률 재계산
	 */
	@PostMapping("/outbound/approve.do")
	@ResponseBody
	public Map<String, Object> approveOutbound(@RequestParam("crrNo") String crrNo){
		
		Map<String, Object> resultMap = new HashMap<>();
			
		try {
			String wmId = getLoginId();
			
			log.info("반출 승인 처리 crrNo : {}", crrNo);
			log.info("반출 승인 처리 창고관리자 ID  wmID  : {} ", wmId);
			
			int result = outboundService.approveOutbound(crrNo,wmId);
			
			if(result > 0) {
				resultMap.put("result", "success");
				resultMap.put("message", "반출승인이 완료되었습니다");
			}else {
				resultMap.put("result", "fail");
				resultMap.put("message", "반출승인 가능한 건이 아닙니다.");
			}
			
		} catch (Exception e) {
			log.error("반출승인 처리 중 오류 발생",e);
			
			resultMap.put("result", "error");
			resultMap.put("message", "반출승인 처리 중 오류가 발생했습니다");
		}
		
		return resultMap;
	}
	
	/**
	 * 반출요청번호 기준 물품별 상세 목록 조회
	 *
	 * 사용 위치:
	 * - 창고관리자 반출처리 상세 모달
	 *
	 * 목적:
	 * - 반출요청 목록은 대표 물품명 + 외 n건으로 보여주고,
	 * - 상세 모달에서는 실제 입고된 물품 개수만큼 보여주기 위함.
	 */
	@GetMapping("/outbound/goodsList.do")
	@ResponseBody
	public List<WarehouseOutboundProcessDTO> selectOutboundGoodsList(
	        @RequestParam String crrNo
	) {
	    String wmId = getLoginId();

	    return outboundService.selectOutboundGoodsListByCrrNo(crrNo, wmId);
	}
	
	
}


















