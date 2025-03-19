package com.FM.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController // React와 통신하기 위해 @RestController 사용
@RequestMapping("/Admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    /* 관리자 메인 페이지 데이터 반환 */
    @GetMapping("/")
    public Map<String, String> adminMainGET() {
        logger.info("관리자 페이지 API 호출");
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "관리자 페이지에 오신 것을 환영합니다!");

        return response; // JSON 형태로 응답 반환
    }
}
