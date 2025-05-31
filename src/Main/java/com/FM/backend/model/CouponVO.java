package com.FM.backend.model;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CouponVO {
    private int couponId;
    private String memberMail;
    private String couponCode;
    private String name;
    private String discountType;
    private int discountValue;
    private String status;
    private LocalDate issueDate;
    private LocalDate expireDate;
}

