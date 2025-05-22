package com.FM.backend.mapper;

import com.FM.backend.model.ClothVO;
import com.FM.backend.model.ImageVO;
import java.util.List;

public interface ClothMapper {
    // 상품 목록 조회
    List<ClothVO> getAllCloths();

    // OUTER 상품 목록 조회
    List<ClothVO> getOuterCloths();

    List<ClothVO> getPaddingCloths();

    List<ClothVO> getJacketCloths();

    List<ClothVO> getCoatCloths();

    List<ClothVO> getCardiganCloths();

    // TOP 상품 목록 조회
    List<ClothVO> getTopCloths();

    List<ClothVO> getMTMCloths();

    List<ClothVO> getHoodieCloths();

    List<ClothVO> getKnitCloths();

    List<ClothVO> getShirtsCloths();

    List<ClothVO> getTeeCloths();

    // BOTTOM 상품 목록 조회
    List<ClothVO> getBottomCloths();

    List<ClothVO> getDenimCloths();

    List<ClothVO> getSkirtCloths();

    List<ClothVO> getPantsCloths();

    // ETC 상품 목록 조회
    List<ClothVO> getETCCloths();

    List<ClothVO> getRingCloths();
    
    // 특정 상품 조회
    ClothVO getClothById(int productId);
    
    // 상품 등록
    int insertCloth(ClothVO cloth);

    // 이미지 하나 등록
    int insertImage(ImageVO image);  
  
    // 상품 수정
    int updateCloth(ClothVO cloth);
    
    // 상품 삭제
    int deleteCloth(int productId);
}
