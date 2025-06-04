package com.FM.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.FM.backend.model.MemberVO;
import com.FM.backend.model.OrderVO;

@Mapper
public interface MemberMapper {
  
  /* 메일 유무 */
  public int checkEmail(String memberMail);
  
  /* 회원가입 */
  public void memberJoin(MemberVO member);
  
  /* 카카오 회원가입 */
  void KakaoMember(MemberVO member);
  
  MemberVO findByEmail(@Param("email") String email);

  /* 로그인 */
  public MemberVO memberLogin(MemberVO member);

  public List<MemberVO> getAllMembers();

  void updateMemberInfo(MemberVO member);

  void useCouponAndPoint(
    @Param("memberMail") String memberMail,
    @Param("usedPoint") int usedPoint,
    @Param("usedCoupon") boolean usedCoupon
  );

  OrderVO getOrderByOrderNum(String orderNum);

}
