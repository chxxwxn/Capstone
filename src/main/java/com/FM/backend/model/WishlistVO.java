package com.FM.backend.model;

import java.util.Date;

public class WishlistVO {
    
    private int wishlistId;

    private int productId;

    private String memberMail;

    private Date regDate;

    public int getWishlistId() {
        return productId;
    }

    public void setWishlistId(int wishlistId) {
        this.wishlistId = wishlistId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public String getMemberMail() {
        return memberMail;
    }

    public void setMemberMail(String memberMail) {
        this.memberMail = memberMail;
    }
    
    public Date getRegDate() {
        return regDate;
    }

    public void setRegDate(Date regDate) {
        this.regDate = regDate;
    }
    
    @Override
    public String toString() {
        return "WishlistVO [wishlistId=" + wishlistId 
            + ", productId=" + productId 
            + ", memberMail=" + memberMail
            + ", regDate=" + regDate + "]";
    }

}
