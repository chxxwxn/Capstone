package com.FM.backend.model;

import java.sql.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PointHistoryVO {
    private int id;
    private String memberMail;
    private int amount;
    private String type; // "적립", "사용", "만료"
    private String description;
    private Date created_at;
    private Date expire_at;
}
