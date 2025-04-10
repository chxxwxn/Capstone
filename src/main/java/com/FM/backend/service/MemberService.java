package com.FM.backend.service;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.http.ResponseEntity;

import com.FM.backend.model.MemberVO;

@Mapper
public interface MemberService {

  /* 메일 유무 */
  public boolean isEmailExists(String memberMail) throws Exception;

  /* 회원가입 */
  public void memberJoin(MemberVO member) throws Exception;
  
  /* 로그인 */
  public MemberVO memberLogin(MemberVO member) throws Exception;

  /* 카카오 회원가입 및 로그인 */
  public MemberVO KakaoMember(String accessToken) throws Exception;

  String getKakaoAccessToken(String code);

}
