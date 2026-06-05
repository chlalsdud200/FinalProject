package kr.or.tacs.fieldofficer.inspection.service;

import java.util.List;

import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.fieldofficer.Inspection.InspectionFileVO;
import kr.or.tacs.vo.fieldofficer.Inspection.InspectionRequestItemVO;
import kr.or.tacs.vo.fieldofficer.Inspection.InspectionRequestVO;

public interface IInspectionService {

	// 검역 요청 상세 조회
	/* 
	 * 검역요청번호(reqNo)를 기준으로 검역 요청 기본정보, 위치정보, 검역 결과 정보를 조회
	 * 검역 요청 상세 JSP의 inspectionDetail로 사용
	 */
	public InspectionRequestVO retriveInspectionRequest(String reqNo);

	// 검역 요청 전체 건수 조회
	/*
	 * 검색 조건에 맞는 전체 검역 요청 건수를 조회
	 * 페이지네이션에서 전체 페이지 수를 계산하기 위해 사용
	 */
	public int retriveInspectionRequestCount(PaginationInfoVO<InspectionRequestVO> pagingVO);

	// 검역 요청 목록 조회
	/*
	 * 현재 페이지에 해당하는 검역 요청 목록 조회
	 * pagingVO 안의 startRow, endRow, searchDTO 기준으로 목록 조회
	 */
	public List<InspectionRequestVO> retriveInspectionRequestList(PaginationInfoVO<InspectionRequestVO> pagingVO);
	
	// 검역 요청 상세 - 품목 목록 조회
	/*
	* 검역요청번호(reqNo)를 기준으로 해당 요청에 포함된 검역대상 품목 목록을 조회
	* 검역 요청 상세 JSP의 inspectionItemList로 사용
	*/
	public List<InspectionRequestItemVO> retriveInspectionItemList(String reqNo);

	// 검역 요청 상세 - 첨부서류 목록 조회
	/*
	 * 검역요청번호(reqNo)를 기준으로 첨부파일 목록을 조회
	 * IMP_INS_REQ.IIR_TFG_NO 파일그룹번호를 이용해 TACS_FILE_MAP, DOCS_FILE_DATA와 연결된 파일 정보를 가져옴
	 * 검역 요청 상세 JSP의 inspectionFileList로 사용
	 */
	public List<InspectionFileVO> retriveInspectionFileList(String reqNo);

	// 검역 요청 첨부 서류 다운로드용 단건 조회
	/*
	 * 파일번호(fileNo)를 기준으로 실제 다운로드 할 파일 정보를 조회
	 * DOCS_FILE_DATA의 원본파일명, 저장파일명, 저장경로 등을 가져옴
	 * Controller에서 실제 파일 다운로드 응답을 만들때 사용
	 */
	public InspectionFileVO retriveInspectionFile(int fileNo);
}




