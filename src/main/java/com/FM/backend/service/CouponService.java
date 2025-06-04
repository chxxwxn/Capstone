package com.FM.backend.service;

import java.util.List;

import com.FM.backend.model.CouponVO;

public interface CouponService {
    void insertCoupon(CouponVO coupon);  // 추가
    
    List<CouponVO> getCouponsByMember(String memberMail);  // 추가

    void markCouponAsUsed(String couponCode, String memberMail);
}