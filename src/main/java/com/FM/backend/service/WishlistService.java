package com.FM.backend.service;

import java.util.List;
import com.FM.backend.model.WishlistVO;
import com.FM.backend.model.ClothVO;

public interface WishlistService {

    void insertWishlist(WishlistVO wishlist);

    void deleteWishlist(WishlistVO wishlist);

    List<ClothVO> getWishlistByMember(String memberMail);
}
