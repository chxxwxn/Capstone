package com.FM.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FM.backend.mapper.CouponMapper;
import com.FM.backend.model.CouponVO;

@Service
public class CouponServiceImpl implements CouponService{

    @Autowired
    private CouponMapper couponMapper;

    @Override
    public void insertCoupon(CouponVO coupon) {
        couponMapper.insertCoupon(coupon);
    }

    @Override
    public List<CouponVO> getCouponsByMember(String memberMail) {
        return couponMapper.getCouponsByMember(memberMail);
    }

    @Override
    public void markCouponAsUsed(String couponCode, String memberMail) {
        couponMapper.updateCouponStatus(couponCode, memberMail, "사용 완료");
    }

}
