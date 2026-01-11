package com.example.autostore.controller.users;

import com.example.autostore.dto.user.ChatMessageDTO;
import com.example.autostore.repository.mongo.ChatMessageMongoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatHistoryController {

    private final ChatMessageMongoRepository repo;

    @GetMapping("/history/{conversationId}")
    public List<ChatMessageDTO> history(@PathVariable String conversationId) {
        return repo.findByConversationIdOrderByTimestampAsc(conversationId)
                .stream()
                .map(doc -> ChatMessageDTO.builder()
                        .id(doc.getId())
                        .conversationId(doc.getConversationId())
                        .senderId(doc.getSenderId())
                        .receiverId(doc.getReceiverId())
                        .content(doc.getContent())
                        .timestamp(doc.getTimestamp())
                        .build())
                .toList();
    }
}
