package com.FM.backend.service;

import com.FM.backend.mapper.ClothMapper;
import com.FM.backend.model.ClothVO;
import com.FM.backend.model.ImageVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClothService {

    private final ClothMapper clothMapper;

    public ClothService(ClothMapper clothMapper) {
        this.clothMapper = clothMapper;
    }

    public List<ClothVO> getAllCloths() {
        return clothMapper.getAllCloths();
    }

    public List<ClothVO> getOuterCloths() {
        return clothMapper.getOuterCloths();
    }

    public List<ClothVO> getTopCloths() {
        return clothMapper.getTopCloths();
    }

    public List<ClothVO> getBottomCloths() {
        return clothMapper.getBottomCloths();
    }

    public List<ClothVO> getETCCloths() {
        return clothMapper.getETCCloths();
    }

    public ClothVO getClothById(int productId) {
        return clothMapper.getClothById(productId);
    }

    public int insertCloth(ClothVO cloth) {
        // 1. 상품 등록 먼저
        int result = clothMapper.insertCloth(cloth);
    
        // 2. productId를 이용해서 이미지 등록
        if (cloth.getImages() != null && !cloth.getImages().isEmpty()) {
            for (ImageVO image : cloth.getImages()) {
                image.setProductId(cloth.getProductId()); // FK 설정
                clothMapper.insertImage(image);
            }
        }
    
        return result;
    }

    public int updateCloth(ClothVO cloth) {
        return clothMapper.updateCloth(cloth);
    }

    public int deleteCloth(int productId) {
        return clothMapper.deleteCloth(productId);
    }
}
