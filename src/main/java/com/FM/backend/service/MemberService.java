package com.FM.backend.service;

import java.util.List;

import com.FM.backend.model.MemberVO;

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

  public List<MemberVO> getAllMembers() throws Exception;

  public void updateMemberInfo(MemberVO member);

  void useCouponAndPoint(String memberMail, int usedPoint);

}
