package com.FM.backend.model;

public class ImageVO {
    private int imageId;

    private int productId;

    private String imageUrl;

    private int imageOrder;

    public int getImageId() {
        return imageId;
    }

    public void setImageId(int imageId) {
        this.imageId = imageId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getImageOrder() {
        return imageOrder;
    }

    public void setImageOrder(int imageOrder) {
        this.imageOrder = imageOrder;
    }

    @Override
    public String toString() {
        return "ImageVO [imageId=" + imageId 
            + ", productId=" + productId 
            + ", imageUrl=" + imageUrl
            + ", imageOrder=" + imageOrder + "]";
    }
}
