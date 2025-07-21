package com.example.autostore.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer messageId;
    private String fullName;
    private String email;
    private String messageContent;

    @ManyToOne(optional = true)
    @JoinColumn(name = "userId")
    private AppUser appUser;

}
