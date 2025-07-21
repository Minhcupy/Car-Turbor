package com.example.autostore.model;



import com.example.autostore.Enum.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String method; // Ví dụ: "CREDIT_CARD", "BANK_TRANSFER", "CASH"

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @ManyToOne
    @JoinColumn(name = "userId") // người thanh toán
    private AppUser appUser;

    @OneToOne
    @JoinColumn(name = "bookingId", referencedColumnName = "bookingId")
    private Booking booking;
}

