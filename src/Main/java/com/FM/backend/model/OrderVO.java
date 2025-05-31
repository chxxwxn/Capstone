package com.FM.backend.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OrderVO {
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
}
