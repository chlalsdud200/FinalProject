package kr.or.tacs.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Slf4j
@Configuration
public class FileConfiguration implements WebMvcConfigurer {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    // 아래는 구글 드라이브 API 통합후 제거예정
    // 통합 마지막 작업자가 제거해주세요 -우승-

    @Value("${kr.or.tacs.upload.path}")//application.properties 적어둔 업로드 경로 값을 자바코드로 가져옴
    private String uploadPath;
    // uploadPath = "C:/upload/"; 라는뜻 나중에 운영서버 바뀌어도 프로퍼티만 바꾸면 됨
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        /*
         * 실제 저장 위치:
         * C:/upload/
         *
         * 브라우저 접근 URL:
         * /upload/**
         */
        registry.addResourceHandler("/upload/**")// 브라우저에서 접근 url패턴
                .addResourceLocations("file:///C:/upload/"); // 실제 파일이 위치한 물리적 경로 //호스트이름이 뒤따름나타냄,그뒤에/는 시스템루트 시작점
    }// 이설정을 통해 특정 url로 요청보내면 로컬에서 파일을 찾아 응답해줌
}
