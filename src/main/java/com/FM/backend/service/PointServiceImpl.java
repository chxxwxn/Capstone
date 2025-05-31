package com.FM.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FM.backend.mapper.PointMapper;
import com.FM.backend.model.PointHistoryVO;

@Service
public class PointServiceImpl implements PointService {
    
    @Autowired
    private PointMapper pointMapper;

    @Override
    public List<PointHistoryVO> getPointHistory(String memberMail) {
        return pointMapper.getPointHistory(memberMail);
    }
}
