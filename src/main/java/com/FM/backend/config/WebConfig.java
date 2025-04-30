package com.FM.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;

import com.FM.backend.interceptor.AdminInterceptor;


@Configuration
public class WebConfig {

  @Autowired
  private AdminInterceptor adminInterceptor;

  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(adminInterceptor)
            .addPathPatterns("/Admin/**") // 관리자 페이지 전체 적용
            .excludePathPatterns("/Admin/login"); // 로그인 페이지는 예외 처리
  }

  @Bean
  public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true); // ✅ 세션 허용
    config.addAllowedOrigin("http://localhost:3000"); // ✅ 정확히 작성
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
  }
}