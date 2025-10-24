package com.example.autostore.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecentBookingDTO {
    private String customerName;
    private String carName;
    private String status;
    private double totalPrice;
    private LocalDateTime createdAt;
}