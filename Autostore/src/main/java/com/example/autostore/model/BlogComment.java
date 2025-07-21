package com.example.autostore.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogComment {
    @Id
    private Integer commentId;

    private String commentContent;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "blogId")
    private Blog blog;

    @ManyToOne
    @JoinColumn(name = "userId")
    private AppUser appUser;
}
