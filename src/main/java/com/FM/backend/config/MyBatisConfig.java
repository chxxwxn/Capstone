package com.FM.backend.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.FM.backend.mapper")  // 매퍼 위치 지정
public class MyBatisConfig {
}