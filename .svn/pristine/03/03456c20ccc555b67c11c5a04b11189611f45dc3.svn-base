package kr.or.tacs.fieldofficer.certs.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpServletResponse;
import kr.or.tacs.fieldofficer.certs.service.ICertsService;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.dto.fieldofficer.certs.CertsDTO;
import kr.or.tacs.dto.fieldofficer.certs.CertsItemDTO;

/*
 *  현장공무원(검역기관) 검역 합격 증명서 발급 Controller
 *  
 *  역할:
 *  1. 검역 합격 증명서 발급 대상 목록 조회
 *  2. 검역 합격 증명서 상세 발급 화면 조회
 *  3. 검역 합격 증명서 발급 처리
 *  4. 보완 요청 등록 처리
 */
@Controller("fieldOfficerCertsController")
@RequestMapping("/fieldofficer")
public class CertsController {
	
	// 검역 합격 증명서 관련 비즈니스 로직을 처리하는 Service
	private final ICertsService certsService;
	
	// 생성자 주입 방식으로 Service 객체를 주입받음
	public CertsController(ICertsService certsService) {
		this.certsService = certsService;
	}
	
	/*
	 * 요청 주소:
	 * GET /fieldofficer/certs.do
	 * 
	 * 처리 흐름:
	 * 1. 화면에서 넘어온 검색 조건을 CertsDTO searchDTO로 자동 바이딩한다.
	 * 2. Service를 통해 발급 대상 목록을 조회한다.
	 * 3. 조회 결과를 certsList라는 이름으로 JSP에 전달한다.
	 * 4. 검색 조건도 searchDTO라는 이름으로 JSP에 다시 전달한다.
	 * 5. fieldofficer/certs.jsp 화면을 보여준다.
	 */
	// 검역 합격 증명서 발급 대상 목록 조회
	@GetMapping("/certs.do")
	public String retriveCertsList(@RequestParam(value = "page", required = false, defaultValue = "1") int currentPage, CertsDTO searchDTO, Authentication authentication, Model model) {
		
		// 1. 페이지네이션 객체 생성
		// 한 페이지에 10개, 페이지 번호는 5개씩 표시
		PaginationInfoVO<CertsDTO> pagingVO = new PaginationInfoVO<>(10, 5);
		
		// 2. 현재 페이지 번호 설정
		// 이때 startRow, endRow, startPage, endPage가 계산된다.
		pagingVO.setCurrentPage(currentPage);
		
		searchDTO.setOfficerId(authentication.getName());
		
		// 3. 검색 조건 DTO를 페이지네이션 객체에 담는다.
		// Mapper XML에서 searchVO.reqNo, searchVO.bizNm 형태로 사용한다.
		pagingVO.setSearchDTO(searchDTO);
		
		// 4. 검색 조건에 맞는 전체 건수 조회
		int totalRecord = certsService.retriveCertsCount(pagingVO);
		
		// 5. 전체 건수를 넣어서 totalPage 계산
		pagingVO.setTotalRecord(totalRecord);
		
		// 6. 현재 페이지에 해당하는 목록 조회
		List<CertsDTO> certsList = certsService.retriveCertsList(pagingVO);
		
		// 7. 페이지네이션 객체에 목록 저장
		pagingVO.setDataList(certsList);
		
		// 8. 기존 JSP 목록 출력용
		model.addAttribute("certsList", certsList);
		
		// 9. 페이지네이션 출력용
		model.addAttribute("pagingVO", pagingVO);
		
		// 10. 검색 조건 유지용
		model.addAttribute("searchDTO", searchDTO);
		
		// /WEB-INF/views/fieldofficer/certs.jsp로 이동
		return "fieldofficer/certs";
	}
	
	/*
	 * TOAST UI Grid 데이터 조회
	 * 
	 * 요청 주소:
	 * GET /fieldofficer/certs/gridData.do
	 * 
	 * 역할:
	 * - certs.jsp 화면에서 AJAX로 호출한다.
	 * - 검색 조건을 CertsDTO searchDTO로 받는다.
	 * - 기존 목록 조회 Service/Mapper를 재사용한다.
	 * - 결과는 JSON 배열로 반환한다.
	 */
	@ResponseBody
	@GetMapping("/certs/gridData.do")
	public List<CertsDTO> retriveCertsGridData(CertsDTO searchDTO, Authentication authentication) {
		
		searchDTO.setOfficerId(authentication.getName());
		
		/*
		 * 현재는 TOAST UI Grid의 클라이언트 페이징을 사용한다.
		 * 그래서 한 번에 넉넉하게 1000건까지 조회한다.
		 */
		PaginationInfoVO<CertsDTO> pagingVO = new PaginationInfoVO<>(1000, 5);
		
		// 1페이지 기준으로 조회
		pagingVO.setCurrentPage(1);
		
		// 검색 조건 저장
		pagingVO.setSearchDTO(searchDTO);
		
		// 기존 목록 조회 Service 재사용
		List<CertsDTO> certsList = certsService.retriveCertsList(pagingVO);
		
		// JSON으로 반환
		return certsList;
	}
	
	/*
	 * 요청 주소: 
	 * GET /fieldofficer/certs/detail.do?reqNo=검역요청번호
	 * 
	 * 처리 흐름:
	 * 1. 주소 파라미터로 reqNo를 받는다.
	 * 2. reqNo를 기준으로 검역 결과, 요청 정보, 위치 정보를 조회한다.
	 * 3. 조회 결과를 certsDetail이라는 이름으로 JSP에 전달한다.
	 * 4. fieldofficer/certsDetail.jsp 화면을 보여준다
	 */
	// 검역 합격 증명서 상세 조회
	@GetMapping("/certs/detail.do")
	public String retriveCerts(@RequestParam("reqNo") String reqNo, Authentication authentication, Model model) {
		
		String officerId = authentication.getName();
		
		// 1. 검역 합격 증명서 상세 기본정보 조회
	    // 요청번호, 증명서번호, 검역결과, 검역장소 등 1건 조회
		CertsDTO certsDetail = certsService.retriveCerts(reqNo, officerId);
		
		if (certsDetail == null) {
	        return "redirect:/fieldofficer/certs.do";
	    }
		
		// 2. 품목 상세 내역 조회
	    // IMP_DCLR_ITEM 기준으로 품목 개수만큼 여러 건 조회
		List<CertsItemDTO> certsItemList = certsService.retriveCertsItemList(reqNo);
		
		// 3. 보완요청/보완제출 정보 조회
		// SUPP_RQST 단일 테이블 기준
		// SR_REF_BIZ_CD = 'IMP_INS_REQ'
		// SR_REF_NO = reqNo
		CertsDTO suppRqst = certsService.retriveSupplementRequest(reqNo);
		
		// JSP에서 ${reqNo}로 요청 번호를 사용할 수 있게 전달
		model.addAttribute("reqNo", reqNo);
		
		// 4. 상세 기본정보를 JSP로 전달
		model.addAttribute("certsDetail", certsDetail);
		
		// 5. 품목 상세 목록을 JSP로 전달
	    // JSP에서는 이 값을 c:forEach로 반복 출력한다.
		model.addAttribute("certsItemList", certsItemList);
		
		// 6. 보완요청/보완제출 정보를 JSP로 전달
		// JSP에서는 ${suppRqst.srNo}, ${suppRqst.srStatusCd} 형태로 사용한다.
		model.addAttribute("suppRqst", suppRqst);
		
		// /WEB-INF/views/fieldofficer/certsDetail.jsp로 이동
		return "fieldofficer/certsDetail";
	}
	
	/*
     * 요청 주소: 
     * POST /fieldofficer/certs/issue.do
     * 
     * 처리 흐름:
     * 1. JSP form에서 넘어온 값을 CertsDTO certsDTO로 자동 바인딩한다.
     * 2. 로그인한 현장공무원 ID를 Authentication에서 꺼낸다.
     * 3. certsDTO에 발급 공무원 ID를 세팅한다.
     * 4. Service를 통해 증명서 발급 정보를 DB에 저장한다.
     * 5. 처리 결과 메시지를 RedirectAttributes에 담는다.
     * 6. 다시 상세 화면으로 redirect한다.
     * 
     * 주의:
     * - Service에서 최종 판정이 합격/적합인 경우만 발급 가능하도록 검증한다.
     */
	// 검역 합격 증명서 발급 처리
//	@PostMapping("/certs/issue.do")
//	public String registCertIssue(CertsDTO certsDTO, Authentication authentication, RedirectAttributes ra) {
//		
//		// 로그인한 사용자 ID를 가져옴
//		// 현재 로그인 사용자는 현장공무원이므로 발급 담당자 ID로 사용
//		String officerId = authentication.getName();
//		
//		// 발급 공무원 ID를 DTO에 저장
//		certsDTO.setOfficerId(officerId);
//		
//		try {
//			// 검역 합격 증명서 발급 등록 처리
//			certsService.registCertIssue(certsDTO);
//			
//			// redirect 후 화면에 보여줄 성공메시지
//			ra.addFlashAttribute("message", "검역 합격 증명서가 발급되었습니다.");
//		} catch (Exception e) {
//			// 발급 실패 시 오류 메시지를 화면에 전달
//			ra.addFlashAttribute("message", e.getMessage());
//		}
//		
//		// redirect URL에 한글/특수문자가 섞일 가능성을 대비해 인코딩
//		String reqNo = URLEncoder.encode(certsDTO.getReqNo(), StandardCharsets.UTF_8);
//		
//		// 발급 처리 후 다시 상세 화면으로 이동
//		return "redirect:/fieldofficer/certs/detail.do?reqNo=" + reqNo;
//	}
	
	 /*
     * 요청 주소:
	 * POST /fieldofficer/certs/supplement.do
	 *
	 * 처리 흐름:
	 * 1. JSP form에서 넘어온 값을 CertsDTO certsDTO로 자동 바인딩한다.
	 * 2. 로그인한 현장공무원 ID를 Authentication에서 꺼낸다.
	 * 3. certsDTO에 요청 발신자 ID를 세팅한다.
	 * 4. Service를 통해 보완요청 기본정보와 상세내용을 DB에 저장한다.
	 *    - SUPP_RQST 테이블에 보완요청내용까지 등록
	 *	  - IMP_INS_RESULT 후속조치 상태 수정
	 * 5. 처리 결과 메시지를 RedirectAttributes에 담는다.
	 * 6. 다시 상세 화면으로 redirect한다.
     */
	// 보완요청 등록 처리
	@PostMapping("/certs/supplement.do")
	public String registSupplementRequest(CertsDTO certsDTO, Authentication authentication, RedirectAttributes ra) {
		
		// 보완요청 등록 시 넘어온 값 확인용 로그
		// 개발 완료 후에는 삭제하거나 log/debug로 바꾸는 것이 좋음
		System.out.println("===== 보완요청 등록 Controller 진입 =====");
	    System.out.println("reqNo = " + certsDTO.getReqNo());
	    System.out.println("iirNo = " + certsDTO.getIirNo());
	    System.out.println("judgeResult = " + certsDTO.getJudgeResult());
	    System.out.println("refBizCd = " + certsDTO.getRefBizCd());
	    System.out.println("suppReqCn = " + certsDTO.getSuppReqCn());
	    System.out.println("receiverId = " + certsDTO.getReceiverId());
	    System.out.println("receiverTyCd = " + certsDTO.getReceiverTyCd());
		
	    // 로그인한 현장공무원 ID를 가져옴
		String officerId = authentication.getName();
		
		// 보완요청 발신자 ID로 사용하기 위해 DTO에 저장
		certsDTO.setOfficerId(officerId);
		
		try {
			// 보완요청 등록 처리
			certsService.registSupplementRequest(certsDTO);
			
			// redirect 후 화면에 보여줄 성공 메시지
			ra.addFlashAttribute("message", "보완요청이 등록되었습니다.");
	
		} catch (Exception e) {
			// 개발 중 오류 확인용
			// 개발 완료 후에는 삭제하거나 log.error로 변경 권장
			e.printStackTrace();	// 임시
			
			// 보완 요청 실패시 오류 메시지를 화면에 전달
			ra.addFlashAttribute("message", e.getMessage());
		}
		
		// redirect URL에 한글/특수문자가 섞일 가능성을 대비해 인코딩
		String reqNo = URLEncoder.encode(certsDTO.getReqNo(), StandardCharsets.UTF_8);
		
		// 보완요청 처리 후 다시 상세 화면으로 이동
		return "redirect:/fieldofficer/certs/detail.do?reqNo=" + reqNo;
	}
	
	
//	@PostMapping("/certs/save.do")
//	public String saveCertIssue(CertsDTO certsDTO, RedirectAttributes ra, Authentication authentication) {
//		
//		try {
//			System.out.println("===== 발급정보 저장 Controller 진입 =====");
//	        System.out.println("reqNo = " + certsDTO.getReqNo());
//	        System.out.println("iirNo = " + certsDTO.getIirNo());
//	        System.out.println("certIssueNo = " + certsDTO.getCertIssueNo());
//	        System.out.println("judgeResult = " + certsDTO.getJudgeResult());
//	        
//			// 로그인한 현장공무원 ID 세팅
//	        if (authentication == null || !authentication.isAuthenticated()) {
//	            throw new IllegalStateException("로그인 정보가 없습니다.");
//	        }
//
//	        certsDTO.setOfficerId(authentication.getName());
//			
//			
//			int result = certsService.saveCertIssue(certsDTO);
//			
//			if (result > 0) {
//				ra.addFlashAttribute("msg", "발급정보가 저장되었습니다.");
//			} else {
//				ra.addFlashAttribute("msg", "저장된 발급정보가 없습니다.");
//			}
//			
//		} catch (Exception e) {
//			e.printStackTrace();
//			ra.addFlashAttribute("msg", "발급정보 저장 중 오류가 발생했습니다." + e.getMessage());
//		}
//		
//		return "redirect:/fieldofficer/certs/detail.do?reqNo=" + certsDTO.getReqNo();
//		
//	}
	
	/**
	 * 검역 합격 증명서 PDF 발급 및 문서 저장
	 *
	 * 처리 흐름:
	 * 1. 화면에서 검역요청번호와 최종 판정 정보를 전달받는다.
	 * 2. 로그인한 현장공무원 ID를 세팅한다.
	 * 3. Service에서 PDF를 생성하고 공통 파일/Google Drive에 저장한다.
	 * 4. 발급 완료 후 상세 화면으로 이동한다.
	 */
	@PostMapping("/certs/issue/pdf.do")
	public String issueCertPdf(CertsDTO certsDTO,
	                           Authentication authentication,
	                           RedirectAttributes ra) {

	    try {
	        String officerId = authentication.getName();
	        certsDTO.setOfficerId(officerId);

	        certsService.issueCertPdf(certsDTO);

	        ra.addFlashAttribute("msg", "검역 합격 증명서가 발급되어 문서함에 저장되었습니다.");

	    } catch (Exception e) {
	        e.printStackTrace();
	        ra.addFlashAttribute("msg", "검역 합격 증명서 발급 중 오류가 발생했습니다. " + e.getMessage());
	    }

	    String reqNo = URLEncoder.encode(certsDTO.getReqNo(), StandardCharsets.UTF_8);

	    return "redirect:/fieldofficer/certs/detail.do?reqNo=" + reqNo;
	}
	
	@PostMapping("/certs/supplement/approve.do")
	public String modifySupplementApprove(@RequestParam("srNo") String srNo, @RequestParam("reqNo") String reqNo, RedirectAttributes ra) {
		
		certsService.modifySupplementApprove(srNo);
		
		ra.addFlashAttribute("msg", "보완 제출내용을 확인 완료 처리했습니다.");
		
		return "redirect:/fieldofficer/certs/detail.do?reqNo=" + reqNo;
		
	}
	
	/**
	 * 검역 합격 증명서 발급 목록 엑셀 다운로드
	 *
	 * 화면의 검색 조건을 그대로 받아서
	 * 조건에 맞는 전체 목록을 엑셀 파일로 다운로드한다.
	 *
	 * 요청 URL:
	 * GET /fieldofficer/certs/excel.do
	 *
	 * @param searchDTO 검색 조건
	 * @param response  엑셀 파일 다운로드 응답 객체
	 */
	@GetMapping("/certs/excel.do")
	public void downloadCertsExcel(CertsDTO searchDTO, Authentication authentication, HttpServletResponse response) throws Exception {
		
		searchDTO.setOfficerId(authentication.getName());

	    // 1. 검색 조건에 맞는 엑셀 파일 byte[] 생성
	    byte[] excelBytes = certsService.downloadCertsExcel(searchDTO);

	    // 2. 다운로드 파일명 설정
	    String fileName = URLEncoder
	            .encode("검역합격증명서_발급목록.xlsx", StandardCharsets.UTF_8)
	            .replaceAll("\\+", "%20");

	    // 3. 응답 헤더 설정
	    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
	    response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + fileName);
	    response.setContentLength(excelBytes.length);

	    // 4. 브라우저로 파일 출력
	    response.getOutputStream().write(excelBytes);
	    response.getOutputStream().flush();
	}

}











