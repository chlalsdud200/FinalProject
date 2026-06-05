package kr.or.tacs.common.auth.service;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import kr.or.tacs.common.auth.mapper.AuthMapper;
import kr.or.tacs.vo.common.AuthUserVO;
import kr.or.tacs.vo.common.AuthVerificationVO;
import kr.or.tacs.vo.common.SmsAuthVO;

@Service
public class AuthFindServiceImpl implements AuthFindService {

    private static final String PURPOSE_PASSWORD_FIND = "FIND_PW"; // 새 테이블 기준 목적코드
    private static final SecureRandom RANDOM = new SecureRandom();

    @Autowired
    private AuthMapper authMapper;

    @Autowired
    private SmsService smsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ==========================================
    // 기존 기능 (호환성을 위해 유지)
    // ==========================================
    @Override
    public void sendPasswordFindAuthCode(String loginId, String phoneNo) {
        String trimmedLoginId = trim(loginId);
        String normalizedPhoneNo = normalizePhoneNo(phoneNo);

        validateLoginId(trimmedLoginId);
        validatePhoneNo(normalizedPhoneNo);

        AuthUserVO user = authMapper.findLoginUserByIdAndPhone(trimmedLoginId, normalizedPhoneNo);
        if (user == null) {
            throw new IllegalArgumentException("아이디와 가입된 휴대폰 번호가 일치하지 않습니다.");
        }

        String authCode = createAuthCode();
        AuthVerificationVO verification = new AuthVerificationVO();
        verification.setPurposeCd("PWD_FIND");
        verification.setTargetId(user.getLoginId());
        verification.setTargetNm(user.getLoginNm());
        verification.setPhoneNo(normalizedPhoneNo);
        verification.setAuthCode(authCode);

        authMapper.insertVerification(verification);
        smsService.sendAuthCode(normalizedPhoneNo, authCode);
    }

    @Override
    public void verifyPasswordFindAuthCode(String loginId, String phoneNo, String authCode) {
        String trimmedLoginId = trim(loginId);
        String normalizedPhoneNo = normalizePhoneNo(phoneNo);
        String trimmedAuthCode = trim(authCode);

        validateLoginId(trimmedLoginId);
        validatePhoneNo(normalizedPhoneNo);
        validateAuthCode(trimmedAuthCode);

        AuthVerificationVO verification = authMapper.selectValidVerification(
                "PWD_FIND",
                trimmedLoginId,
                normalizedPhoneNo);

        if (verification == null) {
            throw new IllegalArgumentException("유효한 인증번호가 없습니다. 인증번호를 다시 발송해주세요.");
        }

        if (verification.getFailCnt() != null && verification.getFailCnt() >= 5) {
            throw new IllegalArgumentException("인증번호 입력 횟수를 초과했습니다. 인증번호를 다시 발송해주세요.");
        }

        if (!trimmedAuthCode.equals(verification.getAuthCode())) {
            authMapper.increaseVerificationFailCnt(verification.getAvNo());
            throw new IllegalArgumentException("인증번호가 일치하지 않습니다.");
        }

        authMapper.updateVerificationSuccess(verification.getAvNo());
    }

    // ==========================================
    // 신규 기능: SMS_AUTH 테이블 활용 버전
    // ==========================================

    @Override
    public void registSmsAuthForPasswordFind(String loginId, String phoneNo) {
        String trimmedLoginId = trim(loginId);
        String normalizedPhoneNo = normalizePhoneNo(phoneNo);

        validateLoginId(trimmedLoginId);
        validatePhoneNo(normalizedPhoneNo);

        AuthUserVO user = authMapper.findLoginUserByIdAndPhone(trimmedLoginId, normalizedPhoneNo);
        if (user == null) {
            throw new IllegalArgumentException("아이디와 가입된 휴대폰 번호가 일치하지 않습니다.");
        }

        String authCode = createAuthCode();
        SmsAuthVO smsAuth = new SmsAuthVO();
        smsAuth.setSaAuthPrposCd(PURPOSE_PASSWORD_FIND);
        smsAuth.setSaTargetId(user.getLoginId());
        smsAuth.setSaPhoneNo(normalizedPhoneNo);
        smsAuth.setSaAuthCd(authCode);

        authMapper.registSmsAuth(smsAuth);
        smsService.sendAuthCode(normalizedPhoneNo, authCode);
    }

    @Override
    public void verifySmsAuthForPasswordFind(String loginId, String phoneNo, String authCode) {
        String trimmedLoginId = trim(loginId);
        String normalizedPhoneNo = normalizePhoneNo(phoneNo);
        String trimmedAuthCode = trim(authCode);

        validateLoginId(trimmedLoginId);
        validatePhoneNo(normalizedPhoneNo);
        validateAuthCode(trimmedAuthCode);

        SmsAuthVO smsAuth = authMapper.selectSmsAuth(
                PURPOSE_PASSWORD_FIND,
                trimmedLoginId,
                normalizedPhoneNo);

        if (smsAuth == null) {
            throw new IllegalArgumentException("유효한 인증번호가 없습니다. 다시 인증을 요청해주세요.");
        }

        if (smsAuth.getSaFailCnt() != null && smsAuth.getSaFailCnt() >= 5) {
            throw new IllegalArgumentException("인증 실패 횟수를 초과했습니다. 다시 인증을 요청해주세요.");
        }

        if (!trimmedAuthCode.equals(smsAuth.getSaAuthCd())) {
            authMapper.modifySmsAuthFailCnt(smsAuth.getSaNo());
            throw new IllegalArgumentException("인증번호가 일치하지 않습니다.");
        }

        authMapper.modifySmsAuthSuccess(smsAuth.getSaNo());
    }

    @Override
    public void modifyPasswordAfterAuth(String loginId, String phoneNo, String newPassword) {
        String trimmedLoginId = trim(loginId);
        String normalizedPhoneNo = normalizePhoneNo(phoneNo);

        validateLoginId(trimmedLoginId);
        validatePhoneNo(normalizedPhoneNo);

        if (!StringUtils.hasText(newPassword)) {
            throw new IllegalArgumentException("새 비밀번호를 입력해주세요.");
        }

        // 1. 유효성 및 권한 검증: 사용자 정보 조회 (테이블명 획득 용도 포함)
        AuthUserVO user = authMapper.findLoginUserByIdAndPhone(trimmedLoginId, normalizedPhoneNo);
        if (user == null || !StringUtils.hasText(user.getActorTableNm())) {
            throw new IllegalArgumentException("유효하지 않은 계정입니다.");
        }

        // 3. 비밀번호 인코딩 (BCryptPasswordEncoder)
        String encodedPassword = passwordEncoder.encode(newPassword);
        
        int result = authMapper.modifyPassword(encodedPassword, trimmedLoginId, user.getActorTableNm());
        if (result == 0) {
            throw new RuntimeException("비밀번호 변경에 실패했습니다.");
        }
    }

    // ==========================================
    // 유틸리티 메서드
    // ==========================================
    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizePhoneNo(String phoneNo) {
        return phoneNo == null ? null : phoneNo.replaceAll("[^0-9]", "");
    }

    private void validateLoginId(String loginId) {
        if (!StringUtils.hasText(loginId)) {
            throw new IllegalArgumentException("아이디를 입력해주세요.");
        }
    }

    private void validatePhoneNo(String phoneNo) {
        if (!StringUtils.hasText(phoneNo)) {
            throw new IllegalArgumentException("휴대폰 번호를 입력해주세요.");
        }
        if (!phoneNo.matches("01[0-9]{8,9}")) {
            throw new IllegalArgumentException("휴대폰 번호 형식이 올바르지 않습니다.");
        }
    }

    private void validateAuthCode(String authCode) {
        if (!StringUtils.hasText(authCode)) {
            throw new IllegalArgumentException("인증번호를 입력해주세요.");
        }
        if (!authCode.matches("[0-9]{6}")) {
            throw new IllegalArgumentException("인증번호는 숫자 6자리로 입력해주세요.");
        }
    }

    private String createAuthCode() {
        return String.format("%06d", RANDOM.nextInt(1_000_000));
    }
}
