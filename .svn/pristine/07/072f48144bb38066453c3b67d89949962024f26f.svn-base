package kr.or.tacs.common.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.web.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.NullSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import kr.or.tacs.common.filter.TokenAuthenticationFilter;
import kr.or.tacs.common.security.CustomAccessDeniedHandler;
import kr.or.tacs.common.security.CustomLoginFailureHandler;
import kr.or.tacs.common.security.CustomLoginSuccessHandler;
import kr.or.tacs.common.security.CustomUserDetailsService;
import kr.or.tacs.common.util.TokenProvider;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private TokenProvider tokenProvider;

    private static final String[] PASS_URL = {
            "/", "/index.html", "/login", "/login.do", "/error",
            "/accessError",
            "/test/sms",

            "/google/drive/**",

            "/find-password.do", "/find-password/send-code.do", "/find-password/verify-code.do", "/find-password/change.do",
            "/join.do", "/joinProc.do", "/join/send-code.do", "/join/verify-code.do", "/checkId.do",
            "/.well-known/**", "/upload/**", "/css/**", "/js/**", "/img/**"
    };

    private static final String[] REACT_PASS_URL = {
            "/api/tacs/auth/checkId",
            "/api/tacs/auth/signup",
            "/api/tacs/auth/signin",
            "/api/tacs/public/**",
            "/api/tacs/ais/**"
    };

    @Bean
    public WebSecurityCustomizer configure() {
        return web -> web.ignoring()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations())
                .requestMatchers("/resources/**", "/static/**");
    }

    /**
     * ① React (JWT, STATELESS) 체인
     */
    @Order(1)
    @Bean
    SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher("/api/tacs/**")
                .csrf(c -> c.disable()) // 토큰검증
                .formLogin(f -> f.disable())
                .httpBasic(b -> b.disable())
                .headers(h -> h.frameOptions(f -> f.sameOrigin()))
                // 세션 정보를 아예 읽지도 쓰지도 않도록 설정 (JSP 세션과의 충돌 방지)
                .securityContext(context -> context.securityContextRepository(new NullSecurityContextRepository()))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors((cors) -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(REACT_PASS_URL).permitAll()
                        .requestMatchers("/api/tacs/owner/**").hasAnyRole("OWNER", "SYSTEM_ADMIN")
                        .requestMatchers("/api/tacs/broker/**").hasAnyRole("BROKER", "SYSTEM_ADMIN")
                        .requestMatchers("/api/tacs/officer/**").hasAnyRole("OFFICER", "SYSTEM_ADMIN")
                        .requestMatchers("/api/tacs/fieldofficer/**").hasAnyRole("OFFICER", "SYSTEM_ADMIN")
                        .requestMatchers("/api/tacs/transport/**").hasAnyRole("TRANSPORT_MANAGER", "SYSTEM_ADMIN")
                        .requestMatchers("/api/tacs/warehouse/**").hasAnyRole("WAREHOUSE_MANAGER", "SYSTEM_ADMIN")
                        .requestMatchers("/api/tacs/systemadmin/**", "/api/tacs/admin/**").hasRole("SYSTEM_ADMIN")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        // 인증 실패 시 리다이렉트 대신 401 반환
                        .authenticationEntryPoint((req, res, authException) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"Unauthorized\"}");
                        })
                        // 권한 부족 시 리다이렉트 대신 403 반환
                        .accessDeniedHandler((req, res, accessDeniedException) -> {
                            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"Forbidden\"}");
                        })
                )
                .addFilterBefore(new TokenAuthenticationFilter(tokenProvider),
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }


    /**
     * ② JSP/세션 체인
     */
    @Order(2)
    @Bean
    SecurityFilterChain webFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher("/**")
                .csrf(c -> c.ignoringRequestMatchers(
                        "/admin/notices/**",
                        "/admin/faqs/**",
                        "/logout",
                        "/api/docs/**",
                        "/api/admin/auth/token", // React 관리자 앱에서 세션 기반 JWT 발급 요청
                        "/api/admin/auth/logout", // React 관리자 앱에서 Spring 세션 종료 요청
                        "/transport/export/request/status.do",
                        "/transport/import/request/status.do",
                        "/warehouse/approveInbound.do",
                        "/api/notifications/**",

                        // Google Drive OAuth / test upload
                        "/google/drive/**"
                ))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(DispatcherType.FORWARD, DispatcherType.ASYNC).permitAll()
                        .requestMatchers(PASS_URL).permitAll()
                        .requestMatchers("/owner/**").hasAnyRole("OWNER", "SYSTEM_ADMIN")
                        .requestMatchers("/broker/**").hasAnyRole("BROKER", "SYSTEM_ADMIN")
                        .requestMatchers("/officer/**").hasAnyRole("OFFICER", "SYSTEM_ADMIN")
                        .requestMatchers("/fieldofficer/**").hasAnyRole("OFFICER", "SYSTEM_ADMIN")
                        .requestMatchers("/quarantine/**").hasAnyRole("OFFICER", "SYSTEM_ADMIN")
                        .requestMatchers("/transport/**").hasAnyRole("TRANSPORT_MANAGER", "SYSTEM_ADMIN")
                        .requestMatchers("/warehouse/**").hasAnyRole("WAREHOUSE_MANAGER", "SYSTEM_ADMIN")
                        .requestMatchers("/systemadmin/**", "/admin/**").hasRole("SYSTEM_ADMIN")
                        .anyRequest().authenticated()
                )
                .formLogin(login -> login
                        .loginPage("/login.do")
                        .loginProcessingUrl("/login")
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .successHandler(new CustomLoginSuccessHandler())
                        .failureHandler(new CustomLoginFailureHandler()))
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .invalidateHttpSession(true)
                        .logoutSuccessUrl("/login.do")
                        .deleteCookies("JSESSIONID", "remember-me"))
                .exceptionHandling(ex -> ex.accessDeniedHandler(new CustomAccessDeniedHandler()))
                .httpBasic(b -> b.disable());
        return http.build();
    }

    // ★★★ Spring Security 7.0 호환 - DaoAuthenticationProvider 직접 만들지 않음
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 1. React 앱이 구동되는 정확한 출처만 타겟팅하여 허용
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:8077",
                "http://127.0.0.1:8077"
        ));
        // 2. 데이터 조회, 등록, 수정, 삭제에 필요한 HTTP 메서드 허용
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // 3. 인증 토큰(Authorization) 및 데이터 포맷(Content-Type) 관련 헤더 허용
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control", "Origin", "Accept", "X-Requested-With"));
        //의미: "백엔드가 응답할 때, 프론트엔드 자바스크립트가 이 헤더는 꺼내서 읽을 수 있게 노출해 줄게."
        //포인트: 여기에 적힌 Content-Disposition은 주로 파일 다운로드할 때 파일 이름을 전달하기 위해 사용하는 헤더야. 이걸 설정 안 하면 백엔드에서 파일 이름을 보내줘도 프론트엔드에서 읽지 못해.
        configuration.setExposedHeaders(Arrays.asList("Content-Disposition"));
        // 4. JWT 토큰이나 쿠키 등 인증 정보를 HTTP 헤더에 실어 보낼 수 있도록 허용
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 URL 경로에 이 규칙 적용
        return source;
    }

}
