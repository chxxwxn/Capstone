package com.FM.backend.service;

import java.util.List;
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

    @Override
    public List<OrderVO> getOrdersByMember(String memberMail) {
        return orderMapper.getOrdersByMember(memberMail);
    }

    @Override
    public void updateStatus(int orderId, String status) {
        orderMapper.updateOrderStatus(orderId, status);
    }

    @Override
    public void markAsRefunded(int orderId) {
        orderMapper.markOrderRefunded(orderId);
    }

    @Override
    public OrderVO getOrderById(int orderId) {
        return orderMapper.getOrderById(orderId);
    }

    @Override
    public List<OrderVO> getRecentOrders(String memberMail) {
        return orderMapper.getRecentOrders(memberMail);
    }

    @Override
    public OrderVO getOrderByOrderNum(String orderNum) {
        return orderMapper.getOrderByOrderNum(orderNum);
    }
}
