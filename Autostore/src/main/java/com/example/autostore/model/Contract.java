package com.example.autostore.model;

import com.example.autostore.Enum.ContractStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contracts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractStatus status = ContractStatus.DRAFT;

    @Lob
    @Column(name = "content_html", nullable = false, columnDefinition = "LONGTEXT")
    private String contentHtml;

    @Column(length = 64)
    private String contentHash; // SHA-256

    private String pdfUnsignedPath;
    private String pdfElectronicSignedPath;
    private String pdfDigitalSignedPath;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = ContractStatus.DRAFT;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
