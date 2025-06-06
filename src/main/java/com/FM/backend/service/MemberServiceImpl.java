package com.FM.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.FM.backend.mapper.MemberMapper;
import com.FM.backend.mapper.CouponMapper;
import com.FM.backend.model.CouponVO;
import com.FM.backend.model.MemberVO;

@Service
public class MemberServiceImpl implements MemberService{

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  MemberMapper membermapper;

  @Autowired
  CouponMapper couponmapper;

  @Override
  public void memberJoin(MemberVO member) throws Exception {
    membermapper.memberJoin(member);

    // 기본 쿠폰 2종 발급
    CouponVO discountCoupon = new CouponVO();
    discountCoupon.setMemberMail(member.getMemberMail());
    discountCoupon.setCouponCode(UUID.randomUUID().toString().substring(0, 10)); // 랜덤 코드
    discountCoupon.setName("10% 할인 쿠폰");
    discountCoupon.setDiscountType("percent");
    discountCoupon.setDiscountValue(10);
    discountCoupon.setStatus("사용 가능");
    discountCoupon.setIssueDate(LocalDate.now());
    discountCoupon.setExpireDate(LocalDate.now().plusMonths(1)); // 1달 유효

    CouponVO freeShippingCoupon = new CouponVO();
    freeShippingCoupon.setMemberMail(member.getMemberMail());
    freeShippingCoupon.setCouponCode(UUID.randomUUID().toString().substring(0, 10));
    freeShippingCoupon.setName("무료 배송 쿠폰");
    freeShippingCoupon.setDiscountType("free_shipping");
    freeShippingCoupon.setDiscountValue(0);
    freeShippingCoupon.setStatus("사용 가능");
    freeShippingCoupon.setIssueDate(LocalDate.now());
    freeShippingCoupon.setExpireDate(LocalDate.now().plusMonths(1));

    // 쿠폰 저장
    couponmapper.insertCoupon(discountCoupon);
    couponmapper.insertCoupon(freeShippingCoupon);
  }
  
  @Override
  public boolean isEmailExists(String memberMail) {
    return membermapper.checkEmail(memberMail) > 0;
  }
  
  @Override
  public MemberVO memberLogin(MemberVO member) throws Exception {
    return membermapper.memberLogin(member);
  }

  @Override
  public void updateMemberInfo(MemberVO member) {
    // 비밀번호가 변경되었을 경우에만 암호화
    if (member.getMemberPw() != null && !member.getMemberPw().isEmpty()) {
        String encryptedPassword = passwordEncoder.encode(member.getMemberPw());
        member.setMemberPw(encryptedPassword);
    }
    membermapper.updateMemberInfo(member);
  }

  /* 카카오 인증 코드로 Access Token 가져오기 */ 
  @SuppressWarnings("rawtypes")
  @Override
  public String getKakaoAccessToken(String code) {
    String clientId = "e0004ba73de38814f9c3d941049efff8";
    String redirectUri = "http://localhost:8090/member/kakao/callback"; // ✅ 올바른 URL 확인
    String tokenUrl = "https://kauth.kakao.com/oauth/token"; // ✅ 올바른 URL

    RestTemplate restTemplate = new RestTemplate();

    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
    params.add("grant_type", "authorization_code");
    params.add("client_id", clientId);
    params.add("redirect_uri", redirectUri);
    params.add("code", code);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
    ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

    if (response.getStatusCode() == HttpStatus.OK) {
        Map<String, Object> body = response.getBody();
        return body != null ? (String) body.get("access_token") : null;
    }
    return null;
  }

  /* Access Token으로 사용자 정보 가져오기 & 회원가입/로그인 처리 */
  @Transactional
  @Override
  public MemberVO KakaoMember(String accessToken) throws Exception {
    String kakaoUserInfoUrl = "https://kapi.kakao.com/v2/user/me";

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + accessToken);
    headers.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

    HttpEntity<String> entity = new HttpEntity<>(headers);
    RestTemplate restTemplate = new RestTemplate();

    ResponseEntity<String> response = restTemplate.exchange(kakaoUserInfoUrl, HttpMethod.GET, entity, String.class);

    // JSON 파싱
    ObjectMapper objectMapper = new ObjectMapper();
    JsonNode rootNode = objectMapper.readTree(response.getBody());
    JsonNode kakaoAccount = rootNode.path("kakao_account");
    JsonNode profile = kakaoAccount.path("profile");

    String email = kakaoAccount.path("email").asText();
    String nickname = profile.path("nickname").asText();
    String phoneNumber = kakaoAccount.path("phone_number").asText(null);

    // DB에서 이메일 존재 여부 확인
    MemberVO existingMember = membermapper.findByEmail(email);

    if (existingMember != null) {
        // 기존 회원 정보 반환
        return existingMember;
    }

    // 새 회원 생성
    MemberVO member = new MemberVO();
    member.setMemberMail(email);
    member.setMemberFn(nickname);
    member.setMemberLn("");
    member.setMemberPw(UUID.randomUUID().toString()); // 랜덤 비밀번호 설정
    member.setMemberNum1(phoneNumber);
    member.setMemberNum2("0000");
    member.setMemberNum3("0000");
    member.setMemberRating("Enjoy");
    member.setPoint(5000);
    member.setMemberCoupon(2);

    // 기본 쿠폰 2종 발급
    CouponVO discountCoupon = new CouponVO();
    discountCoupon.setMemberMail(member.getMemberMail());
    discountCoupon.setCouponCode(UUID.randomUUID().toString().substring(0, 10)); // 랜덤 코드
    discountCoupon.setName("10% 할인 쿠폰");
    discountCoupon.setDiscountType("percent");
    discountCoupon.setDiscountValue(10);
    discountCoupon.setStatus("사용 가능");
    discountCoupon.setIssueDate(LocalDate.now());
    discountCoupon.setExpireDate(LocalDate.now().plusMonths(1)); // 1달 유효

    CouponVO freeShippingCoupon = new CouponVO();
    freeShippingCoupon.setMemberMail(member.getMemberMail());
    freeShippingCoupon.setCouponCode(UUID.randomUUID().toString().substring(0, 10));
    freeShippingCoupon.setName("무료 배송 쿠폰");
    freeShippingCoupon.setDiscountType("free_shipping");
    freeShippingCoupon.setDiscountValue(0);
    freeShippingCoupon.setStatus("사용 가능");
    freeShippingCoupon.setIssueDate(LocalDate.now());
    freeShippingCoupon.setExpireDate(LocalDate.now().plusMonths(1));

    // 쿠폰 저장
    couponmapper.insertCoupon(discountCoupon);
    couponmapper.insertCoupon(freeShippingCoupon);

    // 회원가입 진행
    membermapper.memberJoin(member);

    return member;
  }
  
  @Override
  public List<MemberVO> getAllMembers() throws Exception {
    return membermapper.getAllMembers();
  }

  @Override
  public void useCouponAndPoint(String memberMail, int usedPoint, boolean usedCoupon) {
      membermapper.useCouponAndPoint(memberMail, usedPoint, usedCoupon);
  }

    @Override
    public MemberVO getAllMember(String memberMail) {
      return membermapper.findByEmail(memberMail); 
    }
}