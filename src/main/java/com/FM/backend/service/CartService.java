package com.FM.backend.service;

import java.util.List;
import com.FM.backend.model.CartVO;

public interface CartService {

    void addToCart(CartVO cartVO);
    
    void deleteCartItem(Long cartId);
    
    void deleteSelectedCartItems(List<Long> cartIds);
    
    void updateQuantity(CartVO cart) throws Exception;

    List<CartVO> getCartListByMemberMail(String memberMail);

}
