package com.FM.backend.controller;

//import java.util.Random;

//import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;


import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.net.URLEncoder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.FM.backend.model.MemberVO;
import com.FM.backend.service.MemberService;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(origins = "http://localhost:3000") 
@Controller
@RequestMapping(value = "/member")
public class MemberController {
  
  private static final Logger logger = LoggerFactory.getLogger(MemberController.class);
    
  @Autowired
  private MemberService memberservice;
  
  /* 
  @Autowired
  private JavaMailSender mailSender;
  */

  @Autowired
  private PasswordEncoder passwordEncoder;

  /* 이메일 중복 확인 */
  @PostMapping("/mailChk")
  public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> request) {
    String memberMail = request.get("memberMail");

    try {
        boolean exists = memberservice.isEmailExists(memberMail);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "서버 오류 발생: " + e.getMessage()));
    }
  }

  /* 회원가입 페이지 진입 */
  @RequestMapping(value = "Join2", method = RequestMethod.GET)
  public void joinGET() {
    
    logger.info("회원가입 페이지 진입");
      
  }

  /* 회원가입 처리 */
  @RequestMapping(value="/Join2", method=RequestMethod.POST)
  public ResponseEntity<String> joinPOST(@RequestBody MemberVO member) {
    try {
      logger.info("회원가입 요청 데이터: " + member.toString());  // 입력 데이터 확인
      System.out.println("회원가입 요청 데이터: " + member.toString());

      // 비밀번호 암호화
      String rawPw = member.getMemberPw();
      String encodePw = passwordEncoder.encode(rawPw);
      member.setMemberPw(encodePw);

      // 회원가입 처리
      memberservice.memberJoin(member);
      logger.info("회원가입 성공");

      return ResponseEntity.ok("회원가입 성공");
    } catch (Exception e) {
      logger.error("회원가입 오류 발생: ", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                           .body("회원가입 실패: " + e.getMessage());
    }
  }

  /* 로그인 페이지 진입 */
  @RequestMapping(value="login", method = RequestMethod.GET)
  public void loginGET() {
      
    logger.info("로그인 페이지 진입");
      
  }
   
  /* 
  @RequestMapping(value="/mailCheck", method=RequestMethod.GET)
  @ResponseBody
  public String mailCheckGET(String email) throws Exception{
     
    // 뷰(View)로부터 넘어온 데이터 확인
    logger.info("이메일 데이터 전송 확인");
    logger.info("인증번호 : " + email);
     
    //인증번호(난수) 생성
    Random random = new Random();
    int checkNum = random.nextInt(888888) + 111111;
    logger.info("인증번호" + checkNum);
     
    String setFrom = "guscjf7557@naver.com";
    String toMail = email;
    String title = "회원가입 인증 이메일 입니다.";
    String content = 
      "홈페이지를 방문해주셔서 감사합니다." +
      "<br><br>" +
      "인증번호는 " + checkNum + "입니다." +
      "<br>" +
      "해당 인증번호를 인증번호 확인란에 기입하여 주세요.";

    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
      helper.setFrom(setFrom);
      helper.setTo(toMail);
      helper.setSubject(title);
      helper.setText(content,true);
      mailSender.send(message);
    }catch(Exception e) {
       e.printStackTrace();
    }
    String num = Integer.toString(checkNum);
     
    return num;
     
  }*/
   
  /* 로그인 */
  @RequestMapping(value="login.do", method=RequestMethod.POST)
  @ResponseBody
  public ResponseEntity<?> loginPOST(@RequestBody MemberVO member, HttpServletRequest request) {
    try {
      HttpSession session = request.getSession();
      String rawPw = member.getMemberPw();

      MemberVO lvo = memberservice.memberLogin(member);
        
      if (lvo != null && passwordEncoder.matches(rawPw, lvo.getMemberPw())) {
        lvo.setMemberPw(""); // 비밀번호 숨김 처리
        session.setAttribute("member", lvo); // 세션에 저장

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "로그인 성공");
        response.put("member", lvo); // 회원 정보 포함

        return ResponseEntity.ok(response);
      } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body(Collections.singletonMap("message", "비밀번호가 잘못되었습니다."));
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                           .body(Collections.singletonMap("message", "서버 오류가 발생했습니다."));
    }
  }

  /* 카카오 로그인 콜백 처리 */
  @GetMapping("/kakao/callback") 
  public ResponseEntity<Void> kakaoCallback(
    @RequestParam("code") String code, 
    HttpServletRequest request,  // HttpServletRequest 추가
    HttpServletResponse response
  ) {
    try {
        // 카카오 서버에서 accessToken 요청
        String accessToken = memberservice.getKakaoAccessToken(code);

        // 사용자 정보 가져오기
        MemberVO member = memberservice.KakaoMember(accessToken);

        // 세션에 저장
        HttpSession session = request.getSession(); // request 사용 가능
        session.setAttribute("member", member);

        // 프론트엔드로 `member` 정보도 함께 리다이렉트
        String redirectUrl = "http://localhost:3000/?token=" + accessToken + 
                             "&member=" + URLEncoder.encode(new ObjectMapper().writeValueAsString(member), "UTF-8");
                             
        response.sendRedirect(redirectUrl);
        return ResponseEntity.ok().build();
    } catch (Exception e) {
      System.out.println("❌ 예외 발생: " + e.getMessage());  // ✅ 이거 꼭 넣으세요
      e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
  
  @GetMapping("/list")
  public ResponseEntity<List<MemberVO>> getAllMembers() throws Exception {
    List<MemberVO> members = memberservice.getAllMembers();
    return ResponseEntity.ok(members);
  }
}
