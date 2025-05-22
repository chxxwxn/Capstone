package com.FM.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.FM.backend.model.CartVO;

public interface CartMapper {
    
    void insertCart(CartVO cartVO);
    
    // 단일 상품 삭제
    void deleteCartItem(@Param("cartId") Long cartId);

    // 여러 상품 삭제
    void deleteSelectedCartItems(@Param("cartIds") java.util.List<Long> cartIds);
    
    void updateCartQuantity(@Param("cartId") Long cartId, @Param("quantity") int quantity);

    void updateQuantity(CartVO cart) throws Exception;

    List<CartVO> getCartListByMemberMail(String memberMail);

}
