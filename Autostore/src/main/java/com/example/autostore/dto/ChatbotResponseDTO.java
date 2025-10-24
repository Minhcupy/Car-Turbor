package com.example.autostore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ChatbotResponseDTO {
    private String answer;
    private List<CarDTO> cars;
}
