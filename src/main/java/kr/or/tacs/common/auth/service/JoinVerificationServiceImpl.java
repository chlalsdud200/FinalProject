package kr.or.tacs.common.auth.service;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import kr.or.tacs.common.auth.mapper.AuthMapper;
import kr.or.tacs.vo.common.AuthVerificationVO;

@Service
public class JoinVerificationServiceImpl implements JoinVerificationService {

    private static final String PURPOSE_JOIN = "JOIN";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Autowired
    private AuthMapper authMapper;

    @Autowired
    private SmsService smsService;

    @Override
    public void sendJoinAuthCode(String phoneNo) {
        String normalizedPhoneNo = normalizePhoneNo(phoneNo);
        validatePhoneNo(normalizedPhoneNo);

        String authCode = createAuthCode();
        AuthVerificationVO verification = new AuthVerificationVO();
        verification.setPurposeCd(PURPOSE_JOIN);
        verification.setTargetId(normalizedPhoneNo);
        verification.setTargetNm("화주 회원가입");
        verification.setPhoneNo(normalizedPhoneNo);
        verification.setAuthCode(authCode);

        authMapper.insertVerification(verification);
        smsService.sendAuthCode(normalizedPhoneNo, authCode);
    }

    @Override
    public void verifyJoinAuthCode(String phoneNo, String authCode) {
        String normalizedPhoneNo = normalizePhoneNo(phoneNo);
        String trimmedAuthCode = trim(authCode);

        validatePhoneNo(normalizedPhoneNo);
        validateAuthCode(trimmedAuthCode);

        verifyCurrentAuthCode(normalizedPhoneNo, trimmedAuthCode);
    }

    @Override
    public void verifyJoinAuthForSignup(String phoneNo, String authCode) {
        String normalizedPhoneNo = normalizePhoneNo(phoneNo);
        String trimmedAuthCode = trim(authCode);

        validatePhoneNo(normalizedPhoneNo);
        validateAuthCode(trimmedAuthCode);

        AuthVerificationVO verified = authMapper.selectVerifiedVerification(
                PURPOSE_JOIN,
                normalizedPhoneNo,
                normalizedPhoneNo,
                trimmedAuthCode);

        if (verified != null) {
            return;
        }

        verifyCurrentAuthCode(normalizedPhoneNo, trimmedAuthCode);
    }

    private void verifyCurrentAuthCode(String normalizedPhoneNo, String trimmedAuthCode) {
        AuthVerificationVO verification = authMapper.selectValidVerification(
                PURPOSE_JOIN,
                normalizedPhoneNo,
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

    private String normalizePhoneNo(String phoneNo) {
        return phoneNo == null ? null : phoneNo.replaceAll("[^0-9]", "");
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
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
