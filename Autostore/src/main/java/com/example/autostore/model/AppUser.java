package com.example.autostore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(nullable = false, unique = true, length = 50)
    private String userName;

    @Column(nullable = false, unique = true, length = 100)
    private String userEmail;

    @JsonIgnore
    @Column(nullable = false)
    private String userPassword;

    @Column(length = 15)
    private String userPhone;

    private String userFullName;

    private String avatarUrl;

    @Column(nullable = false)
    private Boolean userIsActive = true;

    // Roles
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();


    // Liên kết với Customer
    @OneToOne(mappedBy = "appUser", cascade = CascadeType.ALL)
    private Customer customer;


}
