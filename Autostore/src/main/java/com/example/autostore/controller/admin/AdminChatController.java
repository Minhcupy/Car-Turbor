package com.example.autostore.controller.admin;

import com.example.autostore.dto.admin.AdminSendRequest;
import com.example.autostore.dto.user.ChatMessageDTO;
import com.example.autostore.model.ChatMessageDocument;
import com.example.autostore.repository.mongo.ChatMessageMongoRepository;
import com.example.autostore.service.ChatMongoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/messages")
public class AdminChatController {

    private final ChatMessageMongoRepository repo;
    private final ChatMongoService chatMongoService;
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${app.chat.admin-id}")
    private long adminId;

    /**
     * ✅ Inbox list: trả về "tin mới nhất" của mỗi conversation.
     * FE sẽ dùng list này để dựng danh sách cuộc hội thoại.
     */
    @GetMapping("/inbox")
    public List<ChatMessageDTO> inbox() {
        List<ChatMessageDocument> all = repo.findBySenderIdOrReceiverIdOrderByTimestampDesc(adminId, adminId);

        // group lấy latest mỗi conversationId
        Map<String, ChatMessageDocument> latest = new LinkedHashMap<>();
        for (ChatMessageDocument m : all) {
            latest.putIfAbsent(m.getConversationId(), m); // vì all đã desc, gặp đầu tiên là latest
        }

        return latest.values().stream()
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

    /**
     * ✅ Admin gửi tin cho user bất kỳ
     * POST /api/admin/messages/send
     */
    @PostMapping("/send")
    public ChatMessageDTO send(@RequestBody AdminSendRequest req) {
        Long receiverId = req.getReceiverId();
        String content = req.getContent() == null ? "" : req.getContent().trim();

        if (receiverId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "receiverId is required");
        if (content.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "content is empty");

        ChatMessageDocument saved = chatMongoService.save(adminId, receiverId, content);

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

    @DeleteMapping("/conversations/{conversationId}")
    public Map<String, Object> deleteConversation(
            @PathVariable String conversationId
    ) {
        long deleted = chatMongoService.deleteConversation(adminId, conversationId);

        messagingTemplate.convertAndSend(
                "/topic/admin/inbox",
                Map.of(
                        "type", "CONVERSATION_DELETED",
                        "conversationId", conversationId
                )
        );
        return Map.of(
                "conversationId", conversationId,
                "deletedMessages", deleted
        );
    }
}
