package com.FM.backend.mapper;

import java.util.List;
import com.FM.backend.model.AddressVO;

public interface AddressMapper {
    void insertAddrEmail(AddressVO address);
    List<AddressVO> getAddrEmail(String memberMail);
    void deleteAddr(int addressId);
}