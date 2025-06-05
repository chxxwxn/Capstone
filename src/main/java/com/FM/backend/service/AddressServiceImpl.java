package com.FM.backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.FM.backend.mapper.AddressMapper;
import com.FM.backend.model.AddressVO;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressMapper addressMapper;

    @Override
    public void saveAddrEmail(AddressVO address) {
        addressMapper.insertAddrEmail(address);
    }

    @Override
    public List<AddressVO> getAddrEmail(String memberMail) {
        return addressMapper.getAddrEmail(memberMail);
    }

    @Override
    public void removeAddr(int addressId) {
        addressMapper.deleteAddr(addressId);
    }
}