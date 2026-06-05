package kr.or.tacs.common.util;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.Data;

@Data
@Component
@ConfigurationProperties("kr.or.tacs.jwt")
public class JwtProperties {
    private String issuer;
    private String secretKey;
}