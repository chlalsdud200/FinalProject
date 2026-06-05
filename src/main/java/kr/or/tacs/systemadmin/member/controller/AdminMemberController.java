package kr.or.tacs.systemadmin.member.controller;

import jakarta.validation.Valid;
import kr.or.tacs.systemadmin.member.service.IAdminMemberService;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.member.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tacs/admin/members")
public class AdminMemberController {

    private final IAdminMemberService adminMemberService;

    /**
     * 관리자 회원 목록 조회 API.
     */
    @GetMapping
    public PaginationInfoVO<AdminMemberListVO> retriveMemberList(
            @ModelAttribute AdminMemberSearchVO searchVO
    ) {
        return adminMemberService.retriveMemberList(searchVO);
    }

    /**
     * 관리자 회원 통계 조회 API (액터유형별 건수)
     */
    @GetMapping("/statistics")
    public Map<String, Object> getMemberStatistics() {
        return adminMemberService.getMemberStatistics();
    }

    /**
     * 로그인 ID 중복 확인 API
     * GET /api/tacs/admin/members/check-login-id?loginId={loginId}
     */
    @GetMapping("/check-login-id")
    public Map<String, Object> checkLoginIdAvailability(@RequestParam(required = false) String loginId) {
        if (loginId == null || loginId.trim().isEmpty()) {
            return Map.of(
                "available", false,
                "message", "로그인 ID를 입력하세요."
            );
        }
        return adminMemberService.checkLoginIdAvailability(loginId);
    }

    /**
     * 신규 액터 등록 API
     * POST /api/tacs/admin/members/{actorTypeCd}
     */
    @PostMapping("/{actorTypeCd}")
    public Map<String, Object> registAdminMember(
            @PathVariable String actorTypeCd,
            @RequestBody Map<String, Object> requestMap
    ) {
        String adminId = getLoginId();
        return adminMemberService.registAdminMember(actorTypeCd, requestMap, adminId);
    }

    /**
     * 액터별 회원 상세 조회 API
     * GET /api/tacs/admin/members/{actorTypeCd}/{loginId}
     */
    @GetMapping("/{actorTypeCd}/{loginId}")
    public AdminMemberDetailResponseVO retrieveMemberDetail(
            @PathVariable String actorTypeCd,
            @PathVariable String loginId
    ) {
        return adminMemberService.retrieveMemberDetail(actorTypeCd, loginId);
    }

    /**
     * 액터별 회원 상세 수정 API
     * PATCH /api/tacs/admin/members/{actorTypeCd}/{loginId}/profile
     */
    @PatchMapping("/{actorTypeCd}/{loginId}/profile")
    public Map<String, Object> updateMemberProfile(
            @PathVariable String actorTypeCd,
            @PathVariable String loginId,
            @RequestBody @Valid AdminMemberProfileUpdateRequestVO requestVO
    ) {
        String adminId = getLoginId();

        return adminMemberService.updateMemberProfile(actorTypeCd, loginId, requestVO, adminId);
    }

    /**
     * 단건 회원 사용여부 변경 API
     * PATCH /api/tacs/admin/members/{actorTypeCd}/{loginId}/use-yn
     */
    @PatchMapping("/{actorTypeCd}/{loginId}/use-yn")
    public Map<String, Object> updateMemberUseYn(
            @PathVariable String actorTypeCd,
            @PathVariable String loginId,
            @RequestBody @Valid AdminMemberUseYnRequestVO requestVO
    ) {
        String adminId = getLoginId();

        return adminMemberService.updateMemberUseYn(actorTypeCd, loginId, requestVO, adminId);
    }

    /**
     * 일괄 회원 사용여부 변경 API
     * PATCH /api/tacs/admin/members/use-yn/bulk
     */
    @PatchMapping("/use-yn/bulk")
    public Map<String, Object> updateBulkMemberUseYn(
            @RequestBody @Valid AdminMemberBulkUseYnRequestVO requestVO
    ) {
        String adminId = getLoginId();

        return adminMemberService.updateBulkMemberUseYn(requestVO, adminId);
    }

    /**
     * 공무원 세부유형 변경 API
     * PATCH /api/tacs/admin/members/OFFICER/{loginId}/officer-type
     */
    @PatchMapping("/OFFICER/{loginId}/officer-type")
    public Map<String, Object> updateOfficerType(
            @PathVariable String loginId,
            @RequestBody @Valid AdminOfficerTypeChangeRequestVO requestVO
    ) {
        String adminId = getLoginId();

        return adminMemberService.updateOfficerType(loginId, requestVO, adminId);
    }

    /**
     * 액터별 가장 최근 등록된 ID 조회 API
     * GET /api/tacs/admin/members/{actorTypeCd}/latest-id
     */
    @GetMapping("/{actorTypeCd}/latest-id")
    public Map<String, Object> getLatestLoginId(@PathVariable String actorTypeCd) {
        return adminMemberService.getLatestLoginId(actorTypeCd);
    }

    /**
     * 공무원 유형별 가장 최근 등록된 ID 조회 API
     * GET /api/tacs/admin/members/OFFICER/latest-id-by-type?officerTyCd={officerTyCd}
     */
    @GetMapping("/OFFICER/latest-id-by-type")
    public Map<String, Object> getLatestOfficerId(@RequestParam String officerTyCd) {
        return adminMemberService.getLatestOfficerId(officerTyCd);
    }

    private String getLoginId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUser) {
            return ((CustomUser) principal).getLoginId();
        }
        return principal.toString();
    }
}
