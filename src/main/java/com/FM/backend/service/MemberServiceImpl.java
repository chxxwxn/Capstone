package com.FM.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import java.util.List;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

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
  public MemberVO memberLogin(MemberVO member) throws Exception {
    return membermapper.memberLogin(member);
  }
  
  /* 카카오 인증 코드로 Access Token 가져오기 */
  @SuppressWarnings("rawtypes")
  @Override
  public String getKakaoAccessToken(String code) {
    String clientId = "116129a2f6241bd118d98c52c1758667";
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
    member.setMemberNum1("010"); // 기본 전화번호 설정
    member.setMemberNum2("1234");
    member.setMemberNum3("5678");
    member.setMemberRating("Enjoy");
    member.setPoint(5000);
    member.setMemberCoupon(0);

    // 회원가입 진행
    membermapper.memberJoin(member);

    return member;
  }
  
  @Override
  public List<MemberVO> getAllMembers() throws Exception {
    return membermapper.getAllMembers();
  }
}
