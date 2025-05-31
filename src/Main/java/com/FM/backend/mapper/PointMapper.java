package com.FM.backend.mapper;

import java.util.List;
import com.FM.backend.model.PointHistoryVO;

public interface PointMapper {
    List<PointHistoryVO> getPointHistory(String memberMail);
}