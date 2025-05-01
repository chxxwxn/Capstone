package com.FM.backend.controller;

import com.FM.backend.model.ClothVO;
import com.FM.backend.service.ClothService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ClothController {

    private final ClothService clothService;

    public ClothController(ClothService clothService) {
        this.clothService = clothService;
    }

    @GetMapping
    public List<ClothVO> getAllCloths() {
        return clothService.getAllCloths();
    }

    @GetMapping("/outer")
    public List<ClothVO> getOuterCloths() {
        return clothService.getOuterCloths();
    }

    @GetMapping("/top")
    public List<ClothVO> getTopCloths() {
        return clothService.getTopCloths();
    }

    @GetMapping("/bottom")
    public List<ClothVO> getBottomCloths() {
        return clothService.getBottomCloths();
    }

    @GetMapping("/etc")
    public List<ClothVO> getETCCloths() {
        return clothService.getETCCloths();
    }

    @GetMapping("/{productId}")
    public ClothVO getClothById(@PathVariable int productId) {
        return clothService.getClothById(productId);
    }

    @PostMapping
    public int insertCloth(@RequestBody ClothVO cloth) {
        return clothService.insertCloth(cloth);
    }

    @PutMapping("/{productId}")
    public int updateCloth(@PathVariable int productId, @RequestBody ClothVO cloth) {
        cloth.setProductId(productId);
        return clothService.updateCloth(cloth);
    }

    @DeleteMapping("/{productId}")
    public int deleteCloth(@PathVariable int productId) {
        return clothService.deleteCloth(productId);
    }
}
