package kr.or.tacs.fieldofficer.certs.service;

import java.util.List;

import kr.or.tacs.dto.fieldofficer.certs.CertPdfIssueResultDTO;
import kr.or.tacs.dto.fieldofficer.certs.CertsDTO;
import kr.or.tacs.dto.fieldofficer.certs.CertsItemDTO;
import kr.or.tacs.vo.common.PaginationInfoVO;

public interface ICertsService {
	
	// 검역 합격 증명서 발급 대상 전체 건수 조회
	public int retriveCertsCount(PaginationInfoVO<CertsDTO> pagingVO);
	
	// 검역 합격 증명서 발급 대상 목록 조회
	public List<CertsDTO> retriveCertsList(PaginationInfoVO<CertsDTO> pagingVO);
	
	// 검역 합격 증명서 상세 조회
	public CertsDTO retriveCerts(String reqNo, String officerId);

	// 검역 합격 증명서 발급 등록
	public int registCertIssue(CertsDTO certsDTO);

	// 보완요청 등록
	public int registSupplementRequest(CertsDTO certsDTO);

	// 검역 합격 증명서 발급 정보 저장
	public int saveCertIssue(CertsDTO certsDTO);

	// 검역 합격 증명서 품목 상세 내역 조회
	public List<CertsItemDTO> retriveCertsItemList(String reqNo);
	
	/**
	 * 검역 합격 증명서 PDF 발급
	 * 
	 * @param reqNo 검역요청번호
	 * @param officerId 로그인한 현장공무원 ID
	 * @return PDF 파일명 + PDF byte[]
	 */
	public CertPdfIssueResultDTO issueCertPdf(CertsDTO certsDTO) throws Exception;

	/**
	 * 보완요청/보완제출 정보 조회
	 *
	 * SUPP_RQST 단일 테이블 기준으로 조회한다.
	 * - SR_REF_BIZ_CD = 'IMP_INS_REQ'
	 * - SR_REF_NO = 검역요청번호(reqNo)
	 *
	 * @param reqNo 검역요청번호
	 * @return 보완요청 정보
	 */
	public CertsDTO retriveSupplementRequest(String reqNo);

	/**
	 * 보완제출 확인완료 처리
	 *
	 * SUPP_RQST 상태를 APR로 변경하고,
	 * SR_APPR_DT를 현재 시각으로 저장한다.
	 *
	 * @param srNo 보완요청번호
	 * @return 수정 건수
	 */
	public int modifySupplementApprove(String srNo);

	// 검역 합격 증명서 발급 목록 엑셀 다운로드
	public byte[] downloadCertsExcel(CertsDTO searchDTO) throws Exception;
	
}
