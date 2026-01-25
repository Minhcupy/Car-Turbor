package com.example.autostore.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contract_signatures")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ContractSignature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Column(nullable = false)
    private Integer customerId;

    @Column(nullable = false)
    private String type; // DRAWN / PKI_SERVER

    private String signatureImagePath;
    private LocalDateTime signedAt;

    private String ip;
    private String userAgent;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String evidenceJson; // consent, signerName...

    private String digitalCertSubject;
    private String digitalVerifyStatus;

    @PrePersist
    void onCreate() {
        if (signedAt == null) signedAt = LocalDateTime.now();
    }
}
