package com.FM.backend.mapper;

import java.util.List;
import com.FM.backend.model.WishlistVO;
import com.FM.backend.model.ClothVO;

public interface WishlistMapper {

    void insertWishlist(WishlistVO wishlist);

    void deleteWishlist(WishlistVO wishlist);

    List<ClothVO> getWishlistByMember(String memberMail);
}
