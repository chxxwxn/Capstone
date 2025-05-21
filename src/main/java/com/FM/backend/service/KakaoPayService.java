package com.FM.backend.service;

import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import com.FM.backend.model.KakaoApproveResponse;
import com.FM.backend.model.KakaoCancelResponse;
import com.FM.backend.model.KakaoReadyResponse;
import org.springframework.http.HttpHeaders;

@Service
@RequiredArgsConstructor
@Transactional
public class KakaoPayService {

  static final String cid = "TC0ONETIME";  // 가맹점 테스트 코드
  
  @Value("${kakao.admin-key}")
  String admin_key = "1fe1fcf258abfc749de85f374e4eb039";

  private KakaoReadyResponse kakaoReady;

  public KakaoReadyResponse kakaoPayReady(int quantity, int totalAmount, String itemName) {

    // 카카오페이 요청 양식
    MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
    parameters.add("cid", cid);
    parameters.add("partner_order_id", "가맹점 주문 번호");
    parameters.add("partner_user_id", "가맹점 회원 ID");
    parameters.add("item_name", itemName);
    parameters.add("quantity", String.valueOf(quantity));
    parameters.add("total_amount", String.valueOf(totalAmount));
    parameters.add("vat_amount", "0");
    parameters.add("tax_free_amount", "0");
    parameters.add("approval_url", "http://localhost:3000/Paid"); // 성공 시 redirect url
    parameters.add("cancel_url", "http://localhost:8090/payment/cancel"); // 취소 시 redirect url
    parameters.add("fail_url", "http://localhost:8090/payment/fail"); // 실패 시 redirect url
    
    // 파라미터, 헤더
    HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());

    //외부에 보낼 url
    RestTemplate restTemplate = new RestTemplate();

    this.kakaoReady = restTemplate.postForObject(
      "https://kapi.kakao.com/v1/payment/ready",
      requestEntity,
      KakaoReadyResponse.class);

    return kakaoReady;
  }

  /* 결제 완료 승인 */
  public KakaoApproveResponse ApproveResponse(String pgToken){

    // 카카오 요청
    MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
    parameters.add("cid", cid);
    parameters.add("tid", kakaoReady.getTid());
    parameters.add("partner_order_id", "가맹점 주문 번호");
    parameters.add("partner_user_id","가맹점 회원 ID");
    parameters.add("pg_token", pgToken);

    // 파라미터, 헤더
    HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(parameters,this.getHeaders());

    // 외부에 보낼 url
    RestTemplate restTemplate = new RestTemplate();

    KakaoApproveResponse approveResponse = restTemplate.postForObject(
      "https://kapi.kakao.com/v1/payment/approve",
      requestEntity,
      KakaoApproveResponse.class);
      
    return approveResponse;
  }

  /*결제 환불 */
  public KakaoCancelResponse kakaoCancel(){
    
    // 카카오페이 요청
    MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
    parameters.add("cid", cid);
    parameters.add("tid", "환불할 결제 고유 번호");
    parameters.add("cancel_amount", "환불 금액");
    parameters.add("cancel_tax_amount", "환불 비과세 금액");
    parameters.add("cancel_vat_amount", "환불 부가세세");

    // 파라미터, 헤더
    HttpEntity<MultiValueMap<String, String>> reqeustEntity = new HttpEntity<>(parameters, this.getHeaders());

    // 외부에 보낼 url
    RestTemplate restTemplate = new RestTemplate();

    KakaoCancelResponse cancelResponse = restTemplate.postForObject(
      "https://kapi.kakao.com/v1/payment/cancel",
      reqeustEntity,
      KakaoCancelResponse.class);
    
      return cancelResponse;
  }

  private HttpHeaders getHeaders() {
    HttpHeaders httpHeaders = new HttpHeaders();

    String auth = "KakaoAK " + admin_key;

    httpHeaders.set("authorization", auth);
    httpHeaders.set("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

    return httpHeaders;
  }

}
