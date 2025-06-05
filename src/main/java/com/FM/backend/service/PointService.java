package com.FM.backend.service;

import java.util.List;
import com.FM.backend.model.PointHistoryVO;

public interface PointService {
    List<PointHistoryVO> getPointHistory(String memberMail);
}
