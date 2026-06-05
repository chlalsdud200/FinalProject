package kr.or.tacs.common.auth.service;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import kr.or.tacs.common.auth.mapper.AuthMapper;
import kr.or.tacs.vo.common.AuthUserVO;
import kr.or.tacs.common.util.TokenProvider;
import kr.or.tacs.cmmenums.ServiceResult;
import kr.or.tacs.vo.OwnerVO;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthMapper authMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenProvider tokenProvider;

    @Override
    public String signin(String loginId, String rawPw) {
        AuthUserVO user = authMapper.selectLoginUser(loginId);

        if (user == null) {
            return null;
        }

        if (!passwordEncoder.matches(rawPw, user.getLoginPw())) {
            return null;
        }

        return tokenProvider.generateToken(user, Duration.ofMinutes(30));
    }

    @Override
    public int countLoginId(String loginId) {
        return authMapper.countLoginId(loginId);
    }

    @Override
    @Transactional
    public ServiceResult registOwner(OwnerVO ownerVO) {
        if (ownerVO == null || !StringUtils.hasText(ownerVO.getOwrId())) {
            return ServiceResult.FAILED;
        }

        String loginId = ownerVO.getOwrId().trim();
        if (authMapper.countLoginId(loginId) > 0) {
            return ServiceResult.EXIST;
        }

        ownerVO.setOwrId(loginId);
        ownerVO.setOwrPassword(passwordEncoder.encode(ownerVO.getOwrPassword()));
        ownerVO.setOwrTelno(normalizeNumber(ownerVO.getOwrTelno()));
        ownerVO.setOwrZip(normalizeNumber(ownerVO.getOwrZip()));
        ownerVO.setOwrIdentNo(normalizeNumber(ownerVO.getOwrIdentNo()));
        ownerVO.setOwrBizrno(normalizeNumber(ownerVO.getOwrBizrno()));
        ownerVO.setOwrCorpRegNo(normalizeNumber(ownerVO.getOwrCorpRegNo()));
        if ("INDV".equals(ownerVO.getOwrTyCd())) {
            ownerVO.setOwrBizrno(null);
            ownerVO.setOwrCorpRegNo(null);
        } else if ("OPERATOR".equals(ownerVO.getOwrTyCd())) {
            ownerVO.setOwrIdentNo(null);
            ownerVO.setOwrCorpRegNo(null);
        } else if ("CORP".equals(ownerVO.getOwrTyCd())) {
            ownerVO.setOwrIdentNo(null);
        }
        ownerVO.setOwrUseYn("Y");
        if (!StringUtils.hasText(ownerVO.getOwrPrivacyAgreeYn())) {
            ownerVO.setOwrPrivacyAgreeYn("Y");
        }

        return authMapper.insertOwner(ownerVO) > 0 ? ServiceResult.OK : ServiceResult.FAILED;
    }

    private String normalizeNumber(String value) {
        return value == null ? null : value.replaceAll("[^0-9]", "");
    }
}
