package com.example.autostore.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Blog {
    @Id
    private Integer blogId;
    private String title;
    private String content;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "userId")
    private AppUser author;

    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL)
    private List<BlogComment> comments;
}
