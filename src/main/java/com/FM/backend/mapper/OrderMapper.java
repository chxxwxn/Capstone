package com.FM.backend.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.FM.backend.model.OrderVO;

@Mapper
public interface OrderMapper {
    void insertOrder(OrderVO order);

    List<OrderVO> getOrdersByMember(String memberMail);

    void updateOrderStatus(int orderId, String status);

    OrderVO getOrderById(int orderId);
    
    void markOrderRefunded(int orderId);

    List<OrderVO> getRecentOrders(String memberMail);

    OrderVO getOrderByOrderNum(String orderNum);
}
