package com.FM.backend.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.FM.backend.model.MemberVO;

@Mapper
public interface MemberMapper {
  
  /* 메일 유무무 */
  public int checkEmail(String memberMail);
  
  /* 회원가입 */
  public void memberJoin(MemberVO member);
  
  /* 아이디 중복 검사 */
  public int idCheck(String memebrId);
  
  /* 로그인 */
  public MemberVO memberLogin(MemberVO member);
}