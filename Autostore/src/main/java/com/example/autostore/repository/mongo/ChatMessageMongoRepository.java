package com.example.autostore.repository.mongo;

import com.example.autostore.model.ChatMessageDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageMongoRepository extends MongoRepository<ChatMessageDocument, String> {
    List<ChatMessageDocument> findByConversationIdOrderByTimestampAsc(String conversationId);
}
