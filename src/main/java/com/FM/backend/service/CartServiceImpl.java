package com.FM.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FM.backend.mapper.CartMapper;
import com.FM.backend.model.CartVO;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartMapper cartMapper;

    @Override
    public void addToCart(CartVO cartVO) {
        cartMapper.insertCart(cartVO);
    }
 
    @Override
    public void deleteCartItem(Long cartId) {
        cartMapper.deleteCartItem(cartId);
    }

    @Override
    public void deleteSelectedCartItems(List<Long> cartIds) {
        cartMapper.deleteSelectedCartItems(cartIds);
    }

    @Override
    public void updateQuantity(CartVO cart) throws Exception {
        cartMapper.updateQuantity(cart);
    }


    @Override
    public List<CartVO> getCartListByMemberMail(String memberMail) {
        return cartMapper.getCartListByMemberMail(memberMail);
    }

}
