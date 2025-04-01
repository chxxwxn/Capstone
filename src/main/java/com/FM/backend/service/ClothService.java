package com.FM.backend.service;

import com.FM.backend.mapper.ClothMapper;
import com.FM.backend.model.ClothVO;
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

    public ClothVO getClothById(int productId) {
        return clothMapper.getClothById(productId);
    }

    public int insertCloth(ClothVO cloth) {
        return clothMapper.insertCloth(cloth);
    }

    public int updateCloth(ClothVO cloth) {
        return clothMapper.updateCloth(cloth);
    }

    public int deleteCloth(int productId) {
        return clothMapper.deleteCloth(productId);
    }
}
