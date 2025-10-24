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
public class BookingDetailDTO {
    private Integer bookingId;
    private String carName;
    private String brandName;
    private String carType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BookingStatus status;
    private String statusLabel;
    private PaymentMethod paymentMethod;
    private Double totalAmount;
    private String customerName;
    private String customerPhone;
}
