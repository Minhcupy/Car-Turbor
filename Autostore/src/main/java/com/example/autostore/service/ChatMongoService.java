package com.example.autostore.service;

// package: com.example.autostore.service.mongo
import com.example.autostore.model.ChatMessageDocument;
import com.example.autostore.repository.mongo.ChatMessageMongoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMongoService {

    private final ChatMessageMongoRepository repo;

    private String conversationId(long a, long b) {
        long min = Math.min(a, b);
        long max = Math.max(a, b);
        return min + "-" + max;
    }

    public ChatMessageDocument save(long senderId, long receiverId, String content) {
        var doc = ChatMessageDocument.builder()
                .conversationId(conversationId(senderId, receiverId))
                .senderId(senderId)
                .receiverId(receiverId)
                .content(content)
                .timestamp(Instant.now())
                .build();
        return repo.save(doc);
    }

    public List<ChatMessageDocument> getConversation(long userId, long adminId) {
        return repo.findByConversationIdOrderByTimestampAsc(conversationId(userId, adminId));
    }

    public long deleteConversation(Long adminId, String conversationId) {

        if (conversationId == null || conversationId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "conversationId is required"
            );
        }

        boolean allowed =
                repo.existsByConversationIdAndSenderIdOrConversationIdAndReceiverId(
                        conversationId, adminId,
                        conversationId, adminId
                );

        if (!allowed) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Không có quyền xóa hội thoại này"
            );
        }

        return repo.deleteByConversationId(conversationId);
    }
}
