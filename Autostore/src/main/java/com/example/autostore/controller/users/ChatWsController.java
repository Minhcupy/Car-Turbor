package com.example.autostore.controller.users;

import com.example.autostore.dto.user.ChatMessageDTO;
import com.example.autostore.service.user.implement.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWsController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO payload) {
        ChatMessageDTO saved = messageService.saveMessage(
                payload.getSenderId(),
                payload.getReceiverId(),
                payload.getContent()
        );

        // publish cho 2 bên (user và admin)
        messagingTemplate.convertAndSend(
                "/topic/chat." + saved.getSenderId() + "." + saved.getReceiverId(), saved);
        messagingTemplate.convertAndSend(
                "/topic/chat." + saved.getReceiverId() + "." + saved.getSenderId(), saved);
    }
}

