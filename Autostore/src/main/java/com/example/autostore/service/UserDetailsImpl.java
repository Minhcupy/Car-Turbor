package com.example.autostore.service;

import com.example.autostore.model.AppUser;
import com.example.autostore.model.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {

    private final Integer id;
    private final String userName;
    private final String email;

    @JsonIgnore
    private final String userPassword;

    private final Boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Integer id,
                           String userName,
                           String email,
                           String userPassword,
                           Boolean active,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.userPassword = userPassword;
        this.active = active;
        this.authorities = authorities;
    }

    // === Convert AppUser -> UserDetailsImpl ===
    public static UserDetailsImpl build(AppUser user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(Role::getName) // lấy enum ERole
                .map(erole -> new SimpleGrantedAuthority(erole.name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getUserId(),
                user.getUserName(),
                user.getUserEmail(),
                user.getUserPassword(),
                user.getUserIsActive(),
                authorities
        );
    }

    public Integer getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getUserName() {
        return userName;
    }

    public Boolean getActive() {
        return active;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    // ⚠ Spring Security sẽ dùng để check password
    @Override
    public String getPassword() {
        return userPassword;
    }

    // ⚠ Đây là giá trị Spring Security dùng để "đăng nhập" (username)
    @Override
    public String getUsername() {
        return userName; // hoặc email, tuỳ bạn muốn login bằng gì
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
