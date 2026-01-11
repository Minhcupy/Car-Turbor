package com.example.autostore.controller;

import com.example.autostore.dto.user.ChatMessageDTO;
import com.example.autostore.model.ChatMessageDocument;
import com.example.autostore.service.ChatMongoService;
//import com.example.autostore.service.user.implement.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
public class ChatWsController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMongoService chatMongoService;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO dto) {
        ChatMessageDocument saved = chatMongoService.save(
                dto.getSenderId(),
                dto.getReceiverId(),
                dto.getContent()
        );


        ChatMessageDTO out = ChatMessageDTO.builder()
                .id(saved.getId())
                .conversationId(saved.getConversationId())
                .senderId(saved.getSenderId())
                .receiverId(saved.getReceiverId())
                .content(saved.getContent())
                .timestamp(saved.getTimestamp())
                .build();

        messagingTemplate.convertAndSend("/topic/conversations/" + saved.getConversationId(), out);
    }


    private String generateConversationId(Long senderId, Long receiverId) {
        long min = Math.min(senderId, receiverId);
        long max = Math.max(senderId, receiverId);
        return min + "-" + max;
    }
}

