package com.FM.backend.service;

import java.util.List;

import com.FM.backend.model.OrderVO;

public interface OrderService {
    void saveOrder(OrderVO order);

    List<OrderVO> getOrdersByMember(String memberMail);

    void updateStatus(int orderId, String status);

    void markAsRefunded(int orderId);
    
    OrderVO getOrderById(int orderId);

    public List<OrderVO> getRecentOrders(String memberMail);

    public OrderVO getOrderByOrderNum(String orderNum) throws Exception;
}
