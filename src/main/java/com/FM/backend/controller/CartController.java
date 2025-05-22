package com.FM.backend.controller;

import com.FM.backend.model.CartVO;
import com.FM.backend.service.CartService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
    
    @Autowired
    private CartService cartService;

    // 장바구니에 추가
    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestBody CartVO cartVO) {
        cartService.addToCart(cartVO);
        return ResponseEntity.ok("장바구니에 추가되었습니다.");
    }
    
    @DeleteMapping("/delete/{cartId}")
    public void deleteCartItem(@PathVariable Long cartId) {
        cartService.deleteCartItem(cartId);
    }

    @PostMapping("/deleteSelected")
    public void deleteSelectedCartItems(@RequestBody List<Long> cartIds) {
        cartService.deleteSelectedCartItems(cartIds);
    }

    @PutMapping("/updateQuantity")
    public ResponseEntity<String> updateQuantity(@RequestBody CartVO cart) {
        try {
            cartService.updateQuantity(cart);
            return ResponseEntity.ok("수량 업데이트 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수량 업데이트 실패");
        }
    }

    // 특정 사용자의 장바구니 상품 조회
    @GetMapping("/list")
    public ResponseEntity<List<CartVO>> getCartListByMemberMail(@RequestParam String memberMail) {
        List<CartVO> cartList = cartService.getCartListByMemberMail(memberMail);
        return ResponseEntity.ok(cartList);
    }

}
