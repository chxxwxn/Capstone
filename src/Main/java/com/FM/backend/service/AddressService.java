package com.FM.backend.service;

import java.util.List;
import com.FM.backend.model.AddressVO;

public interface AddressService {
    void saveAddrEmail(AddressVO address);

    List<AddressVO> getAddrEmail(String memberMail);

    void removeAddr(int addressId);
}