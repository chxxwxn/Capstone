package com.FM.backend.mapper;

import com.FM.backend.model.ClothVO;
import java.util.List;

public interface ClothMapper {
    // 상품 목록 조회
    List<ClothVO> getAllCloths();
    
    // 특정 상품 조회
    ClothVO getClothById(int productId);
    
    // 상품 등록
    int insertCloth(ClothVO cloth);
    
    // 상품 수정
    int updateCloth(ClothVO cloth);
    
    // 상품 삭제
    int deleteCloth(int productId);
}
