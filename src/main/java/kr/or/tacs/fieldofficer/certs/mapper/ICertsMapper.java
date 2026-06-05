package kr.or.tacs.fieldofficer.certs.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.tacs.dto.fieldofficer.certs.CertsDTO;
import kr.or.tacs.dto.fieldofficer.certs.CertsItemDTO;
import kr.or.tacs.vo.common.PaginationInfoVO;

@Mapper
public interface ICertsMapper {

	// 검역 합격 증명서 발급 대상 전체 건수 조회
	public int selectCertsCount(PaginationInfoVO<CertsDTO> pagingVO);
	
	// 검역 합격 증명서 발급 대상 목록 조회
	public List<CertsDTO> retriveCertsList(PaginationInfoVO<CertsDTO> pagingVO);
	
	// 검역 합격 증명서 발급 목록 엑셀 다운로드용 전체 목록 조회
	public List<CertsDTO> selectCertsExcelList(CertsDTO searchDTO);

	// 검역 합격 증명서 상세 조회
	public CertsDTO selectCerts(@Param("reqNo") String reqNo, @Param("officerId") String officerId);
	
	// 검역 합격 증명서 발급 저장
	public int insertCertIssue(CertsDTO certsDTO);

	// 보완요청 기본정보 등록
	public int insertSuppRqst(CertsDTO certsDTO);
	
	// 보완요청/보완제출 정보 조회
	public CertsDTO selectSupplementRequest(@Param("reqNo") String reqNo);
	
	// 보완제출 확인완료 처리
	public int updateSupplementApprove(@Param("srNo") String srNo);

	// 보완요청 선택 시 검역결과 후속조치 수정
	public int updateResultForSupplement(CertsDTO certsDTO);

	// 검역 합격 증명서 발급정보 저장
	public int saveCertIssue(CertsDTO certsDTO);

	// 발급정보 저장 시 검역 결과 판정값 수정
	public int updateResultJudge(CertsDTO certsDTO);

	// 검역 합격 증명서 품목 상세 내역 조회
	public List<CertsItemDTO> selectCertsItemList(@Param("reqNo") String reqNo);
	
	// 발급정보 저장 시 검역 결과가 없으면 INSERT, 있으면 UPDATE
	public int mergeResultJudge(CertsDTO certsDTO);

	// 최종 판정 저장 후 검역요청 상태/완료일시 수정
	int updateRequestCompleteStatus(CertsDTO certsDTO);
	
	

	

	
	

}
