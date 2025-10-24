package com.example.autostore.controller;

import com.example.autostore.dto.ChatbotResponseDTO;
import com.example.autostore.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<ChatbotResponseDTO> chat(@RequestBody Map<String, String> payload) {
        String question = payload.getOrDefault("message", "");
        return ResponseEntity.ok(chatbotService.answer(question));
    }

}
