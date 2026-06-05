package kr.or.tacs.fieldofficer.inspection.service;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.or.tacs.fieldofficer.inspection.mapper.IInspectionMapper;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.fieldofficer.Inspection.InspectionFileVO;
import kr.or.tacs.vo.fieldofficer.Inspection.InspectionRequestItemVO;
import kr.or.tacs.vo.fieldofficer.Inspection.InspectionRequestVO;

@Service
public class InspectionServiceImpl implements IInspectionService {
	
	private final IInspectionMapper inspectionMapper;
	
	public InspectionServiceImpl(IInspectionMapper inspectionMapper) {
		this.inspectionMapper = inspectionMapper;
	}

	/*
	 * 검역 요청 전체 건수 조회
	 *
	 * 처리 흐름:
	 * 1. Controller에서 전달받은 PaginationInfoVO를 Mapper로 넘긴다.
	 * 2. Mapper에서 검색 조건에 맞는 전체 검역 요청 건수를 조회한다.
	 * 3. 조회된 전체 건수는 Controller에서 pagingVO.setTotalRecord()에 사용된다.
	 */
	@Override
	public int retriveInspectionRequestCount(PaginationInfoVO<InspectionRequestVO> pagingVO) {
		return inspectionMapper.selectInspectionRequestCount(pagingVO);
	}

	/*
	 * 검역 요청 목록 조회
	 *
	 * 처리 흐름:
	 * 1. Controller에서 현재 페이지 정보가 담긴 PaginationInfoVO를 전달받는다.
	 * 2. PaginationInfoVO에는 searchDTO, startRow, endRow가 들어 있다.
	 * 3. Mapper XML에서 startRow, endRow 기준으로 현재 페이지 목록만 조회한다.
	 */
	@Override
	public List<InspectionRequestVO> retriveInspectionRequestList(PaginationInfoVO<InspectionRequestVO> pagingVO) {
		return inspectionMapper.retriveInspectionRequestList(pagingVO);
	}

	// 검역 요청 상세 조회
	@Override
	public InspectionRequestVO retriveInspectionRequest(String reqNo) {
		return inspectionMapper.selectInspectionRequest(reqNo);
	}

	@Override
	public List<InspectionRequestItemVO> retriveInspectionItemList(String reqNo) {
		return inspectionMapper.selectInspectionItemList(reqNo);
	}

	// 검역 요청 첨부서류 목록 조회
	@Override
	public List<InspectionFileVO> retriveInspectionFileList(String reqNo) {
		return inspectionMapper.selectInspectionFileList(reqNo);
	}

	// 검역 요청 첨부서류 다운로드용 단건 조회
	@Override
	public InspectionFileVO retriveInspectionFile(int fileNo) {
		return inspectionMapper.selectInspectionFile(fileNo);
	}

}
