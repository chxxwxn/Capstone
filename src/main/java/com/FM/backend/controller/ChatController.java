package com.FM.backend.controller;

import com.FM.backend.service.OpenAIService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/ask")
    public ResponseEntity<String> askQuestion(@RequestBody Map<String, String> request) {
        String userInput = request.get("message");
        String reply = openAIService.getChatResponse(userInput);
        return ResponseEntity.ok(reply);
    }
}


