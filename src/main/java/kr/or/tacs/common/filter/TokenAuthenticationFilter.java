package kr.or.tacs.common.filter;

import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import kr.or.tacs.common.util.TokenProvider;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class TokenAuthenticationFilter extends OncePerRequestFilter {
    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";

    private final TokenProvider tokenProvider;

    public TokenAuthenticationFilter(TokenProvider tp) { this.tokenProvider = tp; }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader(HEADER);
        String token = (header != null && header.startsWith(PREFIX))
                     ? header.substring(PREFIX.length()) : null;

        if (token != null && tokenProvider.validToken(token)) {
            Authentication auth = tokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
            log.info("# JWT 인증 성공: {} ({})",
                tokenProvider.getUserId(token), tokenProvider.getUserId(token));
        }
        chain.doFilter(req, res);
    }
}