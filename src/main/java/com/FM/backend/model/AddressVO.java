package com.FM.backend.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AddressVO {
    private int addressId;
    private String memberMail;
    private String name;
    private String phone;
    private String address;
    private String detailAddress;
    private String zipCode;
    private LocalDateTime createdAt;

    // Getter/Setter 생략
}