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

    @GetMapping("/outer/padding")
    public List<ClothVO> getPaddingCloths() {
        return clothService.getPaddingCloths();
    }

    @GetMapping("/outer/jacket")
    public List<ClothVO> getJacketCloths() {
        return clothService.getJacketCloths();
    }

    @GetMapping("/outer/coat")
    public List<ClothVO> getCoatCloths() {
        return clothService.getCoatCloths();
    }

    @GetMapping("/outer/cardigan")
    public List<ClothVO> getCardiganCloths() {
        return clothService.getCardiganCloths();
    }

    @GetMapping("/top")
    public List<ClothVO> getTopCloths() {
        return clothService.getTopCloths();
    }

    @GetMapping("/top/MTM")
    public List<ClothVO> getMTMCloths() {
        return clothService.getMTMCloths();
    }

    @GetMapping("/top/Hoodie")
    public List<ClothVO> getHoodieCloths() {
        return clothService.getHoodieCloths();
    }

    @GetMapping("/top/knit")
    public List<ClothVO> getKnitCloths() {
        return clothService.getKnitCloths();
    }

    @GetMapping("/top/shirts")
    public List<ClothVO> getShirtsCloths() {
        return clothService.getShirtsCloths();
    }

    @GetMapping("/top/tee")
    public List<ClothVO> getTeeCloths() {
        return clothService.getTeeCloths();
    }

    @GetMapping("/bottom")
    public List<ClothVO> getBottomCloths() {
        return clothService.getBottomCloths();
    }

    @GetMapping("/bottom/denim")
    public List<ClothVO> getDenimCloths() {
        return clothService.getDenimCloths();
    }

    @GetMapping("/bottom/skirt")
    public List<ClothVO> getSkirtCloths() {
        return clothService.getSkirtCloths();
    }

    @GetMapping("/bottom/pants")
    public List<ClothVO> getPantsCloths() {
        return clothService.getPantsCloths();
    }

    @GetMapping("/etc")
    public List<ClothVO> getETCCloths() {
        return clothService.getETCCloths();
    }

    @GetMapping("/etc/ring")
    public List<ClothVO> getRingCloths() {
        return clothService.getRingCloths();
    }

    @GetMapping("/{productId}")
    public ClothVO getClothById(@PathVariable int productId) {
        return clothService.getClothById(productId);
    }

    @GetMapping("/color/{personalColor}")
    public List<ClothVO> getClothsByColor(@PathVariable String personalColor) {
        return clothService.getClothsByPersonalColor(personalColor);
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
