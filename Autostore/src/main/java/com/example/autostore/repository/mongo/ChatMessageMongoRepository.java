package com.example.autostore.repository.mongo;

import com.example.autostore.model.ChatMessageDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageMongoRepository extends MongoRepository<ChatMessageDocument, String> {
    List<ChatMessageDocument> findByConversationIdOrderByTimestampAsc(String conversationId);
    List<ChatMessageDocument> findBySenderIdOrReceiverIdOrderByTimestampDesc(Long senderId, Long receiverId);
    long deleteByConversationId(String conversationId);

    boolean existsByConversationIdAndSenderIdOrConversationIdAndReceiverId(
            String conversationId, Long senderId,
            String conversationId2, Long receiverId
    );
}
