package com.FM.backend.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;
    private final String API_URL = "https://api.openai.com/v1/chat/completions";

    public String getChatResponse(String userInput) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "당신은 옷 쇼핑몰 웹사이트에서 고객에게 귀엽고 발랄하며 친근한 말투로 안내하는 챗봇입니다.");

        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", userInput);


        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-3.5-turbo");
        body.put("messages", List.of(systemMessage, userMessage));
        body.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(API_URL, request, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> messageResponse = (Map<String, Object>) choices.get(0).get("message");

        String rawReply = messageResponse.get("content").toString().trim();
        return applyBrightTone(rawReply);
    }

    private String applyBrightTone(String message) {
        if (message.endsWith(".")) {
            message = message.substring(0, message.length() - 1) + "!";
        }

        return "💬 안녕하세요! F.M.의 스타일 서포터 프엠이입니다!" + message + " 오늘도 스타일리쉬한 하루 되세요! ✨😊";
    }
}
