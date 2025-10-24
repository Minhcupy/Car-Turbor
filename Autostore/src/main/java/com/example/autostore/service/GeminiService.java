package com.example.autostore.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.*;

@Service

public class GeminiService {

    private final WebClient.Builder webClientBuilder;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public String generateAnswer(String message) {
        WebClient webClient = webClientBuilder.build();

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", message)))
                )
        );

        Map response = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        try {
            var candidates = (List<?>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                var first = (Map<?, ?>) candidates.get(0);
                var content = (Map<?, ?>) first.get("content");
                var parts = (List<?>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    var part = (Map<?, ?>) parts.get(0);
                    return Objects.toString(part.get("text"), "");
                }
            }
            return "❌ Không nhận được phản hồi từ Gemini.";
        } catch (Exception e) {
            return "❌ Lỗi khi gọi Gemini: " + e.getMessage();
        }
    }
}
