package kr.or.tacs.systemadmin.member.mapper;

import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberChangeLogVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberListVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberSearchVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface IAdminMemberMapper {

    // 관리자 회원 전체 건수 조회
    //@Param을 쓰는 이유 PaginationInfoVO,AdminMemberSearchVO 를 각각 xml에서 따로 쓰려고
    int selectMemberTotalRecord(@Param("searchVO") AdminMemberSearchVO searchVO);

    // 로그인 ID 중복 체크 (전체 액터 대상)
    int countLoginId(@Param("loginId") String loginId);

    // 관리자 회원 통계 조회 (액터유형별 건수)
    List<Map<String, Object>> selectMemberStatistics();

    // 관리자 회원 페이지 목록 조회
    List<AdminMemberListVO> selectMemberList(
            @Param("pagingVO") PaginationInfoVO<AdminMemberListVO> pagingVO,
            @Param("searchVO") AdminMemberSearchVO searchVO
    );

    // 회원 상세 정보 조회 (useYn 변경 전 상태 확인용)
    AdminMemberListVO selectMemberDetail(
            @Param("actorTypeCd") String actorTypeCd,
            @Param("loginId") String loginId
    );

    int insertBrokerMember(@Param("params") Map<String, Object> params);
    int insertOfficerMember(@Param("params") Map<String, Object> params);
    int insertTransportManagerMember(@Param("params") Map<String, Object> params);
    int insertWarehouseManagerMember(@Param("params") Map<String, Object> params);

    Map<String, Object> selectOwnerProfile(@Param("loginId") String loginId);
    Map<String, Object> selectBrokerProfile(@Param("loginId") String loginId);
    Map<String, Object> selectOfficerProfile(@Param("loginId") String loginId);
    Map<String, Object> selectTransportManagerProfile(@Param("loginId") String loginId);
    Map<String, Object> selectWarehouseManagerProfile(@Param("loginId") String loginId);
    Map<String, Object> selectSystemAdminProfile(@Param("loginId") String loginId);

    // 현재 활성 상태인 시스템관리자 수 조회
    int selectActiveSystemAdminCount();

    // 공무원 유형 변경
    int updateOfficerType(@Param("loginId") String loginId, @Param("officerTyCd") String officerTyCd);

    // 각 액터별 사용여부 업데이트
    int updateOwnerUseYn(@Param("loginId") String loginId, @Param("useYn") String useYn);
    int updateBrokerUseYn(@Param("loginId") String loginId, @Param("useYn") String useYn);
    int updateOfficerUseYn(@Param("loginId") String loginId, @Param("useYn") String useYn);
    int updateTransportManagerUseYn(@Param("loginId") String loginId, @Param("useYn") String useYn);
    int updateWarehouseManagerUseYn(@Param("loginId") String loginId, @Param("useYn") String useYn);
    int updateSystemAdminUseYn(@Param("loginId") String loginId, @Param("useYn") String useYn);

    int updateOwnerProfile(@Param("loginId") String loginId, @Param("changes") Map<String, Object> changes);
    int updateBrokerProfile(@Param("loginId") String loginId, @Param("changes") Map<String, Object> changes);
    int updateOfficerProfile(@Param("loginId") String loginId, @Param("changes") Map<String, Object> changes);
    int updateTransportManagerProfile(@Param("loginId") String loginId, @Param("changes") Map<String, Object> changes);
    int updateWarehouseManagerProfile(@Param("loginId") String loginId, @Param("changes") Map<String, Object> changes);
    int updateSystemAdminProfile(@Param("loginId") String loginId, @Param("changes") Map<String, Object> changes);

    // 회원 변경 이력 저장
    int insertAdminMemberChangeLog(AdminMemberChangeLogVO logVO);

    /**
     * 액터별 가장 최근 등록된 로그인 ID 조회
     */
    String selectLatestLoginId(@Param("actorTypeCd") String actorTypeCd);

    /**
     * 공무원 유형별 가장 최근 등록된 ID 조회 (Annotation 방식)
     */
    @org.apache.ibatis.annotations.Select("SELECT MAX(officer_id) FROM officer WHERE officer_ty_cd = #{officerTyCd}")
    String selectLatestOfficerId(@Param("officerTyCd") String officerTyCd);
}
