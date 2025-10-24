package com.example.autostore.dto.user;

import java.time.LocalDateTime;

public class ChatMessageDTO {
    private Integer senderId;
    private Integer receiverId;
    private String content;
    private LocalDateTime timestamp;

    public ChatMessageDTO(Integer senderId, Integer receiverId, String content, LocalDateTime timestamp) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = timestamp;
    }

    public ChatMessageDTO() {
    }

    public ChatMessageDTO(Integer id, Integer userId, Integer userId1, String content, LocalDateTime timestamp) {
        this.senderId = userId;
        this.receiverId = userId1;
        this.content = content;
        this.timestamp = timestamp;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public Integer getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
