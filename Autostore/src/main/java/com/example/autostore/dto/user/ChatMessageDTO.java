package com.example.autostore.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDTO {
    private String id;
    private String conversationId;
    private Long senderId;
    private Long receiverId;
    private String content;
    private Instant timestamp;
}
