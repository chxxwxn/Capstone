package com.FM.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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

    @GetMapping("/list")
    public List<OrderVO> getOrders(@RequestParam String memberMail, HttpSession session) {
        MemberVO member = (MemberVO) session.getAttribute("member");
        if (member == null || !member.getMemberMail().equals(memberMail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "세션 없음 또는 권한 없음");
        }
        return orderService.getOrdersByMember(memberMail);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<OrderVO>> getRecentOrders(HttpSession session) {
        MemberVO member = (MemberVO) session.getAttribute("member");
        if (member == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 인증 실패
        }
        
        List<OrderVO> recentOrders = orderService.getRecentOrders(member.getMemberMail());
        return ResponseEntity.ok(recentOrders);
    }
    
}
