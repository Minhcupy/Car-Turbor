package com.example.autostore.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Users")
@Data
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId")
    private Integer userId;

    @Column(name = "userName", nullable = false, unique = true)
    private String userName;

    @Column(name = "userPassword", nullable = false)
    private String userPassword;

    @Column(name = "userEmail", unique = true)
    private String userEmail;

    @Column(name = "userPhone")
    private String userPhone;

    @Column(name = "userFullName")
    private String userFullName;

    @Column(name = "userIsActive")
    private Boolean userIsActive = true;

    @ManyToOne
    @JoinColumn(name = "roleId", referencedColumnName = "roleId")
    private Role role;

    @OneToOne(mappedBy = "appUser", cascade = CascadeType.ALL)
    private Customer customer;

    public AppUser() {}

    public AppUser(AppUser appUser) {
        this.userId = appUser.userId;
        this.userName = appUser.userName;
        this.userPassword = appUser.userPassword;
        this.userEmail = appUser.userEmail;
        this.userPhone = appUser.userPhone;
        this.userFullName = appUser.userFullName;
        this.userIsActive = appUser.userIsActive;
    }


}
