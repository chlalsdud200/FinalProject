package kr.or.tacs.fieldofficer.inspection.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.fieldofficer.Inspection.InspectionFileVO;
import kr.or.tacs.vo.fieldofficer.Inspection.InspectionRequestItemVO;
import kr.or.tacs.vo.fieldofficer.Inspection.InspectionRequestVO;

@Mapper
public interface IInspectionMapper {

	/*
	 * 검역 요청 전체 건수 조회
	 *
	 * 역할:
	 * - 검색 조건에 맞는 전체 검역 요청 건수를 조회한다.
	 * - Controller에서 totalPage 계산에 사용된다.
	 * - Mapper XML의 selectInspectionRequestCount 쿼리와 연결된다.
	 */
	public int selectInspectionRequestCount(PaginationInfoVO<InspectionRequestVO> pagingVO);

	/*
	 * 검역 요청 목록 조회
	 *
	 * 역할:
	 * - 현재 페이지에 해당하는 검역 요청 목록만 조회한다.
	 * - PaginationInfoVO 안의 startRow, endRow를 기준으로 조회한다.
	 * - 검색 조건은 pagingVO.searchDTO 안에 들어 있다.
	 * - Mapper XML의 retriveInspectionRequestList 쿼리와 연결된다.
	 */
	public List<InspectionRequestVO> retriveInspectionRequestList(PaginationInfoVO<InspectionRequestVO> pagingVO);
	
	/*
	 * 검역 요청 상세 조회
	 *
	 * 역할:
	 * - 검역요청번호 reqNo를 기준으로 상세 정보를 조회한다.
	 *  - IMP_INS_REQ, IMP_INS_LOC, IMP_INS_RESULT를 중심으로 조회한다.
     * - Mapper XML의 selectInspectionRequest 쿼리와 연결된다.
	 */
	public InspectionRequestVO selectInspectionRequest(@Param("reqNo") String reqNo);
	
	/*
     * 검역 요청 상세 - 품목 목록 조회
     *
     * 역할:
     * - 검역요청번호(reqNo)를 기준으로 IMP_INS_REQ_ITEM 목록을 조회한다.
     * - Mapper XML의 selectInspectionItemList 쿼리와 연결된다.
     */
	public List<InspectionRequestItemVO> selectInspectionItemList(@Param("reqNo") String reqNo);

	 /*
     * 검역 요청 상세 - 첨부서류 목록 조회
     *
     * 역할:
     * - 검역요청번호(reqNo)를 기준으로 첨부서류 목록을 조회한다.
     * - IMP_INS_REQ.IIR_TFG_NO 파일그룹번호를 기준으로
     *   TACS_FILE_MAP, DOCS_FILE_DATA를 조인한다.
     * - Mapper XML의 selectInspectionFileList 쿼리와 연결된다.
     */
	public List<InspectionFileVO> selectInspectionFileList(@Param("reqNo") String reqNo);

	/*
     * 검역 요청 첨부서류 다운로드용 단건 조회
     *
     * 역할:
     * - 파일번호(fileNo)를 기준으로 DOCS_FILE_DATA에서 파일 정보를 조회한다.
     * - 실제 파일 저장 경로, 저장 파일명, 원본 파일명을 가져온다.
     * - Mapper XML의 selectInspectionFile 쿼리와 연결된다.
     */
	public InspectionFileVO selectInspectionFile(@Param("fileNo") int fileNo);
	
}
