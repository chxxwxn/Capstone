package com.FM.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.bind.annotation.RequestParam;

import com.FM.backend.model.KakaoApproveResponse;
import com.FM.backend.model.KakaoCancelResponse;
import com.FM.backend.model.KakaoReadyResponse;
import com.FM.backend.service.KakaoPayService;

import jakarta.servlet.http.HttpSession;

import com.FM.backend.exception.BusinessLogicException;
import com.FM.backend.exception.ExceptionCode;
import com.FM.backend.model.PaymentRequestDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class KakaoPayController {

  private final KakaoPayService kakaoPayService;

  /* 결제요청 */
  @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
  @PostMapping("/ready")
  public KakaoReadyResponse readyToKakaoPay(
    @RequestBody PaymentRequestDto request,
    HttpSession session
) {
    Object loginUser = session.getAttribute("member");
    if (loginUser == null) {
        throw new RuntimeException("세션에 로그인 정보 없음");
    }

    return kakaoPayService.kakaoPayReady(
        request.getQuantity(),
        request.getTotalAmount(),
        request.getItemName()
    );
}

  /* 결제 성공 */
  @GetMapping("/success")
  public ResponseEntity<?> afterPayRequest(
          @RequestParam("pg_token") String pgToken,
          @RequestParam("tid") String tid) {

      try {
          KakaoApproveResponse response = kakaoPayService.approveResponse(pgToken, tid);
          return ResponseEntity.ok(response);
      } catch (HttpClientErrorException e) {
          // ✅ 이미 결제된 경우 무시하거나 안내
          if (e.getResponseBodyAsString().contains("payment is already done")) {
              return ResponseEntity.status(HttpStatus.OK).body("이미 승인된 결제입니다.");
          }
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("결제 승인 실패");
      }
  }

  /* 결제 진행 중 취소 */
  @GetMapping("/cancel")
  public void cancel(){
    throw new BusinessLogicException(ExceptionCode.PAY_CANCEL);
  }

  /* 결제 실패 */
  @GetMapping("/fail")
  public void fail(){
    throw new BusinessLogicException(ExceptionCode.PAY_FAILED);
  }

  /* 환불 */
  @PostMapping("/refund")
  public ResponseEntity refund(){
    KakaoCancelResponse kakaoCancelResponse = kakaoPayService.kakaoCancel();

    return new ResponseEntity<>(kakaoCancelResponse, HttpStatus.OK);
  }
}
