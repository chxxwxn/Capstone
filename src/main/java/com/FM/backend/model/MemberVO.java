package com.FM.backend.model;

import java.util.Date;

public class MemberVO {
    
  //회원 이메일
  private String memberMail;

  //회원 비밀번호
  private String memberPw;

  //회원 이름
  private String memberFn;

  //회원 성
  private String memberLn;
  
  //회원 전화번호1
  private String memberNum1;

  //회원 전화번호2
  private String memberNum2;

  //회원 전화번호3
  private String memberNum3;

  //관리자 구분(0:일반사용자, 1:관리자)
  private int adminCk;
    
  //등록일자
  private Date regDate;
    
  //회원 등급
  private String memberRating;
    
  //회원 포인트
  private int point;

  private int memberCoupon;

  public String getMemberMail() {
    return memberMail;
  }
  
  public void setMemberMail(String memberMail) {
    this.memberMail = memberMail;
  }
  
  public String getMemberPw() {
    return memberPw;
  }
  
  public void setMemberPw(String memberPw) {
    this.memberPw = memberPw;
  }
  
  public String getMemberFn() {
    return memberFn;
  }
  
  public void setMemberFn(String memberFn) {
    this.memberFn = memberFn;
  }

  public String getMemberLn() {
    return memberLn;
  }
  
  public void setMemberLn(String memberLn) {
    this.memberLn = memberLn;
  }

  public String getMemberNum1() {
    return memberNum1;
  }

  public void setMemberNum1(String memberNum1) {
    this.memberNum1 = memberNum1;
  }
  
  public String getMemberNum2() {
    return memberNum2;
  }
  
  public void setMemberNum2(String memberNum2) {
    this.memberNum2 = memberNum2;
  }
  
  public String getMemberNum3() {
    return memberNum3;
  }
  
  public void setMemberNum3(String memberNum3) {
    this.memberNum3 = memberNum3;
  }

  public int getAdminCk() {
    return adminCk;
  }
  
  public void setAdminCk(int adminCk) {
    this.adminCk = adminCk;
  }
  
  public Date getRegDate() {
    return regDate;
  }
  
  public void setRegDate(Date regDate) {
    this.regDate = regDate;
  }

  public String getMemberRating() {
    return memberRating;
  }
  
  public void setMemberRating(String memberRating) {
    this.memberRating = memberRating;
  }
  
  public int getPoint() {
    return point;
  }
  
  public void setPoint(int point) {
    this.point = point;
  }

  public int getMemberCoupon() {
    return memberCoupon;
  }
  
  public void setMemberCoupon(int memberCoupon) {
    this.memberCoupon = memberCoupon;
  }
  
  @Override
  public String toString() {
    return "MemberVO [memberMail="+ memberMail + ", memberPw=" + memberPw + ", memberFn=" + memberFn + ", memberLn=" + memberLn + ", memberNum1=" + memberNum1 + ", memberNum2=" + memberNum2 + ", memberNum3=" + memberNum3
      + ", adminCk=" + adminCk + ", regDate=" + regDate + ", memberRating=" + memberRating + ", point=" + point +  ", memberCoupon=" + memberCoupon + "]";
  }
  
    
    
}
