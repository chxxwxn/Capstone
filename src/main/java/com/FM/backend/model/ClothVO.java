package com.FM.backend.model;

import java.util.Date;
import java.util.List;

public class ClothVO {
    /* 상품 ID */
    private int productId;

    /* 상품 이름 */
    private String productName;

    /* 등록 연도 (YYYY-MM-DD 형식) */
    private Date registerYear;

    /* 상품 가격 */
    private int productPrice;

    /* 상품 재고 */
    private int productStock;

    /* 상품 할인율 (백분율) */
    private double productDiscount;

    /* 상품 색상 코드 (쉼표 구분 문자열) */
    private String colorCodes;

    /* 카테고리 코드 */
    private String cateCode;

    /* 등록 날짜 */
    private Date regDate;

    /* 수정 날짜 */
    private Date updateDate;

    private List<ImageVO> images;

    private String imageUrl;

    /* Getter & Setter */
    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Date getRegisterYear() {
        return registerYear;
    }

    public void setRegisterYear(Date registerYear) {
        this.registerYear = registerYear;
    }

    public int getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(int productPrice) {
        this.productPrice = productPrice;
    }

    public int getProductStock() {
        return productStock;
    }

    public void setProductStock(int productStock) {
        this.productStock = productStock;
    }

    public double getProductDiscount() {
        return productDiscount;
    }

    public void setProductDiscount(double productDiscount) {
        this.productDiscount = productDiscount;
    }

    public String getColorCodes() {
        return colorCodes;
    }

    public void setColorCodes(String colorCodes) {
        this.colorCodes = colorCodes;
    }

    public String getCateCode() {
        return cateCode;
    }

    public void setCateCode(String cateCode) {
        this.cateCode = cateCode;
    }

    public Date getRegDate() {
        return regDate;
    }

    public void setRegDate(Date regDate) {
        this.regDate = regDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public List<ImageVO> getImages() {
        return images;
    }
    
    public void setImages(List<ImageVO> images) {
        this.images = images;
    }

    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    @Override
    public String toString() {
        return "ClothVO [productId=" + productId 
            + ", productName=" + productName 
            + ", registerYear=" + registerYear 
            + ", productPrice=" + productPrice 
            + ", productStock=" + productStock 
            + ", productDiscount=" + productDiscount 
            + ", colorCodes=" + colorCodes 
            + ", cateCode=" + cateCode 
            + ", regDate=" + regDate 
            + ", updateDate=" + updateDate + "]";
    }

}