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

    public List<ClothVO> getPaddingCloths() {
        return clothMapper.getPaddingCloths();
    }

    public List<ClothVO> getJacketCloths() {
        return clothMapper.getJacketCloths();
    }

    public List<ClothVO> getCoatCloths() {
        return clothMapper.getCoatCloths();
    }

    public List<ClothVO> getCardiganCloths() {
        return clothMapper.getCardiganCloths();
    }

    public List<ClothVO> getTopCloths() {
        return clothMapper.getTopCloths();
    }

    public List<ClothVO> getMTMCloths() {
        return clothMapper.getMTMCloths();
    }

    public List<ClothVO> getHoodieCloths() {
        return clothMapper.getHoodieCloths();
    }

    public List<ClothVO> getKnitCloths() {
        return clothMapper.getKnitCloths();
    }

    public List<ClothVO> getShirtsCloths() {
        return clothMapper.getShirtsCloths();
    }

    public List<ClothVO> getTeeCloths() {
        return clothMapper.getTeeCloths();
    }

    public List<ClothVO> getBottomCloths() {
        return clothMapper.getBottomCloths();
    }

    public List<ClothVO> getDenimCloths() {
        return clothMapper.getDenimCloths();
    }

    public List<ClothVO> getSkirtCloths() {
        return clothMapper.getSkirtCloths();
    }

    public List<ClothVO> getPantsCloths() {
        return clothMapper.getPantsCloths();
    }

    public List<ClothVO> getETCCloths() {
        return clothMapper.getETCCloths();
    }

    public List<ClothVO> getRingCloths() {
        return clothMapper.getRingCloths();
    }

    public ClothVO getClothById(int productId) {
        return clothMapper.getClothById(productId);
    }

    public List<ClothVO> getClothsByPersonalColor(String personalColor) {
        return clothMapper.getClothsByPersonalColor(personalColor);
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
