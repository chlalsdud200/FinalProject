package kr.or.tacs.common.mypage.service;

import java.security.SecureRandom;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import jakarta.servlet.http.HttpSession;
import kr.or.tacs.common.auth.service.SmsService;
import kr.or.tacs.common.mypage.mapper.MyPageMapper;
import kr.or.tacs.dto.common.mypage.MyPagePasswordChangeDTO;
import kr.or.tacs.dto.common.mypage.MyPagePasswordCheckDTO;
import kr.or.tacs.dto.common.mypage.MyPageProfileModifyDTO;
import kr.or.tacs.dto.common.mypage.MyPageResponseDTO;
import kr.or.tacs.dto.common.mypage.MyPageSmsVerifyDTO;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.SmsAuthVO;
import kr.or.tacs.vo.common.mypage.MyPageLoginContactVO;
import kr.or.tacs.vo.common.mypage.MyPageProfileVO;

@Service
public class MyPageServiceImpl implements MyPageService {

    public static final String SESSION_PASSWORD_VERIFIED_LOGIN_ID = "MYPAGE_PASSWORD_VERIFIED_LOGIN_ID";
    public static final String SESSION_PASSWORD_VERIFIED_ROLE_CD = "MYPAGE_PASSWORD_VERIFIED_ROLE_CD";
    public static final String SESSION_PASSWORD_VERIFIED_AT = "MYPAGE_PASSWORD_VERIFIED_AT";
    public static final String SESSION_PASSWORD_SMS_VERIFIED_LOGIN_ID = "MYPAGE_PASSWORD_SMS_VERIFIED_LOGIN_ID";
    public static final String SESSION_PASSWORD_SMS_VERIFIED_ROLE_CD = "MYPAGE_PASSWORD_SMS_VERIFIED_ROLE_CD";
    public static final String SESSION_PASSWORD_SMS_VERIFIED_AT = "MYPAGE_PASSWORD_SMS_VERIFIED_AT";

    private static final long PASSWORD_VERIFIED_VALID_MILLIS = 10 * 60 * 1000L;
    private static final long SMS_VERIFIED_VALID_MILLIS = 10 * 60 * 1000L;
    private static final String PURPOSE_MYPAGE_PASSWORD_CHANGE = "MYPAGE_PW_CHANGE";
    private static final SecureRandom RANDOM = new SecureRandom();

    private static final Map<String, String> ROLE_ACTOR_PATH_MAP = Map.of(
            "OWNER", "owner",
            "BROKER", "broker",
            "OFFICER", "officer",
            "TRANSPORT_MANAGER", "transport",
            "WAREHOUSE_MANAGER", "warehouse",
            "SYSTEM_ADMIN", "systemadmin"
    );

    private final MyPageMapper myPageMapper;
    private final PasswordEncoder passwordEncoder;
    private final SmsService smsService;

    public MyPageServiceImpl(MyPageMapper myPageMapper, PasswordEncoder passwordEncoder, SmsService smsService) {
        this.myPageMapper = myPageMapper;
        this.passwordEncoder = passwordEncoder;
        this.smsService = smsService;
    }

    @Override
    public MyPageResponseDTO modifyPasswordCheck(String actorPath, MyPagePasswordCheckDTO passwordCheckDTO, CustomUser user, HttpSession session) {
        if (user == null) {
            clearAllMyPageSecuritySession(session);
            return MyPageResponseDTO.fail("로그인 정보가 없습니다. 다시 로그인해 주세요.");
        }

        String loginId = user.getLoginId();
        String roleCd = user.getRoleCd();

        if (!isValidActorPath(actorPath, roleCd)) {
            clearAllMyPageSecuritySession(session);
            return MyPageResponseDTO.fail("현재 로그인 권한과 마이페이지 경로가 일치하지 않습니다.");
        }

        if (passwordCheckDTO == null || !StringUtils.hasText(passwordCheckDTO.getCurrentPassword())) {
            clearAllMyPageSecuritySession(session);
            return MyPageResponseDTO.fail("현재 비밀번호를 입력해 주세요.");
        }

        String passwordHash = myPageMapper.selectLoginPasswordHash(loginId, roleCd);
        if (!StringUtils.hasText(passwordHash)) {
            clearAllMyPageSecuritySession(session);
            return MyPageResponseDTO.fail("사용자 비밀번호 정보를 찾을 수 없습니다.");
        }

        boolean matched = passwordEncoder.matches(passwordCheckDTO.getCurrentPassword(), passwordHash);
        if (!matched) {
            clearAllMyPageSecuritySession(session);
            return MyPageResponseDTO.fail("비밀번호가 일치하지 않습니다.");
        }

        clearPasswordSmsVerifiedSession(session);
        session.setAttribute(SESSION_PASSWORD_VERIFIED_LOGIN_ID, loginId);
        session.setAttribute(SESSION_PASSWORD_VERIFIED_ROLE_CD, roleCd);
        session.setAttribute(SESSION_PASSWORD_VERIFIED_AT, System.currentTimeMillis());

        return MyPageResponseDTO.success("비밀번호 확인이 완료되었습니다.");
    }

    @Override
    public MyPageResponseDTO retriveProfile(String actorPath, CustomUser user, HttpSession session) {
        MyPageProfileVO profile = retriveVerifiedProfile(actorPath, user, session);
        if (profile == null) {
            return MyPageResponseDTO.fail("회원정보 조회 전 현재 비밀번호 확인이 필요합니다.");
        }
        return MyPageResponseDTO.success("회원정보를 조회했습니다.", profile);
    }

    @Override
    public MyPageResponseDTO modifyProfile(String actorPath, MyPageProfileModifyDTO profileModifyDTO, CustomUser user, HttpSession session) {
        if (user == null) {
            clearAllMyPageSecuritySession(session);
            return MyPageResponseDTO.fail("로그인 정보가 없습니다. 다시 로그인해 주세요.");
        }

        String loginId = user.getLoginId();
        String roleCd = user.getRoleCd();

        if (!isValidActorPath(actorPath, roleCd)) {
            return MyPageResponseDTO.fail("현재 로그인 권한과 마이페이지 경로가 일치하지 않습니다.");
        }

        if (!isPasswordVerified(loginId, roleCd, session)) {
            return MyPageResponseDTO.fail("회원정보 수정 전 현재 비밀번호 확인이 필요합니다.");
        }

        MyPageProfileVO currentProfile = selectProfileByRole(loginId, roleCd);
        if (currentProfile == null) {
            return MyPageResponseDTO.fail("회원정보를 찾을 수 없습니다.");
        }

        if (!isPasswordSmsVerified(loginId, roleCd, session)) {
            return MyPageResponseDTO.fail("회원정보 수정 전 SMS 인증이 필요합니다.");
        }

        boolean passwordChangeRequested = hasNewPasswordRequest(profileModifyDTO);
        if (passwordChangeRequested && !"OWNER".equals(roleCd)) {
            return MyPageResponseDTO.fail("비밀번호 변경은 비밀번호 변경 영역에서 진행해 주세요.");
        }
        if (passwordChangeRequested) {
            String validationMessage = validateNewPassword(
                    profileModifyDTO.getNewPassword(),
                    profileModifyDTO.getNewPasswordConfirm()
            );
            if (validationMessage != null) {
                return MyPageResponseDTO.fail(validationMessage);
            }
        }

        String registrationValidationMessage = validateRegistrationNumbers(roleCd, currentProfile, profileModifyDTO);
        if (registrationValidationMessage != null) {
            return MyPageResponseDTO.fail(registrationValidationMessage);
        }

        MyPageProfileModifyDTO safeModifyDTO = createSafeModifyDTO(loginId, roleCd, currentProfile, profileModifyDTO);
        int updateCount = updateProfileByRole(roleCd, safeModifyDTO);
        if (updateCount < 1) {
            return MyPageResponseDTO.fail("수정된 회원정보가 없습니다.");
        }

        if (passwordChangeRequested) {
            String encodedPassword = passwordEncoder.encode(profileModifyDTO.getNewPassword());
            int passwordUpdateCount = updatePasswordByRole(loginId, roleCd, encodedPassword);
            if (passwordUpdateCount < 1) {
                return MyPageResponseDTO.fail("비밀번호 변경에 실패했습니다.");
            }
        }

        MyPageProfileVO latestProfile = selectProfileByRole(loginId, roleCd);
        applyLoginContext(latestProfile, user);
        if (passwordChangeRequested) {
            clearAllMyPageSecuritySession(session);
            return MyPageResponseDTO.success("회원정보와 비밀번호가 수정되었습니다. 다시 비밀번호 확인 후 회원정보 수정이 가능합니다.", latestProfile);
        }
        if ("OWNER".equals(roleCd)) {
            clearPasswordSmsVerifiedSession(session);
        }
        return MyPageResponseDTO.success("회원정보가 수정되었습니다.", latestProfile);
    }

    @Override
    public MyPageResponseDTO registPasswordSms(String actorPath, CustomUser user, HttpSession session) {
        if (user == null) {
            clearAllMyPageSecuritySession(session);
            return MyPageResponseDTO.fail("로그인 정보가 없습니다. 다시 로그인해 주세요.");
        }

        String loginId = user.getLoginId();
        String roleCd = user.getRoleCd();

        if (!isValidActorPath(actorPath, roleCd)) {
            return MyPageResponseDTO.fail("현재 로그인 권한과 마이페이지 경로가 일치하지 않습니다.");
        }

        if (!isPasswordVerified(loginId, roleCd, session)) {
            return MyPageResponseDTO.fail("SMS 인증 전 현재 비밀번호 확인이 필요합니다.");
        }

        MyPageLoginContactVO contact = myPageMapper.selectLoginContact(loginId, roleCd);
        if (contact == null) {
            return MyPageResponseDTO.fail("SMS 발송 대상 계정 정보를 찾을 수 없습니다.");
        }

        String phoneNo = normalizePhoneNo(contact.getTelno());
        if (!isValidPhoneNo(phoneNo)) {
            return MyPageResponseDTO.fail("현재 계정에 등록된 휴대폰번호가 없거나 형식이 올바르지 않습니다.");
        }

        String authCode = createAuthCode();
        SmsAuthVO smsAuth = new SmsAuthVO();
        smsAuth.setSaAuthPrposCd(PURPOSE_MYPAGE_PASSWORD_CHANGE);
        smsAuth.setSaTargetId(loginId);
        smsAuth.setSaPhoneNo(phoneNo);
        smsAuth.setSaAuthCd(authCode);

        myPageMapper.insertMyPageSmsAuth(smsAuth);
        smsService.sendAuthCode(phoneNo, authCode);
        clearPasswordSmsVerifiedSession(session);

        return MyPageResponseDTO.success("인증번호를 발송했습니다.", Map.of("maskedPhoneNo", maskPhoneNo(phoneNo)));
    }

    @Override
    public MyPageResponseDTO modifyPasswordSmsVerify(String actorPath, MyPageSmsVerifyDTO smsVerifyDTO, CustomUser user, HttpSession session) {
        if (user == null) {
            clearAllMyPageSecuritySession(session);
            return MyPageResponseDTO.fail("로그인 정보가 없습니다. 다시 로그인해 주세요.");
        }

        String loginId = user.getLoginId();
        String roleCd = user.getRoleCd();

        if (!isValidActorPath(actorPath, roleCd)) {
            return MyPageResponseDTO.fail("현재 로그인 권한과 마이페이지 경로가 일치하지 않습니다.");
        }

        if (!isPasswordVerified(loginId, roleCd, session)) {
            return MyPageResponseDTO.fail("SMS 인증 전 현재 비밀번호 확인이 필요합니다.");
        }

        String authCode = smsVerifyDTO == null ? null : trim(smsVerifyDTO.getAuthCode());
        if (!StringUtils.hasText(authCode) || !authCode.matches("[0-9]{6}")) {
            return MyPageResponseDTO.fail("인증번호는 숫자 6자리로 입력해 주세요.");
        }

        MyPageLoginContactVO contact = myPageMapper.selectLoginContact(loginId, roleCd);
        String phoneNo = contact == null ? null : normalizePhoneNo(contact.getTelno());
        if (!isValidPhoneNo(phoneNo)) {
            return MyPageResponseDTO.fail("현재 계정에 등록된 휴대폰번호가 없거나 형식이 올바르지 않습니다.");
        }

        SmsAuthVO smsAuth = myPageMapper.selectLatestMyPageSmsAuth(PURPOSE_MYPAGE_PASSWORD_CHANGE, loginId, phoneNo);
        if (smsAuth == null) {
            return MyPageResponseDTO.fail("유효한 인증번호가 없습니다. 인증번호를 다시 발송해 주세요.");
        }

        if (smsAuth.getSaFailCnt() != null && smsAuth.getSaFailCnt() >= 5) {
            return MyPageResponseDTO.fail("인증 실패 횟수를 초과했습니다. 인증번호를 다시 발송해 주세요.");
        }

        if (!authCode.equals(smsAuth.getSaAuthCd())) {
            myPageMapper.updateMyPageSmsAuthFailCnt(smsAuth.getSaNo());
            return MyPageResponseDTO.fail("인증번호가 일치하지 않습니다.");
        }

        myPageMapper.updateMyPageSmsAuthSuccess(smsAuth.getSaNo());
        session.setAttribute(SESSION_PASSWORD_SMS_VERIFIED_LOGIN_ID, loginId);
        session.setAttribute(SESSION_PASSWORD_SMS_VERIFIED_ROLE_CD, roleCd);
        session.setAttribute(SESSION_PASSWORD_SMS_VERIFIED_AT, System.currentTimeMillis());

        return MyPageResponseDTO.success("SMS 인증이 완료되었습니다.");
    }

    @Override
    public MyPageResponseDTO modifyPassword(String actorPath, MyPagePasswordChangeDTO passwordChangeDTO, CustomUser user, HttpSession session) {
        if (user == null) {
            clearAllMyPageSecuritySession(session);
            return MyPageResponseDTO.fail("로그인 정보가 없습니다. 다시 로그인해 주세요.");
        }

        String loginId = user.getLoginId();
        String roleCd = user.getRoleCd();

        if (!isValidActorPath(actorPath, roleCd)) {
            return MyPageResponseDTO.fail("현재 로그인 권한과 마이페이지 경로가 일치하지 않습니다.");
        }

        if (!isPasswordVerified(loginId, roleCd, session)) {
            return MyPageResponseDTO.fail("비밀번호 변경 전 현재 비밀번호 확인이 필요합니다.");
        }

        if (!isPasswordSmsVerified(loginId, roleCd, session)) {
            return MyPageResponseDTO.fail("비밀번호 변경 전 SMS 인증이 필요합니다.");
        }

        String newPassword = passwordChangeDTO == null ? null : passwordChangeDTO.getNewPassword();
        String newPasswordConfirm = passwordChangeDTO == null ? null : passwordChangeDTO.getNewPasswordConfirm();
        String validationMessage = validateNewPassword(newPassword, newPasswordConfirm);
        if (validationMessage != null) {
            return MyPageResponseDTO.fail(validationMessage);
        }

        String encodedPassword = passwordEncoder.encode(newPassword);
        int updateCount = updatePasswordByRole(loginId, roleCd, encodedPassword);
        if (updateCount < 1) {
            return MyPageResponseDTO.fail("비밀번호 변경에 실패했습니다.");
        }

        clearAllMyPageSecuritySession(session);
        return MyPageResponseDTO.success("비밀번호가 변경되었습니다. 다시 비밀번호 확인 후 회원정보 수정이 가능합니다.");
    }

    private MyPageProfileVO retriveVerifiedProfile(String actorPath, CustomUser user, HttpSession session) {
        if (user == null) {
            clearAllMyPageSecuritySession(session);
            return null;
        }

        String loginId = user.getLoginId();
        String roleCd = user.getRoleCd();

        if (!isValidActorPath(actorPath, roleCd)) {
            return null;
        }

        if (!isPasswordVerified(loginId, roleCd, session)) {
            return null;
        }

        MyPageProfileVO profile = selectProfileByRole(loginId, roleCd);
        if (profile == null) {
            return null;
        }

        applyLoginContext(profile, user);
        return profile;
    }

    private MyPageProfileModifyDTO createSafeModifyDTO(String loginId, String roleCd, MyPageProfileVO currentProfile, MyPageProfileModifyDTO requestDTO) {
        MyPageProfileModifyDTO safeDTO = new MyPageProfileModifyDTO();
        safeDTO.setLoginId(loginId);

        if (requestDTO == null) {
            return safeDTO;
        }

        switch (roleCd) {
            case "OWNER" -> fillOwnerSafeDTO(safeDTO, currentProfile, requestDTO);
            case "BROKER" -> fillBrokerSafeDTO(safeDTO, requestDTO);
            case "OFFICER" -> fillOfficerSafeDTO(safeDTO, requestDTO);
            case "TRANSPORT_MANAGER" -> fillTransportSafeDTO(safeDTO, requestDTO);
            case "WAREHOUSE_MANAGER" -> fillWarehouseSafeDTO(safeDTO, requestDTO);
            case "SYSTEM_ADMIN" -> fillSystemAdminSafeDTO(safeDTO, requestDTO);
            default -> { }
        }

        return safeDTO;
    }

    private void fillOwnerSafeDTO(MyPageProfileModifyDTO safeDTO, MyPageProfileVO currentProfile, MyPageProfileModifyDTO requestDTO) {
        String typeCd = currentProfile.getTypeCd();

        safeDTO.setName(requestDTO.getName());
        safeDTO.setCstmIdfNo(StringUtils.hasText(requestDTO.getCstmIdfNo()) ? requestDTO.getCstmIdfNo() : currentProfile.getCstmIdfNo());
        safeDTO.setEmail(requestDTO.getEmail());
        safeDTO.setTelno(requestDTO.getTelno());
        safeDTO.setZip(requestDTO.getZip());
        safeDTO.setAdres(requestDTO.getAdres());
        safeDTO.setDetailAdres(requestDTO.getDetailAdres());

        if ("OPERATOR".equals(typeCd)) {
            safeDTO.setBizrno(normalizeDigits(requestDTO.getBizrno()));
            safeDTO.setCorpRegNo(null);
            return;
        }

        if ("CORP".equals(typeCd)) {
            safeDTO.setBizrno(normalizeDigits(requestDTO.getBizrno()));
            safeDTO.setCorpRegNo(normalizeDigits(requestDTO.getCorpRegNo()));
            return;
        }

        safeDTO.setBizrno(null);
        safeDTO.setCorpRegNo(null);
    }

    private void fillBrokerSafeDTO(MyPageProfileModifyDTO safeDTO, MyPageProfileModifyDTO requestDTO) {
        safeDTO.setName(requestDTO.getName());
        safeDTO.setOrgName(requestDTO.getOrgName());
        safeDTO.setBizrno(requestDTO.getBizrno());
        safeDTO.setBrokerSpcltyCd(requestDTO.getBrokerSpcltyCd());
        safeDTO.setEmail(requestDTO.getEmail());
        safeDTO.setTelno(requestDTO.getTelno());
        safeDTO.setZip(requestDTO.getZip());
        safeDTO.setAdres(requestDTO.getAdres());
        safeDTO.setDetailAdres(requestDTO.getDetailAdres());
    }

    private void fillOfficerSafeDTO(MyPageProfileModifyDTO safeDTO, MyPageProfileModifyDTO requestDTO) {
        safeDTO.setEmail(requestDTO.getEmail());
        safeDTO.setTelno(requestDTO.getTelno());
        safeDTO.setZip(requestDTO.getZip());
        safeDTO.setAdres(requestDTO.getAdres());
        safeDTO.setDetailAdres(requestDTO.getDetailAdres());
    }

    private void fillTransportSafeDTO(MyPageProfileModifyDTO safeDTO, MyPageProfileModifyDTO requestDTO) {
        safeDTO.setName(requestDTO.getName());
        safeDTO.setTelno(requestDTO.getTelno());
    }

    private void fillWarehouseSafeDTO(MyPageProfileModifyDTO safeDTO, MyPageProfileModifyDTO requestDTO) {
        safeDTO.setName(requestDTO.getName());
        safeDTO.setEmail(requestDTO.getEmail());
        safeDTO.setTelno(requestDTO.getTelno());
        safeDTO.setZip(requestDTO.getZip());
        safeDTO.setAdres(requestDTO.getAdres());
        safeDTO.setDetailAdres(requestDTO.getDetailAdres());
    }

    private void fillSystemAdminSafeDTO(MyPageProfileModifyDTO safeDTO, MyPageProfileModifyDTO requestDTO) {
        safeDTO.setName(requestDTO.getName());
        safeDTO.setEmail(requestDTO.getEmail());
        safeDTO.setTelno(requestDTO.getTelno());
    }

    private int updateProfileByRole(String roleCd, MyPageProfileModifyDTO safeModifyDTO) {
        return switch (roleCd) {
            case "OWNER" -> myPageMapper.updateOwnerProfile(safeModifyDTO);
            case "BROKER" -> myPageMapper.updateBrokerProfile(safeModifyDTO);
            case "OFFICER" -> myPageMapper.updateOfficerProfile(safeModifyDTO);
            case "TRANSPORT_MANAGER" -> myPageMapper.updateTransportProfile(safeModifyDTO);
            case "WAREHOUSE_MANAGER" -> myPageMapper.updateWarehouseProfile(safeModifyDTO);
            case "SYSTEM_ADMIN" -> myPageMapper.updateSystemAdminProfile(safeModifyDTO);
            default -> 0;
        };
    }

    private int updatePasswordByRole(String loginId, String roleCd, String encodedPassword) {
        return switch (roleCd) {
            case "OWNER" -> myPageMapper.updateOwnerPassword(loginId, encodedPassword);
            case "BROKER" -> myPageMapper.updateBrokerPassword(loginId, encodedPassword);
            case "OFFICER" -> myPageMapper.updateOfficerPassword(loginId, encodedPassword);
            case "TRANSPORT_MANAGER" -> myPageMapper.updateTransportPassword(loginId, encodedPassword);
            case "WAREHOUSE_MANAGER" -> myPageMapper.updateWarehousePassword(loginId, encodedPassword);
            case "SYSTEM_ADMIN" -> myPageMapper.updateSystemAdminPassword(loginId, encodedPassword);
            default -> 0;
        };
    }

    private MyPageProfileVO selectProfileByRole(String loginId, String roleCd) {
        return switch (roleCd) {
            case "OWNER" -> myPageMapper.selectOwnerProfile(loginId);
            case "BROKER" -> myPageMapper.selectBrokerProfile(loginId);
            case "OFFICER" -> myPageMapper.selectOfficerProfile(loginId);
            case "TRANSPORT_MANAGER" -> myPageMapper.selectTransportProfile(loginId);
            case "WAREHOUSE_MANAGER" -> myPageMapper.selectWarehouseProfile(loginId);
            case "SYSTEM_ADMIN" -> myPageMapper.selectSystemAdminProfile(loginId);
            default -> null;
        };
    }

    private void applyLoginContext(MyPageProfileVO profile, CustomUser user) {
        if (profile == null || user == null) {
            return;
        }

        profile.setRoleCd(user.getRoleCd());
        profile.setRoleNm(user.getRoleNm());
        if (user.getAuthUser() != null) {
            profile.setActorTypeCd(user.getAuthUser().getActorTypeCd());
            profile.setActorTableNm(user.getAuthUser().getActorTableNm());
        }
    }

    private boolean isPasswordVerified(String loginId, String roleCd, HttpSession session) {
        if (!StringUtils.hasText(loginId) || !StringUtils.hasText(roleCd) || session == null) {
            return false;
        }

        Object sessionLoginId = session.getAttribute(SESSION_PASSWORD_VERIFIED_LOGIN_ID);
        Object sessionRoleCd = session.getAttribute(SESSION_PASSWORD_VERIFIED_ROLE_CD);
        Object verifiedAt = session.getAttribute(SESSION_PASSWORD_VERIFIED_AT);

        if (!loginId.equals(sessionLoginId) || !roleCd.equals(sessionRoleCd)) {
            clearAllMyPageSecuritySession(session);
            return false;
        }

        if (!(verifiedAt instanceof Long)) {
            clearAllMyPageSecuritySession(session);
            return false;
        }

        long elapsed = System.currentTimeMillis() - (Long) verifiedAt;
        if (elapsed > PASSWORD_VERIFIED_VALID_MILLIS) {
            clearAllMyPageSecuritySession(session);
            return false;
        }

        return true;
    }

    private boolean isPasswordSmsVerified(String loginId, String roleCd, HttpSession session) {
        if (!StringUtils.hasText(loginId) || !StringUtils.hasText(roleCd) || session == null) {
            return false;
        }

        Object sessionLoginId = session.getAttribute(SESSION_PASSWORD_SMS_VERIFIED_LOGIN_ID);
        Object sessionRoleCd = session.getAttribute(SESSION_PASSWORD_SMS_VERIFIED_ROLE_CD);
        Object verifiedAt = session.getAttribute(SESSION_PASSWORD_SMS_VERIFIED_AT);

        if (!loginId.equals(sessionLoginId) || !roleCd.equals(sessionRoleCd)) {
            clearPasswordSmsVerifiedSession(session);
            return false;
        }

        if (!(verifiedAt instanceof Long)) {
            clearPasswordSmsVerifiedSession(session);
            return false;
        }

        long elapsed = System.currentTimeMillis() - (Long) verifiedAt;
        if (elapsed > SMS_VERIFIED_VALID_MILLIS) {
            clearPasswordSmsVerifiedSession(session);
            return false;
        }

        return true;
    }

    private boolean isValidActorPath(String actorPath, String roleCd) {
        if (!StringUtils.hasText(actorPath) || !StringUtils.hasText(roleCd)) {
            return false;
        }
        // 공무원은 로그인 권한(roleCd)을 OFFICER로 통합한다.
        // 다만 기존 현장공무원 URL(/fieldofficer/**)은 유지하므로 마이페이지 경로는 임시 허용한다.
        // 현장/행정별 라우팅은 추후 OFFICER_TY_CD 기반으로 분리한다.
        if ("OFFICER".equals(roleCd)) {
            return "officer".equals(actorPath) || "fieldofficer".equals(actorPath);
        }
        return actorPath.equals(ROLE_ACTOR_PATH_MAP.get(roleCd));
    }

    private void clearAllMyPageSecuritySession(HttpSession session) {
        clearPasswordVerifiedSession(session);
        clearPasswordSmsVerifiedSession(session);
    }

    private void clearPasswordVerifiedSession(HttpSession session) {
        if (session == null) {
            return;
        }
        session.removeAttribute(SESSION_PASSWORD_VERIFIED_LOGIN_ID);
        session.removeAttribute(SESSION_PASSWORD_VERIFIED_ROLE_CD);
        session.removeAttribute(SESSION_PASSWORD_VERIFIED_AT);
    }

    private void clearPasswordSmsVerifiedSession(HttpSession session) {
        if (session == null) {
            return;
        }
        session.removeAttribute(SESSION_PASSWORD_SMS_VERIFIED_LOGIN_ID);
        session.removeAttribute(SESSION_PASSWORD_SMS_VERIFIED_ROLE_CD);
        session.removeAttribute(SESSION_PASSWORD_SMS_VERIFIED_AT);
    }

    private boolean hasNewPasswordRequest(MyPageProfileModifyDTO profileModifyDTO) {
        return profileModifyDTO != null
                && (StringUtils.hasText(profileModifyDTO.getNewPassword())
                    || StringUtils.hasText(profileModifyDTO.getNewPasswordConfirm()));
    }

    private String validateNewPassword(String newPassword, String newPasswordConfirm) {
        if (!StringUtils.hasText(newPassword) || !StringUtils.hasText(newPasswordConfirm)) {
            return "새 비밀번호와 새 비밀번호 확인을 모두 입력해 주세요.";
        }
        if (!newPassword.equals(newPasswordConfirm)) {
            return "새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.";
        }
        if (newPassword.contains(" ")) {
            return "비밀번호에는 공백을 사용할 수 없습니다.";
        }
        if (newPassword.length() < 8) {
            return "비밀번호는 8자 이상이어야 합니다.";
        }

        if (getPasswordLengthUnits(newPassword) > 16) {
            return "\ube44\ubc00\ubc88\ud638\ub294 \uc601\ubb38 \uae30\uc900 16\uc790, \ud55c\uae00 \uae30\uc900 8\uc790 \uc774\ub0b4\ub85c \uc785\ub825\ud574 \uc8fc\uc138\uc694.";
        }

        int typeCount = 0;
        if (newPassword.matches(".*[A-Za-z].*")) {
            typeCount++;
        }
        if (newPassword.matches(".*[0-9].*")) {
            typeCount++;
        }
        if (newPassword.matches(".*[^A-Za-z0-9].*")) {
            typeCount++;
        }
        if (typeCount < 2) {
            return "비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 조합해야 합니다.";
        }
        return null;
    }

    private String validateRegistrationNumbers(String roleCd, MyPageProfileVO currentProfile, MyPageProfileModifyDTO requestDTO) {
        if (requestDTO == null) {
            return null;
        }

        String bizrno = normalizeDigits(requestDTO.getBizrno());
        String corpRegNo = normalizeDigits(requestDTO.getCorpRegNo());

        if ("OWNER".equals(roleCd)) {
            if (currentProfile == null) {
                return "화주 회원정보를 확인할 수 없습니다.";
            }
            String typeCd = currentProfile.getTypeCd();
            if (("OPERATOR".equals(typeCd) || "CORP".equals(typeCd)) && !isExactDigits(bizrno, 10)) {
                return "사업자등록번호는 숫자 10자리로 입력해 주세요.";
            }
            if ("CORP".equals(typeCd) && !isExactDigits(corpRegNo, 13)) {
                return "법인등록번호는 숫자 13자리로 입력해 주세요.";
            }
        } else {
            // 다른 역할(관세사 등)에서도 번호가 입력된 경우 자릿수 검증
            if (StringUtils.hasText(bizrno) && !isExactDigits(bizrno, 10)) {
                return "사업자등록번호는 숫자 10자리로 입력해 주세요.";
            }
            if (StringUtils.hasText(corpRegNo) && !isExactDigits(corpRegNo, 13)) {
                return "법인등록번호는 숫자 13자리로 입력해 주세요.";
            }
        }
        return null;
    }

    private String createAuthCode() {
        return String.format("%06d", RANDOM.nextInt(1_000_000));
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizePhoneNo(String phoneNo) {
        return phoneNo == null ? null : phoneNo.replaceAll("[^0-9]", "");
    }

    private String normalizeDigits(String value) {
        return value == null ? null : value.replaceAll("[^0-9]", "");
    }

    private boolean isExactDigits(String value, int length) {
        return StringUtils.hasText(value) && value.matches("[0-9]{" + length + "}");
    }

    private boolean isValidPhoneNo(String phoneNo) {
        return StringUtils.hasText(phoneNo) && phoneNo.matches("01[0-9]{8,9}");
    }

    private int getPasswordLengthUnits(String password) {
        if (password == null) {
            return 0;
        }

        return password.codePoints()
                .map(codePoint -> codePoint > 127 ? 2 : 1)
                .sum();
    }

    private String maskPhoneNo(String phoneNo) {
        String normalized = normalizePhoneNo(phoneNo);
        if (!StringUtils.hasText(normalized) || normalized.length() < 7) {
            return "-";
        }
        if (normalized.length() == 11) {
            return normalized.substring(0, 3) + "****" + normalized.substring(7);
        }
        if (normalized.length() == 10) {
            return normalized.substring(0, 3) + "***" + normalized.substring(6);
        }
        return normalized.substring(0, 3) + "****";
    }
}
