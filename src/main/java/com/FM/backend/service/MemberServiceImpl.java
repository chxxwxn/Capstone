package com.FM.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FM.backend.mapper.MemberMapper;
import com.FM.backend.model.MemberVO;

@Service
public class MemberServiceImpl implements MemberService{

  @Autowired
  MemberMapper membermapper;

  @Override
  public void memberJoin(MemberVO member) throws Exception {
    
    membermapper.memberJoin(member);
    
  }
  
  @Override
  public boolean isEmailExists(String memberMail) {
    return membermapper.checkEmail(memberMail) > 0;
  }

  @Override
  public int idCheck(String memberId) throws Exception {
    
    return membermapper.idCheck(memberId);
    
  }
  
  @Override
  public MemberVO memberLogin(MemberVO member) throws Exception {
    
    return membermapper.memberLogin(member);
    
  }
}