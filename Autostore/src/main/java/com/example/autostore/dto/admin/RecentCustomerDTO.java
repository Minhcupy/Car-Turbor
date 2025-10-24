package com.example.autostore.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecentCustomerDTO {
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private long totalBookings;
}