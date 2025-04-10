package com.FM.backend.model;

public class CategoryVO {
    /* 카테고리 코드 */
    private String cateCode;
        
    /* 카테고리 이름 */
    private String cateName;

    /* 상위 카테고리 코드 (NULL이면 대분류) */
    private String parentCode;

    /* 기본 생성자 */
    public CategoryVO() {}

    /* 모든 필드를 포함하는 생성자 */
    public CategoryVO(String cateCode, String cateName, String parentCode) {
        this.cateCode = cateCode;
        this.cateName = cateName;
        this.parentCode = parentCode;
    }

    /* Getter 및 Setter */
    public String getCateCode() {
        return cateCode;
    }

    public void setCateCode(String cateCode) {
        this.cateCode = cateCode;
    }

    public String getCateName() {
        return cateName;
    }

    public void setCateName(String cateName) {
        this.cateName = cateName;
    }

    public String getParentCode() {
        return parentCode;
    }

    public void setParentCode(String parentCode) {
        this.parentCode = parentCode;
    }

    /* toString() 메서드 */
    @Override
    public String toString() {
        return "CategoryVO [cateCode=" + cateCode + ", cateName=" + cateName + ", parentCode=" + parentCode + "]";
    }
}