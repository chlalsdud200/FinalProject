package kr.or.tacs.systemadmin.member.service;

import java.util.List;

import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.member.*;

import java.util.Map;

public interface IAdminMemberService {

    PaginationInfoVO<AdminMemberListVO> retriveMemberList(AdminMemberSearchVO searchVO);

    Map<String, Object> getMemberStatistics();

    /**
     * 로그인 ID 중복 확인
     */
    Map<String, Object> checkLoginIdAvailability(String loginId);

    /**
     * 신규 액터 등록
     */
    Map<String, Object> registAdminMember(
            String actorTypeCd,
            Map<String, Object> requestMap,
            String adminId
    );

    /**
     * 액터별 원본 테이블 기준 회원 상세 조회
     */
    AdminMemberDetailResponseVO retrieveMemberDetail(
            String actorTypeCd,
            String loginId
    );

    /**
     * 액터별 원본 테이블 기준 회원 상세 수정
     */
    Map<String, Object> updateMemberProfile(
            String actorTypeCd,
            String loginId,
            AdminMemberProfileUpdateRequestVO requestVO,
            String adminId
    );

    /**
     * 단건 회원 사용여부 변경
     */
    Map<String, Object> updateMemberUseYn(
            String actorTypeCd,
            String loginId,
            AdminMemberUseYnRequestVO requestVO,
            String adminId
    );

    /**
     * 일괄 회원 사용여부 변경
     */
    Map<String, Object> updateBulkMemberUseYn(
            AdminMemberBulkUseYnRequestVO requestVO,
            String adminId
    );

    /**
     * 공무원 유형 변경
     */
    Map<String, Object> updateOfficerType(
            String loginId,
            AdminOfficerTypeChangeRequestVO requestVO,
            String adminId
    );

    /**
     * 액터별 가장 최근 로그인 ID 조회
     */
    Map<String, Object> getLatestLoginId(String actorTypeCd);

    /**
     * 공무원 유형별 가장 최근 로그인 ID 조회
     */
    Map<String, Object> getLatestOfficerId(String officerTyCd);
}
