package com.example.autostore.controller.users;

import com.example.autostore.dto.user.ChatMessageDTO;
import com.example.autostore.dto.user.ChatSendRequest;
import com.example.autostore.model.ChatMessageDocument;
import com.example.autostore.service.ChatMongoService;
import com.example.autostore.service.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/messages")
public class MessageRestController {

    private final ChatMongoService chatMongoService;
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${app.chat.admin-id}")
    private long adminId;

    @GetMapping("/me")
    public List<ChatMessageDocument> getMyConversation(@AuthenticationPrincipal UserDetailsImpl me) {
        long userId = me.getId().longValue();
        return chatMongoService.getConversation(userId, adminId);
    }

    @PostMapping
    public ChatMessageDTO sendMessage(
            @AuthenticationPrincipal UserDetailsImpl me,
            @RequestBody ChatSendRequest req
    ) {
        long senderId = me.getId().longValue();
        String content = req.getContent() == null ? "" : req.getContent().trim();

        if (content.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "content is empty");
        }

        ChatMessageDocument saved = chatMongoService.save(senderId, adminId, content);

        ChatMessageDTO dto = ChatMessageDTO.builder()
                .id(saved.getId())
                .conversationId(saved.getConversationId())
                .senderId(saved.getSenderId())
                .receiverId(saved.getReceiverId())
                .content(saved.getContent())
                .timestamp(saved.getTimestamp())
                .build();

        messagingTemplate.convertAndSend("/topic/conversations/" + saved.getConversationId(), dto);
        messagingTemplate.convertAndSend("/topic/admin/inbox", dto);
        return dto;
    }
}
