package com.FM.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.FM.backend.model.AddressVO;
import com.FM.backend.model.MemberVO;
import com.FM.backend.service.AddressService;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/address")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping("/save")
    public ResponseEntity<String> saveAddress(@RequestBody AddressVO addressVO, HttpSession session) {
        try {
            MemberVO member = (MemberVO) session.getAttribute("member");
            if (member == null) {
                System.out.println("세션에 member 없음!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보 없음");
            }

            // 로그인된 사용자 정보로 채움
            addressVO.setMemberMail(member.getMemberMail());
            addressVO.setName(member.getMemberLn() + member.getMemberFn());
            addressVO.setPhone(member.getMemberNum1() + "-" + member.getMemberNum2() + "-" + member.getMemberNum3());

            addressService.saveAddrEmail(addressVO);
            return ResponseEntity.ok("주소 저장 성공");
        } catch (Exception e) {
            e.printStackTrace(); // 로그 확인용
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("주소 저장 실패");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<AddressVO> getAddress(@RequestParam String memberMail) {
        List<AddressVO> addresses = addressService.getAddrEmail(memberMail);
        if (!addresses.isEmpty()) {
            return ResponseEntity.ok(addresses.get(0)); // 가장 최근 주소 1개만 반환
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/getAll")
    public List<AddressVO> getAddresses(HttpSession session) {
        MemberVO member = (MemberVO) session.getAttribute("member");
        if (member == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "세션 없음");
        }
        return addressService.getAddrEmail(member.getMemberMail());
    }

}
