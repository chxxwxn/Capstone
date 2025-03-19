package com.FM.backend.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import com.FM.backend.config.MyBatisConfig;
import com.FM.backend.model.MemberVO;

@MybatisTest  // MyBatis 관련 컴포넌트만 로드
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 실제 DB 사용
@Import(MyBatisConfig.class)  // MyBatis 설정 클래스 로드
public class MemberMapperTests {

    @Autowired
    private MemberMapper membermapper;

    @Test
    public void memberJoin() throws Exception {
        MemberVO member = new MemberVO();
        member.setMemberFn("test");
        member.setMemberLn("test");
        member.setMemberMail("test@test.com");
        member.setMemberPw("test");
        member.setMemberNum1(1234);
        member.setMemberNum2(5678);
        member.setMemberNum3(9012);

        membermapper.memberJoin(member);
    }

    /* 로그인 쿼리 mapper 메서드 테스트 
    @Test
    public void memberLogin() throws Exception{
        
        MemberVO member = new MemberVO();    // MemberVO 변수 선언 및 초기화
        
        // 올바른 아이디 비번 입력경우
        member.setMemberMail("test");
        member.setMemberPw("!test123");
        
        // 올바른 않은 아이디 비번 입력경우
        //member.setMemberId("test1123");
        //member.setMemberPw("test1321321");
        
        membermapper.memberLogin(member);
        System.out.println("결과 값 : " + membermapper.memberLogin(member));
        
    }*/
}