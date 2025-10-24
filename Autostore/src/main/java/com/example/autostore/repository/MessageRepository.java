package com.example.autostore.repository;

import com.example.autostore.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.userId = :userId AND m.receiver.userId = :adminId) OR " +
            "(m.sender.userId = :adminId AND m.receiver.userId = :userId) " +
            "ORDER BY m.timestamp ASC")
    List<Message> findConversation(@Param("userId") Integer userId,
                                   @Param("adminId") Integer adminId);

}
