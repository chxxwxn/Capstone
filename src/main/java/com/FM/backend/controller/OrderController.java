package com.FM.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.FM.backend.model.MemberVO;
import com.FM.backend.model.OrderVO;
import com.FM.backend.service.OrderService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/save")
    public ResponseEntity<String> saveOrder(@RequestBody List<OrderVO> orders, HttpSession session) {
        MemberVO member = (MemberVO) session.getAttribute("member");
        if (member == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");

        for (OrderVO order : orders) {
            order.setMemberMail(member.getMemberMail()); // ✅ M이 대문자
            orderService.saveOrder(order);
        }

        return ResponseEntity.ok("주문 저장 완료");
    }
    
}
