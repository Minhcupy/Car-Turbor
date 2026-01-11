//package com.example.autostore.service.user.implement;
//
//import com.example.autostore.dto.user.ChatMessageDTO;
//import com.example.autostore.model.AppUser;
//import com.example.autostore.model.Message;
//import com.example.autostore.repository.MessageRepository;
//import com.example.autostore.repository.UserRepository;
//import com.example.autostore.service.user.interfaces.IMessageService;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class MessageService implements IMessageService {
//
//    private final MessageRepository messageRepository;
//    private final UserRepository userRepository;
//
//    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
//        this.messageRepository = messageRepository;
//        this.userRepository = userRepository;
//    }
//
//    @Override
//    @Transactional
//    public ChatMessageDTO saveMessage(Integer senderId, Integer receiverId, String content) {
//        if (senderId == null || receiverId == null) {
//            throw new IllegalArgumentException("senderId/receiverId is required");
//        }
//        if (content == null || content.trim().isEmpty()) {
//            throw new IllegalArgumentException("content is required");
//        }
//
//        AppUser sender = userRepository.findById(senderId)
//                .orElseThrow(() -> new RuntimeException("Sender not found: " + senderId));
//
//        AppUser receiver = userRepository.findById(receiverId)
//                .orElseThrow(() -> new RuntimeException("Receiver not found: " + receiverId));
//
//        Message msg = new Message();
//        msg.setSender(sender);
//        msg.setReceiver(receiver);
//        msg.setContent(content.trim());
//
//        Message saved = messageRepository.save(msg);
//
//        return ChatMessageDTO.builder()
//                .id(saved.getId())
//                .senderId(senderId)
//                .receiverId(receiverId)
//                .content(saved.getContent())
//                .timestamp(saved.getTimestamp())
//                .build();
//    }
//
//    @Transactional(readOnly = true)
//    public List<ChatMessageDTO> getConversation(Integer userId, Integer adminId) {
//        List<Message> all = messageRepository.findConversation(userId, adminId);
//
//        return all.stream()
//                .map(m -> ChatMessageDTO.builder()
//                        .id(m.getId())
//                        .senderId(m.getSender().getUserId())
//                        .receiverId(m.getReceiver().getUserId())
//                        .content(m.getContent())
//                        .timestamp(m.getTimestamp())
//                        .build())
//                .collect(Collectors.toList());
//    }
//}
