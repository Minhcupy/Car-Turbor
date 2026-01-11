package com.example.autostore.model;

// package: com.example.autostore.model.mongo
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@Document(collection = "chat_messages")
public class ChatMessageDocument {

    @Id
    private String id;

    @Indexed
    private String conversationId;

    private Long senderId;
    private Long receiverId;
    private String content;

    @Indexed
    private Instant timestamp;
}
