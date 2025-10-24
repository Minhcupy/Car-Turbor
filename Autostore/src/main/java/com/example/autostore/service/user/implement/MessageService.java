package com.example.autostore.service.user.implement;

import com.example.autostore.dto.user.ChatMessageDTO;
import com.example.autostore.model.AppUser;
import com.example.autostore.model.Message;
import com.example.autostore.repository.MessageRepository;
import com.example.autostore.repository.UserRepository;
import com.example.autostore.service.user.interfaces.IMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService implements IMessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }


    @Override
    public ChatMessageDTO saveMessage(Integer senderId, Integer receiverId, String content) {
        AppUser sender = userRepository.findById(senderId)   // ✅ gọi instance
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        AppUser receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());

        messageRepository.save(msg);

        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setSenderId(senderId);
        dto.setReceiverId(receiverId);
        dto.setContent(content);
        dto.setTimestamp(msg.getTimestamp());

        return dto;
    }

    public List<ChatMessageDTO> getConversation(Integer userId, Integer adminId) {
        List<Message> all = messageRepository.findConversation(userId, adminId);

        return all.stream()
                .map(m -> new ChatMessageDTO(
                        m.getId(),
                        m.getSender().getUserId(),
                        m.getReceiver().getUserId(),
                        m.getContent(),
                        m.getTimestamp()
                ))
                .collect(Collectors.toList());

    }
}
