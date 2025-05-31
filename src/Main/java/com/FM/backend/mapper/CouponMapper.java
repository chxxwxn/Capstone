package com.FM.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.FM.backend.model.CouponVO;

public interface CouponMapper {
    void insertCoupon(CouponVO coupon);

    List<CouponVO> getCouponsByMember(String memberMail);

    void updateCouponStatus(@Param("couponCode") String couponCode, @Param("memberMail") String memberMail, @Param("status") String status);

}
