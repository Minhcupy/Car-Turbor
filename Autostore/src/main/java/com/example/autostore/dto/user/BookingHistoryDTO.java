package com.example.autostore.dto.user;

import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.Enum.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class BookingHistoryDTO {
    private Integer bookingId;
    private String carName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BookingStatus status;   // Enum (PENDING, CONFIRMED, CANCELED, COMPLETED)
    private String statusLabel;     // Label tiếng Việt
    private PaymentMethod paymentMethod;
    private Double totalAmount;
}
