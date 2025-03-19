package com.FM.backend.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import com.FM.backend.model.MemberVO;

@Component
public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        MemberVO lvo = (MemberVO) session.getAttribute("member");

        if (lvo == null) {
            response.sendRedirect("/member/Login"); // 로그인되지 않은 경우 로그인 페이지로 이동
            return false;
        }

        if (lvo.getAdminCk() == 0) {
            response.sendRedirect("/"); // 일반 사용자는 메인 페이지로 이동
            return false;
        }

        return true; // 관리자 계정일 경우 통과
    }
}