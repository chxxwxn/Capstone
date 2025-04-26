package com.FM.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 🔐 비밀번호 암호화 설정
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔐 Spring Security 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())         // CSRF 비활성화
            .cors(cors -> {})                    // CORS 활성화 (위 필터와 함께 동작)
            .authorizeHttpRequests(auth -> auth
<<<<<<< HEAD
                .requestMatchers(
                    "/member/mailChk",
                    "/member/Join2",
                    "/member/login.do",
                    "/member/kakao/callback",
                    "/products",
                    "/products/**",
                    "/payment/ready",
                    "/payment/success",
                    "/payment/cancel",
                    "/payment/fail",
                    "/payment/refund"
                ).permitAll()                     // 인증 없이 접근 허용
                .anyRequest().authenticated()     // 그 외는 인증 필요
=======
                .requestMatchers("/member/mailChk", "/member/Join2", "/member/login.do" , "/member/kakao/callback", "/products", "/products/**").permitAll()  // 인증 없이 허용
                .anyRequest().authenticated()  // 나머지는 인증 필요
>>>>>>> 8f75caf836ed735ef3e7be714f2c1634aa5ce098
            )
            .formLogin(form -> form.disable())    // 기본 로그인 폼 비활성화 (프론트에서 처리 시)
            .httpBasic(httpBasic -> httpBasic.disable()) // 기본 인증 비활성화
            .logout(logout -> logout.logoutSuccessUrl("/")); // 로그아웃 리다이렉트 설정

        return http.build();
    }
}
