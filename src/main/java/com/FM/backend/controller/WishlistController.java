package com.FM.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.FM.backend.model.ClothVO;
import com.FM.backend.model.WishlistVO;
import com.FM.backend.service.WishlistService;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = "http://localhost:3000") // 프론트 포트 맞게 조정
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // 찜 추가
    @PostMapping("/insert")
    public void insertWishlist(@RequestBody WishlistVO wishlist) {
        wishlistService.insertWishlist(wishlist);
    }

    // 찜 삭제
    @PostMapping("/delete")
    public void deleteWishlist(@RequestBody WishlistVO wishlist) {
        wishlistService.deleteWishlist(wishlist);
    }

    // 찜 목록 조회
    @GetMapping("/list")
    public List<ClothVO> getWishlistByMember(@RequestParam String memberMail) {
        return wishlistService.getWishlistByMember(memberMail);
    }
}
