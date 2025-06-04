package com.FM.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.FM.backend.model.CouponVO;
import com.FM.backend.model.MemberVO;
import com.FM.backend.service.CouponService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/coupon")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping("/add")
    public ResponseEntity<String> addCoupon(@RequestBody CouponVO coupon, HttpSession session) {
        MemberVO member = (MemberVO) session.getAttribute("member");
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }

        coupon.setMemberMail(member.getMemberMail());
        couponService.insertCoupon(coupon);
        return ResponseEntity.ok("쿠폰 등록 완료");
    }

    @GetMapping("/list")
    public ResponseEntity<List<CouponVO>> listCoupons(HttpSession session) {
        MemberVO member = (MemberVO) session.getAttribute("member");
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(couponService.getCouponsByMember(member.getMemberMail()));
    }

    @PutMapping("/use")
    public ResponseEntity<String> useCoupon(@RequestParam String couponCode, HttpSession session) {
        MemberVO member = (MemberVO) session.getAttribute("member");
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }

        try {
            couponService.markCouponAsUsed(couponCode, member.getMemberMail());
            return ResponseEntity.ok("쿠폰 사용 완료 처리됨");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("쿠폰 상태 변경 실패");
        }
    }
}

