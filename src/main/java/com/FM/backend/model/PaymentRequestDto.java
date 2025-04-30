package com.FM.backend.model;

import lombok.Data;

@Data
public class PaymentRequestDto {
    private int quantity;
    private int totalAmount;
    private String itemName;
}
