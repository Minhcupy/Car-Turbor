package com.example.autostore.service.user.interfaces;

import com.example.autostore.dto.user.ChatMessageDTO;

import java.util.List;

public interface IMessageService {
    ChatMessageDTO saveMessage(Integer senderId, Integer receiverId, String content);
    List<ChatMessageDTO> getConversation(Integer userId, Integer adminId);
}
