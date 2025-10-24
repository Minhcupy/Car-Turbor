package com.example.autostore.repository;


import com.example.autostore.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<AppUser, Integer> {
    Optional<AppUser> findByUserName(String userName);
    Boolean existsByUserName(String userName);
    Boolean existsByuserEmail(String userEmail);


}