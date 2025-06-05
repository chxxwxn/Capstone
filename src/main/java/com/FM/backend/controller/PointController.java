package com.FM.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.FM.backend.model.MemberVO;
import com.FM.backend.model.PointHistoryVO;
import com.FM.backend.service.PointService;

import jakarta.servlet.http.HttpSession;


@RestController
@RequestMapping("/point")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PointController {

    @Autowired
    private PointService pointService;

    @GetMapping("/history")
    public ResponseEntity<List<PointHistoryVO>> getPointHistory(HttpSession session) {
        MemberVO member = (MemberVO) session.getAttribute("member");
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<PointHistoryVO> history = pointService.getPointHistory(member.getMemberMail());
        return ResponseEntity.ok(history);
    }

}
