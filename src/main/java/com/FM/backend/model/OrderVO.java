package com.FM.backend.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OrderVO {
    private String orderId;
    private String memberMail;
    private int productId;
    private String productName;
    private String size;
    private String color;
    private int price;
    private int quantity;
    private String status;
    private LocalDateTime order_date;
    private int usedPoint;
    private String usedCouponCode;
    private boolean isRefunded;
    private String image;
    private String name;
    private String phone;
    private String address;
    private String discount;
    private String delcharges;
    private String totalprice;
    private String paymethod;
    private String payment;
    private int couponDiscount;

}
