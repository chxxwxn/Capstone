package com.FM.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FM.backend.mapper.WishlistMapper;
import com.FM.backend.model.WishlistVO;
import com.FM.backend.model.ClothVO;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistMapper wishlistMapper;

    @Override
    public void insertWishlist(WishlistVO wishlist) {
        wishlistMapper.insertWishlist(wishlist);
    }

    @Override
    public void deleteWishlist(WishlistVO wishlist) {
        wishlistMapper.deleteWishlist(wishlist);
    }


    @Override
    public List<ClothVO> getWishlistByMember(String memberMail) {
        return wishlistMapper.getWishlistByMember(memberMail);
    }
}
