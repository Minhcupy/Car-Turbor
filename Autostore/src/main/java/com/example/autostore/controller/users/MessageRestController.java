package com.example.autostore.controller.users;

import com.example.autostore.dto.user.ChatMessageDTO;
import com.example.autostore.service.user.implement.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageRestController {

    private final MessageService messageService;

    // Lấy toàn bộ lịch sử hội thoại giữa user và admin
    @GetMapping("/{userId}/{adminId}")
    public ResponseEntity<List<ChatMessageDTO>> getConversation(
            @PathVariable Integer userId,
            @PathVariable Integer adminId) {
        return ResponseEntity.ok(messageService.getConversation(userId, adminId));
    }

    // Gửi tin nhắn (REST backup, khi WS lỗi)
    @PostMapping
    public ResponseEntity<ChatMessageDTO> sendMessage(@RequestBody ChatMessageDTO dto) {
        ChatMessageDTO saved = messageService.saveMessage(
                dto.getSenderId(),
                dto.getReceiverId(),
                dto.getContent()
        );
        return ResponseEntity.ok(saved);
    }
}
