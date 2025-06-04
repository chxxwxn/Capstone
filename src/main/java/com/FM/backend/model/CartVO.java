package com.FM.backend.model;

import java.util.Date;

public class CartVO {

    private int cartId;

    private String memberMail;

    private int productId;

    private int productQuantity;

    private String productColor;
    
    private String productSize;

    private Date regDate;

    private String imageUrl;

    private ClothVO product;

    public int getCartId() {
        return cartId;
    }

    public void setCartId(int cartId) {
        this.cartId = cartId;
    }
    
    public String getMemberMail() {
        return memberMail;
    }

    public void setMemberMail(String memberMail) {
        this.memberMail = memberMail;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getProductQuantity() {
        return productQuantity;
    }

    public void setProductQuantity(int productQuantity) {
        this.productQuantity = productQuantity;
    }
    
    public String getProductColor() {
        return productColor;
    }

    public void setProductColor(String productColor) {
        this.productColor = productColor;
    }

    public String getProductSize() {
        return productSize;
    }

    public void setProductSize(String productSize) {
        this.productSize = productSize;
    }

    public Date getRegDate() {
        return regDate;
    }

    public void setRegDate(Date regDate) {
        this.regDate = regDate;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public ClothVO getProduct() {
        return product;
    }
    
    public void setProduct(ClothVO product) {
        this.product = product;
    }
    
    @Override
    public String toString() {
        return "ClothVO [cartId=" + cartId 
            + ", memberMail=" + memberMail 
            + ", productId=" + productId 
            + ", productQuantity=" + productQuantity 
            + ", productColor=" + productColor
            + ", productSize=" + productSize
            + ", regDate=" + regDate + "]";
    }
}
