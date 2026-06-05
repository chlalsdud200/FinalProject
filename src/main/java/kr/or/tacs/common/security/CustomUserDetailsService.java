package kr.or.tacs.common.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import kr.or.tacs.common.auth.mapper.AuthMapper;
import kr.or.tacs.vo.common.AuthUserVO;
import kr.or.tacs.vo.common.CustomUser;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AuthMapper authMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("## loadUserByUsername : {}", username);

        AuthUserVO user = authMapper.selectLoginUser(username);

        if (user == null) {
            throw new UsernameNotFoundException("계정을 찾을 수 없습니다: " + username);
        }

        return new CustomUser(user);
    }
}