package com.FM.backend.service;

import org.apache.ibatis.annotations.Mapper;
import com.FM.backend.model.MemberVO;

@Mapper
public interface MemberService {

  /* 메일 유무 */
  public boolean isEmailExists(String memberMail) throws Exception;

  /* 회원가입 */
  public void memberJoin(MemberVO member) throws Exception;
  
  /* 아이디 중복 확인 */
  public int idCheck(String memberId) throws Exception;
  
  /* 로그인 */
  public MemberVO memberLogin(MemberVO member) throws Exception;

}
