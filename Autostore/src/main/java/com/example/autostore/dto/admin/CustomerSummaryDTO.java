package com.example.autostore.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerSummaryDTO {
    private Integer customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerAddress;
    private String status;

    private LocalDateTime lastBookingDate;  // ngày thuê gần nhất
    private String lastCarName;             // tên xe thuê gần nhất
    private Long totalBookings;             // số lần thuê
}
