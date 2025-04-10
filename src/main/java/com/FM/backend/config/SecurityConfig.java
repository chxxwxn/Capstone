package com.FM.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 비밀번호 암호화 설정
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS 설정
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000"); // React 허용
        config.addAllowedMethod("*"); // 모든 HTTP 메서드 허용
        config.addAllowedHeader("*"); // 모든 헤더 허용
        config.setAllowCredentials(true); // 인증 정보 포함 허용
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    // Spring Security 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // CSRF 비활성화
            .cors(withDefaults())  // CORS 활성화
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/member/mailChk", "/member/Join2", "/member/login.do" , "/member/kakao/callback").permitAll()  // 인증 없이 허용
                .anyRequest().authenticated()  // 나머지는 인증 필요
            )
            .formLogin(withDefaults())  // 기본 로그인 폼 (프론트에서 로그인 페이지가 없다면 제거)
            .logout(logout -> logout.logoutSuccessUrl("/"))  // 로그아웃 후 리다이렉트 방지
    
            // HTTP 기본 인증 제거 (리다이렉트 방지)
            .httpBasic(httpBasic -> httpBasic.disable());
    
        return http.build();
    }
}
