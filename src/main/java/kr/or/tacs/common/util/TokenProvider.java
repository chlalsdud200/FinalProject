package kr.or.tacs.common.util;

import java.time.Duration;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import kr.or.tacs.vo.common.AuthUserVO;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.common.security.CustomUserDetailsService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class TokenProvider {

    @Autowired private JwtProperties jwtProperties;
    @Autowired private CustomUserDetailsService userDetailsService;

    public String generateToken(AuthUserVO user, Duration expiry) {
        Date now = new Date();

        return Jwts.builder()
            .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
            .setIssuer(jwtProperties.getIssuer())
            .setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + expiry.toMillis()))
            .setSubject(user.getLoginId())
            .claim("id", user.getLoginId())
            .claim("role", user.getRoleCd())
            .signWith(SignatureAlgorithm.HS256, jwtProperties.getSecretKey().getBytes())
            .compact();
    }

    public boolean validToken(String token) {
        try {
            Date exp = Jwts.parser()
                .setSigningKey(jwtProperties.getSecretKey().getBytes())
                .parseClaimsJws(token).getBody().getExpiration();
            return !exp.before(new Date());
        } catch (Exception e) { return false; }
    }

    public Authentication getAuthentication(String token) {
        String id = getClaims(token).get("id", String.class);

        UserDetails userDetails = userDetailsService.loadUserByUsername(id);
        CustomUser user = (CustomUser) userDetails;

        return new UsernamePasswordAuthenticationToken(
            userDetails,
            "",
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRoleCd()))
        );
    }
    
    public String getUserId(String token) {
        return getClaims(token).get("id", String.class);
    }
    
    private Claims getClaims(String token) {
        return Jwts.parser()
            .setSigningKey(jwtProperties.getSecretKey().getBytes())
            .parseClaimsJws(token).getBody();
    }
}