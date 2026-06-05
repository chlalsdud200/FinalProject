package kr.or.tacs.broker.quarantine.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.tacs.vo.broker.quarantine.QuarantineItemVO;
import kr.or.tacs.vo.broker.quarantine.QuarantineVO;

@Mapper
public interface IQuarantineMapper {

    // 검역 결과 조회 목록
    List<QuarantineVO> selectImportQuarantineResultList(QuarantineVO searchVO);

    // 검역 결과 상세 조회
    QuarantineVO selectImportQuarantineDetail(String iirReqNo);

    // 수입검역신청 가능한 수입의뢰 목록 조회
    List<QuarantineVO> selectImportRequestCandidateList(String brokerId);

    // 수입검역신청용 수입의뢰 단건 조회
    QuarantineVO selectImportRequestForQuarantine(QuarantineVO param);

    // 이미 검역신청이 등록된 수입의뢰인지 확인
    int countImportQuarantineRequest(String irNo);

    // 수입검역요청 기본정보 등록
    int insertImportQuarantineRequest(QuarantineVO quarantineVO);

    // 수입검역장소 등록
    int insertImportQuarantineLocation(QuarantineVO quarantineVO);

    // 수입검역대상 품목 등록
    int insertImportQuarantineItem(QuarantineItemVO itemVO);

    // 수입검역요청 생성 이력 등록
    int insertImportQuarantineHistory(QuarantineVO quarantineVO);
    
    // 검역 담당 공무원의 소속기관 코드 조회
    String selectOfficerInstCd(String officerId);
    
    // 수입검역요청 첨부파일 그룹번호 수정
    int updateImportQuarantineFileGroup(QuarantineVO quarantineVO);

    // 검역기관이 발급한 검역 합격 증명서 파일번호 조회
	Long selectIssuedCertFileNo(QuarantineVO param);

	// 관세사 보완완료 제출
	int updateSupplementSubmit(QuarantineVO quarantineVO);

	// 보완제출 후 검역결과 후속조치 수정
	int updateResultAfterSupplementSubmit(QuarantineVO quarantineVO);
	
	// 수입의뢰 기준 검역장소 선택 목록 조회
	List<QuarantineVO> selectWarehouseLocationListByImportRequest(QuarantineVO param);

	// 현장공무원 선택 목록 조회
	List<QuarantineVO> selectFieldOfficerList();
	
	// 검역결과 상세 - 검역대상 품목 목록 조회
	List<QuarantineItemVO> selectImportQuarantineItemList(String iirReqNo);
}