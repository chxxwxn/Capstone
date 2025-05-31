package com.FM.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.FM.backend.mapper.OrderMapper;
import com.FM.backend.model.OrderVO;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public void saveOrder(OrderVO order) {
        orderMapper.insertOrder(order);
    }

}
