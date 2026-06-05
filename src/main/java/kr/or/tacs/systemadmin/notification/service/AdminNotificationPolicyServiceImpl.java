package kr.or.tacs.systemadmin.notification.service;

import kr.or.tacs.systemadmin.notification.exception.PolicyConflictException;
import kr.or.tacs.systemadmin.notification.mapper.IAdminNotificationPolicyMapper;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationPolicyRequestVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationPolicySearchVO;
import kr.or.tacs.vo.systemadmin.notification.AdminNotificationPolicyVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminNotificationPolicyServiceImpl implements IAdminNotificationPolicyService {

    private static final Set<String> ALLOWED_RECEIVER_TYPES =
            Set.of("OWNER", "BROKER", "OFFICER", "FIELD_OFFICER", "WAREHOUSE_MANAGER", "TRANSPORT_MANAGER");

    private final IAdminNotificationPolicyMapper policyMapper;

    @Override
    public PaginationInfoVO<AdminNotificationPolicyVO> retrievePolicyList(AdminNotificationPolicySearchVO search) {
        AdminNotificationPolicySearchVO normalized = search == null ? new AdminNotificationPolicySearchVO() : search;
        normalized.setKeyword(trim(normalized.getKeyword()));
        normalized.setUseYn(normalizeFilterUseYn(normalized.getUseYn()));
        normalized.setReceiverType(trim(normalized.getReceiverType()));
        normalized.setCurrentPage(clampPage(normalized.getCurrentPage()));
        normalized.setScreenSize(clampSize(normalized.getScreenSize()));

        List<AdminNotificationPolicyVO> items = policyMapper.selectPolicyList(normalized);
        long totalCount = policyMapper.countPolicies(normalized);

        PaginationInfoVO<AdminNotificationPolicyVO> pagingVO = new PaginationInfoVO<>(normalized.getScreenSize(), 5);
        pagingVO.setCurrentPage(normalized.getCurrentPage());
        pagingVO.setTotalRecord((int) totalCount);
        pagingVO.setDataList(items);

        return pagingVO;
    }

    @Override
    public AdminNotificationPolicyVO retrievePolicy(String eventCd) {
        return policyMapper.selectPolicy(normalizeEventCd(eventCd));
    }

    @Override
    @Transactional
    public void registPolicy(AdminNotificationPolicyRequestVO request) {
        String eventCd = normalizeEventCd(request == null ? null : request.getNpEventCd());
        if (policyMapper.countPolicy(eventCd) > 0) {
            throw new PolicyConflictException("이미 등록된 이벤트 코드입니다: " + eventCd);
        }

        AdminNotificationPolicyVO policy = toPolicyVO(eventCd, request);
        policyMapper.insertPolicy(policy);
    }

    @Override
    @Transactional
    public void modifyPolicy(String eventCd, AdminNotificationPolicyRequestVO request) {
        String normalizedEventCd = normalizeEventCd(eventCd);
        if (policyMapper.selectPolicy(normalizedEventCd) == null) {
            throw new NoSuchElementException("알림 정책이 존재하지 않습니다: " + normalizedEventCd);
        }

        AdminNotificationPolicyVO policy = toPolicyVO(normalizedEventCd, request);
        policyMapper.updatePolicy(policy);
    }

    @Override
    @Transactional
    public void modifyPolicyUseYn(String eventCd, String useYn) {
        String normalizedEventCd = normalizeEventCd(eventCd);
        if (policyMapper.selectPolicy(normalizedEventCd) == null) {
            throw new NoSuchElementException("알림 정책이 존재하지 않습니다: " + normalizedEventCd);
        }
        policyMapper.updatePolicyUseYn(normalizedEventCd, normalizeUseYn(useYn));
    }

    private int clampPage(Integer page) {
        return page == null || page < 1 ? 1 : page;
    }

    private int clampSize(Integer size) {
        if (size == null || size < 1) {
            return 20;
        }
        return Math.min(size, 100);
    }

    private AdminNotificationPolicyVO toPolicyVO(String eventCd, AdminNotificationPolicyRequestVO request) {
        if (request == null) {
            throw new IllegalArgumentException("요청 데이터가 없습니다.");
        }

        AdminNotificationPolicyVO policy = new AdminNotificationPolicyVO();
        policy.setNpEventCd(eventCd);
        policy.setNpBizNm(requireText(request.getNpBizNm(), "업무명을 입력해 주세요."));
        policy.setNpReceiverUserType(normalizeReceiverTypes(request.getNpReceiverUserType()));
        policy.setNpTitleTpl(requireText(request.getNpTitleTpl(), "제목 템플릿을 입력해 주세요."));
        policy.setNpBodyTpl(requireText(request.getNpBodyTpl(), "본문 템플릿을 입력해 주세요."));
        policy.setNpLinkTpl(requireText(request.getNpLinkTpl(), "링크 템플릿을 입력해 주세요."));
        policy.setNpUseYn(normalizeUseYn(request.getNpUseYn()));
        return policy;
    }

    private String normalizeEventCd(String eventCd) {
        String normalized = requireText(eventCd, "이벤트 코드를 입력해 주세요.").toUpperCase(Locale.ROOT);
        if (!normalized.matches("^[A-Z0-9_]+$")) {
            throw new IllegalArgumentException("이벤트 코드는 영문 대문자, 숫자, 언더스코어만 사용할 수 있습니다.");
        }
        if (normalized.length() > 40) {
            throw new IllegalArgumentException("이벤트 코드는 40자 이하로 입력해 주세요.");
        }
        return normalized;
    }

    private String normalizeReceiverTypes(String receiverUserType) {
        String value = requireText(receiverUserType, "수신자 유형을 선택해 주세요.");
        LinkedHashSet<String> receiverTypes = Arrays.stream(value.split(","))
                .map(this::trim)
                .filter(StringUtils::hasText)
                .map(type -> type.toUpperCase(Locale.ROOT))
                .collect(Collectors.toCollection(LinkedHashSet::new));

        if (receiverTypes.isEmpty()) {
            throw new IllegalArgumentException("수신자 유형을 선택해 주세요.");
        }
        for (String receiverType : receiverTypes) {
            if (!ALLOWED_RECEIVER_TYPES.contains(receiverType)) {
                throw new IllegalArgumentException("지원하지 않는 수신자 유형입니다: " + receiverType);
            }
        }
        return String.join(",", receiverTypes);
    }

    private String normalizeFilterUseYn(String useYn) {
        String normalized = trim(useYn);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        return normalizeUseYn(normalized);
    }

    private String normalizeUseYn(String useYn) {
        String normalized = requireText(useYn, "사용여부는 Y 또는 N만 가능합니다.").toUpperCase(Locale.ROOT);
        if (!"Y".equals(normalized) && !"N".equals(normalized)) {
            throw new IllegalArgumentException("사용여부는 Y 또는 N만 가능합니다.");
        }
        return normalized;
    }

    private String requireText(String value, String message) {
        String trimmed = trim(value);
        if (!StringUtils.hasText(trimmed)) {
            throw new IllegalArgumentException(message);
        }
        return trimmed;
    }

    private String trim(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
