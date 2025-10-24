package com.example.autostore.model;

import com.example.autostore.Enum.PaymentMethod;
import com.example.autostore.Enum.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;


    @Column(nullable = false)
    private Double amount; // Số tiền thanh toán

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PaymentMethod paymentMethod;


    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // SUCCESS, FAILED, PENDING

    @Column(updatable = false)
    private LocalDateTime paymentDate;
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private AppUser appUser;

    @PrePersist
    protected void onCreate() {
        this.paymentDate = LocalDateTime.now();
        if (this.status == null) {
            this.status = PaymentStatus.PENDING;
        }
    }
    @Column(length = 100)
    private String payerName;

    @Column(length = 50)
    private String payerPhone;

    @Column(length = 100)
    private String payerEmail;

}
