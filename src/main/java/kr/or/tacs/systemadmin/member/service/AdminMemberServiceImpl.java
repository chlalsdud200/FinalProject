package kr.or.tacs.systemadmin.member.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import kr.or.tacs.systemadmin.member.mapper.IAdminMemberMapper;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberBulkUseYnRequestVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberChangeLogVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberDetailFieldVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberDetailResponseVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberListVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberProfileUpdateRequestVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberSearchVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberTargetVO;
import kr.or.tacs.vo.systemadmin.member.AdminMemberUseYnRequestVO;
import kr.or.tacs.vo.systemadmin.member.AdminOfficerTypeChangeRequestVO;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AdminMemberServiceImpl implements IAdminMemberService {

    private final IAdminMemberMapper adminMemberMapper;
    private final PasswordEncoder passwordEncoder;
    private static final Map<String, ActorProfileSpec> PROFILE_SPECS = createProfileSpecs();

    private static Map<String, ActorProfileSpec> createProfileSpecs() {
        Map<String, ActorProfileSpec> specs = new LinkedHashMap<>();

        specs.put("OWNER", new ActorProfileSpec(Arrays.asList(
                field("owrId", "OWR_ID", "화주 ID", false, false, "text", true),
                field("owrTyCd", "OWR_TY_CD", "화주 유형", true, false, "text", true),
                field("owrNm", "OWR_NM", "이름/상호명", true, false, "text", true),
                field("owrBizrno", "OWR_BIZRNO", "사업자등록번호", true, false, "text", false),
                field("owrIdentNo", "OWR_IDENT_NO", "주민등록번호", false, true, "text", false),
                field("owrCstmIdfNo", "OWR_CSTM_IDF_NO", "개인통관고유부호", true, false, "text", false),
                field("owrEmail", "OWR_EMAIL", "이메일", true, false, "text", true),
                field("owrTelno", "OWR_TELNO", "전화번호", true, false, "text", true),
                field("owrZip", "OWR_ZIP", "우편번호", true, false, "text", true),
                field("owrAdres", "OWR_ADRES", "주소", true, false, "text", true),
                field("owrDetailAdres", "OWR_DETAIL_ADRES", "상세주소", true, false, "text", false),
                field("owrUseYn", "OWR_USE_YN", "사용여부", true, false, "useYn", true),
                field("owrRegistDt", "OWR_REGIST_DT", "등록일", false, false, "text", true),
                field("owrUpdtDt", "OWR_UPDT_DT", "수정일", false, false, "text", true),
                field("privacyAgreeYn", "PRIVACY_AGREE_YN", "개인정보 동의여부", false, false, "text", true),
                field("owrCorpRegNo", "OWR_CORP_REG_NO", "법인등록번호", true, false, "text", false)
        )));

        specs.put("BROKER", new ActorProfileSpec(Arrays.asList(
                field("brokerId", "BROKER_ID", "관세사 ID", false, false, "text", true),
                field("brokerTyCd", "BROKER_TY_CD", "관세사 유형", true, false, "text", true),
                field("brokerNm", "BROKER_NM", "관세사명", true, false, "text", true),
                field("brokerOfficeNm", "BROKER_OFFICE_NM", "관세사 사무소명", true, false, "text", true),
                field("brokerRegNo", "BROKER_REG_NO", "관세사 등록번호", true, false, "text", true),
                field("brokerBizrno", "BROKER_BIZRNO", "사업자등록번호", true, false, "text", false),
                field("brokerSpcltyCd", "BROKER_SPCLTY_CD", "전문분야", true, false, "text", false),
                field("brokerEmail", "BROKER_EMAIL", "이메일", true, false, "text", true),
                field("brokerTelno", "BROKER_TELNO", "전화번호", true, false, "text", false),
                field("brokerZip", "BROKER_ZIP", "우편번호", true, false, "text", false),
                field("brokerAdres", "BROKER_ADRES", "주소", true, false, "text", true),
                field("brokerDetailAdres", "BROKER_DETAIL_ADRES", "상세주소", true, false, "text", false),
                field("brokerUseYn", "BROKER_USE_YN", "사용여부", true, false, "useYn", true),
                field("brokerRegistDt", "BROKER_REGIST_DT", "등록일", false, false, "text", true),
                field("brokerUpdtDt", "BROKER_UPDT_DT", "수정일", false, false, "text", true)
        )));

        specs.put("OFFICER", new ActorProfileSpec(Arrays.asList(
                field("officerId", "OFFICER_ID", "공무원 ID", false, false, "text", true),
                field("officerTyCd", "OFFICER_TY_CD", "공무원 유형", true, false, "text", true),
                field("officerName", "OFFICER_NAME", "세관/기관명", true, false, "text", true),
                field("officerNm", "OFFICER_NM", "공무원명", true, false, "text", true),
                field("officerInstCd", "OFFICER_INST_CD", "소속기관코드", true, false, "text", true),
                field("officerDeptCd", "OFFICER_DEPT_CD", "부서코드", true, false, "text", true),
                field("officerClsfCd", "OFFICER_CLSF_CD", "직급코드", true, false, "text", true),
                field("officerFieldCd", "OFFICER_FIELD_CD", "분야코드", true, false, "text", false),
                field("officerEmail", "OFFICER_EMAIL", "이메일", true, false, "text", true),
                field("officerTelno", "OFFICER_TELNO", "전화번호", true, false, "text", true),
                field("officerZip", "OFFICER_ZIP", "우편번호", true, false, "text", false),
                field("officerAdres", "OFFICER_ADRES", "주소", true, false, "text", true),
                field("officerDetailAdres", "OFFICER_DETAIL_ADRES", "상세주소", true, false, "text", false),
                field("officerUseYn", "OFFICER_USE_YN", "사용여부", true, false, "useYn", true),
                field("officerRegistDt", "OFFICER_REGIST_DT", "등록일", false, false, "text", true),
                field("officerUpdtDt", "OFFICER_UPDT_DT", "수정일", false, false, "text", true)
        )));

        specs.put("TRANSPORT_MANAGER", new ActorProfileSpec(Arrays.asList(
                field("tmNo", "TM_NO", "운송담당자 번호", false, false, "text", true),
                field("tmId", "TM_ID", "운송담당자 ID", false, false, "text", false),
                field("tmCpNm", "TM_CP_NM", "운송사명", true, false, "text", true),
                field("tmCpTelno", "TM_CP_TELNO", "운송사 전화번호", true, false, "text", false),
                field("tmMnCd", "TM_MN_CD", "운송수단", true, false, "text", true),
                field("tmName", "TM_NAME", "담당자명", true, false, "text", false),
                field("tmUseYn", "TM_USE_YN", "사용여부", true, false, "useYn", true)
        )));

        specs.put("WAREHOUSE_MANAGER", new ActorProfileSpec(Arrays.asList(
                field("wmId", "WM_ID", "창고관리자 ID", false, false, "text", true),
                field("wmNm", "WM_NM", "창고관리자명", true, false, "text", true),
                field("wmEmail", "WM_EMAIL", "이메일", true, false, "text", true),
                field("wmTelno", "WM_TELNO", "전화번호", true, false, "text", true),
                field("wmZip", "WM_ZIP", "우편번호", true, false, "text", false),
                field("wmAdres", "WM_ADRES", "주소", true, false, "text", false),
                field("wmDetailAdres", "WM_DETAIL_ADRES", "상세주소", true, false, "text", false),
                field("wmUseYn", "WM_USE_YN", "사용여부", true, false, "useYn", true),
                field("wmRegistDt", "WM_REGIST_DT", "등록일", false, false, "text", true),
                field("wmUpdtDt", "WM_UPDT_DT", "수정일", false, false, "text", true)
        )));

        specs.put("SYSTEM_ADMIN", new ActorProfileSpec(Arrays.asList(
                field("saId", "SA_ID", "관리자 ID", false, false, "text", true),
                field("saNm", "SA_NM", "관리자명", true, false, "text", true),
                field("saEmail", "SA_EMAIL", "이메일", true, false, "text", true),
                field("saTelno", "SA_TELNO", "전화번호", true, false, "text", false),
                field("saUseYn", "SA_USE_YN", "사용여부", true, false, "useYn", true),
                field("saRegistDt", "SA_REGIST_DT", "등록일", false, false, "text", true),
                field("saUpdtDt", "SA_UPDT_DT", "수정일", false, false, "text", true)
        )));

        return Collections.unmodifiableMap(specs);
    }

    private static FieldRule field(String fieldName, String columnName, String label, boolean editable, boolean masked, String inputType, boolean required) {
        return new FieldRule(fieldName, columnName, label, editable, masked, inputType, required);
    }

    @Override
    public PaginationInfoVO<AdminMemberListVO> retriveMemberList(AdminMemberSearchVO searchVO) {
        if (searchVO == null) {
            searchVO = new AdminMemberSearchVO();
        }

        normalizeSearch(searchVO);
        normalizePage(searchVO);

        PaginationInfoVO<AdminMemberListVO> pagingVO =
                new PaginationInfoVO<>(searchVO.getScreenSize(), 5);

        pagingVO.setCurrentPage(searchVO.getCurrentPage());

        int totalRecord = adminMemberMapper.selectMemberTotalRecord(searchVO);
        pagingVO.setTotalRecord(totalRecord);

        List<AdminMemberListVO> memberList = adminMemberMapper.selectMemberList(pagingVO, searchVO);
        pagingVO.setDataList(memberList);

        return pagingVO;
    }

    @Override
    public Map<String, Object> getMemberStatistics() {
        List<Map<String, Object>> statsList = adminMemberMapper.selectMemberStatistics();
        long totalCount = 0;

        for (Map<String, Object> stat : statsList) {
            Object countObj = stat.get("count");
            if (countObj instanceof Number) {
                totalCount += ((Number) countObj).longValue();
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalCount", totalCount);
        result.put("actorStats", statsList);

        return result;
    }

    @Override
    public Map<String, Object> checkLoginIdAvailability(String loginId) {
        if (!StringUtils.hasText(loginId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "로그인 ID를 입력해주세요.");
        }

        int count = adminMemberMapper.countLoginId(loginId.trim());
        boolean available = (count == 0);

        Map<String, Object> result = new HashMap<>();
        result.put("available", available);
        result.put("loginId", loginId);
        result.put("message", available ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.");

        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> registAdminMember(String actorTypeCd, Map<String, Object> requestMap, String adminId) {
        // 1. 공통 검증
        validateRegistCommon(actorTypeCd, requestMap);

        String loginId = valueToString(requestMap.get("loginId"));
        String password = valueToString(requestMap.get("password"));
        String reason = valueToString(requestMap.get("reason"));
        String useYn = requestMap.get("useYn") == null ? "Y" : valueToString(requestMap.get("useYn"));

        // 2. ID 중복 체크
        if (adminMemberMapper.countLoginId(loginId) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 존재하는 로그인 ID입니다.");
        }

        // 3. 액터별 필수값 검증 및 데이터 준비
        Map<String, Object> params = new HashMap<>(requestMap);
        params.put("loginId", loginId);
        params.put("encodedPassword", passwordEncoder.encode(password));
        params.put("useYn", useYn);

        validateActorSpecificFields(actorTypeCd, params);

        // 4. 원본 테이블 Insert
        int insertCount = 0;
        switch (actorTypeCd) {
            case "BROKER":
                insertCount = adminMemberMapper.insertBrokerMember(params);
                break;
            case "OFFICER":
                insertCount = adminMemberMapper.insertOfficerMember(params);
                break;
            case "TRANSPORT_MANAGER":
                insertCount = adminMemberMapper.insertTransportManagerMember(params);
                break;
            case "WAREHOUSE_MANAGER":
                insertCount = adminMemberMapper.insertWarehouseManagerMember(params);
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 액터 유형입니다.");
        }

        if (insertCount <= 0) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "회원 등록에 실패했습니다.");
        }

        // 5. 이력 저장
        saveChangeLog("CREATE", actorTypeCd, loginId, "ACCOUNT", null, loginId, reason, adminId);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "신규 액터가 등록되었습니다.");
        result.put("loginId", loginId);
        result.put("actorTypeCd", actorTypeCd);

        return result;
    }

    private void validateRegistCommon(String actorTypeCd, Map<String, Object> requestMap) {
        if (!Arrays.asList("BROKER", "OFFICER", "TRANSPORT_MANAGER", "WAREHOUSE_MANAGER").contains(actorTypeCd)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 액터 유형입니다.");
        }
        if (requestMap == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "등록 요청 데이터가 없습니다.");
        }
        if (!StringUtils.hasText(valueToString(requestMap.get("loginId")))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "로그인 ID는 필수입니다.");
        }
        if (!StringUtils.hasText(valueToString(requestMap.get("password")))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호는 필수입니다.");
        }
        String useYn = requestMap.get("useYn") == null ? "Y" : valueToString(requestMap.get("useYn"));
        if (!"Y".equals(useYn) && !"N".equals(useYn)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "사용여부는 Y 또는 N만 가능합니다.");
        }
        validateReason(valueToString(requestMap.get("reason")));
    }

    private void validateActorSpecificFields(String actorTypeCd, Map<String, Object> params) {
        switch (actorTypeCd) {
            case "BROKER":
                checkRequired(params, "brokerTyCd", "관세사 유형");
                checkRequired(params, "brokerNm", "관세사명");
                checkRequired(params, "brokerOfficeNm", "관세사 사무소명");
                checkRequired(params, "brokerRegNo", "관세사 등록번호");
                checkRequired(params, "brokerEmail", "이메일");
                checkRequired(params, "brokerAdres", "주소");
                break;
            case "OFFICER":
                checkRequired(params, "officerTyCd", "공무원 유형");
                checkRequired(params, "officerName", "세관/기관명");
                checkRequired(params, "officerNm", "공무원명");
                checkRequired(params, "officerInstCd", "소속기관코드");
                checkRequired(params, "officerDeptCd", "부서코드");
                checkRequired(params, "officerClsfCd", "직급코드");
                checkRequired(params, "officerEmail", "이메일");
                checkRequired(params, "officerTelno", "전화번호");
                checkRequired(params, "officerAdres", "주소");
                break;
            case "TRANSPORT_MANAGER":
                checkRequired(params, "tmCpNm", "운송사명");
                checkRequired(params, "tmMnCd", "운송수단");
                break;
            case "WAREHOUSE_MANAGER":
                checkRequired(params, "wmNm", "창고관리자명");
                checkRequired(params, "wmEmail", "이메일");
                checkRequired(params, "wmTelno", "전화번호");
                break;
        }
    }

    private void checkRequired(Map<String, Object> params, String key, String label) {
        if (!StringUtils.hasText(valueToString(params.get(key)))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, label + "은(는) 필수입니다.");
        }
    }

    @Override
    public AdminMemberDetailResponseVO retrieveMemberDetail(String actorTypeCd, String loginId) {
        ActorProfileSpec spec = getProfileSpec(actorTypeCd);
        Map<String, Object> detail = selectProfileDetail(actorTypeCd, loginId);
        if (detail == null || detail.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다.");
        }

        Map<String, Object> responseDetail = createResponseDetail(spec, detail);
        List<AdminMemberDetailFieldVO> fields = spec.fields.stream()
                .map(FieldRule::toResponseField)
                .collect(Collectors.toList());

        return new AdminMemberDetailResponseVO(actorTypeCd, loginId, responseDetail, fields);
    }

    @Override
    @Transactional
    public Map<String, Object> updateMemberProfile(String actorTypeCd, String loginId, AdminMemberProfileUpdateRequestVO requestVO, String adminId) {
        ActorProfileSpec spec = getProfileSpec(actorTypeCd);
        validateReason(requestVO.getReason());

        Map<String, Object> requestChanges = requestVO.getChanges();
        if (requestChanges == null || requestChanges.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "변경 항목이 없습니다.");
        }

        Map<String, Object> beforeDetail = selectProfileDetail(actorTypeCd, loginId);
        if (beforeDetail == null || beforeDetail.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다.");
        }

        Map<String, Object> changedValues = new LinkedHashMap<>();
        List<FieldChange> fieldChanges = new ArrayList<>();

        for (Map.Entry<String, Object> entry : requestChanges.entrySet()) {
            String fieldName = entry.getKey();
            FieldRule fieldRule = spec.fieldMap.get(fieldName);

            if (fieldRule == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정할 수 없는 필드입니다: " + fieldName);
            }

            if (!fieldRule.editable) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정 불가 필드입니다: " + fieldName);
            }

            Object normalizedValue = normalizeChangeValue(entry.getValue(), fieldRule);
            String beforeValue = valueToString(beforeDetail.get(fieldName));
            String afterValue = valueToString(normalizedValue);

            if (!Objects.equals(beforeValue, afterValue)) {
                changedValues.put(fieldName, normalizedValue);
                fieldChanges.add(new FieldChange(fieldRule, beforeValue, afterValue));
            }
        }

        if (changedValues.isEmpty()) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "변경된 항목이 없습니다.");
            result.put("changedCount", 0);
            return result;
        }

        validateSystemAdminUseYnChange(actorTypeCd, loginId, adminId, changedValues, beforeDetail);

        int updateCount = updateProfile(actorTypeCd, loginId, changedValues);
        if (updateCount <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "회원 상세 정보 수정에 실패했습니다.");
        }

        for (FieldChange fieldChange : fieldChanges) {
            saveChangeLog(
                    resolveProfileChangeType(fieldChange.fieldRule),
                    actorTypeCd,
                    loginId,
                    fieldChange.fieldRule.columnName,
                    fieldChange.beforeValue,
                    fieldChange.afterValue,
                    requestVO.getReason(),
                    adminId
            );
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "회원 상세 정보가 수정되었습니다.");
        result.put("changedCount", fieldChanges.size());
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> updateMemberUseYn(String actorTypeCd, String loginId, AdminMemberUseYnRequestVO requestVO, String adminId) {
        Map<String, Object> result = new HashMap<>();
        
        AdminMemberListVO member = adminMemberMapper.selectMemberDetail(actorTypeCd, loginId);
        if (member == null) {
            result.put("success", false);
            result.put("message", "존재하지 않는 회원입니다.");
            return result;
        }

        String beforeUseYn = member.getUseYn();
        String afterUseYn = requestVO.getUseYn();

        if (afterUseYn.equals(beforeUseYn)) {
            result.put("success", true);
            result.put("message", "이미 해당 상태입니다. 변경 사항이 없습니다.");
            return result;
        }

        // 시스템관리자 비활성화 방지 로직
        if ("SYSTEM_ADMIN".equals(actorTypeCd) && "N".equals(afterUseYn)) {
            if (loginId.equals(adminId)) {
                result.put("success", false);
                result.put("message", "본인 계정은 비활성화할 수 없습니다.");
                return result;
            }
            int activeAdminCount = adminMemberMapper.selectActiveSystemAdminCount();
            if (activeAdminCount <= 1) {
                result.put("success", false);
                result.put("message", "최소 1명의 시스템 관리자가 활성 상태여야 합니다.");
                return result;
            }
        }

        int updateCount = performUpdate(actorTypeCd, loginId, afterUseYn);

        if (updateCount > 0) {
            saveChangeLog("USE_YN", actorTypeCd, loginId, resolveUseYnColumn(actorTypeCd), beforeUseYn, afterUseYn, requestVO.getReason(), adminId);
            
            result.put("success", true);
            result.put("message", "회원 사용여부가 변경되었습니다.");
        } else {
            result.put("success", false);
            result.put("message", "사용여부 변경에 실패했습니다.");
        }

        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> updateBulkMemberUseYn(AdminMemberBulkUseYnRequestVO requestVO, String adminId) {
        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        int skipCount = 0;

        List<AdminMemberTargetVO> targets = requestVO.getTargets();
        String afterUseYn = requestVO.getUseYn();
        String reason = requestVO.getReason();

        for (AdminMemberTargetVO target : targets) {
            String actorTypeCd = target.getActorTypeCd();
            String loginId = target.getLoginId();

            AdminMemberListVO member = adminMemberMapper.selectMemberDetail(actorTypeCd, loginId);
            if (member == null) {
                skipCount++;
                continue;
            }

            String beforeUseYn = member.getUseYn();
            if (afterUseYn.equals(beforeUseYn)) {
                skipCount++;
                continue;
            }

            // 시스템관리자 비활성화 방지 로직 (일괄 처리용)
            if ("SYSTEM_ADMIN".equals(actorTypeCd) && "N".equals(afterUseYn)) {
                if (loginId.equals(adminId)) {
                    skipCount++;
                    continue;
                }
                int activeAdminCount = adminMemberMapper.selectActiveSystemAdminCount();
                if (activeAdminCount <= 1) {
                    skipCount++;
                    continue;
                }
            }

            int updateCount = performUpdate(actorTypeCd, loginId, afterUseYn);
            if (updateCount > 0) {
                saveChangeLog("USE_YN", actorTypeCd, loginId, resolveUseYnColumn(actorTypeCd), beforeUseYn, afterUseYn, reason, adminId);
                successCount++;
            } else {
                skipCount++;
            }
        }

        result.put("success", true);
        result.put("message", String.format("총 %d건 처리되었습니다. (성공: %d, 제외: %d)", targets.size(), successCount, skipCount));
        result.put("changedCount", successCount);
        result.put("skippedCount", skipCount);

        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> updateOfficerType(String loginId, AdminOfficerTypeChangeRequestVO requestVO, String adminId) {
        Map<String, Object> result = new HashMap<>();

        AdminMemberListVO member = adminMemberMapper.selectMemberDetail("OFFICER", loginId);
        if (member == null || !"OFFICER".equals(member.getActorTypeCd())) {
            result.put("success", false);
            result.put("message", "존재하지 않거나 공무원이 아닌 회원입니다.");
            return result;
        }

        String beforeType = member.getOfficerTyCd();
        String afterType = requestVO.getOfficerTyCd();

        if (afterType.equals(beforeType)) {
            result.put("success", true);
            result.put("message", "이미 해당 공무원 유형입니다. 변경 사항이 없습니다.");
            return result;
        }

        int updateCount = adminMemberMapper.updateOfficerType(loginId, afterType);

        if (updateCount > 0) {
            saveChangeLog("OFFICER_TY_CD", "OFFICER", loginId, "OFFICER_TY_CD", beforeType, afterType, requestVO.getReason(), adminId);

            result.put("success", true);
            result.put("message", "공무원 유형이 변경되었습니다.");
        } else {
            result.put("success", false);
            result.put("message", "공무원 유형 변경에 실패했습니다.");
        }

        return result;
    }

    @Override
    public Map<String, Object> getLatestLoginId(String actorTypeCd) {
        String latestId = adminMemberMapper.selectLatestLoginId(actorTypeCd);
        
        Map<String, Object> result = new HashMap<>();
        result.put("actorTypeCd", actorTypeCd);
        result.put("latestId", latestId != null ? latestId : "없음");
        
        return result;
    }

    @Override
    public Map<String, Object> getLatestOfficerId(String officerTyCd) {
        String latestId = adminMemberMapper.selectLatestOfficerId(officerTyCd);
        
        // 데이터가 없는 경우 기본값 세팅
        if (latestId == null) {
            latestId = "OFFICER".equals(officerTyCd) ? "CUS2026000000" : "QRT2026000000";
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("officerTyCd", officerTyCd);
        result.put("latestId", latestId);
        
        return result;
    }

    private int performUpdate(String actorTypeCd, String loginId, String useYn) {
        switch (actorTypeCd) {
            case "OWNER":
                return adminMemberMapper.updateOwnerUseYn(loginId, useYn);
            case "BROKER":
                return adminMemberMapper.updateBrokerUseYn(loginId, useYn);
            case "OFFICER":
                return adminMemberMapper.updateOfficerUseYn(loginId, useYn);
            case "TRANSPORT_MANAGER":
                return adminMemberMapper.updateTransportManagerUseYn(loginId, useYn);
            case "WAREHOUSE_MANAGER":
                return adminMemberMapper.updateWarehouseManagerUseYn(loginId, useYn);
            case "SYSTEM_ADMIN":
                return adminMemberMapper.updateSystemAdminUseYn(loginId, useYn);
            default:
                return 0;
        }
    }

    private String resolveUseYnColumn(String actorTypeCd) {
        switch (actorTypeCd) {
            case "OWNER":
                return "OWR_USE_YN";
            case "BROKER":
                return "BROKER_USE_YN";
            case "OFFICER":
                return "OFFICER_USE_YN";
            case "TRANSPORT_MANAGER":
                return "TM_USE_YN";
            case "WAREHOUSE_MANAGER":
                return "WM_USE_YN";
            case "SYSTEM_ADMIN":
                return "SA_USE_YN";
            default:
                return "USE_YN";
        }
    }

    private void saveChangeLog(String chgTyCd, String actorTypeCd, String loginId, String targetFieldNm, String beforeVal, String afterVal, String reason, String adminId) {
        AdminMemberChangeLogVO logVO = AdminMemberChangeLogVO.builder()
                .targetActorTyCd(actorTypeCd)
                .targetLoginId(loginId)
                .chgTyCd(chgTyCd)
                .targetFieldNm(targetFieldNm)
                .beforeVal(beforeVal)
                .afterVal(afterVal)
                .rsnCn(reason == null ? null : reason.trim())
                .adminId(adminId)
                .build();
        adminMemberMapper.insertAdminMemberChangeLog(logVO);
    }

    private ActorProfileSpec getProfileSpec(String actorTypeCd) {
        ActorProfileSpec spec = PROFILE_SPECS.get(actorTypeCd);
        if (spec == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 액터 유형입니다.");
        }
        return spec;
    }

    private Map<String, Object> selectProfileDetail(String actorTypeCd, String loginId) {
        switch (actorTypeCd) {
            case "OWNER":
                return adminMemberMapper.selectOwnerProfile(loginId);
            case "BROKER":
                return adminMemberMapper.selectBrokerProfile(loginId);
            case "OFFICER":
                return adminMemberMapper.selectOfficerProfile(loginId);
            case "TRANSPORT_MANAGER":
                return adminMemberMapper.selectTransportManagerProfile(loginId);
            case "WAREHOUSE_MANAGER":
                return adminMemberMapper.selectWarehouseManagerProfile(loginId);
            case "SYSTEM_ADMIN":
                return adminMemberMapper.selectSystemAdminProfile(loginId);
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 액터 유형입니다.");
        }
    }

    private int updateProfile(String actorTypeCd, String loginId, Map<String, Object> changes) {
        switch (actorTypeCd) {
            case "OWNER":
                return adminMemberMapper.updateOwnerProfile(loginId, changes);
            case "BROKER":
                return adminMemberMapper.updateBrokerProfile(loginId, changes);
            case "OFFICER":
                return adminMemberMapper.updateOfficerProfile(loginId, changes);
            case "TRANSPORT_MANAGER":
                return adminMemberMapper.updateTransportManagerProfile(loginId, changes);
            case "WAREHOUSE_MANAGER":
                return adminMemberMapper.updateWarehouseManagerProfile(loginId, changes);
            case "SYSTEM_ADMIN":
                return adminMemberMapper.updateSystemAdminProfile(loginId, changes);
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 액터 유형입니다.");
        }
    }

    private Map<String, Object> createResponseDetail(ActorProfileSpec spec, Map<String, Object> detail) {
        Map<String, Object> responseDetail = new LinkedHashMap<>();
        for (FieldRule fieldRule : spec.fields) {
            Object value = detail.get(fieldRule.fieldName);
            if (fieldRule.masked) {
                value = maskSensitiveValue(valueToString(value));
            }
            responseDetail.put(fieldRule.fieldName, value);
        }
        return responseDetail;
    }

    private void validateReason(String reason) {
        if (!StringUtils.hasText(reason)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "사유는 필수입니다.");
        }
        if (reason.trim().length() > 1000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "사유는 1000자 이하로 입력해야 합니다.");
        }
    }

    private Object normalizeChangeValue(Object value, FieldRule fieldRule) {
        if (value == null) {
            if (fieldRule.required) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldRule.label + "은(는) 필수입니다.");
            }
            return null;
        }

        String textValue = String.valueOf(value).trim();
        if (!StringUtils.hasText(textValue)) {
            if (fieldRule.required) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldRule.label + "은(는) 필수입니다.");
            }
            return null;
        }

        if ("useYn".equals(fieldRule.inputType) && !"Y".equals(textValue) && !"N".equals(textValue)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldRule.label + "는 Y 또는 N만 가능합니다.");
        }

        return textValue;
    }

    private void validateSystemAdminUseYnChange(String actorTypeCd, String loginId, String adminId, Map<String, Object> changes, Map<String, Object> beforeDetail) {
        if (!"SYSTEM_ADMIN".equals(actorTypeCd) || !changes.containsKey("saUseYn") || !"N".equals(changes.get("saUseYn"))) {
            return;
        }

        if (loginId.equals(adminId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "본인 계정은 비활성화할 수 없습니다.");
        }

        if ("Y".equals(valueToString(beforeDetail.get("saUseYn")))) {
            int activeAdminCount = adminMemberMapper.selectActiveSystemAdminCount();
            if (activeAdminCount <= 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "최소 1명의 시스템 관리자가 활성 상태여야 합니다.");
            }
        }
    }

    private String resolveProfileChangeType(FieldRule fieldRule) {
        if (fieldRule.columnName.endsWith("_USE_YN")) {
            return "USE_YN";
        }
        if ("OFFICER_TY_CD".equals(fieldRule.columnName)) {
            return "OFFICER_TY_CD";
        }
        return "PROFILE_UPDATE";
    }

    private String maskSensitiveValue(String value) {
        if (!StringUtils.hasText(value)) {
            return value;
        }

        String trimmedValue = value.trim();
        if (trimmedValue.length() <= 6) {
            return "*".repeat(trimmedValue.length());
        }

        return trimmedValue.substring(0, 6) + "*".repeat(trimmedValue.length() - 6);
    }

    private String valueToString(Object value) {
        if (value == null) {
            return null;
        }
        return String.valueOf(value).trim();
    }

    private void normalizeSearch(AdminMemberSearchVO searchVO) {
        searchVO.setActorTypeCd(trimToNull(searchVO.getActorTypeCd()));
        searchVO.setUseYn(trimToNull(searchVO.getUseYn()));
        searchVO.setKeyword(trimToNull(searchVO.getKeyword()));
        searchVO.setStartDate(trimToNull(searchVO.getStartDate()));
        searchVO.setEndDate(trimToNull(searchVO.getEndDate()));
        
        // 공무원 세부유형 trim 및 actorTypeCd가 OFFICER가 아니면 null 처리
        searchVO.setOfficerTyCd(trimToNull(searchVO.getOfficerTyCd()));
        if (!"OFFICER".equals(searchVO.getActorTypeCd())) {
            searchVO.setOfficerTyCd(null);
        }
    }

    private String trimToNull(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim();
    }

    private void normalizePage(AdminMemberSearchVO searchVO) {
        if (searchVO.getCurrentPage() < 1) {
            searchVO.setCurrentPage(1);
        }

        int screenSize = searchVO.getScreenSize();
        if (screenSize != 10 && screenSize != 20 && screenSize != 30 && screenSize != 40 && screenSize != 50) {
            searchVO.setScreenSize(10);
        }
    }

    private static class ActorProfileSpec {

        private final List<FieldRule> fields;
        private final Map<String, FieldRule> fieldMap;

        private ActorProfileSpec(List<FieldRule> fields) {
            this.fields = Collections.unmodifiableList(fields);
            this.fieldMap = Collections.unmodifiableMap(fields.stream()
                    .collect(Collectors.toMap(
                            field -> field.fieldName,
                            Function.identity(),
                            (left, right) -> left,
                            LinkedHashMap::new
                    )));
        }
    }

    private static class FieldRule {

        private final String fieldName;
        private final String columnName;
        private final String label;
        private final boolean editable;
        private final boolean masked;
        private final String inputType;
        private final boolean required;

        private FieldRule(String fieldName, String columnName, String label, boolean editable, boolean masked, String inputType, boolean required) {
            this.fieldName = fieldName;
            this.columnName = columnName;
            this.label = label;
            this.editable = editable;
            this.masked = masked;
            this.inputType = inputType;
            this.required = required;
        }

        private AdminMemberDetailFieldVO toResponseField() {
            return new AdminMemberDetailFieldVO(fieldName, columnName, label, editable, masked, inputType);
        }
    }

    private static class FieldChange {

        private final FieldRule fieldRule;
        private final String beforeValue;
        private final String afterValue;

        private FieldChange(FieldRule fieldRule, String beforeValue, String afterValue) {
            this.fieldRule = fieldRule;
            this.beforeValue = beforeValue;
            this.afterValue = afterValue;
        }
    }
}
